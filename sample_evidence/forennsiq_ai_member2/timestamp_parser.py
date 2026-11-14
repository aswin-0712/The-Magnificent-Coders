# Regex Timestamp Parser & Chronological Sorter
# Member 2: AI / NLP & Inconsistency Engine Lead (FORENNSIQ AI)

import re
from datetime import datetime
from dateutil import parser as date_parser

class TimestampParser:
    """Extracts and normalizes timestamps from chat exports, emails, screenshots, and logs into ISO format."""
    
    TIMESTAMP_PATTERNS = [
        r'\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}(?::\d{2})?',
        r'\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}\s+\d{1,2}:\d{2}(?:\s*[APap][Mm])?',
        r'\[?\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4},\s*\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm])?\]?',
        r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}(?:\s+\d{1,2}:\d{2})?'
    ]

    @classmethod
    def extract_timestamps(cls, text: str) -> list:
        found_timestamps = []
        for pattern in cls.TIMESTAMP_PATTERNS:
            matches = re.findall(pattern, text)
            for m in matches:
                cleaned = m.strip('[]')
                parsed_dt = cls.parse_to_datetime(cleaned)
                if parsed_dt:
                    found_timestamps.append({
                        "raw": m,
                        "iso": parsed_dt.isoformat(),
                        "timestamp": parsed_dt.timestamp()
                    })
        unique = {item["iso"]: item for item in found_timestamps}
        sorted_ts = sorted(unique.values(), key=lambda x: x["timestamp"])
        return sorted_ts

    @staticmethod
    def parse_to_datetime(date_str: str):
        try:
            return date_parser.parse(date_str, fuzzy=True)
        except Exception:
            return None

    @staticmethod
    def sort_timeline(events: list) -> list:
        return sorted(events, key=lambda x: x.get("iso_timestamp", "9999-12-31T23:59:59"))
