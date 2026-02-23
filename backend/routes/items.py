from fastapi import APIRouter, HTTPException
from services.vector_store import get_all_items
from models.schemas import ItemResponse
from utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.get("/items", response_model=ItemResponse)
def list_items():
    try:
        logger.info("Fetching items from vector store")
        items = get_all_items()
        logger.info(f"Retrieved {len(items)} items from vector store")
        return ItemResponse(items=items)
    except Exception as e:
        logger.error(f"Failed to retrieve items: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve items")
