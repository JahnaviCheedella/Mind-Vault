# This file defines the API endpoint for ingesting content into the system. It handles both URL and text inputs, processes them, and stores the resulting chunks in the vector store for later retrieval.
from fastapi import APIRouter, HTTPException
from models.schemas import IngestRequest, IngestResponse
from services.url_fetcher import fetch_url_content
from services.chunker import chunk_text
from services.vector_store import store_chunks
from utils.logger import get_logger
import uuid
from datetime import datetime

router = APIRouter()
logger = get_logger(__name__)


@router.post("/ingest", response_model=IngestResponse)
async def ingest_content(request: IngestRequest):
    logger.info(f"Receives ingest request for source: {request.source_type}")
    try:
        item_id = str(uuid.uuid4())

        # Fetch content if it's a URL, otherwise use the provided text
        if request.source_type == "url":
            text = await fetch_url_content(request.content)
        else:
            text = request.content

        # Chunk the text for embedding and store them
        chunks = chunk_text(text)
        store_chunks(chunks, item_id, request.source_type)

        logger.info(
            f"Ingested item: {item_id} | type: {request.source_type} | chunks: {len(chunks)}"
        )
        return IngestResponse(
            id=item_id,
            message="Content ingested successfully",
            chunks_created=len(chunks),
        )
    except ValueError as e:
        logger.error(f"Ingest error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Ingest error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
