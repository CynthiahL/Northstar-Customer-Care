from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState


def get_order_status(order_id: str) -> ChatResponse:
    return ChatResponse(
        intent=Intent.GET_ORDER_STATUS,
        state=ConversationState.PROCESSING,
        message=f"Stub: order {order_id} status lookup pending."
    )
