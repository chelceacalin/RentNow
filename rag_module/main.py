import numpy as np
from chromadb.api.types import IncludeEnum
from flask import Flask, jsonify, request
from flask_cors import CORS

from config.logger_config import logger
from model.Book import Book
from model.Qa import Qa
from service.data_loader_service import load_data
from service.chroma_service import (
    add_qa_to_collection,
    retrieve_similar_qas,
    delete_qa_entry,
    update_qa_entry,
    print_collections,
    get_random_qas,
    add_book_to_collection,
    get_recommendations_for_user
)
from service.chroma_service import client

app = Flask(__name__)
CORS(app, origins = ["http://localhost:4173"], supports_credentials = True)


# Book Recommendations API
@app.route('/get_recommendations/<userEmail>', methods = ['GET'])
def get_recommendations(userEmail: str):
    books_read = get_recommendations_for_user(userEmail)
    return jsonify(books_read)


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


@app.route('/book/book_returned', methods = ['POST'])
def book_returned():
    try:
        data = request.get_json()
        logger.info(f"Request received: {data}")
        user_email = data.get('user_email')
        category = data.get('category')
        title = data.get('title')
        if not all([user_email, category, title]):
            return jsonify({'error': 'Missing fields in the request'}), 400

        book = Book(title, category)
        add_book_to_collection(user_email, book)

        logger.info(f"Book added for user {user_email}: {book}")
        return jsonify({'message': f"Book '{title}' added for user {user_email}"}), 200

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(port = 5000, debug = True, host = '0.0.0.0')
    load_data()
    
