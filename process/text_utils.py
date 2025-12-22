def normalize_text(value):
    if isinstance(value, list):
        return "\n".join(str(v) for v in value)
    if isinstance(value, str):
        return value
    raise TypeError(f"Expected str or list[str], got {type(value)}")


def safe_split_lines(value):
    return normalize_text(value).split("\n")


def clean_json_text(text):
    import re
    # 1. Remove markdown code blocks
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*', '', text)
    
    # 2. Fix invalid backslashes
    # Replace \ that is NOT followed by a valid escape char with \\
    # Valid: " \ / b f n r t u
    text = re.sub(r'\\(?![\\"/bfnrtu])', r'\\\\', text)
    
    # 3. Fix missing commas between objects/items
    # Look for " closing a string, or } ] closing objects/arrays
    # Followed by whitespace
    # Followed by " { [ opening a new item
    # And NOT preceded by a comma
    text = re.sub(r'(?<=[}\]"\'0-9])\s+(?=["{\[])', ', ', text)
    
    return text


def parse_json_garbage(text):
    import json
    import ast
    
    # 1. Try standard JSON
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # 2. Try cleaning JSON (fixes backslashes, missing commas)
    cleaned = clean_json_text(text)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # 3. Try ast.literal_eval (handles single quotes, Python-like syntax)
    # We try on both original and cleaned text
    for t in [text, cleaned]:
        try:
            return ast.literal_eval(t)
        except (ValueError, SyntaxError):
            pass
            
    # If all fail, raise the last error or a generic one
    raise ValueError("Failed to parse JSON with all available methods.")
