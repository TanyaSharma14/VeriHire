from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List

app = FastAPI(title="VeriHire ML Service")

model = SentenceTransformer("all-MiniLM-L6-v2")


class MatchRequest(BaseModel):
    resume_text: str
    job_text: str
    resume_skills: List[str] = []
    job_skills: List[str] = []


def normalize_skills(skills: List[str]) -> List[str]:
    # normalize: lower, strip, remove empties
    out = []
    for s in skills:
        if not isinstance(s, str):
            continue
        t = s.strip().lower()
        if t:
            out.append(t)
    return out


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/match")
def match_resume_job(data: MatchRequest):
    resume_text = data.resume_text.strip()
    job_text = data.job_text.strip()

    if not resume_text or not job_text:
        return {
            "match_score": 0.0,
            "missing_skills": [],
            "note": "Empty resume_text or job_text"
        }

    resume_embedding = model.encode(resume_text)
    job_embedding = model.encode(job_text)

    similarity = cosine_similarity([resume_embedding], [job_embedding])[0][0]
    score = round(float(similarity) * 100.0, 2)

    rskills = set(normalize_skills(data.resume_skills))
    jskills = set(normalize_skills(data.job_skills))
    missing = sorted(list(jskills - rskills))

    return {
        "match_score": score,
        "missing_skills": missing
    }
