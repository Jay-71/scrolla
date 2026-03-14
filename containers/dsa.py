from engine.fetch import (
    fetch_wikipedia_text, 
    fetch_open_textbook,
    fetch_geeksforgeeks,
    fetch_w3schools,
    fetch_tutorialspoint
)

def fetch_sources(topic: str) -> tuple[dict, dict]:
    """
    Fetch sources tailored for Data Structures and Algorithms (DSA).
    Returns: (stored_sources, reference_sources)
    """
    stored = {
        "wikipedia": fetch_wikipedia_text(topic),
        "open_textbook": fetch_open_textbook(topic)
    }

    reference = {
        "geeksforgeeks": fetch_geeksforgeeks(topic),
        "w3schools": fetch_w3schools(topic),
        "tutorialspoint": fetch_tutorialspoint(topic)
    }
    
    return stored, reference

ALLOWED_TYPES = [
    "Definition",
    "Principle",
    "Operation",
    "Complexity",
    "Application",
    "Pitfall"
]
