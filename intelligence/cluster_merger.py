def merge_cluster(cluster, scores):
    cluster = sorted(
        cluster,
        key=lambda c: scores[c["concept"]],
        reverse=True
    )

    base = cluster[0]

    for extra in cluster[1:]:
        for k, v in extra["knowledge"].items():
            if base["knowledge"].get(k) in (None, "", "unknown"):
                base["knowledge"][k] = v

    return base
