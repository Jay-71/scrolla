import requests
import wikipedia

# --- Wikipedia Fetcher ---
def fetch_wikipedia_text(topic: str) -> str:
    wikipedia.set_lang("en")
    try:
        # 1. Try direct page
        page = wikipedia.page(topic, auto_suggest=True)
        return clean_wiki_text(page.content)
    except wikipedia.PageError:
        print("[WARN] Direct page not found. Searching Wikipedia...")
        # 2. Search fallback
        results = wikipedia.search(topic, results=5)
        if not results:
            print("[ERROR] No Wikipedia search results")
            return ""
        # 3. Pick the first result
        try:
            page = wikipedia.page(results[0])
            print(f"[INFO] Using Wikipedia page: {results[0]}")
            return clean_wiki_text(page.content)
        except Exception as e:
            print("[ERROR] Failed to load search result:", e)
            return ""
    except wikipedia.DisambiguationError as e:
        print("[WARN] Disambiguation detected. Using first option.")
        page = wikipedia.page(e.options[0])
        return clean_wiki_text(page.content)
    except Exception as e:
        print("[ERROR] Wiki fetch failed:", e)
        return ""

def clean_wiki_text(text: str) -> str:
    lines = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        if line.startswith("=="):
            continue
        if "ISBN" in line:
            continue
        lines.append(line)
    return "\n".join(lines)


# --- Open Textbook Fetcher ---
OPEN_DS_URL = "https://opendatastructures.org/ods-python/"

def fetch_open_textbook(topic: str) -> str:
    try:
        r = requests.get(OPEN_DS_URL, timeout=10)
        if r.status_code != 200:
            return ""
        text = r.text
        if topic.lower() in text.lower():
            return clean_textbook_text(text)
        return ""
    except Exception:
        return ""

def clean_textbook_text(text: str):
    lines = []
    for line in text.splitlines():
        line = line.strip()
        if len(line) < 40:
            continue
        if "<" in line:
            continue
        lines.append(line)
    return "\n".join(lines)


# --- Reference Readers ---
def fetch_reference(url: str) -> str:
    try:
        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            return ""
        return r.text[:3000]  # HARD LIMIT
    except Exception:
        return ""

def fetch_geeksforgeeks(topic: str) -> str:
    q = topic.replace(" ", "-")
    url = f"https://www.geeksforgeeks.org/{q}/"
    return fetch_reference(url)

def fetch_w3schools(topic: str) -> str:
    return ""  # w3schools URLs vary heavily

def fetch_tutorialspoint(topic: str) -> str:
    return ""  # handled similarly
