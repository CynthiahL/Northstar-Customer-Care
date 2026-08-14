import ticketing
import escalation
import fallback


def reset_tickets():
    ticketing._TICKETS.clear()


def test_task10_unresolved_request_from_order_flow_creates_ticket():
    reset_tickets()
    ticket = ticketing.create_ticket(
        customer_id="cust_1",
        source_flow="order_status",
        reason="order_not_found",
        original_message="Where is order 88213?",
    )
    assert ticket.ticket_id
    assert ticket.source_flow == "order_status"
    assert ticket.status == "open"
    print("PASS: task 10, order flow produces a structured ticket")


def test_task10_unresolved_request_from_returns_flow_creates_ticket():
    reset_tickets()
    ticket = ticketing.create_ticket(
        customer_id="cust_2",
        source_flow="returns_refunds",
        reason="return_window_expired",
        original_message="Can I still return this jacket?",
    )
    assert ticket.ticket_id
    assert ticket.source_flow == "returns_refunds"
    print("PASS: task 10, returns flow produces a structured ticket")


def test_task11_customer_can_escalate_from_order_flow():
    reset_tickets()
    assert escalation.wants_human("talk to a person")
    message = escalation.escalate_to_human(
        customer_id="cust_3",
        source_flow="order_status",
        message="talk to a person",
    )
    assert "ticket" in message
    tickets = ticketing.get_tickets_for_customer("cust_3")
    assert len(tickets) == 1
    assert tickets[0].source_flow == "order_status"
    assert tickets[0].reason == "customer_requested_human"
    print("PASS: task 11, escalation works from order status flow")


def test_task11_customer_can_escalate_from_returns_flow():
    reset_tickets()
    message = escalation.escalate_to_human(
        customer_id="cust_4",
        source_flow="returns_refunds",
        message="agent",
    )
    assert "ticket" in message
    tickets = ticketing.get_tickets_for_customer("cust_4")
    assert len(tickets) == 1
    assert tickets[0].source_flow == "returns_refunds"
    print("PASS: task 11, escalation works from returns/refunds flow")


def test_task12_unmatched_query_gets_fallback_response():
    reset_tickets()
    response = fallback.handle_unmatched_query(
        customer_id="cust_5",
        message="Do you sell gift cards?",
    )
    assert "ticket" in response.lower()
    tickets = ticketing.get_tickets_for_customer("cust_5")
    assert len(tickets) == 1
    assert tickets[0].source_flow == "fallback"
    print("PASS: task 12, unmatched query gets a fallback response and ticket")


def test_task12_stock_availability_question_is_unmatched_in_this_mvp():
    reset_tickets()
    response = fallback.handle_unmatched_query(
        customer_id="cust_6",
        message="Is this back in stock in a medium?",
    )
    assert response
    tickets = ticketing.get_tickets_for_customer("cust_6")
    assert len(tickets) == 1
    print("PASS: task 12, stock-availability question handled by fallback")


if __name__ == "__main__":
    test_task10_unresolved_request_from_order_flow_creates_ticket()
    test_task10_unresolved_request_from_returns_flow_creates_ticket()
    test_task11_customer_can_escalate_from_order_flow()
    test_task11_customer_can_escalate_from_returns_flow()
    test_task12_unmatched_query_gets_fallback_response()
    test_task12_stock_availability_question_is_unmatched_in_this_mvp()
    print("\nAll tests passed.")
