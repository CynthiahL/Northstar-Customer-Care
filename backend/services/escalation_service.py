from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState


def escalate_to_human(issue_id: str) -> ChatResponse:
    return ChatResponse(
        intent=Intent.ESCALATE_TO_HUMAN,
        state=ConversationState.PROCESSING,
        message=f"Stub: issue {issue_id} escalation to human agent pending."
    )