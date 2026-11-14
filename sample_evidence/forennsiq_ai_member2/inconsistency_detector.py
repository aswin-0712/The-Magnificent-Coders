# Contradiction & Inconsistency Detector Engine
# Member 2: AI / NLP & Inconsistency Engine Lead (FORENNSIQ AI)

from datetime import datetime

class InconsistencyDetector:
    """Detects discrepancies, alibi overlaps, contradictory statements, and timeline clashes across multiple evidence files."""

    def __init__(self):
        pass

    def analyze_evidence_corpus(self, evidence_records: list) -> list:
        inconsistencies = []
        
        location_claims = []
        for rec in evidence_records:
            source = rec.get("source_name")
            persons = rec.get("entities", {}).get("persons", [])
            locations = rec.get("entities", {}).get("locations", [])
            timestamps = rec.get("timestamps", [])
            
            for ts in timestamps:
                for loc in locations:
                    for person in persons:
                        location_claims.append({
                            "person": person,
                            "location": loc,
                            "iso": ts.get("iso"),
                            "source": source
                        })

        for i in range(len(location_claims)):
            for j in range(i + 1, len(location_claims)):
                c1 = location_claims[i]
                c2 = location_claims[j]
                if c1["person"] == c2["person"] and c1["source"] != c2["source"]:
                    if c1["location"] != c2["location"]:
                        try:
                            dt1 = datetime.fromisoformat(c1["iso"])
                            dt2 = datetime.fromisoformat(c2["iso"])
                            diff_hours = abs((dt1 - dt2).total_seconds()) / 3600.0
                            if diff_hours <= 2.0:
                                inconsistencies.append({
                                    "type": "LOCATION_CONTRADICTION",
                                    "severity": "HIGH",
                                    "description": f"Contradictory location claim for '{c1['person']}': Cited at '{c1['location']}' in {c1['source']} at {c1['iso']} vs '{c2['location']}' in {c2['source']} at {c2['iso']}.",
                                    "sources": [c1["source"], c2["source"]]
                                })
                        except:
                            pass

        financial_claims = []
        for rec in evidence_records:
            monetary = rec.get("entities", {}).get("monetary", [])
            for m in monetary:
                financial_claims.append({
                    "amount_str": m,
                    "source": rec.get("source_name"),
                    "text": rec.get("text")
                })
        
        if len(financial_claims) >= 2:
            amounts = [item["amount_str"] for item in financial_claims]
            if len(set(amounts)) > 1:
                inconsistencies.append({
                    "type": "FINANCIAL_DISCREPANCY",
                    "severity": "MEDIUM",
                    "description": f"Multiple differing monetary values referenced across evidence sources: {set(amounts)}. Verify authenticity.",
                    "sources": list(set([item["source"] for item in financial_claims]))
                })

        unique_inc = []
        seen = set()
        for inc in inconsistencies:
            identifier = (inc["type"], inc["description"])
            if identifier not in seen:
                seen.add(identifier)
                unique_inc.append(inc)

        return unique_inc
