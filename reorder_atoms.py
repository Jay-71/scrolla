"""
Script to reorder existing atoms to match concept_knowledge sequence.
This fixes atoms generated before the ordering fix was implemented.
"""
import json
import os
from process.concept_normalizer import normalize_concept_name


def reorder_atoms(topic: str):
    """
    Reorder atoms in the atoms file to match the concept_knowledge sequence.
    
    Args:
        topic: The topic name (e.g., "linked list in data structure")
    """
    # Load concept_knowledge to get the correct order
    concept_knowledge_path = f"output/concept_knowledge/{topic.replace(' ', '_').lower()}.json"
    atoms_path = f"output/{topic.replace(' ', '_').lower()}_atoms.json"
    
    if not os.path.exists(concept_knowledge_path):
        print(f"[ERROR] Concept knowledge file not found: {concept_knowledge_path}")
        return
    
    if not os.path.exists(atoms_path):
        print(f"[ERROR] Atoms file not found: {atoms_path}")
        return
    
    # Load files
    with open(concept_knowledge_path, "r", encoding="utf-8") as f:
        concept_data = json.load(f)
    
    with open(atoms_path, "r", encoding="utf-8") as f:
        atoms_data = json.load(f)
    
    # Get concept order from concept_knowledge
    concept_order = [c["concept"] for c in concept_data["concepts"]]
    print(f"\n[INFO] Expected concept order:")
    for i, concept in enumerate(concept_order, 1):
        print(f"  {i}. {concept}")
    
    # Group atoms by concept (using stemming for matching)
    atoms_by_concept = {}
    for atom in atoms_data["atoms"]:
        concept = atom["concept"]
        normalized = normalize_concept_name(concept)
        
        if normalized not in atoms_by_concept:
            atoms_by_concept[normalized] = []
        atoms_by_concept[normalized].append(atom)
    
    print(f"\n[INFO] Found {len(atoms_by_concept)} unique concepts in atoms file")
    
    # Reorder atoms according to concept_knowledge sequence
    reordered_atoms = []
    order = 1
    
    for expected_concept in concept_order:
        normalized_expected = normalize_concept_name(expected_concept)
        
        if normalized_expected in atoms_by_concept:
            concept_atoms = atoms_by_concept[normalized_expected]
            print(f"\n[REORDER] {expected_concept}: {len(concept_atoms)} atoms (order {order}-{order + len(concept_atoms) - 1})")
            
            for atom in concept_atoms:
                atom["order"] = order
                order += 1
                reordered_atoms.append(atom)
        else:
            print(f"\n[WARN] No atoms found for concept: {expected_concept}")
    
    # Check for any atoms not matched
    matched_concepts = set()
    for expected_concept in concept_order:
        matched_concepts.add(normalize_concept_name(expected_concept))
    
    orphaned = set(atoms_by_concept.keys()) - matched_concepts
    if orphaned:
        print(f"\n[WARN] Found {len(orphaned)} concepts in atoms but not in concept_knowledge:")
        for normalized in orphaned:
            original_names = set(atom["concept"] for atom in atoms_by_concept[normalized])
            print(f"  - {', '.join(original_names)} ({len(atoms_by_concept[normalized])} atoms)")
            
            # Add orphaned atoms at the end
            for atom in atoms_by_concept[normalized]:
                atom["order"] = order
                order += 1
                reordered_atoms.append(atom)
    
    # Save reordered atoms
    atoms_data["atoms"] = reordered_atoms
    
    with open(atoms_path, "w", encoding="utf-8") as f:
        json.dump(atoms_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n[SUCCESS] Reordered {len(reordered_atoms)} atoms")
    print(f"[SAVED] {atoms_path}")
    
    # Show before/after comparison
    print(f"\n{'='*60}")
    print("BEFORE vs AFTER (First 3 concepts)")
    print(f"{'='*60}")
    
    # Load original to compare
    with open(atoms_path, "r", encoding="utf-8") as f:
        new_data = json.load(f)
    
    seen_concepts = []
    for atom in new_data["atoms"][:21]:  # First 3 concepts × 7 atoms
        if atom["concept"] not in seen_concepts:
            seen_concepts.append(atom["concept"])
            if len(seen_concepts) <= 3:
                print(f"{len(seen_concepts)}. {atom['concept']} (order {atom['order']})")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        topic = " ".join(sys.argv[1:])
    else:
        topic = input("Enter topic: ").strip()
    
    if topic:
        reorder_atoms(topic)
    else:
        print("[ERROR] No topic provided")
