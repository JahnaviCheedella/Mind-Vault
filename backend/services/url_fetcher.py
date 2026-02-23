# Fetches a URL using urllib and extracts clean text
import asyncio
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
from utils.logger import get_logger

logger = get_logger(__name__)


def _fetch_sync(url: str) -> str:
    """Synchronous fetch using urllib (not blocked by sites like Wikipedia)."""
    req = Request(
        url,
        headers={
            "User-Agent": "KnowledgeInbox/1.0 (AI Knowledge Inbox App)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urlopen(req, timeout=15) as response:
        return response.read().decode("utf-8", errors="replace")


async def fetch_url_content(url: str) -> str:
    try:
        content = await asyncio.to_thread(_fetch_sync, url)

        soup = BeautifulSoup(content, "html.parser")

        # Remove unwanted tags
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)

        logger.info(f"Fetched URL: {url} | Length: {len(text)} chars")
        return text

    except Exception as e:
        logger.error(f"Failed to fetch URL {url}: {e}")
        raise ValueError(f"Could not fetch URL: {url}")
