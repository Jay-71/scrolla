def topic_alignment_score(concept: str, topic: str) -> float:
    concept = concept.lower()
    topic = topic.lower()

    # Exact or partial match
    if concept in topic or topic in concept:
        return 1.0

    c_tokens = set(concept.split())
    t_tokens = set(topic.split())

    if not c_tokens:
        return 0.0

    return len(c_tokens & t_tokens) / len(c_tokens)

CONFIDENCE_THRESHOLD = 0.75
MAX_CONCEPTS = 12

REJECT_PHRASES = [
    "in computer science",
    "this article",
    "the following",
    "such as",
    "is a type of"
]

# Allowed downstream learning roles
ALLOWED_TYPES = {
    "Definition",
    "Principle",
    "Operation",
    "Complexity",
    "Application",
    "Pitfall"
}

# Normalize semantic labels → learning roles
TYPE_NORMALIZATION = {
    "Concept": "Definition",
    "Entity": "Definition",
    "Structure": "Definition",
    "Data": "Definition"
}


def validate_concepts(concepts: list, topic: str):
    cleaned = []

    for c in concepts:
        name = c["name"].strip()
        name_lower = name.lower()
        confidence = c.get("confidence", 1.0)
        concept_type = c.get("type")

        if confidence < CONFIDENCE_THRESHOLD:
            continue

        if topic_alignment_score(name, topic) < 0.25:
            continue

        if any(p in name_lower for p in REJECT_PHRASES):
            continue

        if len(name.split()) > 4:
            continue

        if concept_type in TYPE_NORMALIZATION:
            concept_type = TYPE_NORMALIZATION[concept_type]

        if concept_type not in ALLOWED_TYPES:
            continue

        cleaned.append({
            "concept": name,
            "type": concept_type,
            "confidence": confidence
        })

    seen = set()
    final = []
    for c in cleaned:
        key = (c["concept"].lower(), c["type"])
        if key not in seen:
            seen.add(key)
            final.append(c)

    return final[:MAX_CONCEPTS]
