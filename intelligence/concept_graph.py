from collections import defaultdict


def build_concept_graph(concepts):
    graph = defaultdict(set)

    for c in concepts:
        text = " ".join(
            v for v in c["knowledge"].values()
            if isinstance(v, str)
        ).lower()

        for other in concepts:
            if c == other:
                continue
            if other["concept"].lower() in text:
                graph[c["concept"]].add(other["concept"])

    return graph
