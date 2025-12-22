def select_learning_concepts(concepts, scores, max_concepts=10):
    ranked = sorted(
        concepts,
        key=lambda c: scores[c["concept"]],
        reverse=True
    )

    final = []
    application_count = 0

    for c in ranked:
        if c["type"] == "Application":
            if application_count >= 1:
                continue
            application_count += 1

        final.append(c)

        if len(final) >= max_concepts:
            break

    return final
