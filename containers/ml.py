from engine.fetch import fetch_wikipedia_text, fetch_open_textbook

def fetch_sources(topic: str) -> tuple[dict, dict]:
    """
    Fetch sources tailored for Machine Learning (ML).
    Returns: (stored_sources, reference_sources)
    """
    stored = {
        "wikipedia": fetch_wikipedia_text(topic),
        "open_textbook": fetch_open_textbook(topic)
    }
    
    # Placeholder for future ML-specific reference sources (like TowardsDataScience, paperswithcode, etc.)
    reference = {}
    
    return stored, reference

ALLOWED_TYPES = [
    "Definition",
    "Architecture",
    "Algorithm",
    "Hyperparameter",
    "Metric",
    "Application",
    "Pitfall"
]
