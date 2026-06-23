# APP SPECIFICATION: Scrolla

## 1. Executive Summary & Core Loop
* **High-Level Description:** Scrolla is an educational application designed to teach complete skills through structured roadmaps. The content is broken down into bite-sized learning chunks called "atoms" (explanations, mental models, code examples, quick checks), enabling a continuous, highly-engaging learning experience.
* **The "Core Loop":** User enters the app -> Views available roadmaps (e.g., Machine Learning) -> Selects a topic from the roadmap sequence -> Pre-generated JSON "atoms" are fetched for that topic -> User swipes/scrolls through the atoms to learn -> Progress is tracked -> (Future Extension: User can dynamically generate atoms for missing topics).
* **Primary Target Audience:** Students wanting to learn a complete skill from scratch by following a guided roadmap, or professionals looking to quickly revise specific topics.

---

## 2. Tech Stack & Environment
* **Frontend Framework:** React 19 + Vite
* **Animations & UI:** Framer Motion (for smooth transitions/swipes) and Lottie-React (for engaging illustrations).
* **Styling:** Vanilla CSS (following the project's aesthetics guidelines).
* **Data Layer:** Pre-generated static JSON files (stored via CDN/backend), structured with an `index.json` and individual topic files (e.g., `01_what_is_an_ml_engineer.json`).

---

## 3. Core Features (MVP Scope)
* [ ] **Feature 1: User Authentication** (Sign up, Log in, Sign out, Protected Routes)
* [ ] **Feature 2: Roadmap Dashboard** (Fetches `index.json` to display the roadmap sequence and track completion)
* [ ] **Feature 3: Atom Viewer (Topic View)** (A swipeable or scrollable interface presenting atoms sequentially for the selected topic)
* [ ] **Feature 4: Processing & Loading States** (Smooth spinners/progress bars while fetching JSON data or authenticating)
* [ ] **Feature 5: History & Progress Tracking** (Saves user's completed topics and current position in the roadmap)

---

## 4. System Architecture & Data Model

### Data Flow
The app relies on a completely pre-computed data structure to minimize latency and LLM costs.
1. The app fetches `output/<Domain>/index.json` to render the roadmap tree.
2. When a topic is clicked, it fetches `output/<Domain>/<id>_<topic>.json`.

### Database Tables / JSON Schema (Proposed)
* **Roadmap Index (`index.json`):**
  - `roadmap_title` (String)
  - `total_topics` (Integer)
  - `topics` (Array of Objects: `{id, file, title, atom_count}`)
* **Topic Document (`<id>_<topic>.json`):**
  - `topic` (String)
  - `atoms` (Array of Objects)
    - `concept` (String)
    - `atom_type` (Enum: explanation, mental_model, code_example, common_pitfall, quick_check)
    - `content` (String, strictly < 30 words for text)
    - `difficulty` (Enum: easy, medium, hard)
    - `estimated_read_time_sec` (Integer)
    - `order` (Integer)

---

## 5. UI/UX Layout & Component Tree
* **App** (Handles Routing & Auth Context)
  * **Login/Signup**
  * **Dashboard** (Shows user stats and active roadmaps)
  * **RoadmapView** (Visual path of topics using `index.json`)
    * **TopicCard** (Displays title and completion status)
  * **TopicLearningView** (The core learning interface)
    * **AtomCarousel / ScrollView** (Renders individual atoms via Framer Motion)
      * **AtomCard** (Dynamic rendering based on `atom_type`)
        * **LottieAnimation** (Optional, visual reinforcement)

---

## 6. Development Rules & Guardrails (For the AI)
* **Pre-computed Content First:** Always rely on the existing static JSON files in `output/` before attempting to dynamically generate content.
* **Micro-Learning Focus:** UI must respect the "atom" philosophy. Do not dump large walls of text; present one atom at a time in a clean, focused view.
* **Premium Aesthetics:** Utilize Framer Motion for buttery-smooth page transitions and micro-interactions. The UI should feel native, snappy, and highly polished.
* **State Management:** Keep it simple using React Context or lightweight stores unless complex global state mandates otherwise.
