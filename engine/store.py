import os
import json
from datetime import datetime
from engine.normalize import normalize_concept_name

RAW_DIR = "output/raw_knowledge"
SEM_DIR = "output/semantic_knowledge"
CK_DIR = "output/concept_knowledge"

# --- Raw Store ---
def save_raw(topic: str, text: str):
    os.makedirs(RAW_DIR, exist_ok=True)
    path = os.path.join(RAW_DIR, topic.replace(" ", "_").lower() + ".json")

    with open(path, "w", encoding="utf-8") as f:
        json.dump({
            "topic": topic,
            "source": "wikipedia",
            "fetched_at": datetime.utcnow().isoformat(),
            "raw_text": text
        }, f, indent=2)


# --- Semantic Store ---
def save_semantic(topic: str, concepts: list):
    os.makedirs(SEM_DIR, exist_ok=True)
    path = os.path.join(SEM_DIR, topic.replace(" ", "_").lower() + ".json")

    with open(path, "w", encoding="utf-8") as f:
        json.dump({
            "topic": topic,
            "generated_at": datetime.utcnow().isoformat(),
            "concepts": concepts
        }, f, indent=2)


# --- Concept Knowledge Store ---
def _topic_path(topic: str) -> str:
    safe = topic.lower().replace(" ", "_")
    return os.path.join(CK_DIR, f"{safe}.json")

def load_concept_knowledge(topic: str, concept: str):
    path = _topic_path(topic)
    if not os.path.exists(path):
        return None

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        normalized_input = normalize_concept_name(concept)
        for c in data.get("concepts", []):
            if normalize_concept_name(c["concept"]) == normalized_input:
                return c
    except Exception:
        return None

    return None

def save_concept_knowledge(topic: str, concept_knowledge: dict):
    os.makedirs(CK_DIR, exist_ok=True)
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

    updated = False
    normalized_input = normalize_concept_name(concept_knowledge["concept"])

    for i, c in enumerate(data["concepts"]):
        if normalize_concept_name(c["concept"]) == normalized_input:
            data["concepts"][i] = concept_knowledge
            updated = True
            print(f"[DEDUP] Merged '{concept_knowledge['concept']}' with existing '{c['concept']}'")
            break

    if not updated:
        data["concepts"].append(concept_knowledge)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# --- Atom Store ---
def save_atoms(topic: str, atom_feed: dict):
    safe_topic = topic.replace(" ", "_").lower()
    os.makedirs("output", exist_ok=True)

    path = f"output/{safe_topic}_atoms.json"

    with open(path, "w", encoding="utf-8") as f:
        json.dump(atom_feed, f, indent=2, ensure_ascii=False)

    print(f"[SAVED] Atom feed -> {path}")
