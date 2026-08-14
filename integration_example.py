from escalation import wants_human, escalate_to_human
from fallback import handle_unmatched_query


def order_status_flow(customer_id: str, message: str) -> str:
    if wants_human(message):
        return escalate_to_human(customer_id, "order_status", message)

    # Placeholder: real order lookup logic belongs to member 2's task 6.
    order_found = False
    if not order_found:
        return handle_unmatched_query(customer_id, message)

    return "Your order is on the way."


def returns_refunds_flow(customer_id: str, message: str) -> str:
    if wants_human(message):
        return escalate_to_human(customer_id, "returns_refunds", message)

    # Placeholder: real return-eligibility logic belongs to member 3's task 8.
    return handle_unmatched_query(customer_id, message)


if __name__ == "__main__":
    print(order_status_flow("cust_100", "talk to a person"))
    print(returns_refunds_flow("cust_101", "Can I exchange this for a different size?"))
