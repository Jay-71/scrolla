from collections import OrderedDict

# -------------------------------
# Helpers
# -------------------------------

def normalize_text(value):
    if isinstance(value, list):
        return "\n".join(str(v).strip() for v in value if v)
    if isinstance(value, str):
        return value.strip()
    return str(value)


def clean_quick_check(text: str):
    """
    Remove answers if LLM leaked them.
    """
    for marker in ["Answer:", "answer:", "Ans:", "Correct:"]:
        if marker in text:
            text = text.split(marker)[0].strip()
    return text


# -------------------------------
# Core Curator
# -------------------------------

def curate_atoms(atom_feed: dict):
    """
    Input: {
        "topic": str,
        "atoms": [ { atom }, ... ]
    }
    Output: same structure, but curated
    """

    topic = atom_feed["topic"]
    atoms = atom_feed["atoms"]

    # (concept, atom_type) → atom
    deduped = OrderedDict()

    for atom in atoms:
        concept = atom.get("concept")
        atom_type = atom.get("atom_type")

        key = (concept.lower(), atom_type)

        content = normalize_text(atom.get("content", ""))

        # Quick check sanitization
        if atom_type == "quick_check":
            content = clean_quick_check(content)

        atom["content"] = content

        # Keep the better version if duplicate
        if key in deduped:
            existing = deduped[key]
            if len(content) > len(existing["content"]):
                deduped[key] = atom
        else:
            deduped[key] = atom

    # -------------------------------
    # Enforce learning order
    # -------------------------------

    ORDER = [
        "explanation",
        "mental_model",
        "example",
        "key_points",
        "pitfall",
        "why_it_matters",
        "quick_check"
    ]

    sorted_atoms = sorted(
        deduped.values(),
        key=lambda a: (
            a["concept"].lower(),
            ORDER.index(a["atom_type"]) if a["atom_type"] in ORDER else 99
        )
    )

    # Reassign order cleanly
    for idx, atom in enumerate(sorted_atoms, start=1):
        atom["order"] = idx

    return {
        "topic": topic,
        "atoms": sorted_atoms
    }
