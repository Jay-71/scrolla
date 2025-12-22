import json
import os


def save_atoms(topic: str, atom_feed: dict):
    safe_topic = topic.replace(" ", "_").lower()
    os.makedirs("output", exist_ok=True)

    path = f"output/{safe_topic}_atoms.json"

    with open(path, "w", encoding="utf-8") as f:
        json.dump(atom_feed, f, indent=2, ensure_ascii=False)

    print(f"[SAVED] Atom feed → {path}")
