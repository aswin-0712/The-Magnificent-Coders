# spaCy Named Entity Recognition (NER) & Information Extraction Module
# Member 2: AI / NLP & Inconsistency Engine Lead (FORENNSIQ AI)

import re
import spacy

class NERExtractor:
    """Extracts entities (Persons, Organizations, Locations, Dates, Money, Emails, Phones) using spaCy and Custom Regex."""
    
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            import os
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")

    def extract_entities(self, text: str) -> dict:
        doc = self.nlp(text)
        
        entities = {
            "persons": list(set([ent.text for ent in doc.ents if ent.label_ == "PERSON"])),
            "organizations": list(set([ent.text for ent in doc.ents if ent.label_ == "ORG"])),
            "locations": list(set([ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]])),
            "dates_times": list(set([ent.text for ent in doc.ents if ent.label_ in ["DATE", "TIME"]])),
            "monetary": list(set([ent.text for ent in doc.ents if ent.label_ == "MONEY"])),
            "emails": list(set(re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text))),
            "phone_numbers": list(set(re.findall(r'\+?[0-9][0-9\s\-\(\)]{8,}[0-9]', text)))
        }
        return entities
