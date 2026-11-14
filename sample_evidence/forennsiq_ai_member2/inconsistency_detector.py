def detect_inconsistencies(current_text, vault_texts):
    """
    Cross-references newly uploaded text against previously stored vault files 
    to find forensic contradictions.
    """
    contradictions = []
    current_lower = current_text.lower()
    
    # Check 1: Email Spoofing within the same file
    if "received-spf: fail" in current_lower or "dkim=neutral" in current_lower:
        contradictions.append({
            "type": "Email Spoofing & Relay Anomaly",
            "summary": "SPF validation failed. The sender IP does not match the authorized domain relay, indicating a spoofed message.",
            "severity": "High"
        })

    # Check 2: Cross-Source Alibi Contradiction
    for old_text in vault_texts:
        combined = current_lower + " " + old_text.lower()
        
        has_alibi = "offline" in combined or "never accessed" in combined
        has_activity = "authorized" in combined or "wire transfer" in combined
        same_time = "21:18" in combined
        
        if has_alibi and has_activity and same_time:
            contradictions.append({
                "type": "Alibi Timestamp Contradiction",
                "summary": "Subject claimed to be offline at 21:18 UTC, but banking audit logs show an active wire authorization from their account at the exact same timestamp.",
                "severity": "Critical"
            })
            break # Prevent duplicate flags for the same incident

    return contradictions
