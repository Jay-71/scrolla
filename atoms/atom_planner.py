# -------------------------------------------------------------------
# Atom plans per concept type
# -------------------------------------------------------------------
from process.llm_extractor import run_llm_text

ATOM_PLANS = {
    "Definition": [
        "explanation",
        "mental_model",
        "key_points",
        "example",
        "why_it_matters",
        "quick_check"
    ],
    "Operation": [
        "explanation",
        "steps",
        "example",
        "edge_cases",
        "pitfall",
        "quick_check"
    ],
    "Complexity": [
        "explanation",
        "intuition",
        "comparison",
        "pitfall",
        "quick_check"
    ],
    "Pitfall": [
        "explanation",
        "why_it_happens",
        "impact",
        "prevention",
        "quick_check"
    ],
    "Application": [
        "explanation",
        "real_world_use",
        "why_suitable"
    ],
    "Principle": [
        "explanation",
        "rule",
        "consequence",
        "quick_check"
    ]
}


# -------------------------------------------------------------------
# Planner function (signature MUST match pipeline call)
# -------------------------------------------------------------------
def plan_atoms_for_concept(concept_knowledge: dict, concept_type: str):
    """
    Decide which atoms to generate for a concept.
    Returns an ordered list of atom plans.
    """

    concept = concept_knowledge["concept"]

    plans = []

    # -------------------------------------------------
    # Always start with understanding
    # -------------------------------------------------
    plans.append({
        "concept": concept,
        "concept_type": concept_type,
        "atom_type": "explanation"
    })

    plans.append({
        "concept": concept,
        "concept_type": concept_type,
        "atom_type": "mental_model"
    })

    # -------------------------------------------------
    # Type-specific expansion
    # -------------------------------------------------
    if concept_type == "Definition":
        plans.extend([
            {"concept": concept, "concept_type": concept_type, "atom_type": "key_points"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "example"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "why_it_matters"},
        ])

    elif concept_type == "Operation":
        plans.extend([
            {"concept": concept, "concept_type": concept_type, "atom_type": "steps"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "edge_cases"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "pitfall"},
        ])

    elif concept_type == "Complexity":
        plans.extend([
            {"concept": concept, "concept_type": concept_type, "atom_type": "intuition"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "comparison"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "pitfall"},
        ])

    elif concept_type == "Pitfall":
        plans.extend([
            {"concept": concept, "concept_type": concept_type, "atom_type": "why_it_happens"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "impact"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "prevention"},
        ])

    elif concept_type == "Application":
        plans.extend([
            {"concept": concept, "concept_type": concept_type, "atom_type": "real_world_use"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "why_suitable"},
        ])

    elif concept_type == "Principle":
        plans.extend([
            {"concept": concept, "concept_type": concept_type, "atom_type": "rule"},
            {"concept": concept, "concept_type": concept_type, "atom_type": "consequence"},
        ])

    # -------------------------------------------------
    # Always end with a check
    # -------------------------------------------------
    plans.append({
        "concept": concept,
        "concept_type": concept_type,
        "atom_type": "quick_check"
    })

    return plans
