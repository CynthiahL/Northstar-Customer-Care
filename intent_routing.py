"""Intent routing for the Northstar support deflection MVP (Ticket #5).

Routes a raw customer question to a support flow using pattern matching
against common order-status phrasings. Returns a JSON-serializable
dictionary so Member 4 can integrate the result without parsing free text.
Unmatched questions are returned as a neutral "unknown" intent/flow rather
than escalating directly — escalation is Member 4's scope, not Ticket #5's.

Branch: product/intent-routing
"""

import json
import re


# Stable intent identifiers for Member 4 integration.
# These are intentionally simple strings so they can be serialized to JSON.
ORDER_STATUS_INTENT = "order_status"
UNKNOWN_INTENT = "unknown"

# Stable flow identifiers.
# ORDER_STATUS_FLOW is the flow owned by the Order Status module.
# UNKNOWN_FLOW is deliberately not a human-escalation state.
# Escalation belongs to Member 4, not Ticket #5.
ORDER_STATUS_FLOW = "order_status_flow"
UNKNOWN_FLOW = "unknown_intent"

# Why these patterns exist:
# Real e-commerce assistants commonly recognize natural-language questions about
# tracking, shipping, delivery, and order status. These patterns are intentionally
# simple for a 1-week MVP, but they cover the common customer phrasings.
ORDER_STATUS_PATTERNS = [
    r"\bwhere\s+is\s+(?:my|the)\s+(?:order|package|parcel)\b",
    r"\bwhere's\s+(?:my|the)\s+(?:order|package|parcel)\b",
    r"\btrack\s+(?:my|the)\s+(?:order|package|parcel|shipment)\b",
    r"\btracking\s+(?:my|the)\s+(?:order|package|parcel|shipment)\b",
    r"\bstatus\s+of\s+(?:my|this|the)\s+order\b",
    r"\border\s+status\b",
    r"\bhas\s+(?:my|this|the)\s+order\s+(?:been\s+)?shipped\b",
    r"\bhas\s+(?:this|it)\s+shipped\b",
    r"\bshipped\s+yet\b",
    r"\bwhen\s+will\s+(?:my|the)\s+(?:order|package|parcel)\s+(?:arrive|be\s+delivered)\b",
    r"\bout\s+for\s+delivery\b",
    r"\bdelivery\s+(?:status|date|update)\b",
]

# Compile regexes once because the same routing rules may be reused many times.
_ORDER_STATUS_REGEXES = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in ORDER_STATUS_PATTERNS
]


def route_intent(raw_question):
    """Route a raw customer question to a support flow.

    Checks the question against ORDER_STATUS_PATTERNS and returns the
    matching intent/flow, or a neutral "unknown" result if nothing matches.
    Stops at the first match since the MVP only needs a single route, not
    confidence ranking or multi-intent handling.

    Args:
        raw_question: the customer's raw input. None or empty input is
            handled explicitly and returns an "unknown" result rather
            than raising an error.

    Returns:
        dict: {
            "rawQuestion": str,
            "intent": "order_status" | "unknown",
            "flow": "order_status_flow" | "unknown_intent",
        }
        This shape is stable for Member 4's integration.
    """

    # Preserve a safe string version of the original input for JSON output.
    if raw_question is None:
        safe_raw = ""
        text = ""
    else:
        safe_raw = str(raw_question)
        text = safe_raw.strip().lower()

    # Empty text cannot be identified as an order-status intent.
    # Ticket #6 handles order-number-specific empty input later.
    if not text:
        return {
            "rawQuestion": safe_raw,
            "intent": UNKNOWN_INTENT,
            "flow": UNKNOWN_FLOW,
        }

    # Stop at the first matching rule because the MVP only needs a single route,
    # not confidence ranking or multi-intent handling.
    for regex in _ORDER_STATUS_REGEXES:
        if regex.search(text):
            return {
                "rawQuestion": safe_raw,
                "intent": ORDER_STATUS_INTENT,
                "flow": ORDER_STATUS_FLOW,
            }

    # If no order-status pattern matches, keep the result neutral.
    # This does not trigger human escalation because escalation is Member 4's scope.
    return {
        "rawQuestion": safe_raw,
        "intent": UNKNOWN_INTENT,
        "flow": UNKNOWN_FLOW,
    }


# Sample questions required by Ticket #5 DoD.
# This is demonstration output only, not the full QA test suite.
SAMPLE_QUESTIONS = [
    "where is my order",
    "has this shipped yet",
    "track my package",
    "What is the status of my order?",
    "When will my package arrive?",
]


if __name__ == "__main__":
    # Print JSON so the sample routing result matches the project data format.
    results = [route_intent(question) for question in SAMPLE_QUESTIONS]
    print(json.dumps(results, indent=2))