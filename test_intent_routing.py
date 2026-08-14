"""Tests for Ticket #5 (intent routing) on product/intent-routing.

Each test checks route_intent() against Ticket #5's Definition of Done:
"Sample customer questions map to the correct support flow." Matches the
pattern used in test_escalation.py for Tickets #10-12.
"""

from intent_routing import (
    route_intent,
    ORDER_STATUS_INTENT,
    ORDER_STATUS_FLOW,
    UNKNOWN_INTENT,
    UNKNOWN_FLOW,
)


def test_task5_where_is_my_order_routes_correctly():
    result = route_intent("where is my order")
    assert result["intent"] == ORDER_STATUS_INTENT
    assert result["flow"] == ORDER_STATUS_FLOW
    print("PASS: task 5, 'where is my order' routes correctly")


def test_task5_has_this_shipped_yet_routes_correctly():
    result = route_intent("has this shipped yet")
    assert result["intent"] == ORDER_STATUS_INTENT
    assert result["flow"] == ORDER_STATUS_FLOW
    print("PASS: task 5, 'has this shipped yet' routes correctly")


def test_task5_case_insensitive_match():
    result = route_intent("WHERE IS MY ORDER")
    assert result["intent"] == ORDER_STATUS_INTENT
    print("PASS: task 5, matching is case-insensitive")


def test_task5_unrelated_question_routes_to_unknown():
    result = route_intent("do you sell gift cards")
    assert result["intent"] == UNKNOWN_INTENT
    assert result["flow"] == UNKNOWN_FLOW
    print("PASS: task 5, unrelated question routes to unknown")


def test_task5_empty_input_routes_to_unknown_without_crashing():
    result = route_intent("")
    assert result["intent"] == UNKNOWN_INTENT
    print("PASS: task 5, empty input handled without crashing")


def test_task5_none_input_routes_to_unknown_without_crashing():
    result = route_intent(None)
    assert result["intent"] == UNKNOWN_INTENT
    assert result["rawQuestion"] == ""
    print("PASS: task 5, None input handled without crashing")


if __name__ == "__main__":
    test_task5_where_is_my_order_routes_correctly()
    test_task5_has_this_shipped_yet_routes_correctly()
    test_task5_case_insensitive_match()
    test_task5_unrelated_question_routes_to_unknown()
    test_task5_empty_input_routes_to_unknown_without_crashing()
    test_task5_none_input_routes_to_unknown_without_crashing()
    print("\nAll tests passed.")
