# VeriHire — AI-Powered Resume Screening Platform

VeriHire is a resume–job matching prototype that combines a MERN frontend/backend with an ML microservice.
It returns a **match score** (semantic similarity) and **missing skills** for a given resume and job description.

## Architecture
- **Frontend (React):** UI to paste resume/job text and skills; shows score + gaps
- **Backend (Node/Express):** single API for frontend + proxies requests to ML service
- **ML Service (FastAPI):** SentenceTransformer embeddings + cosine similarity

Flow: Frontend → Backend → ML Service → Backend → Frontend

## Matching Logic
- Model: `all-MiniLM-L6-v2` (SentenceTransformers)
- Score: cosine similarity between resume text and job text (0–100)
- Missing skills: `job_skills - resume_skills`

## Local Setup

### Prereqs
- Node.js 18+
- Python 3.10+
- (Optional) MongoDB if you extend auth/storage later

### 1) ML Service
```bash
cd ml-service
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app:app --reload --port 8000
