# It's a vector database used to store text + its embedding vector + metadata together and built-in cosine similarity search.
import chromadb
from utils.logger import get_logger
from chromadb.utils import embedding_functions


logger = get_logger(__name__)

client = chromadb.PersistentClient(path="./chroma_storage")

# Pre-initialize the embedding function
default_ef = embedding_functions.DefaultEmbeddingFunction()
# Define it ONCE at the module level
knowledge_collection = client.get_or_create_collection(
    name="knowledge_inbox_collection",
    embedding_function=default_ef,
    metadata={
        "hnsw:space": "cosine",
        # "hnsw:batch_size": 10000,
    },  # Use cosine similarity for vector search
)


def get_collection():
    return knowledge_collection
    # logger.info(f"ChromaDB collection loaded: {collection}")
    # return collection
