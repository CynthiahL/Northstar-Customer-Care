from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState

def get_refund_status(refund_id: str) -> ChatResponse:
    return ChatResponse(
        intent=Intent.GET_REFUND_STATUS,
        state=ConversationState.PROCESSING,
        message=f"Stub: refund {refund_id} status lookup pending."
    )
