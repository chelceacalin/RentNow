import random
import uuid
from typing import Dict

import numpy as np
from chromadb import Client
from chromadb.api.types import IncludeEnum
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from config.logger_config import logger
from model.Book import Book
from model.Qa import Qa

# Initialize the SentenceTransformer model locally
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
default_ef = embedding_functions.DefaultEmbeddingFunction()

# Initialize ChromaDB client
client_settings = Settings(
    chroma_api_impl = "chromadb.api.fastapi.FastAPI",
    chroma_server_host = "localhost",
    chroma_server_http_port = 8000
)

client = Client(client_settings)

# Initialize collections
book_collection = client.get_or_create_collection("user_books")
qa_collection = client.get_or_create_collection("qa_pairs")


def print_collections():
    try:
        collections = client.list_collections()
        collection_names = [collection.name for collection in collections]
        logger.info(f"Retrieved collections: {collection_names}")
        return collection_names
    except Exception as e:
        logger.error(f"Failed to retrieve collection names: {e}")
        return []


# ----------------------------
# Book Collection Functions
# ----------------------------
def add_book_to_collection(user_email: str, book: Book):
    try:
        unique_id = f"{user_email}_{uuid.uuid4()}"
        book_collection.add(
            documents = [f"Category: {book.category}, Title: {book.title}"],
            ids = [unique_id],
            metadatas = {"user_email": user_email}
        )
        logger.info(f"Added book to collection: {book}")
    except Exception as e:
        logger.error(f"Failed to add book to collection: {book}, Error: {e}")


def get_books_for_user(user_email: str):
    try:
        results = book_collection.get(
            where = {"user_email": user_email},
            include = [IncludeEnum.metadatas, IncludeEnum.documents]
        )
        return " ".join(results['documents']) if results.get('documents') else None
    except Exception as e:
        logger.error(f"Error retrieving books for user {user_email}: {e}")
        return None


# ----------------------------
# Q&A Collection Functions
# ----------------------------
def generate_embedding(text: str):
    return embedding_model.encode(text).tolist()


def add_qa_to_collection(qa: Qa):
    try:
        question_embedding = generate_embedding(qa.question)
        question_embedding = [float(x) for x in question_embedding]

        qa_collection.add(
            documents = [f"Q: {qa.question} A: {qa.answer} ID: {qa.id}"],
            ids = [qa.id],
            embeddings = [question_embedding],
            metadatas = [{"question": qa.question, "answer": qa.answer}]
        )

        logger.info(f"Added Q&A to collection: {qa.question} -> {qa.answer}")
    except Exception as e:
        logger.error(f"Failed to add Q&A to collection: {qa.question}, Error: {e}")


def retrieve_similar_qas(query: str, top_k: int = 5, similarity_threshold: float = 0.6) -> Dict[str, str]:
    try:
        query_embedding = generate_embedding(query)
        query_embedding = np.array(query_embedding).reshape(1, -1)

        results = qa_collection.query(
            query_embeddings = query_embedding.tolist(),
            n_results = top_k,
            include = [IncludeEnum.documents, IncludeEnum.metadatas, IncludeEnum.embeddings]
        )

        best_match = None
        highest_similarity = similarity_threshold

        ids = results.get('ids', [[]])[0]
        metadatas = results.get('metadatas', [[]])[0]
        embeddings = [np.array(embed) for embed in results.get('embeddings', [[]])[0]]

        for idx, metadata in enumerate(metadatas):
            similarity = cosine_similarity(query_embedding, embeddings[idx].reshape(1, -1))[0][0]
            if similarity >= highest_similarity:
                highest_similarity = similarity
                best_match = {
                    "id": ids[idx],
                    "question": metadata["question"],
                    "answer": metadata["answer"]
                }

        if best_match:
            return best_match
        return {"message": "No relevant response found for your question"}

    except Exception as e:
        logger.error(f"Error retrieving similar Q&As: {e}")
        return {"message": "No relevant response found for your question"}


def delete_qa_entry(unique_id: str):
    try:
        qa_collection.delete(ids = [unique_id])
        logger.info(f"Deleted Q&A entry with ID: {unique_id}")
    except Exception as e:
        logger.error(f"Failed to delete Q&A entry with ID {unique_id}: {e}")


def update_qa_entry(qa_id: str, new_question: str, new_answer: str):
    try:
        delete_qa_entry(qa_id)
        qa = Qa(qa_id, new_question, new_answer)
        add_qa_to_collection(qa)
        logger.info(f"Updated Q&A entry with ID: {qa_id}")
    except Exception as e:
        logger.error(f"Failed to update Q&A entry with ID {qa_id}: {e}")


def get_random_qas(n = 2):
    all_qas = qa_collection.get()

    ids = all_qas.get('ids', [])
    metadatas = all_qas.get('metadatas', [])

    if ids and metadatas:
        indices = random.sample(range(len(ids)), min(n, len(ids)))

        random_qas = [
            {
                "id": ids[i],
                "question": metadatas[i]["question"],
                "answer": metadatas[i]["answer"]
            }
            for i in indices
        ]

        return random_qas

    return []
