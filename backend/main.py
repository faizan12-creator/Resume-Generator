from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.models import user, resume
from app.api import resumes
from app.api import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumes.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")

@app.get("/")
def read_root():
    return {"message": "Resume Generator Backend is working!"}