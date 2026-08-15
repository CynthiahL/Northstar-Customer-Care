from unittest.mock import patch

from escalation import wants_human, escalate_to_human


def test_explicit_human_request_escalates():
    assert wants_human("talk to a human") is True


def test_human_request_is_case_insensitive():
    assert wants_human("TALK TO A HUMAN") is True


def test_human_request_ignores_surrounding_whitespace():
    assert wants_human("  speak to an agent  ") is True


def test_non_escalation_message_does_not_escalate():
    assert wants_human("Where is my order?") is False


def test_unrelated_message_does_not_escalate():
    assert wants_human("I want to return this item") is False


def test_order_flow_escalation_creates_ticket():
    with patch("escalation.create_ticket") as mock_ticket:
        mock_ticket.return_value.ticket_id = "TICKET-123"

        result = escalate_to_human(
            customer_id="CUST-1",
            source_flow="order_status",
            message="talk to a human",
        )

        mock_ticket.assert_called_once_with(
            customer_id="CUST-1",
            source_flow="order_status",
            reason="customer_requested_human",
            original_message="talk to a human",
        )
        assert "TICKET-123" in result


def test_returns_flow_escalation_creates_ticket():
    with patch("escalation.create_ticket") as mock_ticket:
        mock_ticket.return_value.ticket_id = "TICKET-456"

        result = escalate_to_human(
            customer_id="CUST-2",
            source_flow="returns_refunds",
            message="speak to an agent",
        )

        mock_ticket.assert_called_once_with(
            customer_id="CUST-2",
            source_flow="returns_refunds",
            reason="customer_requested_human",
            original_message="speak to an agent",
        )
        assert "TICKET-456" in result


def test_escalation_confirmation_references_ticket():
    with patch("escalation.create_ticket") as mock_ticket:
        mock_ticket.return_value.ticket_id = "TICKET-789"

        result = escalate_to_human(
            customer_id="CUST-3",
            source_flow="order_status",
            message="representative",
        )

        assert "TICKET-789" in result
        assert "support team" in result