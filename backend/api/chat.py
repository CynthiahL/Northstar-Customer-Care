from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

# Domain imports
from backend.intents.classifier import classify_message
from backend.intents.definitions import Intent, ConversationState

# Service imports
from backend.services.order_service import get_order_status
from backend.services.returns_service import initiate_return
from backend.services.refund_service import get_refund_status
from backend.services.fallback import handle_unmatched_query
from backend.services.escalation import escalate_to_human
from backend.services.ticketing import create_ticket

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)

# ---------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------

class SessionState(BaseModel):
    """Tracks continuous validation errors to trigger automatic escalations."""
    consecutive_not_found: int = 0
    consecutive_invalid: int = 0


class ChatRequest(BaseModel):
    message: str
    intent: Optional[Intent] = None
    order_id: Optional[str] = None
    state: ConversationState = ConversationState.NEW
    # Session state moves inside the payload to remain horizontally scalable
    session_state: SessionState = Field(default_factory=SessionState)


class ChatResponse(BaseModel):
    intent: Intent
    state: ConversationState
    message: str
    order_id: Optional[str] = None
    escalated: bool = False
    ticket_id: Optional[str] = None
    session_state: SessionState = Field(default_factory=SessionState)


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def request_order_id(
    intent: Intent,
    message: str,
    session_state: SessionState
) -> ChatResponse:
    """Returns a dynamic validation response demanding an missing Order ID."""
    return ChatResponse(
        intent=intent,
        state=ConversationState.AWAITING_ORDER_ID,
        message=message,
        session_state=session_state
    )


# ---------------------------------------------------------
# Endpoints
# ---------------------------------------------------------

@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    """
    Main integrated chatbot endpoint.
    Processes NLP classifications, handles fallback states, 
    tracks sequence counts, and handles context routing.
    """
    # Initialize state from incoming transaction tracking
    current_state = request.session_state
    classification = classify_message(request.message)
    intent = classification.intent
    order_id = classification.order_id or request.order_id

    # 1. Manual Escalation Intent
    if intent == Intent.HUMAN_ESCALATION:
        escalation_result = escalate_to_human(order_id or "Unspecified User Request")
        return ChatResponse(
            intent=Intent.HUMAN_ESCALATION,
            state=ConversationState.TERMINATED,
            message=getattr(escalation_result, "message", "Escalating to a human representative."),
            order_id=order_id,
            escalated=True,
            session_state=current_state
        )

    # 2. Get Order Status Intent (With Escalation Threshold Triggers)
    if intent == Intent.GET_ORDER_STATUS:
        if not order_id:
            # Handle empty context validation limits
            current_state.consecutive_invalid += 1
            if current_state.consecutive_invalid >= 3:
                escalation_result = escalate_to_human("Repeated invalid order input")
                return ChatResponse(
                    intent=Intent.HUMAN_ESCALATION,
                    state=ConversationState.TERMINATED,
                    message="Escalating due to multiple invalid entry attempts.",
                    escalated=True,
                    session_state=current_state
                )
            return request_order_id(intent, "Please provide your order number so I can check its status.", current_state)

        # Call business fulfillment service
        result = get_order_status(order_id)
        msg = getattr(result, "message", str(result))

        # Check: Unfound order thresholds
        if msg == "We couldn't find that order.":
            current_state.consecutive_not_found += 1
            if current_state.consecutive_not_found >= 2:
                escalate_to_human("Repeated order not found")
                return ChatResponse(
                    intent=Intent.HUMAN_ESCALATION,
                    state=ConversationState.TERMINATED,
                    message="I'm having trouble finding your order record. Connecting you to an agent...",
                    escalated=True,
                    session_state=current_state
                )
        else:
            current_state.consecutive_not_found = 0

        # Check: Invalid entry thresholds
        if msg in ["Please enter an order number.", "That doesn't look like a valid order ID."]:
            current_state.consecutive_invalid += 1
            if current_state.consecutive_invalid >= 3:
                escalate_to_human("Repeated invalid order input")
                return ChatResponse(
                    intent=Intent.HUMAN_ESCALATION,
                    state=ConversationState.TERMINATED,
                    message="Connecting to an agent to verify your identity parameters.",
                    escalated=True,
                    session_state=current_state
                )
        else:
            current_state.consecutive_invalid = 0

        return ChatResponse(
            intent=intent,
            state=ConversationState.PROGRESS,
            message=msg,
            order_id=order_id,
            session_state=current_state
        )

    # 3. Initiate Returns Intent
    if intent == Intent.INITIATE_RETURN:
        if not order_id:
            return request_order_id(intent, "Please provide your order number so I can check return eligibility.", current_state)
        
        result = initiate_return(order_id)
        return ChatResponse(
            intent=intent,
            state=ConversationState.PROGRESS,
            message=getattr(result, "message", str(result)),
            order_id=order_id,
            session_state=current_state
        )

    # 4. Get Refund Status Intent
    if intent == Intent.GET_REFUND_STATUS:
        if not order_id:
            return request_order_id(intent, "Please provide your order number so I can check refund status.", current_state)
        
        result = get_refund_status(order_id)
        return ChatResponse(
            intent=intent,
            state=ConversationState.PROGRESS,
            message=getattr(result, "message", str(result)),
            order_id=order_id,
            session_state=current_state
        )

    # 5. Fallback Route
    fallback_message = handle_unmatched_query()
    return ChatResponse(
        intent=Intent.UNKNOWN if intent is None else intent,
        state=ConversationState.FALLBACK,
        message=getattr(fallback_message, "message", str(fallback_message)),
        order_id=order_id,
        session_state=current_state
    )


# ---------------------------------------------------------
# Legacy Utility Support Endpoints (From Original GET blocks)
# ---------------------------------------------------------

@router.get("/fallback")
def fallback_legacy():
    return handle_unmatched_query()

@router.get("/escalate")
def escalate_legacy(reason: str = "unspecified"):
    return escalate_to_human(reason)

@router.get("/ticket")
def ticket_legacy(issue: str):
    return create_ticket(issue)
