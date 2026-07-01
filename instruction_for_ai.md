# Scrolla Curriculum Pipeline - AI Generation Guide

This document is a comprehensive guide for AI assistants tasked with generating curriculum content for the Scrolla educational app. Scrolla is a micro-learning platform where complex engineering and computer science topics are broken down into bite-sized, highly digestible chunks called **Atoms**.

To maintain a high standard of quality, consistency, and structural integrity across the app, you MUST strictly adhere to the pipeline, schemas, and constraints outlined below.

---

## 🚀 The Curriculum Pipeline

The process of generating a new curriculum track (e.g., "Frontend Development", "Data Science") follows a strict 4-step flow:

1. **Source Ingestion**: Convert a raw source (like a PDF textbook or documentation) into plain text. (This step is usually done beforehand).
2. **Roadmap Text Generation**: Create a `[topic]-roadmap.txt` file that outlines the curriculum structure (Modules and Topics) and estimates the number of Atoms per topic.
3. **Roadmap JSON Generation**: Convert the `.txt` roadmap into a strict `roadmap_modules.json` schema that the app's UI uses to render the module selection screen.
4. **Atom JSON Generation**: For *every single topic* listed in the roadmap, generate a specific JSON file containing the actual educational content (the "Atoms").

---

## 🛠️ Step 1: Roadmap Text Generation (`roadmap.txt`)

Before writing any JSON, you must draft a `.txt` or `.md` roadmap. This acts as the structural blueprint.

**Structure Rules:**
- Use Markdown headers (`##`) for **Modules**.
- Use bullet points (`-`) for **Topics** under each module.
- For each topic, append an estimate of how many Atoms it will take to teach it, formatted as `[X Atoms]`.
- Complex, highly technical topics or comprehensive algorithms may require 20+ atoms to fully break down. Simpler definitions or single concepts require fewer (5-8 atoms).

**Example Output:**
```markdown
# Frontend Engineering Roadmap

## Internet Fundamentals
- How does the Internet work? `[4 Atoms]`
- What is HTTP/HTTPS? `[3 Atoms]`
- DNS and Domain Names `[5 Atoms]`

## HTML & CSS Basics
- Semantic HTML `[4 Atoms]`
- CSS Box Model `[6 Atoms]`
```

---

## 🛠️ Step 2: Roadmap JSON Generation (`roadmap_modules.json`)

Once the text roadmap is approved, convert it into a strictly formatted JSON array. This file drives the UI of the roadmap screen.

**Schema Requirements:**
- The root must be a JSON Array `[]`.
- Each object in the array represents a **Module**.
- **`id`** (string): A unique identifier (e.g., `"m1"`, `"m2"`).
- **`title`** (string): The module title (e.g., `"Internet Fundamentals"`).
- **`desc`** (string): A brief 1-2 sentence description of what the module covers.
- **`tags`** (array of strings): 1-3 tags for UI badges.
- **`topics`** (array of objects): The list of topics within this module.
  - **`id`** (integer): A strictly sequential, globally unique ID. Topic IDs MUST increment continuously across the *entire* roadmap (1, 2, 3... 45, 46). Do NOT reset the ID to 1 at the start of a new module.
  - **`title`** (string): The topic title, exactly matching the text roadmap.

**Example Output:**
```json
[
  {
    "id": "m1",
    "title": "Internet Fundamentals",
    "desc": "Understand the underlying infrastructure of the web before writing code.",
    "tags": ["Networking", "Basics"],
    "topics": [
      { "id": 1, "title": "How does the Internet work?" },
      { "id": 2, "title": "What is HTTP/HTTPS?" },
      { "id": 3, "title": "DNS and Domain Names" }
    ]
  }
]
```

---

## 🛠️ Step 3: Atom JSON Generation (`XX_topic_name.json`)

For **every** topic defined in the `roadmap_modules.json`, you must generate a separate JSON file.
- **File Naming**: `[topic_id]_[lowercase_topic_name_with_underscores].json` (e.g., `01_how_does_the_internet_work.json`, `02_what_is_http_https.json`). Ensure IDs < 10 are zero-padded (01, 02).

**Schema Requirements:**
- The root must be a JSON Object `{}`.
- **`topic`** (string): The exact title of the topic.
- **`atoms`** (array of objects): The actual content chunks. The number of objects should roughly match the `[X Atoms]` estimate from the text roadmap.

**The Atom Object Constraints:**
Every atom object MUST contain the following 7 keys:
1. **`topic`** (string): The name of the parent topic (repeat this for every atom).
2. **`concept`** (string): A short, 1-3 word subtitle for this specific atom (e.g., "Role Definition", "The Box Model", "Syntax").
3. **`atom_type`** (string): MUST be one of the following exact strings:
   - `"explanation"`: A direct, factual explanation of the concept.
   - `"mental_model"`: An analogy to help the user understand the concept intuitively.
   - `"key_points"`: A numbered or bulleted list of 2-4 critical takeaways.
   - `"quick_check"`: A simple True/False or multiple-choice question to test understanding.
   - `"code_snippet"`: A short example of code (if applicable).
   - `"common_pitfall"`: A warning about a common mistake beginners make.
4. **`content`** (string): The actual educational text.
   - **CRITICAL CONSTRAINT**: The content MUST be extremely concise. Aim for 1-3 short sentences (max 250 characters). Scrolla is a mobile app with limited screen real estate. NO giant walls of text.
   - If the type is `"key_points"`, format it with inline newlines (`\n`) for bullet points.
5. **`difficulty`** (string): `"easy"`, `"medium"`, or `"hard"`.
6. **`estimated_read_time_sec`** (integer): A realistic guess of how many seconds it takes to read (usually between `5` and `25`).
7. **`order`** (integer): The sequential order of the atom within this file (1, 2, 3...).

**Example Output (`01_how_does_the_internet_work.json`):**
```json
{
  "topic": "How does the Internet work?",
  "atoms": [
    {
      "topic": "How does the Internet work?",
      "concept": "The Global Network",
      "atom_type": "explanation",
      "content": "The Internet is a massive, global network of physical cables connecting millions of computers, allowing them to communicate and share data instantly.",
      "difficulty": "easy",
      "estimated_read_time_sec": 10,
      "order": 1
    },
    {
      "topic": "How does the Internet work?",
      "concept": "The Global Network",
      "atom_type": "mental_model",
      "content": "Think of the Internet like the world's postal service. Computers are the houses, data packets are the letters, and routers are the post offices directing traffic.",
      "difficulty": "easy",
      "estimated_read_time_sec": 12,
      "order": 2
    },
    {
      "topic": "How does the Internet work?",
      "concept": "The Global Network",
      "atom_type": "quick_check",
      "content": "True or False: The Internet is entirely wireless and does not rely on physical cables.",
      "difficulty": "easy",
      "estimated_read_time_sec": 5,
      "order": 3
    }
  ]
}
```

## 🚨 Final Checklist for the AI Assistant
- [ ] Did I create the text roadmap first?
- [ ] Are the topic IDs in `roadmap_modules.json` strictly sequential and non-resetting?
- [ ] Did I generate a separate JSON file for EVERY topic?
- [ ] Are the atom files named correctly with zero-padded IDs?
- [ ] Does every atom strictly use one of the approved `atom_type` strings?
- [ ] Is the `content` of every atom concise enough for a mobile screen (no walls of text)?
