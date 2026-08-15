import uuid
from datetime import datetime, timezone

REFUND_NOT_FOUND_MESSAGE = "We couldn't find a matching order for refund."
REFUND_INITIATED_MESSAGE = "Your refund request has been initiated successfully."
REFUND_ALREADY_PROCESSED_MESSAGE = "This order has already been refunded."

# Demo in-memory store for refunds
REFUND_STORE = {}

def initiate_refund(order_id: str) -> str:
    """
    Business logic layer to initiate an order cash refund.
    Returns a raw message string for the API layer to wrap.
    """
    # 1. Structural prefix parsing validation
    if not order_id or not order_id.startswith("ORD"):
        return REFUND_NOT_FOUND_MESSAGE

    # 2. Check duplicate refund request constraints
    if order_id in REFUND_STORE:
        return REFUND_ALREADY_PROCESSED_MESSAGE

    # 3. Create persistent record log entries
    refund_id = str(uuid.uuid4())
    REFUND_STORE[order_id] = {
        "refundId": refund_id,
        "orderId": order_id,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "status": "Initiated",
    }

    return f"{REFUND_INITIATED_MESSAGE} Refund ID: {refund_id}."


def get_refund_status(order_id: str) -> str:
    """
    Business logic layer to check an active refund status tracking state.
    """
    record = REFUND_STORE.get(order_id)
    if not record:
        return REFUND_NOT_FOUND_MESSAGE

    return f"Refund {record['refundId']} for order {order_id} is currently {record['status']}."
