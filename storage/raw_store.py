import json, os
from datetime import datetime

RAW_DIR = "raw_knowledge"

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
