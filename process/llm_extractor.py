import requests
import json
import time

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral"

ALLOWED_TYPES = [
    "Definition",
    "Principle",
    "Operation",
    "Complexity",
    "Application",
    "Pitfall"
]

TIMEOUT = 180
RETRIES = 2
CHUNK_SIZE = 2000
MAX_CONCEPTS = 20


# ---------------------------------------------------------
# Low-level LLM call (safe, retryable)
# ---------------------------------------------------------

def run_llm_text(prompt: str) -> str:
    last_error = None

    for attempt in range(RETRIES + 1):
        try:
            response = requests.post(
                OLLAMA_URL,
                json={
                    "model": MODEL,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=TIMEOUT
            )
            response.raise_for_status()

            data = response.json().get("response")

            # ---- HARD INVARIANT: always return str ----
            if isinstance(data, list):
                return "\n".join(str(x) for x in data)

            if data is None:
                return ""

            if not isinstance(data, str):
                return str(data)

            return data

        except requests.exceptions.ReadTimeout as e:
            last_error = e
            print(f"[WARN] LLM timeout (attempt {attempt + 1}/{RETRIES + 1})")
            time.sleep(2)

    raise RuntimeError(f"LLM failed after retries: {last_error}")
    

# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def chunk_text(text: str, size: int = CHUNK_SIZE):
    for i in range(0, len(text), size):
        yield text[i:i + size]


def extract_json_safely(text: str):
    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON found in LLM response")

    return json.loads(text[start:end + 1])


# ---------------------------------------------------------
# Chunked semantic extraction (MAIN)
# ---------------------------------------------------------

def extract_concepts_llm(topic: str, raw_text: str):
    system_prompt = f"""
You are a semantic extractor.

TASK:
Extract ONLY concepts that are central to the topic: "{topic}"

Return ONLY valid JSON in this format:

{{
  "concepts": [
    {{
      "name": "string",
      "type": "one of {ALLOWED_TYPES}",
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
            raw_output = run_llm_text(prompt)
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

    return {
        "concepts": collected[:MAX_CONCEPTS]
    }
def extract_supporting_concepts_llm(topic: str, raw_text: str):
    system_prompt = f"""
You are a semantic extractor.

TASK:
Extract supporting concepts that explain HOW the topic "{topic}" works.

These include:
- internal components
- operations
- variations
- mechanisms
- common actions

Return ONLY valid JSON in this format:

{{
  "concepts": [
    {{
      "name": "string",
      "type": "one of {ALLOWED_TYPES}",
      "confidence": number between 0 and 1
    }}
  ]
}}

RULES:
- Concepts must be directly related to "{topic}"
- Prefer operations, components, and behaviors
- Do NOT repeat high-level definitions
- Short canonical names (1–4 words)
- Output JSON ONLY
"""
    payload = system_prompt + "\nTEXT:\n" + raw_text[:6000]
    output = run_llm_text(payload)
    return extract_json_safely(output)
