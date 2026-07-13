import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("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"))

def generate_summary(full_name: str, raw_summary: str) -> str:
    prompt = f"""You are a professional resume writer. Based on the information below, 
write a professional, ATS-friendly resume summary (2-3 lines, action-oriented, 
industry-standard tone).

Name: {full_name}
User's input: {raw_summary}

Return only the improved summary text, no extra explanation."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content


def generate_bullet_points(job_title: str, raw_description: str) -> str:
    prompt = f"""You are a professional resume writer. Based on the job details below, 
write 2-3 professional, ATS-friendly bullet points (start with action verbs, mention 
quantifiable results where possible).

Job Title: {job_title}
User's input: {raw_description}

Return only the bullet points (each line starting with "- "), no extra explanation."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content


def generate_cover_letter(full_name: str, job_title: str, company: str, summary: str) -> str:
    prompt = f"""You are a professional cover letter writer. Write a concise, professional 
cover letter (3-4 paragraphs) for the candidate below applying to the given position.

Candidate Name: {full_name}
Applying for: {job_title} at {company}
Candidate Background: {summary}

Return only the cover letter text (no subject line, no extra explanation). Keep it 
professional, confident, and under 250 words."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content