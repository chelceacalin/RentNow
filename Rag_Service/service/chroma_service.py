from chromadb.api.types import IncludeEnum
from chromadb.config import Settings
from chromadb import Client, Collection
import logging
import uuid

logger = logging.getLogger(__name__)

# Initialize ChromaDB client
client_settings = Settings(
    chroma_api_impl = "chromadb.api.fastapi.FastAPI",
    chroma_server_host = "localhost",
    chroma_server_http_port = 8000
)

client = Client(client_settings)


def create_collection(name: str):
    try:
        logger.info("Trying to create collection {}".format(name))
        coll: Collection = client.create_collection(name)
        return coll
    except Exception as e:
        logger.warning("Collection already exists {}".format(name))
        return client.get_collection(name)


# Init default collection
collection = create_collection("user_books")


def printCollections():
    collections = client.list_collections()
    for c in collections:
        logger.info(c)


def add_book_to_collection(user_email: str, category: str, name: str):
    try:
        unique_id = f"{user_email}_{uuid.uuid4()}"
        collection.add(
            documents = [f"Category: {category}, Name: {name}"],
            ids = [unique_id],
            metadatas = {"user_email": user_email}
        )
        logger.info("Added book to collection {}".format(name))
    except Exception as e:
        logger.error("Failed to add book to collection {}".format(name))


def get_books_for_user(user_email: str):
    try:
        results = collection.get(
            where = {"user_email": user_email},
            include = [IncludeEnum.metadatas, IncludeEnum.documents]
        )
        if results and results['documents']:
            return " ".join(results['documents'])
    except Exception as e:
        logger.error(f"Error retrieving books for user {user_email}: {e}")
    return None
