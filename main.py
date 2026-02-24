from input.wiki_fetch import fetch_wikipedia_text
from input.open_textbook_fetch import fetch_open_textbook
from input.reference_readers import (
    fetch_geeksforgeeks,
    fetch_w3schools,
    fetch_tutorialspoint
)

from storage.raw_store import save_raw
from storage.semantic_store import save_semantic
from storage.concept_knowledge_store import (
    load_concept_knowledge,
    save_concept_knowledge
)
from storage.atom_store import save_atoms

from process.llm_extractor import extract_concepts_llm
from process.context_builder import build_merged_raw_text
from process.knowledge_extractor import extract_concept_knowledge
from process.atom_bundle_generator import generate_atom_bundle


def main():
    topic = input("Enter topic: ").strip()
    if not topic:
        return

    # --------------------------------------------------
    # 1. Fetch sources
    # --------------------------------------------------
    print("[1] Fetching sources...")
    wiki = fetch_wikipedia_text(topic)
    textbook = fetch_open_textbook(topic)

    refs = {
        "geeksforgeeks": fetch_geeksforgeeks(topic),
        "w3schools": fetch_w3schools(topic),
        "tutorialspoint": fetch_tutorialspoint(topic)
    }

    save_raw(topic, wiki)

    # --------------------------------------------------
    # 2. Build merged raw text (ONLY for concept extraction)
    # --------------------------------------------------
    print("[2] Building merged raw text...")
    merged_raw = build_merged_raw_text(
        {"wikipedia": wiki, "open_textbook": textbook},
        refs
    )

    # --------------------------------------------------
    # 3. Extract semantic concepts (LLM)
    # --------------------------------------------------
    print("[3] Extracting semantic concepts...")
    llm_output = extract_concepts_llm(topic, merged_raw)

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
    # 4. Resolve concept knowledge (CACHE → LLM)
    # --------------------------------------------------
    from process.knowledge_single_extractor import extract_single_concept_knowledge   
    print("[4] Resolving concept knowledge (cache-first)...")

    concept_knowledge_list = []

    for c in valid_concepts:
        cached = load_concept_knowledge(topic, c["concept"])
        if cached:
            concept_knowledge_list.append(cached)
            continue

        print(f"[LLM] Extracting knowledge → {c['concept']}")

        try:
            knowledge = extract_single_concept_knowledge(
                topic=topic,
                concept=c,                 # ✅ FULL DICT
                semantic_context=merged_raw
            )

            save_concept_knowledge(topic, knowledge)
            concept_knowledge_list.append(knowledge)

        except Exception as e:
            print(f"[WARN] Failed for {c['concept']}: {e}")

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

    from atoms.atom_curator import curate_atoms

    raw_atom_feed = {
        "topic": topic,
        "atoms": atoms
    }

    curated_atom_feed = curate_atoms(raw_atom_feed)

    save_atoms(topic, curated_atom_feed)



if __name__ == "__main__":
    main()
