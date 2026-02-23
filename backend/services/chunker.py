# Splits text into manageable chunks for processing, with overlap for context continuation.
from utils.logger import get_logger

logger = get_logger(__name__)

def chunk_text(text:str, chunk_size:int=400, overlap:int=50) -> list[str]:
    words = text.split()
    chunks = []
    start = 0
    
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap  # Move forward but keep some overlap
        
    logger.info(f"Text chunked into {len(chunks)} pieces")
    return chunks