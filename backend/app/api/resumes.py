import json
import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.services.ai_service import generate_summary, generate_bullet_points, generate_cover_letter
from app.services.pdf_service import generate_resume_pdf
from app.services.ats_service import calculate_ats_score
from app.schemas.resume import ResumeData
from app.db.database import get_db
from app.models.resume import Resume
from app.api.auth import get_current_user
from app.models.user import User

router = APIRouter()

class SummaryRequest(BaseModel):
    full_name: str
    summary: str

class BulletRequest(BaseModel):
    job_title: str
    description: str

class CoverLetterRequest(BaseModel):
    full_name: str
    job_title: str
    company: str
    summary: str

class ATSRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/generate-summary")
def create_summary(data: SummaryRequest):
    improved = generate_summary(data.full_name, data.summary)
    return {"improved_summary": improved}


@router.post("/generate-bullets")
def create_bullets(data: BulletRequest):
    improved = generate_bullet_points(data.job_title, data.description)
    return {"improved_bullets": improved}


@router.post("/generate-cover-letter")
def create_cover_letter(data: CoverLetterRequest):
    letter = generate_cover_letter(data.full_name, data.job_title, data.company, data.summary)
    return {"cover_letter": letter}


@router.post("/ats-score")
def get_ats_score(data: ATSRequest):
    result = calculate_ats_score(data.resume_text, data.job_description)
    return result


@router.post("/resumes")
def save_resume(data: ResumeData, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = Resume(
        user_id=current_user.id,
        full_name=data.full_name,
        email=data.email,
        summary=data.summary,
        experiences=json.dumps([e.dict() for e in data.experiences]),
        education=json.dumps([e.dict() for e in data.education]),
        skills=data.skills,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return {"id": resume.id, "message": "Resume saved successfully"}


@router.get("/resumes")
def list_resumes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "full_name": r.full_name,
            "email": r.email,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in resumes
    ]


@router.get("/resumes/{resume_id}")
def get_resume(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "id": resume.id,
        "full_name": resume.full_name,
        "email": resume.email,
        "summary": resume.summary,
        "experiences": json.loads(resume.experiences) if resume.experiences else [],
        "education": json.loads(resume.education) if resume.education else [],
        "skills": resume.skills,
    }


@router.delete("/resumes/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted"}


@router.post("/generate-pdf")
def download_pdf(data: ResumeData):
    pdf_bytes = generate_resume_pdf(data)
    filename = data.full_name.replace(" ", "_") or "resume"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}_resume.pdf"}
    )