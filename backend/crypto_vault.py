import hashlib
import json
import os
from datetime import datetime, timezone

AUDIT_FILE = "audit_log.json"

def compute_sha256(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()

def append_audit_log(action: str, filename: str, file_hash: str, status: str) -> dict:
    logs = []
    if os.path.exists(AUDIT_FILE):
        with open(AUDIT_FILE, "r", encoding="utf-8") as f:
            try:
                logs = json.load(f)
            except json.JSONDecodeError:
                logs = []

    prev_hash = logs[-1]["chain_signature"] if logs else "0" * 64
    timestamp = datetime.now(timezone.utc).isoformat()
    raw_block = f"{prev_hash}|{timestamp}|{action}|{filename}|{file_hash}|{status}"
    chain_signature = hashlib.sha256(raw_block.encode("utf-8")).hexdigest()

    entry = {
        "index": len(logs) + 1,
        "timestamp": timestamp,
        "action": action,
        "filename": filename,
        "evidence_sha256": file_hash,
        "status": status,
        "prev_hash": prev_hash,
        "chain_signature": chain_signature,
    }
    logs.append(entry)
    with open(AUDIT_FILE, "w", encoding="utf-8") as f:
        json.dump(logs, f, indent=2)
    return entry

def get_audit_logs() -> list:
    if not os.path.exists(AUDIT_FILE):
        return []
    with open(AUDIT_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def clear_audit_logs():
    if os.path.exists(AUDIT_FILE):
        os.remove(AUDIT_FILE)