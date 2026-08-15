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
    return {order["orderId"]: order for order in orders}

ORDER_INDEX = _load_orders()

def _is_valid_date(date_str: str) -> bool:
    try:
        year, month, day = map(int, date_str.split("-"))
        date(year, month, day)
        return True
    except Exception:
        return False

def get_order_status(order_number: str) -> ChatResponse:
    # Empty input
    if order_number is None or (isinstance(order_number, str) and order_number.strip() == ""):
        return ChatResponse(intent=Intent.ORDER_STATUS,
                            state=ConversationState.PROCESSING,
                            message=EMPTY_INPUT_MESSAGE)

    # Non-string input
    if not isinstance(order_number, str):
        return ChatResponse(intent=Intent.ORDER_STATUS,
                            state=ConversationState.PROCESSING,
                            message=MALFORMED_ID_MESSAGE)

    cleaned_order_id = order_number.strip()

    # Invalid format
    if not ORDER_ID_REGEX.fullmatch(cleaned_order_id):
        return ChatResponse(intent=Intent.ORDER_STATUS,
                            state=ConversationState.PROCESSING,
                            message=MALFORMED_ID_MESSAGE)

    # Lookup
    order = ORDER_INDEX.get(cleaned_order_id)
    if order is None:
        return ChatResponse(intent=Intent.ORDER_STATUS,
                            state=ConversationState.PROCESSING,
                            message=NOT_FOUND_MESSAGE)

    # Success
    return ChatResponse(intent=Intent.ORDER_STATUS,
                        state=ConversationState.SUCCESS,
                        message=f"Order {order['orderId']} is {order['status']} with delivery date {order.get('deliveryDate')}.")
