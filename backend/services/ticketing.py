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


# In-memory ticket storage tracking for validation auditing and MVP testing
_TICKETS: list[Ticket] = []


def create_ticket(
    customer_id: str, 
    source_flow: str, 
    reason: str, 
    original_message: str
) -> Ticket:
    """
    Create, register, and store a structured support ticket for an unresolved request.

    Args:
        customer_id: Identifier for the customer (email, account id, or session id).
        source_flow: Which flow the request came from (e.g., "order_status", "fallback").
        reason: Short machine-readable reason the request wasn't resolved.
        original_message: The customer's original question or input for human agent context.

    Returns:
        The Ticket object instance that was generated and appended to storage.
    """
    if not customer_id:
        raise ValueError("customer_id is required to create a ticket")
    if not source_flow:
        raise ValueError("source_flow is required to create a ticket")

    # Construct the persistent dataclass instance
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
    """
    Return every ticket created so far. 
    Used by tests and by handover documentation to demonstrate the audit trail.
    """
    return list(_TICKETS)


def get_tickets_for_customer(customer_id: str) -> list[Ticket]:
    """
    Return all tickets raised by a given customer identifier.
    """
    return [t for t in _TICKETS if t.customer_id == customer_id]
