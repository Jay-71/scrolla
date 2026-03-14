import importlib

from engine.store import (
    save_raw,
    save_semantic,
    load_concept_knowledge,
    save_concept_knowledge,
    save_atoms
)

from engine.extract import (
    extract_concepts_llm,
    extract_concept_knowledge,
    extract_all_concept_knowledge_concurrent
)
from engine.context import build_merged_raw_text
from engine.generate import generate_atom_bundle
from engine.index import build_topic_index, find_existing_topic
import json
import os


def main():
    topic = input("Enter topic: ").strip()
    if not topic:
        return

    domain = input("Enter domain (dsa/ml/general) [default: general]: ").strip().lower()
    if domain not in ["dsa", "ml", "general"]:
        domain = "general"

    try:
        container = importlib.import_module(f"containers.{domain}")
    except ImportError:
        print(f"[WARN] Could not load container for domain '{domain}'. Falling back to 'general'.")
        container = importlib.import_module("containers.general")

    # --------------------------------------------------
    # 0. Check Topic Caching (Fuzzy Match against existing)
    # --------------------------------------------------
    print("[0] Checking for existing topic data...")
    index = build_topic_index()
    existing_file_path = find_existing_topic(topic, index)
    
    if existing_file_path and os.path.exists(existing_file_path):
        print(f"\n[CACHE HIT] Found existing atoms for '{topic}' in: {existing_file_path}")
        print("Skipping LLM pipeline and loading existing data...\n")
        
        try:
             with open(existing_file_path, "r", encoding="utf-8") as f:
                  data = json.load(f)
             print(f"Successfully loaded {len(data.get('atoms', []))} atoms from cache.")
             
             # Optionally, you could print them or just let the application finish here
             return
        except Exception as e:
             print(f"[CACHE ERROR] Failed to load existing file: {e}")
             print("Falling back to full pipeline generation...")

    # --------------------------------------------------
    # 1. Fetch sources
    # --------------------------------------------------
    print(f"[1] Fetching sources (Domain: {domain})...")
    stored, refs = container.fetch_sources(topic)
    
    # Preserve the original behavior of saving Wikipedia raw data if it exists
    if "wikipedia" in stored:
        save_raw(topic, stored["wikipedia"])

    # --------------------------------------------------
    # 2. Build merged raw text (ONLY for concept extraction)
    # --------------------------------------------------
    print("[2] Building merged raw text...")
    merged_raw = build_merged_raw_text(stored, refs)

    # --------------------------------------------------
    # 3. Extract semantic concepts (LLM)
    # --------------------------------------------------
    print("[3] Extracting semantic concepts...")
    llm_output = extract_concepts_llm(topic, merged_raw, container.ALLOWED_TYPES)

    # Loose / recovery-friendly concept structure
    valid_concepts = [
        {
            "concept": c["name"],
            "type": c["type"]
        }
        for c in llm_output.get("concepts", [])
    ]

    if not valid_concepts:
        print("[STOP] No concepts extracted.")
        return

    save_semantic(topic, valid_concepts)

    print("[DONE] Concepts:")
    for c in valid_concepts:
        print(f"- {c['concept']} ({c['type']})")

    # --------------------------------------------------
    # 4. Resolve concept knowledge (CACHE → CONCURRENT LLM)
    # --------------------------------------------------
    print("[4] Resolving concept knowledge (cache-first, then concurrent LLM)...")

    concept_knowledge_list = []
    concepts_to_fetch = []  # concepts not in cache
    cached_by_concept = {}  # preserve original order

    # Pass 1: load whatever is already cached
    for c in valid_concepts:
        cached = load_concept_knowledge(topic, c["concept"])
        if cached:
            cached_by_concept[c["concept"]] = cached
            print(f"[CACHE] {c['concept']}")
        else:
            concepts_to_fetch.append(c)

    # Pass 2: concurrently extract only the missing ones
    if concepts_to_fetch:
        print(f"[LLM] Fetching {len(concepts_to_fetch)} concepts concurrently...")
        fetched = extract_all_concept_knowledge_concurrent(
            topic=topic,
            concepts=concepts_to_fetch,
            semantic_context=merged_raw
        )
        for knowledge in fetched:
            if knowledge:
                save_concept_knowledge(topic, knowledge)
                cached_by_concept[knowledge["concept"]] = knowledge

    # Reassemble in the original concept order
    for c in valid_concepts:
        ck = cached_by_concept.get(c["concept"])
        if ck:
            concept_knowledge_list.append(ck)
        else:
            print(f"[WARN] No knowledge resolved for: {c['concept']}")

    if not concept_knowledge_list:
        print("[STOP] No concept knowledge resolved.")
        return

    # --------------------------------------------------
    # 5. Generate atoms (ONE CALL PER CONCEPT)
    # ORDER IS PRESERVED: atoms follow concept_knowledge_list order
    # --------------------------------------------------
    print("[5] Generating atoms (1 call per concept)...")

    atoms = []
    order = 1

    for ck in concept_knowledge_list:
        try:
            bundle = generate_atom_bundle(topic, ck)
            for atom in bundle:
                atom["order"] = order
                order += 1
                atoms.append(atom)
        except Exception as e:
            print(f"[WARN] Atom generation failed for {ck['concept']}: {e}")

    save_atoms(topic, {
        "topic": topic,
        "atoms": atoms
    })

    print(f"[DONE] Generated {len(atoms)} atoms")

    from engine.curate import curate_atoms

    raw_atom_feed = {
        "topic": topic,
        "atoms": atoms
    }

    curated_atom_feed = curate_atoms(raw_atom_feed)

    save_atoms(topic, curated_atom_feed)



if __name__ == "__main__":
    main()
