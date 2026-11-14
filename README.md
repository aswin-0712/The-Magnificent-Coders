# 🛡️ ForenSIQ — AI-Powered Digital Evidence Intelligence Platform

**ForenSIQ** is an end-to-end digital forensics and evidence intelligence platform designed to help investigators and victims of fraud, harassment, stalking, and cybercrime organize fragmented multi-format artifacts into court-ready intelligence. 

Built by **Team Magnificent Coders**, ForenSIQ combines cryptographic chain-of-custody verification with automated OCR, NLP entity extraction, cross-source contradiction detection, chronological timeline reconstruction, and interactive relationship mapping.

## 🎯 Problem Statement Alignment

Digital incidents leave evidence scattered across screenshots, raw email headers, chat exports, audio recordings, and PDF documents. ForenSIQ eliminates manual correlation bottlenecks through six core capabilities:

1. **Multi-Format Evidence Ingestion & Organization:** Supports Images (`.jpg`, `.png`), Documents (`.pdf`, `.docx`, `.txt`), Chat Exports (`.json`, `.csv`), and Audio Recordings (`.wav`, `.mp3`).
2. **Cryptographic Integrity & Duplicate Detection:** Computes SHA-256 digests both client-side (WebCrypto API) and server-side (`crypto_vault.py`), automatically flagging duplicate uploads and logging every action into a hash-chained, tamper-evident audit ledger (`audit_log.json`).
3. **Automated OCR, NLP & Entity Extraction:** Extracts structured entities including **People**, **Phone Numbers**, **Email Addresses**, **Dates**, **Locations**, and **Financial Identifiers (IBANs/Invoices)** with direct excerpts linked back to source exhibits.
4. **Cross-Source Inconsistency & Alibi Contradiction Detection:** Automatically cross-references timestamps and claims across files (`intelligence.py` & `inconsistency_detector.py`) to flag anomalies such as unverified IBAN overrides, SPF email header failures, and conflicting suspect alibis.
5. **Chronological Timeline & Entity Relationship Graph:** Normalizes heterogeneous timestamps into a unified, filterable **Incident Timeline** and renders an interactive node-link **Relationship Graph** connecting people, communications, financial transfers, and physical access events.
6. **Tamper-Evident Forensic Reports:** Generates structured, exportable investigation summaries complete with extracted text, entity tables, timeline sequences, and a verifiable SHA-256 checksum manifest for legal sharing.

## 🏗️ Repository Architecture

```text
├── backend/
│   ├── main.py                      # FastAPI server & REST endpoints (/api/upload, /api/dashboard, /api/seed, /api/reset)
│   ├── crypto_vault.py              # SHA-256 hashing, duplicate detection & hash-chained audit ledger
│   ├── intelligence.py              # NLP entity extraction, timeline sorting & contradiction engine
│   └── audit_log.json               # Tamper-evident cryptographic chain-of-custody log
├── frontend/
│   ├── src/
│   │   ├── components/              # Forensic cards, SHA-256 dropzone, stat cards & search bar
│   │   ├── context/                 # EvidenceContext & AuthContext state management
│   │   ├── pages/                   # Dashboard, UploadEvidence, AIAnalysis, Timeline, RelationshipGraph, Reports, Settings
│   │   ├── services/api.js          # Axios bridge connecting React UI to FastAPI backend
│   │   └── utils/crypto.js          # Browser-native SHA-256 computation & formatting utilities
│   ├── index.html
│   └── vite.config.ts
└── sample_evidence/
    ├── forennsiq_ai_member2/        # Specialized AI extraction modules
    │   ├── ocr_extractor.py         # Image OCR & document text extraction
    │   ├── ner_extractor.py         # Named Entity Recognition (NER) pipeline
    │   ├── timestamp_parser.py      # Multi-format chronological timestamp normalizer
    │   ├── inconsistency_detector.py# Cross-artifact contradiction & anomaly detector
    │   └── pipeline.py              # Unified orchestration pipeline
    ├── 2.txt                        # Sample suspect chat alibi log
    ├── 3.txt                        # Sample conflicting bank wire execution log
    └── MANUAL.md                    # Sample evidence testing guide
