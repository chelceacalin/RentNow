from threading import Thread

import numpy as np
from chromadb.api.types import IncludeEnum
from flask import Flask, jsonify, request
from flask_cors import CORS
from model.Book import Book
from config.logger_config import logger
from model.Qa import Qa
from service.ai_service import generate_recommendations_from_ai
from service.chroma_service import client
from service.chroma_service import (
    get_books_for_user,
    add_qa_to_collection,
    retrieve_similar_qas,
    delete_qa_entry,
    update_qa_entry,
    print_collections,
    get_random_qas
)
from service.kafka_service import kafka_listener

app = Flask(__name__)
CORS(app, origins = ["http://localhost:4173"], supports_credentials = True)


# Book Recommendations API
@app.route('/get_recommendations/<userEmail>', methods = ['GET'])
def get_recommendations(userEmail: str):
    books_read = get_books_for_user(userEmail)
    recommendations = generate_recommendations_from_ai(books_read)
    return jsonify(recommendations)


@app.route("/getCollections", methods = ['GET'])
def get_collections():
    return jsonify({"collections": print_collections()})


# Q&A CRUD APIs
@app.route('/qa', methods = ['POST'])
def add_qa_to_collection_repo():
    data = request.json
    qId = data.get("id")
    question = data.get("question")
    answer = data.get("answer")
    qa = Qa(qId, question, answer)
    if not question or not answer or not qId:
        return jsonify({"error": "Question, Answer and Id fields are required"}), 400
    add_qa_to_collection(qa)
    return jsonify({"message": "Q&A added successfully"}), 201


@app.route('/qa/similar', methods = ['POST'])
def get_similar_qas():
    data = request.json
    query = data.get("query")
    top_k = data.get("top_k", 5)
    if not query:
        return jsonify({"error": "Query is required"}), 400
    similar_qas = retrieve_similar_qas(query, top_k = top_k)
    return jsonify(similar_qas)


@app.route('/qa/random', methods = ['GET'])
def get_random_qas_controller():
    return jsonify(get_random_qas())


@app.route('/get_entries/<collection_name>', methods = ['GET'])
def get_entries(collection_name: str):
    try:
        collection = client.get_collection(collection_name)
        entries = collection.get(
            include = [IncludeEnum.documents, IncludeEnum.metadatas, IncludeEnum.embeddings]
        )

        if 'embeddings' in entries:
            entries['embeddings'] = [
                embedding.tolist() if isinstance(embedding, np.ndarray) else embedding
                for embedding in entries['embeddings']
            ]

        return jsonify(entries), 200
    except Exception as e:
        logger.error(f"Error retrieving entries for collection {collection_name}: {e}")
        return jsonify({"error": "Failed to retrieve entries"}), 500


@app.route('/delete_entries/<collection_name>', methods = ['DELETE'])
def delete_all_entries(collection_name: str):
    try:
        collection = client.get_collection(collection_name)
        entries = collection.get(
            include = [IncludeEnum.documents, IncludeEnum.metadatas]
        )
        all_ids = entries.get("ids", [])
        if all_ids:
            flat_ids = [item for sublist in all_ids for item in sublist] if isinstance(all_ids[0], list) else all_ids
            collection.delete(ids = flat_ids)
        return jsonify({"message": "All entries deleted"}), 200
    except Exception as e:
        logger.error(f"Error deleting entries for collection {collection_name}: {e}")
        return jsonify({"error": "Failed to delete entries"}), 500


@app.route('/qa/<unique_id>', methods = ['DELETE'])
def delete_qa(unique_id: str):
    delete_qa_entry(unique_id)
    return jsonify({"message": f"Q&A with ID {unique_id} deleted successfully"}), 200


@app.route('/qa/<unique_id>', methods = ['PUT'])
def update_qa(qa_id: str):
    data = request.json
    new_question = data.get("question")
    new_answer = data.get("answer")
    if not new_question or not new_answer or not qa_id:
        return jsonify({"error": "New question and answer are required"}), 400
    update_qa_entry(qa_id, new_question, new_answer)
    return jsonify({"message": f"Q&A with ID {qa_id} updated successfully"}), 200


if __name__ == '__main__':
    # load_data()
    kafka_thread = Thread(target = kafka_listener, daemon = True)
    kafka_thread.start()
    app.run(port = 5000, debug = True, host = '0.0.0.0')
