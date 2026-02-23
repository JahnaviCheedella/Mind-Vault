from db.chroma_client import get_collection
from utils.logger import get_logger
import uuid

logger = get_logger(__name__)
# _collection = None


def _get_col():
    return get_collection()
    # global _collection
    # if _collection is None:
    #     _collection = get_collection()
    #     logger.info(f"ChromaDB collection loaded in vector store: {_collection}")
    # return _collection


# Store each chunk in ChromaDB (ChromaDB auto-generates embeddings using its default embedding function)
def store_chunks(chunks: list[str], item_id: str, source_type: str):
    # Prepare lists for batch insertion into ChromaDB
    ids = []
    documents = []
    metadatas = []

    # Loop through chunks and prepare metadata
    for i, chunk in enumerate(chunks):
        chunk_id = f"{item_id}_chunk_{i}"

        # Add to batch lists
        ids.append(chunk_id)
        documents.append(chunk)
        metadatas.append(
            {"item_id": item_id, "source_type": source_type, "chunk_index": i}
        )
    col = _get_col()
    # Store in ChromaDB in a single batch (embeddings are auto-generated)
    col.add(ids=ids, documents=documents, metadatas=metadatas)
    logger.info(f"Stored {len(chunks)} chunks for item {item_id}")


# Find top N chunks most similar to the question
def search_similar(question: str, n_results: int = 5):
    # ChromaDB auto-embeds the query text using its default embedding function
    results = _get_col().query(
        query_texts=[question],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )
    print(f"search similar results : {results}")
    # Flatten results (ChromaDB returns lists of lists)
    docs = results["documents"][0]
    metas = results["metadatas"][0]

    logger.info(f"Found {len(docs)} relevant chunks for query")
    return list(zip(docs, metas))


# Get all stored items (unique by item_id)
def get_all_items():
    collection = _get_col()
    # print(f"Retrieved {collection.count()} items from vector store")
    result = collection.get(include=["documents", "metadatas"])
    logger.info(f"Retrieved {len(result)} items from vector store")
    print(f"Retrieved {result} items from vector store")
    seen = {}

    for doc, meta in zip(result["documents"], result["metadatas"]):
        item_id = meta["item_id"]
        if item_id not in seen:
            seen[item_id] = {
                "id": item_id,
                "content": doc[:200] + "...",  # Preview
                "source_type": meta["source_type"],
                "created_at": meta.get("created_at", ""),
            }

    return list(seen.values())
