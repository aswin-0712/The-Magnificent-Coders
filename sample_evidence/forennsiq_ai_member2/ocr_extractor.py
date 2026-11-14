# OCR & Document Extraction Module
# Member 2: AI / NLP & Inconsistency Engine Lead (FORENNSIQ AI)

import os
import io
from PIL import Image
import fitz  # PyMuPDF for PDFs
import pytesseract

class OCRExtractor:
    """Handles text extraction from uploaded evidence files (PDFs, Images, TXT)."""
    
    @staticmethod
    def extract_from_text(file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    @staticmethod
    def extract_from_pdf(file_path: str) -> str:
        text = ""
        try:
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text() + "\n"
        except Exception as e:
            text = f"[Error extracting PDF text: {str(e)}]"
        return text

    @staticmethod
    def extract_from_image(file_path: str) -> str:
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            return f"[OCR Fallback / Simulated Text for Image]: Unable to run pytesseract locally."

    @classmethod
    def process_file(cls, file_path: str) -> str:
        ext = os.path.splitext(file_path)[1].lower()
        if ext in ['.txt', '.log', '.csv', '.json']:
            return cls.extract_from_text(file_path)
        elif ext == '.pdf':
            return cls.extract_from_pdf(file_path)
        elif ext in ['.png', '.jpg', '.jpeg', '.webp', '.bmp']:
            return cls.extract_from_image(file_path)
        else:
            try:
                return cls.extract_from_text(file_path)
            except:
                return ""
