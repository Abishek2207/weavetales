from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api import endpoints
from app.core.database import engine
from app.models import domain as models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WeaveTales AI Backend",
    description="Backend API for WeaveTales AI Platform",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory for audio
os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Only include our new AI core endpoints to prevent breaking changes with async/sync conflicts
app.include_router(endpoints.router, prefix="/api", tags=["core"])

@app.get("/")
def read_root():
    return {"message": "Welcome to WeaveTales AI Backend API"}
