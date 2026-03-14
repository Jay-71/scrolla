import os
import glob
from engine.normalize import normalize_concept_name

OUTPUT_DIR = "output"

def build_topic_index() -> dict[str, str]:
    index = {}
    if not os.path.exists(OUTPUT_DIR):
        return index

    search_pattern = os.path.join(OUTPUT_DIR, "*_atoms.json")
    for file_path in glob.glob(search_pattern):
        filename = os.path.basename(file_path)
        canonical_name = filename[:-11]
        topic_string = canonical_name.replace("_", " ")
        stemmed_topic = normalize_concept_name(topic_string)
        index[stemmed_topic] = file_path.replace("\\", "/")
        
    return index

def find_existing_topic(user_query: str, topic_index: dict[str, str]) -> str | None:
    if not topic_index:
        return None
        
    query_stems = set(normalize_concept_name(user_query).split())
    
    for indexed_stemmed_topic, file_path in topic_index.items():
        indexed_stems = set(indexed_stemmed_topic.split())
        if query_stems.issubset(indexed_stems) or indexed_stems.issubset(query_stems):
             return file_path
             
    return None
