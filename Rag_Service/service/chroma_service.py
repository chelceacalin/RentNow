import uuid
from typing import List, Dict

from chromadb import Client
from chromadb.api.types import IncludeEnum
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

from config.logger_config import logger
from model.Book import Book
from model.Qa import Qa

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


def add_qa_to_collection(qa: Qa):
    try:
        question_embedding = generate_embedding(qa.question)
        qa_collection.add(
            documents = [f"Q: {qa.question} A: {qa.answer} ID: {qa.id}"],
            ids = [qa.id],
            embeddings = [question_embedding],
            metadatas = {"question": qa.question, "answer": qa.answer}
        )
        logger.info(f"Added Q&A to collection: {qa.question} -> {qa.answer}")
    except Exception as e:
        logger.error(f"Failed to add Q&A to collection: {qa.question}, Error: {e}")


def retrieve_similar_qas(query: str, top_k: int = 3) -> List[Dict[str, str]]:
    """
    Retrieve similar Q&A documents based on the provided query. Returns a list of dictionaries
    with each dictionary containing the 'id', 'question', and 'answer' for each similar document.
    """
    try:
        query_embedding = generate_embedding(query)
        results = qa_collection.query(
            query_embeddings = [query_embedding],
            n_results = top_k,
            include = [IncludeEnum.documents, IncludeEnum.metadatas]
        )

        output = [
            {
                "id": result["id"],
                "question": result["metadata"]["question"],
                "answer": result["metadata"]["answer"]
            }
            for result in results.get("results", [])
        ]
        return output

    except Exception as e:
        logger.error(f"Error retrieving similar Q&As: {e}")
        return []


def delete_qa_entry(unique_id: str):
    try:
        qa_collection.delete(ids = [unique_id])
        logger.info(f"Deleted Q&A entry with ID: {unique_id}")
    except Exception as e:
        logger.error(f"Failed to delete Q&A entry with ID {unique_id}: {e}")


def update_qa_entry(qa_id: str, new_question: str, new_answer: str):
    try:
        delete_qa_entry(qa_id)
        qa: Qa = Qa(qa_id, new_answer, new_answer)
        add_qa_to_collection(qa)
        logger.info(f"Updated Q&A entry with ID: {qa_id}")
    except Exception as e:
        logger.error(f"Failed to update Q&A entry with ID {qa_id}: {e}")
