import re

MAX_CHARS = 8000

def clean_text(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    return text[:MAX_CHARS]

def normalize_skills(skills):
    return sorted(
        set(s.strip().lower() for s in skills if isinstance(s, str) and s.strip())
    )
