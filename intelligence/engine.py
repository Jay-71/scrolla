from intelligence.semantic_normalizer import normalize_concepts
from intelligence.concept_graph import build_concept_graph
from intelligence.concept_scorer import score_concept
from intelligence.cluster_merger import merge_cluster
from intelligence.concept_selector import select_learning_concepts


def run_concept_intelligence(concepts):
    clusters = normalize_concepts(concepts)

    flattened = [c for cluster in clusters for c in cluster]
    graph = build_concept_graph(flattened)

    scores = {
        c["concept"]: score_concept(c, graph)
        for c in flattened
    }

    merged = [
        merge_cluster(cluster, scores)
        for cluster in clusters
    ]

    final = select_learning_concepts(merged, scores)

    return final
