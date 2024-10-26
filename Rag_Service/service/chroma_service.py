from chromadb.api.types import IncludeEnum
from chromadb.config import Settings
from chromadb import Client, Collection
import uuid
from model.Book import Book
from config.logger_config import logger

# Initialize ChromaDB client
client_settings = Settings(
    chroma_api_impl = "chromadb.api.fastapi.FastAPI",
    chroma_server_host = "localhost",
    chroma_server_http_port = 8000
)

client = Client(client_settings)

# Init default collection
collection = client.get_collection("user_books") or client.create_collection("user_books")


def create_collection(name: str):
    try:
        logger.info("Trying to create collection {}".format(name))
        coll: Collection = client.create_collection(name)
        return coll
    except Exception as e:
        logger.warning("Collection already exists {}".format(name))
        return client.get_collection(name)


def printCollections():
    collections = client.list_collections()
    for c in collections:
        logger.info(c)


def add_book_to_collection(user_email: str, book: Book):
    try:
        unique_id = f"{user_email}_{uuid.uuid4()}"
        collection.add(
            documents = [f"Category: {book.category}, Title: {book.title}"],
            ids = [unique_id],
            metadatas = {"user_email": user_email}
        )
        logger.info(f"Added book to collection: {book}")
    except Exception as e:
        logger.error(f"Failed to add book to collection: {book}, Error: {e}")


def get_books_for_user(user_email: str):
    try:
        results = collection.get(
            where = {"user_email": user_email},
            include = [IncludeEnum.metadatas, IncludeEnum.documents]
        )
        return " ".join(results['documents']) if results.get('documents') else None
    except Exception as e:
        logger.error(f"Error retrieving books for user {user_email}: {e}")
        return None
