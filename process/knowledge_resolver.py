from process.knowledge_cache import (
    load_concept_from_cache,
    save_concept_to_cache
)
from process.knowledge_extractor import extract_concept_knowledge


def resolve_concept_knowledge(topic, concepts, semantic_context):
    """
    Cache-first concept knowledge resolver.
    Uses existing knowledge_cache and correct extractor signature.
    """

    resolved = []

    for c in concepts:
        name = c["concept"]
        ctype = c["type"]

        # 1️⃣ Cache-first
        cached = load_concept_from_cache(name)
        if cached:
            resolved.append(cached)
            continue

        # 2️⃣ LLM fallback (CORRECT signature)
        try:
            print(f"[LLM] Extracting knowledge → {name}")

            ck = extract_concept_knowledge(
                topic=topic,
                concept=name,           # string
                concept_type=ctype,     # REQUIRED
                semantic_context=semantic_context
            )

            save_concept_to_cache(ck)
            resolved.append(ck)

        except Exception as e:
            print(f"[WARN] Failed for {name}: {e}")

    return resolved
