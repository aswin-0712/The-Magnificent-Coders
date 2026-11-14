import re
import spacy

try:
    nlp = spacy.load("en_core_web_sm")
    USE_SPACY_NER = True
except Exception:
    nlp = spacy.blank("en")
    USE_SPACY_NER = False

TIMESTAMP_PATTERNS = [
    r"(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})",                 # 2026-11-10 21:15
    r"(\d{2}/\d{2}/\d{4},?\s*\d{1,2}:\d{2}\s*[APap][Mm])" # 10/11/2026, 9:15 PM
]

def _extract_actors_fallback(text: str) -> list:
    matches = re.findall(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b", text)
    ignore = {"Cyber Cell", "MG Road", "Metro Station", "Acme Corp", "UPI Transfer", "UPI Debit"}
    return [m for m in set(matches) if m not in ignore]

def analyze_evidence_text(raw_text: str, filename: str, file_hash: str) -> dict:
    entities = {"PERSON": set(), "ORG": set(), "GPE": set(), "DATE": set()}

    if USE_SPACY_NER:
        doc = nlp(raw_text)
        for ent in doc.ents:
            if ent.label_ in entities:
                entities[ent.label_].add(ent.text.strip())
    else:
        for name in _extract_actors_fallback(raw_text):
            entities["PERSON"].add(name)

    events = []
    edges = []
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]

    for idx, line in enumerate(lines):
        ts = None
        for pat in TIMESTAMP_PATTERNS:
            m = re.search(pat, line)
            if m:
                ts = m.group(1)
                break
        timestamp_val = ts if ts else f"Unverified-Seq-{idx+1:02d}"

        if USE_SPACY_NER:
            line_doc = nlp(line)
            actors = list({e.text.strip() for e in line_doc.ents if e.label_ == "PERSON"})
        else:
            actors = _extract_actors_fallback(line)

        if not actors:
            actors = ["Unknown Actor"]

        low = line.lower()
        category = "Communication Log"
        severity = "Low"
        if any(w in low for w in ["threat", "leak", "stalk", "harass", "outside", "watch", "kill"]):
            category = "Harassment / Intimidation"
            severity = "Critical"
        elif any(w in low for w in ["upi", "inr", "bank", "transfer", "paid", "fraud", "debit", "rs"]):
            category = "Financial Extortion / Fraud"
            severity = "High"

        events.append({
            "id": f"{file_hash[:8]}_{idx}",
            "timestamp": timestamp_val,
            "content": line,
            "actors": actors,
            "category": category,
            "severity": severity,
            "source_file": filename,
            "evidence_hash": file_hash[:12],
        })

        # Build relationship links when 2+ actors appear in the same event
        if len(actors) >= 2 and "Unknown Actor" not in actors:
            for i in range(len(actors)):
                for j in range(i + 1, len(actors)):
                    edges.append({
                        "source": actors[i],
                        "target": actors[j],
                        "relation": category,
                        "evidence_ref": filename,
                    })

    return {
        "entities": {k: list(v) for k, v in entities.items()},
        "events": events,
        "edges": edges,
    }

def detect_contradictions(sorted_events: list) -> list:
    by_time = {}
    for ev in sorted_events:
        if not ev["timestamp"].startswith("Unverified"):
            by_time.setdefault(ev["timestamp"], []).append(ev)

    contradictions = []
    for ts, items in by_time.items():
        sources = {item["source_file"] for item in items}
        combined_text = " ".join(item["content"].lower() for item in items)
        if len(sources) > 1 and any(w in combined_text for w in ["never", "offline", "not me", "alibi", "denied"]):
            contradictions.append({
                "timestamp": ts,
                "type": "Cross-Source Alibi Contradiction",
                "summary": f"Conflicting activity recorded at {ts} across {', '.join(sorted(sources))}.",
                "supporting_files": sorted(list(sources)),
            })
    return contradictions