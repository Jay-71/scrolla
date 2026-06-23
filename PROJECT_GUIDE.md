# Scrolla Project Guide & Architecture

## Overview
Scrolla is a dopamine-optimized, TikTok-style learning application that breaks complex topics down into small "Atoms". The project consists of an AI-powered Python backend to generate content using LLMs (Ollama) and a React/Vite frontend for the vertical-scrolling feed consumption.

## Directory Structure

* **`main.py`**: The CLI entrypoint for the backend. Orchestrates the pipeline: fetching, extraction, knowledge resolution, atom generation, and curation.
* **`engine/`**: The core logic and pipeline modules.
  * **`llm.py`**: Gateway for all LLM interactions with Ollama. Contains retry logic, concurrency tools, and model configuration (default: `mistral`).
  * **`extract.py`**: Extracts concepts from raw text and resolves detailed knowledge for each concept.
  * **`generate.py`**: Prompts the LLM to generate structured "Atoms" (e.g., explanation, example, mental_model).
  * **`curate.py`**: Validates, filters, and refines the generated atoms to ensure quality.
  * **`store.py`**: Handles saving outputs, caching intermediate representations (raw, semantic, knowledge) in the filesystem.
  * **`fetch.py`**: Connects to information sources (like Wikipedia) to gather initial context.
  * **`index.py`**: Builds an index of cached topics to skip redundant work.
  * **`context.py`**: Merges text from multiple sources for the LLM.
  * **`normalize.py`**: Utilities for cleaning text and parsing LLM JSON output.
* **`containers/`**: Domain configurations (`dsa.py`, `ml.py`, `general.py`) detailing which sources to fetch and what concept types are allowed.
* **`output/`**: Serves as an implicit cache and destination. Stores generated JSON atom feeds (`<topic>_atoms.json`).
* **`visual/`**: React + Vite frontend application.
  * **`src/App.jsx`**: Main UI wrapper implementing vertical snapping/scrolling behavior, mapping `atoms.json` items into cards.
  * **`src/components/`**: UI components like `AtomCard.jsx` (which displays the atom content) and `ProgressDots.jsx`.
  * **`src/data/atoms.json`**: The destination or symlink where the React app expects the generated JSON feed.

## The Generation Pipeline Flow (`main.py`)
1. **Cache Check:** Uses `engine.index` to find if the target topic already has generated atoms in the `output/` folder.
2. **Fetch:** Retrieves raw content (e.g., Wikipedia pages) via `containers.<domain>`.
3. **Extract Concepts:** Uses the LLM to identify high-level topics/concepts within the fetched context.
4. **Resolve Knowledge:** Fetches deeper explanations for the identified concepts, loading from cache when possible or querying the LLM concurrently.
5. **Generate Atoms:** Calls `generate_atom_bundle()` to produce specific chunks of information (explanation, mental_model, example, pitfall, quick_check).
6. **Curate:** Filters atoms through strict rules to ensure they are bite-sized and clear.
7. **Store:** Outputs the final feed structure to JSON format.

## Architectural Constraints & Conventions
- **LLM Gateway**: All LLM calls MUST go through `engine.llm.llm_call()` or `engine.llm.llm_run_concurrent()`. Direct API calls elsewhere are forbidden.
- **Caching**: The backend caches at every significant step (raw, semantic, knowledge, atoms) to optimize LLM cost and runtime.
- **Atom Strictness**: Atoms must adhere to simple language, short paragraphs, and specific types (e.g., mental models must use unique analogies, no generic "chain" or "boxes").
- **State Flow**: The Python backend generates static JSON artifacts which the frontend statically consumes. There is no real-time database connection in this architecture.

## Frontend Development
* **Environment**: Node.js 18+
* **Run**: `cd visual && npm run dev`
* **Styling**: `index.css` and custom components handle the full-screen TikTok style aesthetics. `App.jsx` relies on `IntersectionObserver` or scroll event math to calculate the current visible card index.
