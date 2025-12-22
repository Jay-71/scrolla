# input/wiki_fetch.py

import wikipedia

def fetch_wikipedia_text(topic: str) -> str:
    wikipedia.set_lang("en")

    try:
        # 1. Try direct page
        page = wikipedia.page(topic, auto_suggest=True)
        return clean_text(page.content)

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
            return clean_text(page.content)
        except Exception as e:
            print("[ERROR] Failed to load search result:", e)
            return ""

    except wikipedia.DisambiguationError as e:
        print("[WARN] Disambiguation detected. Using first option.")
        page = wikipedia.page(e.options[0])
        return clean_text(page.content)

    except Exception as e:
        print("[ERROR] Wiki fetch failed:", e)
        return ""


def clean_text(text: str) -> str:
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
