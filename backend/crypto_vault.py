import os
import json
import hashlib
from datetime import datetime

LOG_FILE = "audit_log.json"

class CryptoVault:
    def __init__(self):
        self.log_file = LOG_FILE
        # Initialize an empty cryptographic ledger if it doesn't exist
        if not os.path.exists(self.log_file):
            with open(self.log_file, "w") as f:
                json.dump([], f)

    def get_audit_logs(self):
        """Returns the full tamper-evident audit ledger for verification."""
        if os.path.exists(self.log_file):
            try:
                with open(self.log_file, "r") as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return []
        return []

    def is_duplicate(self, file_hash: str) -> bool:
        """Mathematically checks if a SHA-256 hash is already in the vault."""
        logs = self.get_audit_logs()
        for entry in logs:
            if entry.get("file_hash") == file_hash:
                return True
        return False

    def verify_and_log(self, filename: str, raw_bytes: bytes):
        """
        Computes the SHA-256 hash of the evidence, links it to the previous 
        block's signature to maintain chain-of-custody, and logs the event.
        """
        file_hash = hashlib.sha256(raw_bytes).hexdigest()
        logs = self.get_audit_logs()
        
        # Determine the previous chain signature (Genesis block if ledger is empty)
        previous_signature = logs[-1]["chain_signature"] if logs else "GENESIS_00000000000000000000000000000000"
        
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        # The payload that gets sealed into this block
        payload = f"{previous_signature}:{file_hash}:{filename}:{timestamp}"
        
        # The cryptographic chain signature for THIS specific block
        chain_signature = hashlib.sha256(payload.encode('utf-8')).hexdigest()
        
        new_entry = {
            "timestamp": timestamp,
            "filename": filename,
            "file_hash": file_hash,
            "previous_signature": previous_signature,
            "chain_signature": chain_signature,
            "action": "EVIDENCE_INDEXED"
        }
        
        logs.append(new_entry)
        
        # Save the immutable ledger
        with open(self.log_file, "w") as f:
            json.dump(logs, f, indent=4)
            
        return new_entry
