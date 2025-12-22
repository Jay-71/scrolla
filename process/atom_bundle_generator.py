from process.text_utils import normalize_text, safe_split_lines, parse_json_garbage
from process.llm_extractor import run_llm_text

PROMPT = """
You are generating learning atoms for scrolling study.

Topic: {topic}
Concept: {concept}
Concept Type: {concept_type}

Authoritative knowledge:
{knowledge}

Task:
Generate 6–10 learning atoms in JSON.

Allowed atom types:
- explanation
- mental_model
- example
- key_points
- pitfall
- why_it_matters
- quick_check

Rules:
- Simple language
- Short paragraphs
- Beginner friendly
- No repetition
- No emojis
- No headings
- Return ONLY valid JSON

Output format:
[
  {{
    "atom_type": "...",
    "content": "..."
  }}
]
"""


def generate_atom_bundle(topic, concept_knowledge):
    prompt = PROMPT.format(
        topic=topic,
        concept=concept_knowledge["concept"],
        concept_type=concept_knowledge["type"],
        knowledge=_format_knowledge(concept_knowledge["knowledge"])
    )


    text = normalize_text(run_llm_text(prompt))
    lines = safe_split_lines(text)


    try:
        atoms = parse_json_garbage(text)
    except Exception as e:
        print(f"[ERROR] Failed to parse JSON for {concept_knowledge['concept']}: {e}")
        print(f"[DEBUG] Original text: {text[:500]}...")
        raise e

    results = []
    for a in atoms:
        content = a["content"]
        if isinstance(content, list):
            content = "\n".join(content)
        
        results.append({
            "topic": topic,
            "concept": concept_knowledge["concept"],
            "atom_type": a["atom_type"],
            "content": content,
            "difficulty": "easy",
            "estimated_read_time_sec": max(4, min(10, len(content.split()) // 4))
        })

    return results


def _format_knowledge(k):
    if isinstance(k, dict):
        return "\n".join(f"- {x}: {y}" for x, y in k.items())
    return str(k)
