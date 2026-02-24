# Scrolla: TikTok for Learning

Scrolla is a dopamine-optimized learning feed that breaks down complex topics into small, digestible "Atoms". It mimics the engaging nature of short-form video feeds but focuses on delivering high-quality educational content.

## 🚀 Project Overview

The core philosophy of Scrolla is to transform the way we learn by:
1.  **Deconstructing** topics into atomic concepts.
2.  **Structuring** these concepts into a logical dependency graph.
3.  **Presenting** them in a scrollable, bite-sized format (Atoms).

Each "Atom" is a self-contained unit of knowledge—an explanation, a mental model, an example, or a quick check—designed to be read in seconds.

## 🏗️ Architecture

Scrolla operates on a pipeline that transforms raw information into curated learning atoms:

```mermaid
graph LR
    Input[Input Sources] --> Fetch[Fetch & Clean]
    Fetch --> Merge[Merged Context]
    Merge --> Extract[Concept Extraction (LLM)]
    Extract --> Resolve[Knowledge Resolution (LLM)]
    Resolve --> Generate[Atom Generation (LLM)]
    Generate --> Curate[Curation & Ordering]
    Curate --> Output[Final Feed JSON]
```

### Core Components

1.  **Input (`input/`)**: Fetches raw text from Wikipedia, Open Textbooks, and other references.
2.  **Process (`process/`)**:
    *   **LLM Extractor**: Uses a local LLM to identify key concepts.
    *   **Knowledge Resolver**: Expands each concept into authoritative knowledge.
    *   **Atom Generator**: Converts knowledge into specific atom types (Explanation, Mental Model, etc.).
3.  **Atoms (`atoms/`)**: Defines the structure and validation rules for atoms.
4.  **Storage (`storage/`)**: Handles saving raw data, semantic concepts, and final atom feeds to JSON.

## 🛠️ Setup & Installation

### Prerequisites

*   **Python 3.10+**
*   **Ollama**: You must have [Ollama](https://ollama.com/) installed and running locally.
*   **Mistral Model**: The project is configured to use the `mistral` model by default.

```bash
# Pull the model
ollama pull mistral
```

### Installation

1.  Clone the repository.
2.  Install python dependencies:

```bash
pip install -r requirements.txt
```

## 🏃 Usage

1.  **Start Ollama**: Ensure your local LLM server is running.
    ```bash
    ollama serve
    ```

2.  **Run Scrolla**:
    ```bash
    python main.py
    ```

3.  **Enter a Topic**: When prompted, type a topic you want to learn about (e.g., "Binary Search Trees", "Quantum Entanglement").

4.  **Monitor Progress**: The pipeline will output its status steps:
    *   Fetching sources...
    *   Extracting concepts...
    *   Resolving knowledge...
    *   Generating atoms...

5.  **View Output**: The final curated feed is saved in the `output/` directory as a JSON file (e.g., `output/<topic>_atoms.json`).

## 📂 Project Structure

```
scrolla/
├── atoms/              # Atom definitions, validation, and curation logic
├── input/              # Scrapers for Wikipedia, textbooks, etc.
├── intelligence/       # (Experimental) Advanced concept scoring and graph logic
├── process/            # Core LLM pipeline (Extraction, Generation)
├── storage/            # JSON file I/O operations
├── output/             # Generated content
├── main.py             # Entry point
└── requirements.txt    # Python dependencies
```

## 🧩 The Atom Protocol

Scrolla uses a strict format for "Atoms" to ensure quality:

*   **Explanation**: Plain language, no jargon, under 30 words.
*   **Mental Model**: A single powerful analogy.
*   **Example**: Concrete real-world or code example.
*   **Pitfall**: Common user mistakes.
*   **Quick Check**: Interactive question to verify understanding.

See `atoms/atom_generator.py` for the specific prompts and `atoms/atom_validator.py` for quality gates.
