import requests
import wikipedia

import time
# --- Wikipedia Fetcher ---
def fetch_wikipedia_text(topic: str, retries=3) -> str:
    # Set a custom user agent to avoid being blocked by Wikipedia's generic requests blocker
    wikipedia.set_user_agent("ScrollaBot/1.0 (bot@scrolla.com)")
    wikipedia.set_lang("en")
    
    # Contextualize ambiguous topics
    search_topic = topic
    if topic.lower() in ["loops", "conditionals", "exceptions", "basic syntax", "variables and data types"]:
        search_topic = topic + " (programming)"
    
    for attempt in range(retries):
        try:
            page = wikipedia.page(search_topic, auto_suggest=True)
            time.sleep(1) # Rate limit protection
            return clean_wiki_text(page.content)
        except wikipedia.PageError:
            print(f"[WARN] Direct page not found for '{search_topic}'. Searching...")
            try:
                results = wikipedia.search(search_topic, results=5)
                if not results:
                    return ""
                page = wikipedia.page(results[0])
                time.sleep(1)
                return clean_wiki_text(page.content)
            except Exception as e:
                print("[ERROR] Failed to load search result:", e)
                return ""
        except wikipedia.DisambiguationError as e:
            print("[WARN] Disambiguation detected. Using first option:", e.options[0])
            try:
                page = wikipedia.page(e.options[0])
                time.sleep(1)
                return clean_wiki_text(page.content)
            except Exception:
                return ""
        except Exception as e:
            print(f"[ERROR] Wiki fetch failed (attempt {attempt+1}):", e)
            time.sleep(2)
            
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
