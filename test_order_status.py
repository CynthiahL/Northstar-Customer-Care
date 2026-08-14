"""Tests for Ticket #6 (order-status flow) on feature/order.

Each test is written directly against Ticket #6's Definition of Done:
"A valid order number returns the correct order status and relevant
delivery information," plus the exact fallback behavior the ticket
requires for invalid input. Matches the pattern used in
test_escalation.py for Tickets #10-12.
"""

from order_status import get_order_status


def test_task6_valid_order_returns_status_and_delivery_info():
    result = get_order_status("ORD1001")
    assert result["success"] is True
    assert result["order"]["status"] == "Processing"
    assert result["order"]["carrier"] == "USPS"
    print("PASS: task 6, valid order returns status and delivery info")


def test_task6_whitespace_padded_order_id_still_resolves():
    result = get_order_status("  ORD1002  ")
    assert result["success"] is True
    assert result["order"]["orderId"] == "ORD1002"
    print("PASS: task 6, whitespace-padded order ID still resolves")


def test_task6_empty_input_returns_exact_fallback():
    result = get_order_status("")
    assert result["success"] is False
    assert result["message"] == "Please enter an order number."
    assert result["allowRetry"] is True
    print("PASS: task 6, empty input returns exact fallback")


def test_task6_none_input_returns_exact_fallback():
    result = get_order_status(None)
    assert result["message"] == "Please enter an order number."
    print("PASS: task 6, None input returns exact fallback")


def test_task6_malformed_id_returns_exact_fallback():
    result = get_order_status("abc123")
    assert result["success"] is False
    assert result["message"] == "That doesn't look like a valid order ID."
    print("PASS: task 6, malformed ID returns exact fallback")


def test_task6_lowercase_prefix_is_malformed():
    # Order IDs are case-sensitive per the agreed format.
    result = get_order_status("ord1001")
    assert result["message"] == "That doesn't look like a valid order ID."
    print("PASS: task 6, lowercase prefix is treated as malformed")


def test_task6_wellformed_but_missing_order_returns_not_found():
    result = get_order_status("ORD9999")
    assert result["success"] is False
    assert result["message"] == "We couldn't find that order."
    print("PASS: task 6, well-formed but missing order returns not-found fallback")


if __name__ == "__main__":
    test_task6_valid_order_returns_status_and_delivery_info()
    test_task6_whitespace_padded_order_id_still_resolves()
    test_task6_empty_input_returns_exact_fallback()
    test_task6_none_input_returns_exact_fallback()
    test_task6_malformed_id_returns_exact_fallback()
    test_task6_lowercase_prefix_is_malformed()
    test_task6_wellformed_but_missing_order_returns_not_found()
    print("\nAll tests passed.")
