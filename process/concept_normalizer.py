"""
Utility for normalizing concept names using NLP stemming to prevent duplicates.
"""
from nltk.stem import PorterStemmer
import nltk

# Download required NLTK data (only runs once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

_stemmer = PorterStemmer()


def normalize_concept_name(concept: str) -> str:
    """
    Normalize concept names using NLP stemming to prevent duplicates.
    
    Examples:
        "Insertion" -> "insert"
        "Deletion" -> "delet"  
        "Traversal" -> "travers"
        "Linked List" -> "link list"
    
    Args:
        concept: The concept name to normalize
        
    Returns:
        Stemmed version of the concept name
    """
    words = concept.lower().split()
    stemmed = " ".join(_stemmer.stem(word) for word in words)
    return stemmed


def are_concepts_duplicate(concept1: str, concept2: str) -> bool:
    """
    Check if two concept names are duplicates using stemming.
    
    Examples:
        "Delete", "Deletion" -> True
        "Insert", "Insertion" -> True
        "Linked List", "Singly Linked List" -> False
    
    Args:
        concept1: First concept name
        concept2: Second concept name
        
    Returns:
        True if concepts are duplicates, False otherwise
    """
    return normalize_concept_name(concept1) == normalize_concept_name(concept2)
