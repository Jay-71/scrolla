import json
import requests

MAX_CONTEXT_CHARS = 1200

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral"


# ---------------------------------------------------------
# Helper: format semantic context into text
# ---------------------------------------------------------

def semantic_context_to_text(semantic_context: dict) -> str:
    lines = []
    for source, content in semantic_context.items():
        if content:
            lines.append(f"{source.upper()}")
            lines.append(content)
    return "\n\n".join(lines)


# ---------------------------------------------------------
# Helper: extract relevant text for a concept
# ---------------------------------------------------------

def _focus_context(concept: str, semantic_context: dict) -> str:
    text = semantic_context.get("merged_raw_text", "")
    if not text:
        return ""

    idx = text.lower().find(concept.lower())
    if idx == -1:
        return text[:MAX_CONTEXT_CHARS]

    start = max(0, idx - 400)
    end = idx + MAX_CONTEXT_CHARS
    return text[start:end]


# ---------------------------------------------------------
# Helper: safely extract JSON from LLM output
# ---------------------------------------------------------

def _extract_json_safely(text: str):
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No valid JSON found in LLM output")
    return json.loads(text[start:end + 1])


# ---------------------------------------------------------
# Single concept extractor (SAFE)
# ---------------------------------------------------------

def extract_concept_knowledge(
    topic: str,
    concept: str,
    concept_type: str,
    semantic_context: dict
):
    focused_context = _focus_context(concept, semantic_context)

    prompt = f"""
You are extracting structured knowledge for learning.

Topic: {topic}
Concept: {concept}
Concept Type: {concept_type}

Context:
{focused_context}

Return ONLY valid JSON.

Required format:

{{
  "concept": "{concept}",
  "type": "{concept_type}",
  "knowledge": {{
    "summary": "2–3 simple lines explaining the concept",
    "key_points": ["point 1", "point 2", "point 3"],
    "common_confusion": "one common beginner mistake (optional)"
  }}
}}

Rules:
- Simple language
- No citations
- No prose outside JSON
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )
        response.raise_for_status()

        raw_text = response.json().get("response", "")
        return _extract_json_safely(raw_text)

    except Exception as e:
        print(f"[SKIP] Knowledge extraction failed for {concept}: {e}")
        return None


# ---------------------------------------------------------
# Batch extractor (ALL concepts)
# ---------------------------------------------------------

def extract_all_concept_knowledge(
    topic: str,
    concepts: list,
    semantic_context: dict
):
    results = []

    for c in concepts:
        concept = c["concept"]
        concept_type = c.get("type", "unknown")

        data = extract_concept_knowledge(
            topic=topic,
            concept=concept,
            concept_type=concept_type,
            semantic_context=semantic_context
        )

        if data:
            results.append(data)

    return {
        "topic": topic,
        "concepts": results
    }
