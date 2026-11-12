"""
AutoLume License Plate Validation & Text Cleaning Service
Module: backend/services/plate_validator.py
"""

import re


class PlateValidator:
    """
    Validates, sanitizes, and applies domain-specific heuristic disambiguation
    to extracted OCR license plate text.
    """

    STATE_CODES = {
        "TS": "Telangana",
        "AP": "Andhra Pradesh",
        "DL": "Delhi",
        "MH": "Maharashtra",
        "KA": "Karnataka",
        "TN": "Tamil Nadu",
        "KL": "Kerala",
        "GJ": "Gujarat",
        "UP": "Uttar Pradesh",
        "HR": "Haryana",
        "RJ": "Rajasthan",
        "WB": "West Bengal",
        "MP": "Madhya Pradesh",
        "CH": "Chandigarh",
        "BR": "Bihar",
    }

    @classmethod
    def clean_and_normalize(cls, raw_ocr_text):
        """
        Strips non-alphanumeric characters, whitespace, and forces uppercase.
        """
        if not raw_ocr_text:
            return ""
        return re.sub(r"[^A-Z0-9]", "", raw_ocr_text.upper().strip())

    @classmethod
    def disambiguate_characters(cls, cleaned_text):
        """
        Applies positional syntax rules to fix common OCR confusions:
        - 'O' vs '0'
        - 'I' vs '1'
        - 'B' vs '8'
        - 'Z' vs '2'
        """
        chars = list(cleaned_text)
        rules_applied = []

        # Standard Indian HSRP Syntax: [State: 2 chars][RTO: 2 digits][Series: 1-3 chars][Serial: 4 digits]
        if len(chars) >= 8 and len(chars) <= 11:
            # Positions 0 and 1 must be state alphabets
            for i in range(2):
                if chars[i] == "0":
                    chars[i] = "O"
                    rules_applied.append(f"Position {i}: '0' -> 'O' (State letter required)")
                elif chars[i] == "1":
                    chars[i] = "I"
                    rules_applied.append(f"Position {i}: '1' -> 'I' (State letter required)")
                elif chars[i] == "8":
                    chars[i] = "B"
                    rules_applied.append(f"Position {i}: '8' -> 'B' (State letter required)")

            # Positions 2 and 3 must be RTO digits
            for i in range(2, 4):
                if chars[i] in ["O", "Q"]:
                    chars[i] = "0"
                    rules_applied.append(f"Position {i}: '{chars[i]}' -> '0' (RTO digit required)")
                elif chars[i] in ["I", "L"]:
                    chars[i] = "1"
                    rules_applied.append(f"Position {i}: '{chars[i]}' -> '1' (RTO digit required)")
                elif chars[i] == "B":
                    chars[i] = "8"
                    rules_applied.append(f"Position {i}: 'B' -> '8' (RTO digit required)")
                elif chars[i] == "Z":
                    chars[i] = "2"
                    rules_applied.append(f"Position {i}: 'Z' -> '2' (RTO digit required)")

            # Last 4 positions must be numeric serial digits
            last_4_start = len(chars) - 4
            for i in range(last_4_start, len(chars)):
                if chars[i] in ["O", "D"]:
                    chars[i] = "0"
                    rules_applied.append(f"Position {i}: '{chars[i]}' -> '0' (Serial digit required)")
                elif chars[i] in ["I", "T"]:
                    chars[i] = "1"
                    rules_applied.append(f"Position {i}: '{chars[i]}' -> '1' (Serial digit required)")
                elif chars[i] == "B":
                    chars[i] = "8"
                    rules_applied.append(f"Position {i}: 'B' -> '8' (Serial digit required)")
                elif chars[i] == "S":
                    chars[i] = "5"
                    rules_applied.append(f"Position {i}: 'S' -> '5' (Serial digit required)")

        return "".join(chars), rules_applied

    @classmethod
    def validate_plate(cls, plate_text, confidence=95.0):
        """
        Validates syntax against recognized standards (Indian HSRP, US, European).
        Returns:
            dict containing:
                - 'is_valid': bool
                - 'status': 'detected' | 'review' | 'failed'
                - 'state_name': str or None
                - 'format_type': str
                - 'warnings': list of str
        """
        cleaned, rules = cls.disambiguate_characters(cls.clean_and_normalize(plate_text))

        if not cleaned:
            return {
                "cleaned_plate": "",
                "is_valid": False,
                "status": "failed",
                "state_name": None,
                "format_type": "unknown",
                "warnings": ["Empty or unreadable plate characters."],
            }

        warnings = []
        state_prefix = cleaned[:2]
        state_name = cls.STATE_CODES.get(state_prefix, None)

        # Check Indian HSRP regex
        is_indian = bool(re.match(r"^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4}$", cleaned))
        # Check standard US regex (6 to 8 alphanumeric)
        is_us = bool(re.match(r"^[0-9A-Z]{6,8}$", cleaned)) and not is_indian
        # European format (e.g. B 1234 AB)
        is_euro = bool(re.match(r"^[A-Z]{1,3}[0-9]{1,4}[A-Z]{1,3}$", cleaned))

        format_type = "HSRP Standard" if is_indian else ("US Standard" if is_us else ("Euro Standard" if is_euro else "Custom Alphanumeric"))

        # Determine status based on confidence and format
        if confidence < 70.0:
            status = "review"
            warnings.append("Low OCR confidence score. Needs human review.")
        elif not (is_indian or is_us or is_euro) and len(cleaned) < 5:
            status = "review"
            warnings.append("Plate length shorter than standard vehicle registrations.")
        else:
            status = "detected"

        return {
            "cleaned_plate": cleaned,
            "formatted_plate": f"{cleaned[:2]} {cleaned[2:4]} {cleaned[4:6]} {cleaned[6:]}" if is_indian and len(cleaned) == 10 else cleaned,
            "is_valid": is_indian or is_us or is_euro,
            "status": status,
            "state_name": state_name,
            "format_type": format_type,
            "warnings": warnings,
            "rules_applied": rules,
        }
