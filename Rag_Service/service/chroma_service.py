from threading import Thread
from flask import Flask, jsonify, request
from chromadb.api.types import IncludeEnum
from chromadb.config import Settings
from chromadb import Client, Collection
import uuid
from model.Book import Book
from config.logger_config import logger
from sentence_transformers import SentenceTransformer

# Initialize the SentenceTransformer model locally
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

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
    # Use the locally loaded model to generate embeddings
    return embedding_model.encode(text).tolist()


def add_qa_to_collection(question: str, answer: str):
    try:
        unique_id = str(uuid.uuid4())
        question_embedding = generate_embedding(question)
        qa_collection.add(
            documents = [f"Q: {question} A: {answer}"],
            ids = [unique_id],
            embeddings = [question_embedding],
            metadatas = {"question": question, "answer": answer}
        )
        logger.info(f"Added Q&A to collection: {question} -> {answer}")
    except Exception as e:
        logger.error(f"Failed to add Q&A to collection: {question}, Error: {e}")


def retrieve_similar_qas(query: str, top_k: int = 3):
    try:
        query_embedding = generate_embedding(query)
        results = qa_collection.query(
            query_embeddings = [query_embedding],
            n_results = top_k,
            include = [IncludeEnum.documents, IncludeEnum.metadatas]
        )
        return [
            {"question": res["metadata"]["question"], "answer": res["metadata"]["answer"]}
            for res in results.get("results", [])
        ]
    except Exception as e:
        logger.error(f"Error retrieving similar Q&As: {e}")
        return []


def delete_qa_entry(unique_id: str):
    try:
        qa_collection.delete(ids = [unique_id])
        logger.info(f"Deleted Q&A entry with ID: {unique_id}")
    except Exception as e:
        logger.error(f"Failed to delete Q&A entry with ID {unique_id}: {e}")


def update_qa_entry(unique_id: str, new_question: str, new_answer: str):
    try:
        delete_qa_entry(unique_id)
        add_qa_to_collection(new_question, new_answer)
        logger.info(f"Updated Q&A entry with ID: {unique_id}")
    except Exception as e:
        logger.error(f"Failed to update Q&A entry with ID {unique_id}: {e}")
