from .ner_extractor import extract_entities
from .inconsistency_detector import detect_inconsistencies

def process_evidence(file_content, vault_history=None):
    """
    Main orchestration function. Ayush's main.py will call this function 
    and pass the raw text and previous vault files.
    """
    if vault_history is None:
        vault_history = []
        
    text_string = file_content.decode('utf-8', errors='ignore') if isinstance(file_content, bytes) else str(file_content)
    
    # 1. Extract Entities
    entities = extract_entities(text_string)
    
    # 2. Detect Contradictions against vault
    contradictions = detect_inconsistencies(text_string, vault_history)
    
    return {
        "status": "success",
        "entities": entities,
        "contradictions": contradictions,
        "summary": {
            "total_events": len(entities["DATE"]),
            "critical_threats": len(contradictions)
        }
    }
