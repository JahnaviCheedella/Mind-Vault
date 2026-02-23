import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import ingest, items, query
from dotenv import load_dotenv
from contextlib import asynccontextmanager


load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure connection is ready
    print("Connecting to ChromaDB...")
    yield
    # Shutdown: ChromaDB PersistentClient persists data automatically
    print("Disconnecting...")


app = FastAPI(
    title="AI Knowledge Inbox",
    description="RAG-based knowledge management system",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

app.include_router(ingest.router, prefix="/api")
app.include_router(items.router, prefix="/api")
app.include_router(query.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Welcome to the AI knowledge inbox"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, workers=1)
