from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Load BERT model
model = SentenceTransformer("all-MiniLM-L6-v2")

class MatchRequest(BaseModel):
    resume_text: str
    job_text: str
    resume_skills: list
    job_skills: list

@app.post("/match")
def match_resume_job(data: MatchRequest):
    resume_embedding = model.encode(data.resume_text)
    job_embedding = model.encode(data.job_text)

    similarity = cosine_similarity(
        [resume_embedding],
        [job_embedding]
    )[0][0]

    missing_skills = list(
        set(data.job_skills) - set(data.resume_skills)
    )

    return {
        "match_score": round(similarity * 100, 2),
        "missing_skills": missing_skills
    }
