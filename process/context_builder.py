def build_merged_raw_text(stored_sources: dict, reference_sources: dict):
    """
    Build a flat text view for concept extraction ONLY.
    Reference sources are truncated heavily.
    """
    chunks = []

    for text in stored_sources.values():
        if text:
            chunks.append(text[:4000])

    for text in reference_sources.values():
        if text:
            chunks.append(text[:1000])

    return "\n".join(chunks)


def build_semantic_context(stored_sources: dict, reference_sources: dict):
    """
    Combine sources into a semantic context for LLM.
    """
    context = {
        "authoritative_sources": [],
        "reference_sources": [],
        "merged_raw_text": build_merged_raw_text(
            stored_sources,
            reference_sources
        )
    }

    for name, text in stored_sources.items():
        if text:
            context["authoritative_sources"].append({
                "source": name,
                "content": text[:4000]
            })

    for name, text in reference_sources.items():
        if text:
            context["reference_sources"].append({
                "source": name,
                "content": text[:1500]
            })

    return context
