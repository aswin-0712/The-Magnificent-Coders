import re
from typing import List, Dict, Any
from .textsim import compute_similarity

class InconsistencyDetector:
    """
    Analyzes extracted evidence statements across files to flag contradictions,
    timeline clashes, monetary discrepancies, and alibi shifts.
    """
    def __init__(self, threshold: float = 0.75):
        self.threshold = threshold

    def detect(self, parsed_files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        findings = []
        all_statements = []

        # Collect all timestamped or distinct factual statements from files
        for f in parsed_files:
            fname = f.get("filename", "unknown")
            for stmt in f.get("statements", []):
                all_statements.append({
                    "filename": fname,
                    "text": stmt.get("text", ""),
                    "timestamp": stmt.get("timestamp"),
                    "amounts": stmt.get("amounts", []),
                    "entities": stmt.get("entities", [])
                })

        # 1. Check for Monetary Discrepancies across similar context
        for i in range(len(all_statements)):
            for j in range(i + 1, len(all_statements)):
                s1, s2 = all_statements[i], all_statements[j]
                if s1["filename"] == s2["filename"]:
                    continue

                # If both mention amounts but they differ
                if s1["amounts"] and s2["amounts"] and s1["amounts"] != s2["amounts"]:
                    sim = compute_similarity(s1["text"], s2["text"])
                    if sim > 0.3:  # Similar context, different numbers
                        findings.append({
                            "type": "MONETARY_CONTRADICTION",
                            "severity": "HIGH",
                            "description": f"Conflicting amounts found between {s1['filename']} ('{s1['text']}') and {s2['filename']} ('{s2['text']}').",
                            "evidence_sources": [s1["filename"], s2["filename"]]
                        })

                # 2. Timeline / Alibi clashes
                if s1["timestamp"] and s2["timestamp"] and s1["timestamp"] == s2["timestamp"]:
                    # Check if entities or actions conflict at the exact same timestamp
                    shared_entities = set(e["text"] for e in s1["entities"]) & set(e["text"] for e in s2["entities"])
                    if shared_entities and compute_similarity(s1["text"], s2["text"]) < 0.4:
                        findings.append({
                            "type": "TIMELINE_OVERLAP_CONFLICT",
                            "severity": "CRITICAL",
                            "description": f"Conflicting accounts reported for the same timestamp ({s1['timestamp']}) involving {list(shared_entities)}.",
                            "evidence_sources": [s1["filename"], s2["filename"]]
                        })

        return findings