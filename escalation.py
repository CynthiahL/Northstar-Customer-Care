#doing the ticket escalation
from ticketing import create_ticket

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
    """Check whether a customer message is an explicit request for a
    human agent. Case-insensitive, matches on exact trigger phrases."""
    normalized = message.strip().lower()
    return normalized in HUMAN_REQUEST_TRIGGERS


def escalate_to_human(customer_id: str, source_flow: str, message: str) -> str:
    """Escalate a customer request to a human agent.

    Called from within the order-status flow or the returns/refunds flow
    whenever wants_human() returns True for the customer's message.

    Args:
        customer_id: identifier for the customer.
        source_flow: which flow the escalation came from, e.g.
            "order_status" or "returns_refunds".
        message: the customer's original message that triggered escalation.

    Returns:
        The confirmation message to show the customer.
    """
    ticket = create_ticket(
        customer_id=customer_id,
        source_flow=source_flow,
        reason="customer_requested_human",
        original_message=message,
    )
    return CONFIRMATION_MESSAGE.format(ticket_id=ticket.ticket_id)
