"""Order status lookup for the Northstar support deflection MVP (Ticket #6).

Given a customer's order number, validates the format, looks it up against
the Ticket #6 demo order data (orders.json), and returns status and
delivery details in a stable JSON-serializable shape. Falls back to the
exact fallback messages required by the ticket when input is empty,
malformed, or not found. The response shape matches what
order_escalation_conditions.md (Ticket #7) assumes Member 4 will receive.

Branch: feature/order
"""

import json
import re
from pathlib import Path


# Exact fallback messages required by the ticket.
# Do not paraphrase or replace these.
EMPTY_INPUT_MESSAGE = "Please enter an order number."
MALFORMED_ID_MESSAGE = "That doesn't look like a valid order ID."
NOT_FOUND_MESSAGE = "We couldn't find that order."

# Exact order ID rule provided:
# "ORD" followed by exactly 4 digits.
# Case-sensitive: ORD1001 is valid, ord1001 is invalid.
ORDER_ID_REGEX = re.compile(r"^ORD\d{4}$")

# Keep the demo data in JSON as required by the project constraints.
# Using Path(__file__) makes the loader look beside this Python file,
# rather than depending on the user's current working directory.
ORDERS_FILE = Path(__file__).resolve().parent / "orders.json"


def _load_orders():
    """Load demo orders from orders.json and index them by orderId.

    Indexing by orderId keeps lookup fast and simple for the MVP, since
    the ticket only requires JSON demo data, not a real database.

    Returns:
        dict[str, dict]: orders indexed by their orderId field.
    """
    with ORDERS_FILE.open("r", encoding="utf-8") as file:
        orders = json.load(file)

    # orderId is the stable lookup key for Ticket #6.
    return {order["orderId"]: order for order in orders}


# Load once at module import because this is demo data and the MVP
# does not need dynamic reloading, caching, or database access.
ORDER_INDEX = _load_orders()


def _build_response(success, message, order, allow_retry):
    """Build the stable JSON-serializable response shape for this module.

    Args:
        success: whether a matching order was found.
        message: the exact fallback message, or None on success.
        order: the order record dict, or None on failure.
        allow_retry: whether the customer may try another order number.

    Returns:
        dict: {"success": bool, "message": str | None, "order": dict | None,
        "allowRetry": bool}. Member 4 needs this predictable structure to
        distinguish success from each fallback case during integration.
    """
    return {
        "success": success,
        "message": message,
        "order": order,
        "allowRetry": allow_retry,
    }


def get_order_status(order_number):
    """Look up an order's status and delivery info by order number.

    Flow: customer provides an order number -> validate format -> look up
    -> return status/delivery info, or return the exact fallback message
    required by Ticket #6 (empty input, malformed ID, or not found).

    Args:
        order_number: customer-provided order number. Expected to match
            ^ORD\\d{4}$ (case-sensitive). None or non-string input is
            handled explicitly rather than raising an error.

    Returns:
        dict: {"success": bool, "message": str | None, "order": dict | None,
        "allowRetry": bool}. This shape is stable for Member 4's
        integration and matches what order_escalation_conditions.md
        (Ticket #7) assumes it will receive.
    """

    # Empty input is treated as missing input.
    # None and whitespace-only strings both count as empty for this MVP.
    if order_number is None:
        return _build_response(
            success=False,
            message=EMPTY_INPUT_MESSAGE,
            order=None,
            allow_retry=True,
        )

    # Non-string input cannot match the required string pattern.
    # Treat it as malformed rather than crashing.
    if not isinstance(order_number, str):
        return _build_response(
            success=False,
            message=MALFORMED_ID_MESSAGE,
            order=None,
            allow_retry=True,
        )

    # Strip surrounding whitespace only.
    # This allows " ORD1001 " to be treated as ORD1001,
    # while still rejecting invalid formats.
    cleaned_order_id = order_number.strip()

    # After stripping, whitespace-only input should use the empty-input fallback.
    if cleaned_order_id == "":
        return _build_response(
            success=False,
            message=EMPTY_INPUT_MESSAGE,
            order=None,
            allow_retry=True,
        )

    # Validate the order ID format before attempting lookup.
    # The regex is case-sensitive, so "ord1001" is malformed.
    if not ORDER_ID_REGEX.fullmatch(cleaned_order_id):
        return _build_response(
            success=False,
            message=MALFORMED_ID_MESSAGE,
            order=None,
            allow_retry=True,
        )

    # Look up the validated order ID.
    order = ORDER_INDEX.get(cleaned_order_id)

    # A correctly formatted ID can still be absent from the demo data.
    if order is None:
        return _build_response(
            success=False,
            message=NOT_FOUND_MESSAGE,
            order=None,
            allow_retry=True,
        )

    # Return a copy of the order record so callers cannot accidentally
    # mutate the module-level demo data.
    return _build_response(
        success=True,
        message=None,
        order=dict(order),
        allow_retry=False,
    )