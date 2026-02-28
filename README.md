# Scrolla: TikTok for Learning

Scrolla is a dopamine-optimized learning feed that breaks down complex topics into small, digestible "Atoms". It mimics the engaging nature of short-form video feeds but focuses on delivering high-quality educational content.

## 🚀 Project Overview

The core philosophy of Scrolla is to transform the way we learn by:
1.  **Deconstructing** topics into atomic concepts.
2.  **Structuring** these concepts into a logical dependency graph.
3.  **Presenting** them in a scrollable, bite-sized format (Atoms).

Each "Atom" is a self-contained unit of knowledge—an explanation, a mental model, an example, or a quick check—designed to be read in seconds. The project now features a complete system with an AI-driven backend for content generation and a React-based frontend for the TikTok-style vertical scrolling feed.

## 🏗️ Architecture

Scrolla operates on a pipeline that transforms raw information into curated learning atoms, and then serves them via a visually rich web application.

```mermaid
graph LR
    Input[Input Sources] --> Fetch[Fetch & Clean]
    Fetch --> Merge[Merged Context]
    Merge --> Extract[Concept Extraction (LLM)]
    Extract --> Resolve[Knowledge Resolution (LLM)]
    Resolve --> Generate[Atom Generation (LLM)]
    Generate --> Curate[Curation & Ordering]
    Curate --> Output[Final Feed JSON]
    Output --> Frontend[React/Vite Visual Feed]
```

### Core Components

1.  **Input (`input/`)**: Fetches raw text from Wikipedia, Open Textbooks, GeeksForGeeks, W3Schools, etc.
2.  **Process (`process/`)**:
    *   **LLM Extractor**: Uses a local LLM to identify key concepts.
    *   **Knowledge Resolver**: Expands each concept into authoritative knowledge.
    *   **Atom Generator**: Converts knowledge into specific atom types (Explanation, Mental Model, etc.).
3.  **Atoms (`atoms/`)**: Defines the structure and validation rules for atoms.
4.  **Storage (`storage/`)**: Handles saving raw data, semantic concepts, and final atom feeds to JSON (`output/`).
5.  **Visual Frontend (`visual/`)**: A React/Vite powered vertical-scroll UI that renders the generated JSON feeds with animations, Lottie graphics, and rich data cards.

## 🛠️ Setup & Installation

### Backend Prerequisites

*   **Python 3.10+**
*   **Ollama**: You must have [Ollama](https://ollama.com/) installed and running locally.
*   **Mistral Model**: The project is configured to use the `mistral` model by default.

```bash
# Pull the model
ollama pull mistral
```

### Frontend Prerequisites
*   **Node.js 18+**
*   **npm**

### Installation

1.  Clone the repository.
2.  Install Python dependencies:

```bash
pip install -r requirements.txt
```

3.  Install Frontend dependencies:

```bash
cd visual
npm install
```

## 🏃 Usage

### 1. Generate the Content Feed (Backend)

1.  **Start Ollama**: Ensure your local LLM server is running.
    ```bash
    ollama serve
    ```

2.  **Run Scrolla Python Pipeline**:
    ```bash
    python main.py
    ```

3.  **Enter a Topic**: When prompted, type a topic you want to learn about (e.g., "Binary Search Trees", "Quantum Entanglement"). The pipeline will fetch sources, extract concepts, resolve knowledge, and generate atoms.

4.  **View Output**: The final curated feed is saved in the `output/` directory as a JSON file (e.g., `output/<topic>_atoms.json`). The frontend automatically reads from the output to display the feeds.

### 2. Run the Visual Feed (Frontend)

1.  Navigate to the `visual/` directory and start the Vite dev server:
    ```bash
    cd visual
    npm run dev
    ```

2.  Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).
3.  Scroll through your newly generated knowledge feed just like a TikTok/Reels feed!

## 📂 Project Structure

```text
scrolla/
├── atoms/              # Atom definitions, validation, and curation logic
├── input/              # Scrapers for Wikipedia, textbooks, and web references
├── intelligence/       # Advanced concept scoring and graph logic
├── process/            # Core LLM pipeline (Extraction, Generation)
├── storage/            # JSON file I/O operations for caching and output
├── visual/             # React + Vite frontend for the vertical scroll feed
├── output/             # Generated final atom JSON feeds
├── raw_knowledge/      # Cached scraped text content
├── semantic_knowledge/ # Cached extracted concepts and definitions
├── main.py             # Entry point for the backend generation pipeline
└── requirements.txt    # Python dependencies
```

## 🧩 The Atom Protocol

Scrolla uses a strict format for "Atoms" to ensure quality:

*   **Explanation**: Plain language, no jargon, under 30 words.
*   **Mental Model**: A single powerful analogy.
*   **Example**: Concrete real-world or code example.
*   **Pitfall**: Common user mistakes.
*   **Quick Check**: Interactive question to verify understanding.

See `atoms/atom_generator.py` for specific implementation details and validation rules.
