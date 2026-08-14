import re
from typing import Dict, Optional
from backend.intents.definitions import (
    Intent,
    ORDER_ID_REGEX,
    EMAIL_REGEX,
    INTENT_KEYWORDS,
    INTENT_PRIORITY,
)


class ClassificationResult:
    """
    Result returned by the intent classifier.
    """

    def __init__(
        self,
        intent: Intent,
        order_id: Optional[str] = None,
        email: Optional[str] = None,
    ):
        self.intent = intent
        self.order_id = order_id
        self.email = email

    def to_dict(self) -> Dict:
        return {
            "intent": self.intent.value,
            "order_id": self.order_id,
            "email": self.email,
        }


def normalize_text(text: str) -> str:
    """
    Normalize customer input before classification.

    Example:
        "  WHERE Is My Order??? "
        ->
        "where is my order"
    """

    text = text.lower().strip()

    # Replace punctuation with spaces
    text = re.sub(r"[^\w\s-]", " ", text)

    # Collapse repeated whitespace
    text = re.sub(r"\s+", " ", text)

    return text


def extract_order_id(text: str) -> Optional[str]:
    """
    Extract an order ID from customer input.

    Supported examples:
        ORD-12345
        12345
    """

    match = ORDER_ID_REGEX.search(text)

    if not match:
        return None

    return match.group(0).upper()


def extract_email(text: str) -> Optional[str]:
    """
    Extract an email address if provided.
    """

    match = EMAIL_REGEX.search(text)

    if not match:
        return None

    return match.group(0).lower()


def contains_keyword(text: str, keyword: str) -> bool:
    """
    Check whether a keyword or phrase exists in the
    normalized customer message.
    """

    return keyword in text


def detect_intent(text: str) -> Intent:
    """
    Detect the most appropriate intent using
    rule-based keyword matching.

    Human escalation receives priority over all
    other intents.
    """

    normalized_text = normalize_text(text)

    matched_intents = []

    for intent, keywords in INTENT_KEYWORDS.items():

        for keyword in keywords:

            if contains_keyword(normalized_text, keyword):
                matched_intents.append(intent)
                break

    if not matched_intents:
        return Intent.FALLBACK

    # Respect the predefined intent priority.
    for priority_intent in INTENT_PRIORITY:

        if priority_intent in matched_intents:
            return priority_intent

    return Intent.FALLBACK


def classify_message(text: str) -> ClassificationResult:
    """
    Full classification pipeline.

    Steps:
        1. Normalize input
        2. Extract entities
        3. Detect intent
        4. Return classification result
    """

    normalized_text = normalize_text(text)

    order_id = extract_order_id(normalized_text)
    email = extract_email(normalized_text)

    intent = detect_intent(normalized_text)

    return ClassificationResult(
        intent=intent,
        order_id=order_id,
        email=email,
    )