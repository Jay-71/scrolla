import requests

OPEN_DS_URL = "https://opendatastructures.org/ods-python/"

def fetch_open_textbook(topic: str) -> str:
    try:
        # very simple heuristic: fetch index page
        r = requests.get(OPEN_DS_URL, timeout=10)
        if r.status_code != 200:
            return ""
        text = r.text

        # lightweight filtering
        if topic.lower() in text.lower():
            return clean_text(text)
        return ""
    except Exception:
        return ""

def clean_text(text: str):
    lines = []
    for line in text.splitlines():
        line = line.strip()
        if len(line) < 40:
            continue
        if "<" in line:
            continue
        lines.append(line)
    return "\n".join(lines)
