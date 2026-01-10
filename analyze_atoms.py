
import json
import os
from collections import Counter
import re

def tokenize(text):
    return set(re.findall(r'\w+', text.lower()))

def jaccard_similarity(text1, text2):
    t1 = tokenize(text1)
    t2 = tokenize(text2)
    if not t1 or not t2:
        return 0.0
    return len(t1.intersection(t2)) / len(t1.union(t2))

def analyze_atoms(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    atoms = data.get("atoms", [])
    print(f"Total Atoms: {len(atoms)}")
    
    # 1. Type Distribution
    types = Counter(a.get("atom_type", "unknown") for a in atoms)
    print("\nAtom Types:")
    for t, c in types.items():
        print(f"  - {t}: {c}")

    # 2. Content Analysis
    contents = [a.get("content", "") for a in atoms]
    
    # Exact Duplicates
    duplicates = [item for item, count in Counter(contents).items() if count > 1]
    print(f"\nExact Duplicates: {len(duplicates)}")
    for d in duplicates:
        print(f"  - {d[:50]}...")

    # Near Duplicates (Jaccard > 0.8)
    print("\nNear Duplicates (Jaccard > 0.8):")
    seen = set()
    near_dupes = 0
    for i in range(len(contents)):
        for j in range(i + 1, len(contents)):
            if i in seen or j in seen:
                continue
            sim = jaccard_similarity(contents[i], contents[j])
            if sim > 0.8:
                print(f"  - [{sim:.2f}] '{contents[i][:30]}...' vs '{contents[j][:30]}...'")
                near_dupes += 1
                seen.add(j)
    
    if near_dupes == 0:
        print("  None found.")

    # 3. Read Time Analysis
    times = [a.get("estimated_read_time_sec", 0) for a in atoms]
    if times:
        avg_time = sum(times) / len(times)
        print(f"\nAverage Read Time: {avg_time:.2f} sec")
        print(f"Max Read Time: {max(times)} sec")
        print(f"Min Read Time: {min(times)} sec")

    # 4. Learning Quality Heuristics (Simple)
    # Check for variety in start words, length, etc.
    print("\nQuality Heuristics:")
    short_atoms = sum(1 for c in contents if len(c.split()) < 5)
    print(f"  - Very short atoms (< 5 words): {short_atoms}")
    
    long_atoms = sum(1 for c in contents if len(c.split()) > 50)
    print(f"  - Very long atoms (> 50 words): {long_atoms}")

if __name__ == "__main__":
    # Try both potential paths
    paths = [
        "output/stack_in_data_structure_atoms.json",
        "d:/code/scrolla/output/stack_in_data_structure_atoms.json"
    ]
    
    found = False
    for p in paths:
        if os.path.exists(p):
            print(f"Analyzing: {p}")
            analyze_atoms(p)
            found = True
            break
    
    if not found:
        print("Could not find the atom file in expected locations.")
