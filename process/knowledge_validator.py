def validate_knowledge(concept_knowledge: dict, topic: str):
    # Rule 1: topic concept can only be Definition
    if concept_knowledge["concept"].lower() == topic.lower():
        if concept_knowledge["type"] != "Definition":
            return False

    knowledge = concept_knowledge["knowledge"]

    filled = 0
    for v in knowledge.values():
        if v not in (None, "", "unknown"):
            filled += 1

    # At least half the fields must be filled
    return filled >= max(1, len(knowledge) // 2)
