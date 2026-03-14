# Scrolla — Project Optimization Analysis

## Overview

After a deep audit of all 30+ source files across 7 directories, I've identified **10 issues** — the 5 you raised plus 5 additional ones found during analysis.

---

## Your 5 Issues

### Issue 1 — Scattered File Structure

**Problem**: 7 top-level directories with thin files spread everywhere.

```
scrolla/
├── atoms/          (5 files)    ← atom generation & curation
├── input/          (3 files)    ← data fetching
├── intelligence/   (6 files)    ← NOT USED IN PIPELINE
├── process/        (13 files)   ← extraction, validation, caching
├── storage/        (4 files)    ← save/load JSON files
├── output/         (runtime)    ← generated data
├── visual/         (frontend)
├── main.py
├── reorder_atoms.py
├── analyze_atoms.py
└── tempCodeRunnerFile.py        ← orphan
```

**Root cause**: Each "layer" got its own folder, but many files are 15-40 lines. The `process/` folder alone has 13 files, some doing nearly identical things.

**Proposed Solution**: Consolidate into 3 backend directories:

```
scrolla/
├── engine/              ← ALL backend logic
│   ├── fetch.py         ← merged: wiki_fetch + open_textbook_fetch + reference_readers
│   ├── extract.py       ← merged: llm_extractor + knowledge_extractor + knowledge_single_extractor
│   ├── generate.py      ← merged: atom_bundle_generator + atom_generator
│   ├── curate.py        ← atom_curator + atom_validator
│   ├── normalize.py     ← concept_normalizer + text_utils
│   └── store.py         ← merged: all storage files
├── containers/          ← domain-specific configs (Issue 2)
├── output/              ← generated data
├── visual/              ← frontend
└── main.py
```

**Impact**: ~30 files → ~8 files, clearer imports, easier onboarding.

---

### Issue 2 — DSA-Centralized Pipeline (No Domain Isolation)

**Problem**: Data sources are hardcoded to DSA websites:

```python
# input/reference_readers.py — HARDCODED to DSA sites
fetch_geeksforgeeks(topic)    # DSA only
fetch_w3schools(topic)         # DSA only
fetch_tutorialspoint(topic)    # DSA only
```

```python
# process/source_config.py — HARDCODED weights
SOURCE_WEIGHTS = {
    "geeksforgeeks": 0.6,
    "w3schools": 0.5,
    "tutorialspoint": 0.5
}
```

Adding ML or any non-DSA domain will fetch irrelevant content from these sites.

**Proposed Solution**: Domain containers with isolated configs:

```
containers/
├── base_container.py         ← default pipeline interface
├── dsa/
│   ├── config.json           ← sources, weights, concept types
│   └── sources.py            ← DSA-specific fetchers
├── ml/
│   ├── config.json
│   └── sources.py            ← ML-specific fetchers (arXiv, Papers With Code, etc.)
└── general/
    ├── config.json
    └── sources.py            ← Wikipedia-only fallback
```

Each `config.json`:
```json
{
  "domain": "dsa",
  "sources": [
    {"name": "geeksforgeeks", "weight": 0.6, "fetcher": "fetch_geeksforgeeks"},
    {"name": "w3schools", "weight": 0.5, "fetcher": "fetch_w3schools"}
  ],
  "concept_types": ["Definition", "Operation", "Complexity", "Principle", "Application", "Pitfall"],
  "max_concepts": 15
}
```

`main.py` auto-selects the container based on topic or lets user choose.

---

### Issue 3 — Excessive LLM Calls (Computation Drain)

**Problem**: For a topic with N concepts, the current pipeline makes:

| Step | LLM Calls | What it does |
|------|-----------|--------------|
| Concept extraction | 1 per chunk (~3-5) | Extracts concepts from raw text |
| Knowledge extraction | 1 per concept (N) | Deep knowledge for each concept |
| Atom bundle generation | 1 per concept (N) | Generates 6-10 atoms each |
| **Total** | **~3 + 2N calls** | For 13 concepts = **~29 LLM calls** |

Each call takes 10-30s on local Ollama. **Full pipeline = 5-15 minutes**.

