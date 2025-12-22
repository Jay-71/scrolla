from atoms.atom_planner import plan_atoms_for_concept
from atoms.atom_generator import generate_atom

from datetime import datetime
from process.atom_bundle_generator import generate_atom_bundle

from atoms.atom_planner import plan_atoms_for_concept


def generate_atoms_for_topic(topic, concepts, concept_knowledge_map):
    atoms = []

    for c in concepts:
        name = c["concept"]
        ctype = c["type"]

        ck = concept_knowledge_map.get(name.lower())
        if not ck:
            continue

        # 🔧 FIX: pass concept_type explicitly
        plans = plan_atoms_for_concept(ck, ctype)
        atoms.extend(plans)

    return {
        "topic": topic,
        "atoms": atoms
    }

# -------------------------------------------------
# Helpers
# -------------------------------------------------

def estimate_read_time(text: str):
    words = len(text.split())
    return max(4, min(10, words // 4))
