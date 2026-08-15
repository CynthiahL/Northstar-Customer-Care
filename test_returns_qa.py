from backend.services.returns_service import initiate_return
from backend.services.refund_service import get_refund_status
from backend.intents.definitions import Intent, ConversationState


def test_return_happy_path():
    result = initiate_return("ORD1001")

    assert result.intent == Intent.INITIATE_RETURN
    assert result.state == ConversationState.PROCESSING
    assert "ORD1001" in result.message


def test_return_with_different_order_id():
    result = initiate_return("ORD1002")

    assert result.intent == Intent.INITIATE_RETURN
    assert result.state == ConversationState.PROCESSING
    assert "ORD1002" in result.message


def test_return_empty_order_id():
    result = initiate_return("")

    assert result.intent == Intent.INITIATE_RETURN
    assert result.state == ConversationState.PROCESSING


def test_return_missing_order_id():
    result = initiate_return(None)

    assert result.intent == Intent.INITIATE_RETURN
    assert result.state == ConversationState.PROCESSING


def test_refund_status_happy_path():
    result = get_refund_status("ORD1001")

    assert result.intent == Intent.GET_REFUND_STATUS
    assert result.state == ConversationState.PROCESSING
    assert "ORD1001" in result.message


def test_refund_status_with_different_order_id():
    result = get_refund_status("ORD1002")

    assert result.intent == Intent.GET_REFUND_STATUS
    assert result.state == ConversationState.PROCESSING
    assert "ORD1002" in result.message


def test_refund_status_empty_order_id():
    result = get_refund_status("")

    assert result.intent == Intent.GET_REFUND_STATUS
    assert result.state == ConversationState.PROCESSING


def test_refund_status_missing_order_id():
    result = get_refund_status(None)

    assert result.intent == Intent.GET_REFUND_STATUS
    assert result.state == ConversationState.PROCESSING