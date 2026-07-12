import re

STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
    "with", "by", "is", "are", "was", "were", "be", "been", "being", "have",
    "has", "had", "do", "does", "did", "will", "would", "should", "could",
    "this", "that", "these", "those", "as", "if", "it", "its", "we", "you",
    "your", "our", "their", "job", "role", "work", "team", "years", "year",
    "experience", "required", "preferred", "including", "etc", "using",
}


def extract_keywords(text: str) -> set:
    words = re.findall(r"[a-zA-Z][a-zA-Z+#.]*", text.lower())
    return {w for w in words if len(w) > 2 and w not in STOPWORDS}


def calculate_ats_score(resume_text: str, job_description: str) -> dict:
    resume_keywords = extract_keywords(resume_text)
    job_keywords = extract_keywords(job_description)

    if not job_keywords:
        return {"score": 0, "matched_keywords": [], "missing_keywords": []}

    matched = job_keywords & resume_keywords
    missing = job_keywords - resume_keywords

    score = round((len(matched) / len(job_keywords)) * 100)

    return {
        "score": score,
        "matched_keywords": sorted(matched)[:20],
        "missing_keywords": sorted(missing)[:20],
    }