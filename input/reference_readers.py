import requests

def fetch_reference(url):
    try:
        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            return ""
        return r.text[:3000]  # HARD LIMIT
    except Exception:
        return ""

def fetch_geeksforgeeks(topic):
    q = topic.replace(" ", "-")
    url = f"https://www.geeksforgeeks.org/{q}/"
    return fetch_reference(url)

def fetch_w3schools(topic):
    return ""  # w3schools URLs vary heavily

def fetch_tutorialspoint(topic):
    return ""  # handled similarly
