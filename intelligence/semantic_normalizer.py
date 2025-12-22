from sentence_transformers import SentenceTransformer
from sklearn.cluster import AgglomerativeClustering
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")


def normalize_concepts(concepts, distance_threshold=0.35):
    names = [c["concept"] for c in concepts]
    embeddings = model.encode(names)

    clustering = AgglomerativeClustering(
        n_clusters=None,
        distance_threshold=distance_threshold,
        metric="cosine",
        linkage="average"
    )

    labels = clustering.fit_predict(embeddings)

    clusters = {}
    for label, concept in zip(labels, concepts):
        clusters.setdefault(label, []).append(concept)

    return list(clusters.values())
