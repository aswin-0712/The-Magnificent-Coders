from typing import List, Dict, Any
from .extractor import extract_text_from_file
from .timestamp_parser import parse_timestamps
from .ner import extract_entities
from .inconsistency import InconsistencyDetector
from .timeline import build_timeline
from .graph import build_relationship_graph
from .summary import generate_summary

class EvidencePipeline:
    def __init__(self):
        self.inconsistency_detector = InconsistencyDetector()

    def process_evidence_batch(self, file_paths: List[str]) -> Dict[str, Any]:
        parsed_files = []
        for path in file_paths:
            raw_text = extract_text_from_file(path)
            entities = extract_entities(raw_text)
            timestamps = parse_timestamps(raw_text)
            
            # Simple statement chunking
            sentences = [s.strip() for s in raw_text.split('.') if len(s.strip()) > 5]
            statements = []
            for idx, sent in enumerate(sentences):
                statements.append({
                    "id": f"stmt_{idx}",
                    "text": sent,
                    "timestamp": timestamps[0] if timestamps else None,
                    "amounts": [int(re_val) for re_val in re.findall(r'₹\s*(\d+)', sent)],
                    "entities": entities
                })

            parsed_files.append({
                "filename": path.split('/')[-1],
                "raw_text": raw_text,
                "statements": statements,
                "entities": entities,
                "timestamps": timestamps
            })

        timeline = build_timeline(parsed_files)
        inconsistencies = self.inconsistency_detector.detect(parsed_files)
        graph = build_relationship_graph(parsed_files)
        summary = generate_summary(parsed_files, inconsistencies, timeline)

        return {
            "status": "success",
            "timeline": timeline,
            "inconsistencies": inconsistencies,
            "relationship_graph": graph,
            "summary": summary
        }