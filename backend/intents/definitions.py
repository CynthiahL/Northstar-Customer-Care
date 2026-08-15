from enum import Enum
from typing import Dict, List, Pattern
import re

class Intent(str, Enum):
    # P0 — Order Status
    GET_ORDER_STATUS = "get_order_status"

    # P0 — Returns & Refunds
    INITIATE_RETURN = "initiate_return"

    # P0 — Refunds
    GET_REFUND_STATUS = "get_refund_status"

    # P0 — General Support
    HUMAN_ESCALATION = "human_escalation"

    # P0 — Fallback
    FALLBACK = "fallback"


class ConversationState(str, Enum):
    """
    Represents the current stage of a chatbot conversation.
    """

    NEW = "new"
    AWAITING_ORDER_ID = "awaiting_order_id"
    PROCESSING = "processing"
    RESOLVED = "resolved"
    ESCALATED = "escalated"


# ---------------------------------------------------------
# Entity extraction patterns
# ---------------------------------------------------------

ORDER_ID_REGEX: Pattern = re.compile(
    r"\b(?:ORD-\d{4,6}|\d{5})\b",
    re.IGNORECASE
)

EMAIL_REGEX: Pattern = re.compile(
    r"\b[\w.-]+@[\w.-]+\.\w+\b"
)


# ---------------------------------------------------------
# Intent keywords
# ---------------------------------------------------------

INTENT_KEYWORDS: Dict[Intent, List[str]] = {

    Intent.GET_ORDER_STATUS: [
        "where is my order",
        "track my order",
        "track order",
        "order status",
        "has my order shipped",
        "has it shipped",
        "shipping status",
         "shipping info", 
        "delivery status",
        "delivery date",
        "package status",
        "where is my package",
        "when will my order arrive",
        "when will my package arrive",
    ],

    Intent.INITIATE_RETURN: [
        "how do i return",
        "how can i return",
        "return an item",
        "return my item",
        "want to return",
        "need to return",
        "send item back",
        "send this back",
        "start a return",
        "return label",
        "return policy",
    ],

    Intent.GET_REFUND_STATUS: [
        "where is my refund",
        "when will i get my refund",
        "refund status",
        "check my refund",
        "refund update",
        "money back",
        "when will i get my money back",
        "haven't received my refund",
        "have not received my refund",
    ],

    Intent.HUMAN_ESCALATION: [
        "talk to a human",
        "speak to a human",
        "talk to an agent",
        "speak to an agent",
        "customer service agent",
        "real person",
        "speak to representative",
        "talk to representative",
        "human support",
        "customer support",
        "speak to someone",
        "manager",
    ],
}


INTENT_PRIORITY: List[Intent] = [
    Intent.HUMAN_ESCALATION,
    Intent.GET_ORDER_STATUS,
    Intent.INITIATE_RETURN,
    Intent.GET_REFUND_STATUS,
    Intent.FALLBACK,
]