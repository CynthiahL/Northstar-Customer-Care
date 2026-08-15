from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState


def escalate_to_human(order_id: str | None = None) -> ChatResponse:
    return ChatResponse(
        intent=Intent.HUMAN_ESCALATION,
        state=ConversationState.ESCALATED,
        message="Your request has been escalated to a human support representative.",
        order_id=order_id,
        escalated=True,
        ticket_id="TICKET-001",
    )


    