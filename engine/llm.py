"""
LLM Gateway — Single source of truth for all LLM interactions.

All Ollama configuration, retry logic, and timeout policy lives here.
No other file should directly call requests.post to Ollama.
"""
import json
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# ---------------------------------------------------------
# Config (change model/URL here only)
# ---------------------------------------------------------
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL      = "mistral"
TIMEOUT    = 180   # seconds per request
RETRIES    = 2
MAX_WORKERS = 4    # concurrent LLM threads (Ollama supports parallel by default)

# ---------------------------------------------------------
# Core: single retryable call
# ---------------------------------------------------------

def llm_call(prompt: str, label: str = "") -> str:
    last_error = None

    for attempt in range(RETRIES + 1):
        try:
            response = requests.post(
                OLLAMA_URL,
                json={"model": MODEL, "prompt": prompt, "stream": False},
                timeout=TIMEOUT
            )
            response.raise_for_status()
            data = response.json().get("response")

            # Always return str
            if data is None:
                return ""
            if isinstance(data, list):
                return "\n".join(str(x) for x in data)
            if not isinstance(data, str):
                return str(data)
            return data

        except requests.exceptions.ReadTimeout as e:
            last_error = e
            suffix = f" [{label}]" if label else ""
            print(f"[WARN] LLM timeout{suffix} (attempt {attempt + 1}/{RETRIES + 1})")
            time.sleep(2)
        except Exception as e:
            raise RuntimeError(f"LLM call failed [{label}]: {e}") from e

    raise RuntimeError(f"LLM [{label}] failed after {RETRIES + 1} attempts: {last_error}")

# ---------------------------------------------------------
# Convenience: concurrent batch runner
# ---------------------------------------------------------

def llm_run_concurrent(tasks: list[dict]) -> list[dict]:
    results_by_label = {}

    def run_one(task):
        label  = task.get("label", "?")
        prompt = task["prompt"]
        try:
            response = llm_call(prompt, label=label)
            return {"label": label, "response": response, "error": None}
        except Exception as e:
            print(f"[ERROR] LLM concurrent task failed [{label}]: {e}")
            return {"label": label, "response": None, "error": str(e)}

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_task = {executor.submit(run_one, t): t for t in tasks}
        for future in as_completed(future_to_task):
            result = future.result()
            results_by_label[result["label"]] = result

    # Return in original order
    return [results_by_label[t["label"]] for t in tasks]

# ---------------------------------------------------------
# Helpers (shared across all callers)
# ---------------------------------------------------------

def extract_json_safely(text: str) -> dict | list:
    """Extract the first valid JSON object or array from an LLM response."""
    # Try object first
    obj_start = text.find("{")
    obj_end   = text.rfind("}")
    arr_start = text.find("[")
    arr_end   = text.rfind("]")

    if obj_start == -1 and arr_start == -1:
        raise ValueError("No JSON found in LLM response")

    # Pick whichever comes first
    if arr_start != -1 and (obj_start == -1 or arr_start < obj_start):
        return json.loads(text[arr_start:arr_end + 1])

    return json.loads(text[obj_start:obj_end + 1])

def chunk_text(text: str, size: int = 2000):
    """Yield chunks of `text` of at most `size` characters."""
    for i in range(0, len(text), size):
        yield text[i:i + size]