Additionally, `knowledge_extractor.py` duplicates the Ollama connection config:

```python
# llm_extractor.py
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral"

# knowledge_extractor.py — SAME CONFIG DUPLICATED
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral"
```

**Proposed Solution — Batch + Cache + Single Gateway**:

1. **Single LLM gateway**: One file, one config, one retry/timeout policy
2. **Batch knowledge extraction**: Send all concepts in ONE prompt instead of N separate calls

```python
# BEFORE: N separate LLM calls
for concept in concepts:
    knowledge = extract_single_concept_knowledge(topic, concept, context)  # 1 LLM call each

# AFTER: 1 batched LLM call
all_knowledge = extract_batch_concept_knowledge(topic, all_concepts, context)  # 1 call total
```

3. **Skip atom_generator.py entirely**: `atom_bundle_generator.py` already generates all atoms in one call per concept. The individual `atom_generator.py` (with 20+ prompt templates) is never used in the active pipeline — it's dead code.

**Estimated reduction**: 29 calls → ~5-7 calls (per topic).

---

### Issue 4 — Unnecessary Layers

**Problem**: Several entire modules are **never imported** by `main.py`:

| File | Lines | Status |
|------|-------|--------|
| `intelligence/engine.py` | 27 | ❌ **Never imported** in main pipeline |
| `intelligence/semantic_normalizer.py` | 26 | ❌ Dead (needs `sentence_transformers`) |
| `intelligence/concept_graph.py` | 20 | ❌ Dead |
| `intelligence/concept_scorer.py` | 43 | ❌ Dead |
| `intelligence/concept_selector.py` | 23 | ❌ Dead |
| `intelligence/cluster_merger.py` | 16 | ❌ Dead |
| `atoms/atom_pipeline.py` | 37 | ❌ **Never imported** anywhere |
| `atoms/atom_planner.py` | 132 | ❌ Only imported by dead `atom_pipeline.py` |
| `atoms/atom_generator.py` | 276 | ⚠️ Only imported by dead `atom_pipeline.py` |
| `process/knowledge_resolver.py` | 44 | ❌ **Never imported** by main |
| `process/knowledge_contracts.py` | 32 | ❌ **Never imported** anywhere |
| `process/knowledge_validator.py` | 16 | ❌ **Never imported** anywhere |
| `process/validator.py` | 89 | ❌ **Never imported** by main |

**13 files (~580 lines) are completely dead code.**

The entire `intelligence/` folder (6 files) was designed for concept scoring/clustering but was never wired into `main.py`.

**Proposed Solution**: 
- Delete all dead files
- If the intelligence layer has future value, move it to a `_deprecated/` folder with a note

---

### Issue 5 — No Topic-Level Caching (Duplicate Pipeline Runs)

**Problem**: If User A generates atoms for `"Linked List in data structure"` and User B asks for `"Linked List"`, the entire pipeline runs again from scratch — fetching, extracting, LLM calls, everything.

Current caching is **concept-level only** (inside `concept_knowledge_store.py`), not **topic-level**.

**Proposed Solution — Fuzzy Topic Index**:

```python
# output/topic_index.json
{
  "topics": [
    {
      "canonical": "linked_list_in_data_structure",
      "aliases": ["linked list", "linked list in data structure", "linked list dsa"],
      "atoms_file": "output/linked_list_in_data_structure_atoms.json",
      "generated_at": "2026-02-15T10:18:10",
      "concept_count": 13,
      "atom_count": 91
    }
  ]
}
```

**Matching logic using stemming** (we already have NLTK):

```python
from process.concept_normalizer import normalize_concept_name

def find_existing_topic(user_query: str, topic_index: list) -> dict | None:
    """
    Fuzzy match user query against existing topics.
    "Linked List" matches "Linked List in Data Structure" 
    if stemmed form is a subset.
    """
    query_stems = set(normalize_concept_name(user_query).split())
    
    for topic in topic_index:
        canonical_stems = set(normalize_concept_name(topic["canonical"]).split())
        # If query is a subset of canonical, it's a match
        if query_stems.issubset(canonical_stems):
            return topic
        # Check aliases
        for alias in topic.get("aliases", []):
            alias_stems = set(normalize_concept_name(alias).split())
            if query_stems == alias_stems or query_stems.issubset(alias_stems):
                return topic
    
    return None
```

