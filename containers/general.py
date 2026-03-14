from engine.fetch import fetch_wikipedia_text, fetch_open_textbook

def fetch_sources(topic: str) -> tuple[dict, dict]:
    """
    Fetch sources for a general educational topic. 
    Returns: (stored_sources, reference_sources)
    """
    stored = {
        "wikipedia": fetch_wikipedia_text(topic),
        "open_textbook": fetch_open_textbook(topic)
    }
    
    reference = {}
    
    return stored, reference

ALLOWED_TYPES = [
    "Definition",
    "Principle",
    "Component",
    "Process",
    "Application",
    "Common Error"
]
