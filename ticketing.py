#ticketing programme

from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4


@dataclass
class Ticket:
    ticket_id: str
    customer_id: str
    source_flow: str
    reason: str
    original_message: str
    created_at: str
    status: str = "open"


_TICKETS: list[Ticket] = []


def create_ticket(customer_id: str, source_flow: str, reason: str, original_message: str) -> Ticket:
    """Create and store a structured ticket for an unresolved request.

    Args:
        customer_id: identifier for the customer (email, account id, or
            session id, depending on what the interface provides).
        source_flow: which flow the request came from, e.g. "order_status",
            "returns_refunds", or "fallback".
        reason: short machine-readable reason the request wasn't resolved,
            e.g. "customer_requested_human" or "unmatched_query".
        original_message: the customer's original question or input, kept
            for the human agent who picks up the ticket.

    Returns:
        The Ticket that was created and stored.
    """
    if not customer_id:
        raise ValueError("customer_id is required to create a ticket")
    if not source_flow:
        raise ValueError("source_flow is required to create a ticket")

    ticket = Ticket(
        ticket_id=str(uuid4()),
        customer_id=customer_id,
        source_flow=source_flow,
        reason=reason,
        original_message=original_message,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    _TICKETS.append(ticket)
    return ticket


def get_all_tickets() -> list[Ticket]:
    """Return every ticket created so far. Used by tests and by the
    handover documentation to demonstrate the audit trail."""
    return list(_TICKETS)


def get_tickets_for_customer(customer_id: str) -> list[Ticket]:
    """Return all tickets raised by a given customer."""
    return [t for t in _TICKETS if t.customer_id == customer_id]