**Flow**:
1. User enters topic → check `topic_index.json` first
2. If fuzzy match found → return existing atoms JSON immediately
3. If no match → run pipeline → save result + update index

---

## 5 Additional Issues Found

### Issue 6 — Duplicate Ollama Config

`OLLAMA_URL` and `MODEL` are defined in **two separate files** (`llm_extractor.py` L5-6 and `knowledge_extractor.py` L6-7). Changing the model requires editing both.

**Fix**: Single `config.py` at project root.

---

### Issue 7 — `atom_curator` Breaks Concept Ordering

In `main.py`, atoms are generated in concept_knowledge order (fix we implemented). But then `atom_curator.py` L80-86 re-sorts by `concept.lower()` **alphabetically**, destroying the pedagogical order:

```python
# atom_curator.py — THIS DESTROYS OUR ORDERING
sorted_atoms = sorted(
    deduped.values(),
    key=lambda a: (
        a["concept"].lower(),   # ← ALPHABETICAL, not pedagogical
        ORDER.index(a["atom_type"])
    )
)
```

"Circular Linked List" would sort before "Linked List" alphabetically, putting an advanced concept before the fundamental one.

**Fix**: Sort by the original `order` field instead, or pass concept_knowledge order.

---

### Issue 8 — Orphan Directories & Files

These exist at root level and are no longer used:
- `raw_knowledge/` — old output location (now `output/raw_knowledge/`)
- `semantic_knowledge/` — old output location (now `output/semantic_knowledge/`)
- `tempCodeRunnerFile.py` — leftover from testing
- `vibe_coding_app_plan.md` — planning doc, not code

**Fix**: Delete orphans, add `.gitignore` rules.

---

### Issue 9 — No Error Recovery / Partial Results

If the pipeline crashes at step 4 (knowledge extraction) after processing 8/13 concepts, there's no way to resume. The next run starts from scratch — re-fetching Wikipedia, re-extracting concepts, etc.

**Fix**: Checkpoint system. After each major step, save intermediate state:
```
output/.checkpoints/
├── linked_list_in_data_structure/
│   ├── step1_sources.json
│   ├── step2_concepts.json
│   ├── step3_knowledge.json    ← resume from here
│   └── step4_atoms.json
```

---

### Issue 10 — `normalize_text()` Defined 3 Times

The same function exists in:
1. `process/text_utils.py` L1-12
2. `atoms/atom_generator.py` L206-213
3. `atoms/atom_curator.py` L7-12

**Fix**: Single source of truth in one utility file.

---

## Summary Table

| # | Issue | Severity | Effort | Impact |
|---|-------|----------|--------|--------|
| 1 | Scattered files | Medium | Medium | Maintainability |
| 2 | DSA-only pipeline | **High** | High | Scalability |
| 3 | Excessive LLM calls | **High** | Medium | Performance & Cost |
| 4 | Dead code layers | Medium | Low | Code cleanliness |
| 5 | No topic caching | **High** | Medium | User experience & Cost |
| 6 | Duplicate Ollama config | Low | Low | Maintenance |
| 7 | Curator breaks ordering | Medium | Low | Content quality |
| 8 | Orphan files/dirs | Low | Low | Cleanliness |
| 9 | No error recovery | Medium | Medium | Reliability |
| 10 | Triple `normalize_text` | Low | Low | DRY violation |

## Recommended Priority Order

1. **Issue 5** — Topic caching (biggest user-facing win, moderate effort)
2. **Issue 3** — Reduce LLM calls (biggest cost/perf win)
3. **Issue 4** — Remove dead code (quick cleanup, reduces confusion)
4. **Issue 7** — Fix curator ordering (quick fix, quality impact)
5. **Issue 2** — Domain containers (enables scaling to ML/other domains)
6. **Issue 1** — Consolidate files (do alongside other refactors)
7. **Issue 6, 8, 10** — Quick cleanup tasks
8. **Issue 9** — Checkpoint system (nice-to-have for reliability)
