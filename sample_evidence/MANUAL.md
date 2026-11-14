# FORENNSIQ AI - Technical & Operational Manual
**Problem Statement 3.2: AI-Powered Digital Evidence Intelligence Platform**

## 1. System Overview
FORENNSIQ AI ingests multi-format digital evidence (chat exports, OCR screenshots, audio transcription logs, emails), extracts verifiable entities, constructs chronological timelines, flags contradictions using NLP semantic matching, and outputs cryptographically secure audit logs.

## 2. Team Division & Architecture Integration
* **Member 1 (Backend & Cryptographic Vault Lead):** FastAPI server, SHA-256 evidence hashing, tamper-evident audit logger, duplicate detection.
* **Member 2 (AI / NLP & Inconsistency Engine Lead):** OCR/text extraction, spaCy NER, timestamp parser, chronological sorter, inconsistency & contradiction detection engine.
* **Member 3 (Frontend UI & Visualization Lead):** React + Vite + Tailwind CSS dashboard, interactive timeline, entity relationship graph (D3/Vis.js), cryptographic badge viewer.

## 3. API Endpoints (Member 2 -> Member 1 Bridge)
* `POST /api/v1/analyze`: Accepts multi-file evidence payload, runs the Member 2 pipeline (`EvidencePipeline`), and returns JSON containing timelines, detected contradictions, entity graphs, and AI incident briefs.
* `GET /api/v1/timeline`: Fetches sorted chronological sequence across all ingested evidence.
* `GET /api/v1/inconsistencies`: Returns flagged contradictions with severity tags (`HIGH`, `CRITICAL`).

## 4. Running Tests & Demo
```bash
# Install dependencies
pip install -r requirements.txt

# Run test suite
pytest test_engine.py

# Run standalone demo app
python demo_app.py