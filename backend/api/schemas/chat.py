from pydantic import BaseModel
from typing import Optional
from backend.intents.definitions import Intent, ConversationState

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
