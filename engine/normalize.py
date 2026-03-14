"""
Utility for text and concept normalization.
Combines NLP stemming and text parsing helpers.
"""
from nltk.stem import PorterStemmer
import nltk
import re
import json
import ast

# Download required NLTK data (only runs once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

_stemmer = PorterStemmer()

# --- Concept Normalization ---
def normalize_concept_name(concept: str) -> str:
    """
    Normalize concept names using NLP stemming to prevent duplicates.
    """
    words = concept.lower().split()
    stemmed = " ".join(_stemmer.stem(word) for word in words)
    return stemmed

def are_concepts_duplicate(concept1: str, concept2: str) -> bool:
    return normalize_concept_name(concept1) == normalize_concept_name(concept2)


# --- Text Normalization ---
def normalize_text(value):
    if isinstance(value, list):
        return "\n".join(str(v).strip() for v in value if v)
    if isinstance(value, str):
        return value.strip()
    return str(value)

def safe_split_lines(value):
    return normalize_text(value).split("\n")


# --- JSON Cleaning ---
def clean_json_text(text):
    # 1. Remove markdown code blocks
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    
    # 2. Fix invalid backslashes
    text = re.sub(r'\\(?![\\"/bfnrtu])', r'\\\\', text)
    
    # 3. Fix missing commas between objects/items
    text = re.sub(r'(?<=[}\]"\'0-9])\s+(?=["{\[])', ', ', text)
    
    return text

def parse_json_garbage(text):
    # 1. Try standard JSON
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # 2. Try cleaning JSON
    cleaned = clean_json_text(text)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # 3. Try ast.literal_eval
    for t in [text, cleaned]:
        try:
            return ast.literal_eval(t)
        except (ValueError, SyntaxError):
            pass
            
    raise ValueError("Failed to parse JSON with all available methods.")
