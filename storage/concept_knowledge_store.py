import os
import json
from datetime import datetime

BASE_DIR = "output\concept_knowledge"


def _topic_path(topic: str) -> str:
    safe = topic.lower().replace(" ", "_")
    return os.path.join(BASE_DIR, f"{safe}.json")


def load_concept_knowledge(topic: str, concept: str):
    """
    Load knowledge for a single concept if it exists.
    Returns None if not found.
    """
    path = _topic_path(topic)

    if not os.path.exists(path):
        return None

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for c in data.get("concepts", []):
            if c["concept"].lower() == concept.lower():
                return c

    except Exception:
        return None

    return None


def save_concept_knowledge(topic: str, concept_knowledge: dict):
    """
    Append or update concept knowledge inside topic file.
    """
    os.makedirs(BASE_DIR, exist_ok=True)
    path = _topic_path(topic)

    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = {
            "topic": topic,
            "generated_at": datetime.utcnow().isoformat(),
            "concepts": []
        }

    # Replace if exists
    updated = False
    for i, c in enumerate(data["concepts"]):
        if c["concept"].lower() == concept_knowledge["concept"].lower():
            data["concepts"][i] = concept_knowledge
            updated = True
            break

    if not updated:
        data["concepts"].append(concept_knowledge)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
