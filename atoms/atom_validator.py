import re


MAX_WORDS = {
    "explanation": 90,
    "mental_model": 50,
    "example": 70,
    "pitfall": 90,
    "quick_check": 30,
    "key_points": 80,
    "steps": 90,
    "edge_cases": 80,
    "why_it_matters": 70,
    "intuition": 70,
    "comparison": 80,
    "impact": 80,
    "prevention": 80,
    "real_world_use": 70,
    "why_suitable": 60
}



FORBIDDEN_PATTERNS = [
    r"http[s]?://",
    r"wikipedia",
    r"according to",
    r"this article",
    r"source:"
]


def validate_atom(atom: dict) -> bool:
    content = atom.get("content", "").strip()
    atom_type = atom.get("atom_type")

    # Rule 1: non-empty
    if len(content.split()) < 3:
        return False

    # Rule 2: length cap
    max_words = MAX_WORDS.get(atom_type, 30)
    if len(content.split()) > max_words:
        return False

    # Rule 3: sentence count
    sentences = re.split(r"[.!?]+", content)
    sentences = [s for s in sentences if s.strip()]

    if atom_type == "mental_model" and len(sentences) > 1:
        return False

    if len(sentences) > 2:
        return False

    # Rule 4: quick check must be a question
    if atom_type == "quick_check" and not content.endswith("?"):
        return False

    # Rule 5: no leakage
    lower = content.lower()
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, lower):
            return False

    return True
