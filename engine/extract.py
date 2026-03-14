"""
Extractor module — combines concept extraction and knowledge extraction.
Uses the unified LLM gateway (`engine.llm`).
"""
from engine.llm import llm_call, extract_json_safely, chunk_text, llm_run_concurrent

MAX_CONCEPTS = 20
MAX_CONTEXT_CHARS = 1200


# ---------------------------------------------------------
# Concept Extractor
# ---------------------------------------------------------
def extract_concepts_llm(topic: str, raw_text: str, allowed_types: list[str]) -> dict:
    """
    Chunked semantic extraction: calls LLM per chunk of raw text,
    deduplicates, and returns up to MAX_CONCEPTS concepts.
    """
    system_prompt = f"""
You are a semantic extractor.

TASK:
Extract ONLY concepts that are central to the topic: "{topic}"

Return ONLY valid JSON in this format:

{{
  "concepts": [
    {{
      "name": "string",
      "type": "one of {allowed_types}",
      "confidence": number between 0 and 1
    }}
  ]
}}

RULES:
- Each concept MUST directly help explain the topic "{topic}"
- Ignore background, prerequisite, or tangential concepts
- If removing the concept would NOT hurt understanding of "{topic}", exclude it
- Prefer structural, operational, and definitional concepts
- Ignore generic programming/data concepts unless the topic itself is about them
- No explanations
- No prose
- Short canonical names (1–4 words)
- Output JSON ONLY
"""

    collected = []
    seen = set()

    for idx, chunk in enumerate(chunk_text(raw_text)):
        print(f"[LLM] Processing chunk {idx + 1}")
        prompt = system_prompt + "\nTEXT:\n" + chunk

        try:
            raw_output = llm_call(prompt, label=f"concept-chunk-{idx + 1}")
            parsed = extract_json_safely(raw_output)

            for c in parsed.get("concepts", []):
                key = (c["name"].lower(), c["type"])
                if key not in seen:
                    seen.add(key)
                    collected.append(c)

        except Exception as e:
            print(f"[WARN] Skipping chunk {idx + 1}: {e}")

        if len(collected) >= MAX_CONCEPTS:
            break

    return {"concepts": collected[:MAX_CONCEPTS]}


# ---------------------------------------------------------
# Knowledge Extractor
# ---------------------------------------------------------
def _focus_context(concept: str, semantic_context) -> str:
    """
    Find a relevant window of text around the concept.
    Robustly handles semantic_context as string or dict.
    """
    if isinstance(semantic_context, str):
        text = semantic_context
    elif isinstance(semantic_context, dict):
        text = (
            semantic_context.get("merged_raw_text") or 
            semantic_context.get("raw_context") or 
            ""
        )
    else:
        text = ""

    if not text:
        return ""

    idx = text.lower().find(concept.lower())
    if idx == -1:
        return text[:MAX_CONTEXT_CHARS]

    start = max(0, idx - 400)
    end   = idx + MAX_CONTEXT_CHARS
    return text[start:end]

def _build_knowledge_prompt(topic: str, concept: str, concept_type: str, focused_context: str) -> str:
    return f"""
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

def extract_concept_knowledge(
    topic: str,
    concept: str,
    concept_type: str,
    semantic_context: dict
) -> dict | None:
    """
    Extract structured knowledge for ONE concept via a single LLM call.
    """
    focused_context = _focus_context(concept, semantic_context)
    prompt = _build_knowledge_prompt(topic, concept, concept_type, focused_context)

    try:
        raw_text = llm_call(prompt, label=concept)
        return extract_json_safely(raw_text)
    except Exception as e:
        print(f"[SKIP] Knowledge extraction failed for {concept}: {e}")
        return None

def extract_all_concept_knowledge_concurrent(
    topic: str,
    concepts: list,
    semantic_context: dict
) -> list:
    """
    Extract knowledge for ALL concepts concurrently using a thread pool.
    """
    tasks = []
    for c in concepts:
        concept      = c["concept"]
        concept_type = c.get("type", "Definition")
        focused_ctx  = _focus_context(concept, semantic_context)
        prompt       = _build_knowledge_prompt(topic, concept, concept_type, focused_ctx)
        tasks.append({"label": concept, "prompt": prompt})

    print(f"[LLM] Running {len(tasks)} knowledge extractions concurrently...")
    raw_results = llm_run_concurrent(tasks)

    results = []
    for task, raw in zip(concepts, raw_results):
        if raw["error"] or raw["response"] is None:
            print(f"[WARN] Skipping concept '{task['concept']}': {raw['error']}")
            continue
        try:
            parsed = extract_json_safely(raw["response"])
            results.append(parsed)
        except Exception as e:
            print(f"[WARN] JSON parse failed for '{task['concept']}': {e}")

    return results
