from process.llm_extractor import run_llm_text


# -------------------------------------------------------------------
# Atom generation prompts (STRICT, scroll-first)
# -------------------------------------------------------------------

PROMPTS = {
    "explanation": """You are generating a learning atom.

Concept: {concept}

Task:
Explain the idea simply.
No formal definitions.
No examples.
Max 2 sentences.
Max 30 words.
Plain language only.
""",

    "mental_model": """You are generating a learning atom.

Concept: {concept}

Task:
Give ONE simple, UNIQUE analogy.
Avoid these overused metaphors: chain, links, boxes, train, arrows, list.
Be creative and specific to THIS concept.
ONE sentence only.
Max 25 words.
""",

    "example": """You are generating a learning atom.

Concept: {concept}

Task:
Give ONE concrete real-world or software example.
ONE sentence only.
No explanation.
Max 25 words.
""",

    "key_points": """You are generating a learning atom.

Concept: {concept}

Task:
List 3–4 bullet points.
Each bullet max 8 words.
No full sentences.
No repetition.
""",

    "why_it_matters": """You are generating a learning atom.

Concept: {concept}

Task:
Explain why this concept is useful.
ONE or TWO short sentences.
No examples.
Max 30 words.
""",

    "steps": """You are generating a learning atom.

Concept: {concept}

Task:
List at most 5 steps.
Each step max 6 words.
No explanations.
""",

    "edge_cases": """You are generating a learning atom.

Concept: {concept}

Task:
List up to 3 edge cases.
Each bullet max 10 words.
No explanation.
""",

    "intuition": """You are generating a learning atom.

Concept: {concept}

Task:
Explain the intuition behind this.
ONE or TWO short sentences.
No formulas.
Max 30 words.
""",

    "comparison": """You are generating a learning atom.

Concept: {concept}

Task:
Compare with ONE related alternative.
Highlight ONE clear difference.
Max 2 sentences.
Max 30 words.
""",

    "pitfall": """You are generating a learning atom.

Concept: {concept}

Task:
Describe ONE common mistake.
ONE sentence only.
No solution.
Max 25 words.
""",

    "why_it_happens": """You are generating a learning atom.

Concept: {concept}

Task:
Explain why this mistake occurs.
ONE short sentence.
Max 20 words.
""",

    "impact": """You are generating a learning atom.

Concept: {concept}

Task:
Explain the impact of this issue.
ONE short sentence.
Focus on performance or correctness.
Max 25 words.
""",

    "prevention": """You are generating a learning atom.

Concept: {concept}

Task:
State ONE way to avoid the issue.
ONE sentence.
Max 20 words.
""",

    "real_world_use": """You are generating a learning atom.

Concept: {concept}

Task:
Describe ONE real-world use case.
ONE sentence only.
Max 25 words.
""",

    "why_suitable": """You are generating a learning atom.

Concept: {concept}

Task:
Explain why this concept fits the use case.
ONE sentence only.
Max 25 words.
""",

    "rule": """You are generating a learning atom.

Concept: {concept}

Task:
State the core rule.
ONE sentence.
Max 20 words.
""",

    "consequence": """You are generating a learning atom.

Concept: {concept}

Task:
Explain what happens if this rule is followed or violated.
ONE sentence.
Max 25 words.
""",

    "quick_check": """You are generating a learning atom.

Concept: {concept}

Task:
Ask ONE yes/no or simple MCQ question.
Do NOT include the answer.
ONE sentence only.
Max 20 words.
"""
}


# -------------------------------------------------------------------
# Atom generator
# -------------------------------------------------------------------
def normalize_text(value):
    if isinstance(value, list):
        return "\n".join(str(v) for v in value)
    if isinstance(value, str):
        return value
    if value is None:
        return ""
    raise TypeError(f"Expected str or list[str], got {type(value)}")


# -------------------------------------------------------------------
# Atom generator
# -------------------------------------------------------------------
def generate_atom(topic: str, plan_item: dict, concept_knowledge: dict):
    atom_type = plan_item["atom_type"]
    concept = plan_item["concept"]
    concept_type = plan_item["concept_type"]

    knowledge = json_safe(concept_knowledge.get("knowledge"))

    prompt = PROMPTS[atom_type].format(
        concept=concept,
        concept_type=concept_type,
        knowledge=knowledge
    )

    raw_text = run_llm_text(prompt)
    text = normalize_text(raw_text)

    return {
        "topic": topic,
        "concept": concept,
        "atom_type": atom_type,
        "content": text,
        "difficulty": "easy",
        "estimated_read_time_sec": estimate_read_time(text)
    }


# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------
def json_safe(obj):
    """
    Render knowledge dictionary compactly for prompts.
    """
    if isinstance(obj, dict):
        return "\n".join(
            f"- {k.replace('_', ' ')}: {normalize_text(v)}"
            for k, v in obj.items()
            if v
        )

    if isinstance(obj, list):
        return "\n".join(normalize_text(v) for v in obj)

    if isinstance(obj, str):
        return obj

    return ""


from process.text_utils import normalize_text

def estimate_read_time(text):
    text = normalize_text(text)
    words = len(text.split())
    return max(4, min(12, words // 4))

