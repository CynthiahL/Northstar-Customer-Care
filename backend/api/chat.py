from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel


from backend.api.schemas.chat import ChatRequest, ChatResponse
from backend.intents.classifier import classify_message
from backend.intents.definitions import Intent, ConversationState

from backend.services.order_service import get_order_status
from backend.services.returns_service import initiate_return
from backend.services.refund_service import get_refund_status
from backend.services.fallback import handle_unmatched_query
from backend.services.escalation import escalate_to_human


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# ---------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------

class ChatRequest(BaseModel):
    message: str
    intent: Optional[Intent] = None
    order_id: Optional[str] = None
    state: ConversationState = ConversationState.NEW


class ChatResponse(BaseModel):
    intent: Intent
    state: ConversationState
    message: str
    order_id: Optional[str] = None
    escalated: bool = False
    ticket_id: Optional[str] = None


# ---------------------------------------------------------
# Helper
# ---------------------------------------------------------

def request_order_id(
    intent: Intent,
    message: str,
) -> ChatResponse:
    """
    Return a response when an intent requires an order ID
    but none was provided.
    """

    return ChatResponse(
        intent=intent,
        state=ConversationState.AWAITING_ORDER_ID,
        message=message,
    )


# ---------------------------------------------------------
# Chat Endpoint
# ---------------------------------------------------------

@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chatbot endpoint.

    Responsibilities:
    - Classify the customer's message
    - Extract the order ID
    - Route the request to the appropriate service
    """

    classification = classify_message(request.message)

    intent = classification.intent

    # Prefer an order ID found in the current message.
    # If none was found, use the ID supplied with the request.
    order_id = classification.order_id or request.order_id

    # -----------------------------------------------------
    # Human escalation
    # -----------------------------------------------------

    if intent == Intent.HUMAN_ESCALATION:
        return escalate_to_human(order_id)

    # -----------------------------------------------------
    # Order status
    # -----------------------------------------------------

    if intent == Intent.GET_ORDER_STATUS:

        if not order_id:
            return request_order_id(
                intent,
                "Please provide your order number so I can check its status."
            )

        return get_order_status(order_id)

    # -----------------------------------------------------
    # Returns
    # -----------------------------------------------------

    if intent == Intent.INITIATE_RETURN:

        if not order_id:
            return request_order_id(
                intent,
                "Please provide your order number so I can check return eligibility."
            )

        return initiate_return(order_id)

    # -----------------------------------------------------
    # Refund status
    # -----------------------------------------------------

    if intent == Intent.GET_REFUND_STATUS:

        if not order_id:
            return request_order_id(
                intent,
                "Please provide your order number so I can check refund status."
            )

        return get_refund_status(order_id)

    # -----------------------------------------------------
    # Fallback
    # -----------------------------------------------------

    return get_fallback_response(order_id)