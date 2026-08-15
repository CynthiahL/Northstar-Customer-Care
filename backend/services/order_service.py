import json
import re
from pathlib import Path
from datetime import date
from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState

# Exact fallback messages
EMPTY_INPUT_MESSAGE = "Please enter an order number."
MALFORMED_ID_MESSAGE = "That doesn't look like a valid order ID."
NOT_FOUND_MESSAGE = "We couldn't find that order."

# Regex for order IDs
ORDER_ID_REGEX = re.compile(r"^ORD\d{4}$")

# Demo data file (placed in backend/data/orders.json)
ORDERS_FILE = Path(__file__).resolve().parent.parent / "data" / "orders.json"

def _load_orders():
    with ORDERS_FILE.open("r", encoding="utf-8") as file:
        orders = json.load(file)
    return {order["order_id"]: order for order in orders}

ORDER_INDEX = _load_orders()

def _is_valid_date(date_str: str) -> bool:
    try:
        year, month, day = map(int, date_str.split("-"))
        date(year, month, day)
        return True
    except Exception:
        return False

def get_order_status(order_number: str) -> str:
    """
    Business logic layer for looking up order tracking milestones.
    Returns a raw message string describing the lookup result.
    """
    # 1. Empty input validation
    if order_number is None or (isinstance(order_number, str) and order_number.strip() == ""):
        return "Please enter an order number."

    # 2. Non-string input validation
    if not isinstance(order_number, str):
        return "That doesn't look like a valid order ID."

    cleaned_order_id = order_number.strip()

    # 3. Structural regex pattern validation
    if not ORDER_ID_REGEX.fullmatch(cleaned_order_id):
        return "That doesn't look like a valid order ID."

    # 4. Database index lookup
    order = ORDER_INDEX.get(cleaned_order_id)
    if order is None:
        return "We couldn't find that order."

    # 5. Success execution path
    return f"Order {order['orderId']} is {order['status']} with delivery date {order.get('deliveryDate', 'unspecified')}."
