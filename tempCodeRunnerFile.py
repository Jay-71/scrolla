if USE_CONCEPT_INTELLIGENCE:
        print("[7] Running concept intelligence engine...")
        final_concepts = run_concept_intelligence(concept_knowledge_list)
    else:
        print("[7] Skipping concept intelligence (explore mode)...")
        final_concepts = concept_knowledge_list

    print("[DONE] Final learning concepts:")
    for c in final_concepts:
        print(f"- {c['concept']} ({c['type']})")

    print("[7] Generating atoms (explore / scroll mode)..."