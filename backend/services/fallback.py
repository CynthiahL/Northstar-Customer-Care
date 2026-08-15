from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState
from backend.services.escalation import escalate_to_human

# Dynamic fallback message string waiting for a real ticket ID insertion
FALLBACK_MESSAGE = (
    "I'm not able to help with that specific request yet. I've logged it "
    "for our support team, and you can also ask to speak with a person at "
    "any time. Reference ticket: {ticket_id}"
)


def handle_unmatched_query(customer_id: str, message: str) -> ChatResponse:
    """
    Handle a customer message that no other flow could resolve.

    This routes the request through the same human escalation path used
    for explicit human requests, so every unresolved query, whether the
    customer asked for a person or the bot simply didn't understand,
    ends up as a ticket a human can act on.

    Args:
        customer_id: identifier for the customer.
        message: the customer's original, unmatched message.

    Returns:
        A fallback message shown to the customer, including a ticket
        reference.
    """
    # Trigger the downstream human escalation & ticket creation logic
    escalation_response = escalate_to_human(
        customer_id=customer_id,
        source_flow="fallback",
        message=message,
    )
    
    # Reuse the ticket id embedded in the escalation confirmation rather
    # than creating a second ticket for the same request.
    return ChatResponse(
        intent=Intent.FALLBACK,
        state=ConversationState.ESCALATED,
        message=FALLBACK_MESSAGE.format(ticket_id=escalation_response.ticket_id),
        escalated=True,
        ticket_id=escalation_response.ticket_id,
    )
