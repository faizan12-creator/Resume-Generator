from pydantic import BaseModel
from typing import List, Optional

class ExperienceItem(BaseModel):
    jobTitle: str
    company: str
    dates: str
    description: str

class EducationItem(BaseModel):
    degree: str
    institution: str
    year: str

class ResumeData(BaseModel):
    full_name: str
    email: Optional[str] = ""
    summary: Optional[str] = ""
    experiences: List[ExperienceItem] = []
    education: List[EducationItem] = []
    skills: Optional[str] = ""