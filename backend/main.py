import io
from typing import List
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

from crypto_vault import compute_sha256, append_audit_log, get_audit_logs, clear_audit_logs
from intelligence import analyze_evidence_text, detect_contradictions

app = FastAPI(title="Aegis Chronos Forensics Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VAULT = {}
TIMELINE = []
ENTITIES = {"PERSON": set(), "ORG": set(), "GPE": set(), "DATE": set()}
RELATIONSHIPS = []

def extract_raw_text(filename: str, file_bytes: bytes) -> str:
    if filename.lower().endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    return file_bytes.decode("utf-8", errors="ignore")

@app.post("/api/upload")
async def upload_evidence(files: List[UploadFile] = File(...)):
    results = []
    for f in files:
        content_bytes = await f.read()
        file_hash = compute_sha256(content_bytes)

        # Duplicate Detection Check
        if file_hash in VAULT:
            append_audit_log("DUPLICATE_FLAGGED", f.filename, file_hash, "REJECTED_DUPLICATE")
            results.append({
                "filename": f.filename,
                "sha256": file_hash,
                "status": "Duplicate Detected - Identical SHA-256 Already in Vault",
            })
            continue

        raw_text = extract_raw_text(f.filename, content_bytes)
        parsed = analyze_evidence_text(raw_text, f.filename, file_hash)

        VAULT[file_hash] = {
            "filename": f.filename,
            "sha256": file_hash,
            "size_bytes": len(content_bytes),
            "events_extracted": len(parsed["events"]),
        }
        TIMELINE.extend(parsed["events"])
        RELATIONSHIPS.extend(parsed["edges"])
        for k, vals in parsed["entities"].items():
            ENTITIES[k].update(vals)

        append_audit_log("EVIDENCE_INGESTED", f.filename, file_hash, "VERIFIED_INTACT")
        results.append({
            "filename": f.filename,
            "sha256": file_hash,
            "status": "Verified & Indexed",
        })

    return {"uploaded": results}

@app.get("/api/dashboard")
def get_dashboard():
    ordered_timeline = sorted(TIMELINE, key=lambda x: x["timestamp"])
    contradictions = detect_contradictions(ordered_timeline)
    return {
        "summary": {
            "total_files": len(VAULT),
            "total_events": len(ordered_timeline),
            "critical_threats": sum(1 for e in ordered_timeline if e["severity"] == "Critical"),
            "contradictions_found": len(contradictions),
        },
        "vault_files": list(VAULT.values()),
        "timeline": ordered_timeline,
        "entities": {k: sorted(list(v)) for k, v in ENTITIES.items()},
        "relationships": RELATIONSHIPS,
        "contradictions": contradictions,
        "audit_logs": get_audit_logs(),
    }

@app.post("/api/seed")
def seed_demo_case():
    samples = [
        (
            "whatsapp_chat_export.txt",
            "2026-11-10 21:15 - Rohan Verma told Priya Nair: Send 50000 INR via UPI to Acme Corp or I leak your photos.\n"
            "2026-11-10 21:45 - Priya Nair told Rohan Verma: Please stop harassing me, I am reporting this.\n"
            "2026-11-11 09:30 - Rohan Verma told Vikram Singh: Watch Priya Nair outside MG Road Metro Station."
        ),
        (
            "bank_statement_alert.txt",
            "2026-11-10 22:10 - UPI Transfer of 50000 INR from Priya Nair to Acme Corp Account flagged."
        ),
        (
            "suspect_alibi_email.eml",
            "2026-11-10 21:15 - Rohan Verma stated to Cyber Cell: I was completely offline and never messaged Priya Nair at 21:15."
        ),
    ]
    for fname, txt in samples:
        b = txt.encode("utf-8")
        h = compute_sha256(b)
        if h not in VAULT:
            parsed = analyze_evidence_text(txt, fname, h)
            VAULT[h] = {
                "filename": fname,
                "sha256": h,
                "size_bytes": len(b),
                "events_extracted": len(parsed["events"]),
            }
            TIMELINE.extend(parsed["events"])
            RELATIONSHIPS.extend(parsed["edges"])
            for k, vals in parsed["entities"].items():
                ENTITIES[k].update(vals)
            append_audit_log("DEMO_SEEDED", fname, h, "VERIFIED_INTACT")
    return {"status": "Demo Case Loaded"}

@app.post("/api/reset")
def reset_case():
    VAULT.clear()
    TIMELINE.clear()
    RELATIONSHIPS.clear()
    for k in ENTITIES:
        ENTITIES[k].clear()
    clear_audit_logs()
    return {"status": "Vault Reset"}