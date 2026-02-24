import json, os
from datetime import datetime

SEM_DIR = "output/semantic_knowledge"

def save_semantic(topic: str, concepts: list):
    os.makedirs(SEM_DIR, exist_ok=True)
    path = os.path.join(SEM_DIR, topic.replace(" ", "_").lower() + ".json")

    with open(path, "w", encoding="utf-8") as f:
        json.dump({
            "topic": topic,
            "generated_at": datetime.utcnow().isoformat(),
            "concepts": concepts
        }, f, indent=2)
