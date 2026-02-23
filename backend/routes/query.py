from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest, QueryResponse, Source
from services.vector_store import search_similar
from utils.logger import get_logger
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()
logger = get_logger(__name__)


@router.post("/query", response_model=QueryResponse)
def query_content(request: QueryRequest):
    try:
        # Find relevant chunks
        results = search_similar(request.query, n_results=5)
        print(f"results: {results}")
        if not results:
            return QueryResponse(answer="No relevant content found.", sources=[])

        # Build context from chunks
        context = "\n\n---\n\n".join([doc for doc, _ in results])

        # Build prompt for Gemini
        prompt = f"""
        You are a helpful assistant. Answer the question using ONLY the context below.
        If the answer is not in the context, say "I don't have enough information about this."

        Context:
        {context}

        Question: {request.query}

        Answer clearly and concisely:  
        """
        response = client.models.generate_content(
            model="models/gemini-flash-lite-latest", contents=prompt
        )
        answer = response.text

        # Extract sources
        sources = [
            Source(
                content=doc[:300],
                source_type=meta["source_type"],
                item_id=meta["item_id"],
            )
            for doc, meta in results
        ]

        logger.info(f"Query answer successfully with {len(sources)} sources")
        return QueryResponse(answer=answer, sources=sources)

    except Exception as e:
        logger.error(f"Query error: {e}")
        raise HTTPException(status_code=500, detail="failed to process query")
