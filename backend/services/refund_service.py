import uuid
from datetime import datetime, timezone

RETURN_NOT_FOUND_MESSAGE = "We couldn't find a matching order for return."
RETURN_INITIATED_MESSAGE = "Your return request has been initiated successfully."
RETURN_ALREADY_PROCESSED_MESSAGE = "This order has already been returned or refunded."

# Demo in-memory store for returns
RETURN_STORE = {}

def initiate_return(order_id: str) -> str:
    """
    Business logic layer to initiate a product return.
    Returns a raw message string to be wrapped by the API controller.
    """
    # 1. Validate order format (matching your database configuration prefix)
    if not order_id or not order_id.startswith("ORD"):
        return RETURN_NOT_FOUND_MESSAGE

    # 2. Check if already processed
    if order_id in RETURN_STORE:
        return RETURN_ALREADY_PROCESSED_MESSAGE

    # 3. Create return record
    return_id = str(uuid.uuid4())
    RETURN_STORE[order_id] = {
        "returnId": return_id,
        "orderId": order_id,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "status": "Initiated",
    }

    return f"{RETURN_INITIATED_MESSAGE} Return ID: {return_id}."


def get_return_status(order_id: str) -> str:
    """
    Business logic layer to fetch an active return record milestone status.
    """
    record = RETURN_STORE.get(order_id)
    if not record:
        return RETURN_NOT_FOUND_MESSAGE

    return f"Return {record['returnId']} for order {order_id} is currently {record['status']}."
