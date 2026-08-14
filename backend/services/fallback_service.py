from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState
from typing import Optional

def get_fallback_response(order_id: Optional[str] = None) -> ChatResponse:
    return ChatResponse(
        intent=Intent.FALLBACK,
        state=ConversationState.PROCESSING,
        message="I'm sorry, I didn't understand that. Can you please rephrase?",
    )