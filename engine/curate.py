import re
from collections import OrderedDict
from engine.normalize import normalize_text

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

    if len(content.split()) < 3:
        return False

    max_words = MAX_WORDS.get(atom_type, 30)
    if len(content.split()) > max_words:
        return False

    sentences = re.split(r"[.!?]+", content)
    sentences = [s for s in sentences if s.strip()]

    if atom_type == "mental_model" and len(sentences) > 1:
        return False

    if len(sentences) > 2:
        return False

    if atom_type == "quick_check" and not content.endswith("?"):
        return False

    lower = content.lower()
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, lower):
            return False

    return True

def clean_quick_check(text: str):
    for marker in ["Answer:", "answer:", "Ans:", "Correct:"]:
        if marker in text:
            text = text.split(marker)[0].strip()
    return text

def curate_atoms(atom_feed: dict):
    topic = atom_feed["topic"]
    atoms = atom_feed["atoms"]

    deduped = OrderedDict()

    for atom in atoms:
        concept = atom.get("concept")
        atom_type = atom.get("atom_type")

        key = (concept.lower(), atom_type)
        content = normalize_text(atom.get("content", ""))

        if atom_type == "quick_check":
            content = clean_quick_check(content)

        atom["content"] = content

        if key in deduped:
            existing = deduped[key]
            if len(content) > len(existing["content"]):
                deduped[key] = atom
        else:
            deduped[key] = atom

    ORDER = [
        "explanation",
        "mental_model",
        "example",
        "key_points",
        "pitfall",
        "why_it_matters",
        "quick_check"
    ]

    sorted_atoms = sorted(
        deduped.values(),
        key=lambda a: (
            a.get("order", 999),
            ORDER.index(a["atom_type"]) if a["atom_type"] in ORDER else 99
        )
    )

    for idx, atom in enumerate(sorted_atoms, start=1):
        atom["order"] = idx

    return {
        "topic": topic,
        "atoms": sorted_atoms
    }
