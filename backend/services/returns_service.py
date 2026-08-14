from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState


def initiate_return(item_id: str) -> ChatResponse:
    return ChatResponse(
        intent=Intent.INITIATE_RETURN,
        state=ConversationState.PROCESSING,
        message=f"Stub: return process for item {item_id} initiated."
    )