import json
import os

CACHE_DIR = "storage/concept_cache"
os.makedirs(CACHE_DIR, exist_ok=True)


def _path(concept_name: str):
    safe = concept_name.lower().replace(" ", "_")
    return os.path.join(CACHE_DIR, f"{safe}.json")


def load_concept_from_cache(concept_name: str):
    path = _path(concept_name)
    if not os.path.exists(path):
        return None

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_concept_to_cache(concept_knowledge: dict):
    path = _path(concept_knowledge["concept"])
    with open(path, "w", encoding="utf-8") as f:
        json.dump(concept_knowledge, f, indent=2)
