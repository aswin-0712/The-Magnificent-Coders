# FORENNSIQ AI - Member 2: AI / NLP & Inconsistency Engine Lead

Welcome to the AI & NLP module repository for **FORENNSIQ AI** (PS 3.2: AI-Powered Digital Evidence Intelligence Platform).

## 📂 Module Structure
- `ocr_extractor.py`: Multimodal text extraction (PDFs via PyMuPDF, Images via Tesseract OCR, Text/Logs).
- `ner_extractor.py`: spaCy-powered Named Entity Recognition (Persons, Organizations, Locations, Dates, Money, Emails, Phones).
- `timestamp_parser.py`: Multi-format regex timestamp extraction and chronological sorting engine.
- `inconsistency_detector.py`: Cross-evidence contradiction detector (location clashes, time gaps, financial discrepancies).
- `pipeline.py`: Main integration pipeline callable by Member 1's FastAPI server.

## 🔌 Integration with Member 1 & Member 3
In your FastAPI main application (`main.py`), Member 1 can import the pipeline:
```python
from forennsiq_ai_member2.pipeline import ForennsiqAIPipeline

pipeline = ForennsiqAIPipeline()

@app.post("/api/analyze-evidence")
async def analyze_evidence(file_paths: list[str]):
    result = pipeline.process_evidence_batch(file_paths)
    return result
```
