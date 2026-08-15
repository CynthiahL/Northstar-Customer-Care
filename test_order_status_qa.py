from order_status import get_order_status


def test_valid_processing_order():
    result = get_order_status("ORD1001")
    assert result["success"] is True
    assert result["order"]["status"] == "Processing"


def test_valid_shipped_order():
    result = get_order_status("ORD1002")
    assert result["success"] is True
    assert result["order"]["status"] == "Shipped"


def test_valid_delivered_order():
    result = get_order_status("ORD1004")
    assert result["success"] is True
    assert result["order"]["status"] == "Delivered"


def test_valid_cancelled_order():
    result = get_order_status("ORD1005")
    assert result["success"] is True
    assert result["order"]["status"] == "Cancelled"


def test_order_id_with_whitespace():
    result = get_order_status("  ORD1001  ")
    assert result["success"] is True
    assert result["order"]["orderId"] == "ORD1001"


def test_none_order_id():
    result = get_order_status(None)
    assert result["success"] is False
    assert result["message"] == "Please enter an order number."


def test_empty_order_id():
    result = get_order_status("")
    assert result["success"] is False
    assert result["message"] == "Please enter an order number."


def test_whitespace_only_order_id():
    result = get_order_status("   ")
    assert result["success"] is False
    assert result["message"] == "Please enter an order number."


def test_malformed_order_id():
    result = get_order_status("abc123")
    assert result["success"] is False
    assert result["message"] == "That doesn't look like a valid order ID."


def test_lowercase_order_id():
    result = get_order_status("ord1001")
    assert result["success"] is False
    assert result["message"] == "That doesn't look like a valid order ID."


def test_wrong_length_order_id():
    result = get_order_status("ORD123")
    assert result["success"] is False
    assert result["message"] == "That doesn't look like a valid order ID."


def test_unknown_order_id():
    result = get_order_status("ORD9999")
    assert result["success"] is False
    assert result["message"] == "We couldn't find that order."


def test_non_string_order_id():
    result = get_order_status(1001)
    assert result["success"] is False
    assert result["message"] == "That doesn't look like a valid order ID."