# AI Pipeline Integrator for Member 2
# Connects OCR, NER, Timestamp Parsing, and Inconsistency Detection into a unified API function

from forennsiq_ai_member2.ocr_extractor import OCRExtractor
from forennsiq_ai_member2.ner_extractor import NERExtractor
from forennsiq_ai_member2.timestamp_parser import TimestampParser
from forennsiq_ai_member2.inconsistency_detector import InconsistencyDetector

class ForennsiqAIPipeline:
    def __init__(self):
        self.ner = NERExtractor()
        self.detector = InconsistencyDetector()

    def process_evidence_batch(self, file_paths: list) -> dict:
        processed_records = []
        all_events = []

        for path in file_paths:
            filename = path.split("/")[-1]
            extracted_text = OCRExtractor.process_file(path)
            entities = self.ner.extract_entities(extracted_text)
            timestamps = TimestampParser.extract_timestamps(extracted_text)

            record = {
                "source_name": filename,
                "text": extracted_text,
                "entities": entities,
                "timestamps": timestamps
            }
            processed_records.append(record)

            for ts in timestamps:
                all_events.append({
                    "iso_timestamp": ts["iso"],
                    "raw_time": ts["raw"],
                    "source": filename,
                    "summary": f"Activity recorded in {filename} mentioning entities."
                })

        sorted_timeline = sorted(all_events, key=lambda x: x["iso_timestamp"])
        inconsistencies = self.detector.analyze_evidence_corpus(processed_records)

        return {
            "status": "success",
            "records_processed": len(processed_records),
            "timeline": sorted_timeline,
            "inconsistencies": inconsistencies,
            "extracted_entities": [r["entities"] for r in processed_records]
        }
