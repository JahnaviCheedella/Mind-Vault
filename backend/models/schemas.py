# FastAPI uses Pydantic for automatic request validation and response serialization, returning 422 errors for invalid or missing fields without manual checks.
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class IngestRequest(BaseModel):
    content: str
    source_type: str


class IngestResponse(BaseModel):
    id: str
    message: str
    chunks_created: int


class Item(BaseModel):
    id: str
    content: str
    source_type: str
    created_at: str


class ItemResponse(BaseModel):
    items: List[Item]


class QueryRequest(BaseModel):
    query: str


class Source(BaseModel):
    content: str
    source_type: str
    item_id: str


class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]
