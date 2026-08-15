from backend.api.schemas.chat import ChatResponse
from backend.intents.definitions import Intent, ConversationState
from backend.services.ticketing import create_ticket

# Phrases that count as an explicit request for a human agent. 
HUMAN_REQUEST_TRIGGERS = {
    "talk to a person",
    "talk to a human",
    "speak to an agent",
    "human please",
    "agent",
    "representative",
}

CONFIRMATION_MESSAGE = (
    "I've passed this on to our support team. A person will follow up with "
    "you shortly, referencing ticket {ticket_id}."
)


def wants_human(message: str) -> bool:
    """
    Check whether a customer message is an explicit request for a
    human agent. Case-insensitive, matches on exact trigger phrases.
    """
    normalized = message.strip().lower()
    return normalized in HUMAN_REQUEST_TRIGGERS


def escalate_to_human(
    customer_id: str, 
    source_flow: str, 
    message: str, 
    reason: str = "customer_requested_human"
) -> ChatResponse:
    """
    Escalate a customer request to a human agent by generating a support ticket.

    Called from within the order-status, returns/refunds, or fallback flows
    whenever a human is requested or automated processing thresholds fail.

    Args:
        customer_id: Identifier for the customer.
        source_flow: Which flow the escalation came from (e.g., "order_status", "fallback").
        message: The customer's original message that triggered escalation.
        reason: Contextual reason for the escalation (defaults to customer intent).

    Returns:
        A structured ChatResponse containing the ticket confirmation mapping.
    """
    # Create the production support ticket mapping
    ticket = create_ticket(
        customer_id=customer_id,
        source_flow=source_flow,
        reason=reason,
        original_message=message,
    )
    
    return ChatResponse(
        intent=Intent.HUMAN_ESCALATION,
        state=ConversationState.ESCALATED,
        message=CONFIRMATION_MESSAGE.format(ticket_id=ticket.ticket_id),
        escalated=True,
        ticket_id=ticket.ticket_id,
    )
