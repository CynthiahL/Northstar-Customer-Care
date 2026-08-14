"""Fallback handling for the Northstar support deflection MVP.

Called when a customer's message doesn't match the order-status flow or
the returns/refunds flow. Instead of returning nothing or an error, this
gives the customer a clear response and a route to a human, using the
same escalation and ticketing logic as the rest of the system.
"""

from escalation import escalate_to_human

FALLBACK_MESSAGE = (
    "I'm not able to help with that specific request yet. I've logged it "
    "for our support team, and you can also ask to speak with a person at "
    "any time. Reference ticket: {ticket_id}"
)


def handle_unmatched_query(customer_id: str, message: str) -> str:
    """Handle a customer message that no other flow could resolve.

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
    confirmation = escalate_to_human(
        customer_id=customer_id,
        source_flow="fallback",
        message=message,
    )
    # Reuse the ticket id embedded in the escalation confirmation rather
    # than creating a second ticket for the same request.
    ticket_id = confirmation.split("ticket ")[-1].rstrip(".")
    return FALLBACK_MESSAGE.format(ticket_id=ticket_id)
