# 🛡️ ForenSIQ — AI-Powered Digital Evidence Intelligence Platform

**ForenSIQ** is an end-to-end digital forensics and evidence intelligence platform designed to help investigators and victims of fraud, harassment, stalking, and cybercrime organize fragmented multi-format artifacts into court-ready intelligence. 

Built by **Team Magnificent Coders**, ForenSIQ combines cryptographic chain-of-custody verification with automated OCR, NLP entity extraction, cross-source contradiction detection, chronological timeline reconstruction, and interactive relationship mapping.

## 🎯 Problem Statement Alignment

Digital incidents leave evidence scattered across screenshots, raw email headers, chat exports, audio recordings, and PDF documents. ForenSIQ eliminates manual correlation bottlenecks through six core capabilities:

1. **Multi-Format Evidence Ingestion & Organization:** Supports Images (`.jpg`, `.png`), Documents (`.pdf`, `.docx`, `.txt`), Chat Exports (`.json`, `.csv`), and Audio Recordings (`.wav`, `.mp3`).
2. **Cryptographic Integrity & Duplicate Detection:** Computes SHA-256 digests both client-side (WebCrypto API) and server-side (`crypto_vault.py`), automatically flagging duplicate uploads and logging every action into a hash-chained, tamper-evident audit ledger (`audit_log.json`).
3. **Automated OCR, NLP & Entity Extraction:** Extracts structured entities including **People**, **Phone Numbers**, **Email Addresses**, **Dates**, **Locations**, and **Financial Identifiers (IBANs/Invoices
