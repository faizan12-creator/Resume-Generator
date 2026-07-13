from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.db.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    experiences = Column(Text, nullable=True)
    education = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    skills = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)