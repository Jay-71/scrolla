TYPE_PRIOR = {
    "Definition": 1.0,
    "Principle": 0.9,
    "Operation": 0.85,
    "Complexity": 0.75,
    "Pitfall": 0.7,
    "Application": 0.6
}


def score_concept(concept, graph):
    name = concept["concept"]
    knowledge = concept["knowledge"]

    centrality = len(graph.get(name, []))
    density = sum(
        1 for v in knowledge.values()
        if v not in (None, "", "unknown")
    ) / max(1, len(knowledge))

    type_score = TYPE_PRIOR.get(concept["type"], 0.5)

    LEARNING_STAGE_WEIGHT = {
        "Definition": 1.0,
        "Principle": 0.95,
        "Operation": 0.9,
        "Complexity": 0.75,
        "Pitfall": 0.7,
        "Application": 0.4
    }

    stage_weight = LEARNING_STAGE_WEIGHT.get(concept["type"], 0.5)

    score = (
        0.35 * min(1.0, centrality / 5) +
        0.35 * density +
        0.15 * type_score +
        0.15 * stage_weight
    )


    return score
