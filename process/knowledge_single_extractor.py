from process.knowledge_extractor import extract_concept_knowledge


def extract_single_concept_knowledge(
    topic: str,
    concept: dict,
    semantic_context
):
    """
    Safe single-concept wrapper.
    Accepts semantic_context as dict or str and normalizes it.
    """

    if not isinstance(concept, dict):
        raise TypeError(f"concept must be dict, got {type(concept)}")

    concept_name = concept.get("concept")
    concept_type = concept.get("type")

    if not concept_name or not concept_type:
        raise ValueError(f"Invalid concept structure: {concept}")

    # normalize semantic_context
    if isinstance(semantic_context, str):
        semantic_context = {
            "raw_context": semantic_context
        }
    elif not isinstance(semantic_context, dict):
        raise TypeError(
            f"semantic_context must be dict or str, got {type(semantic_context)}"
        )

    return extract_concept_knowledge(
        topic=topic,
        concept=concept_name,
        concept_type=concept_type,
        semantic_context=semantic_context
    )

