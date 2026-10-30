import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.models import user, resume
from app.api import resumes
from app.api import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Generator API")

# Allowed frontend origins. Extra origins can be added through the
# ALLOWED_ORIGINS environment variable (comma-separated) without changing code.
DEFAULT_ORIGINS = [
    "https://resume-generator-by-faizan.vercel.app",
    "http://localhost:3000",
]
extra_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEFAULT_ORIGINS + extra_origins,
    # Also allows Vercel preview deployments of this project
    allow_origin_regex=r"https://resume-generator-.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumes.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")


@app.get("/")
def read_root():
    return {"message": "Resume Generator Backend is working!"}