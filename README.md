# Northstar Chat Routing & Dynamic Escalation Service

This service powers an intelligent, schema-driven contextual customer support routing pipeline using FastAPI and Pydantic validation scopes. 

## 🏗️ Architectural Pattern: Service-Controller Separation
To prevent circular dependency cycles (`ImportError`) and isolate business layers from serialization boundaries:
* **Service Layers (`order_service`, `returns_service`, `refund_service`)**: Pure Python computation loops. They parse parameters, validate records against underlying index lookups, and return clean, atomic `str` payloads. They contain **zero** awareness of web routing protocols or API schema objects.
* **Controller Layer (`api/chat.py`)**: Manages downstream communication contracts. It intercepts NLP intent classifications, updates tracking state parameters, and packages execution strings into formal `ChatResponse` payload structures.

## 🎛️ Conversational Escalation Rules (MVP Logic)

The service relies on an encrypted state contract payload (`SessionState`) injected directly into inbound/outbound client handshakes. This ensures absolute stateless horizontality for server scalability.

| Validation Trigger Condition | Operational Threshold | Resulting State Action |
| :--- | :--- | :--- |
| **Explicit Human Callout** | Instant (`intent == "human_escalation"`) | Bypasses steps, logs `Ticket`, flags session as `escalated`. |
| **Unfound Orders (`consecutive_not_found`)** | `≥ 2` consecutive lookup drops | Generates automated fallback `Ticket`, halts AI loop. |
| **Malformed Input (`consecutive_invalid`)** | `≥ 3` invalid formatting blocks | Escalates transaction directly to a manual agent review queue. |
| **Unmapped Intentions** | Fallback Catch-all Route | Registers a blind support item tracking ID reference instantly. |

## 🚀 Interface Testing Parameters

### Local API Verification
1. Boot the ASGI local application process:
   ```bash
   uvicorn backend.main:app --reload
   ```
2. Navigate to your local router documentation: **`http://127.0.0`**

### Active JSON Transaction Structure Payload
When calling `POST /chat/`, utilize the strict `ConversationState` configuration parameters (`'new'`, `'awaiting_order_id'`, `'processing'`, `'resolved'`, `'escalated'`):

```json
{
  "message": "check status on order non_existent_id",
  "intent": "get_order_status",
  "order_id": "non_existent_id",
  "state": "processing",
  "session_state": {
    "consecutive_not_found": 1,
    "consecutive_invalid": 0
  }
}
```
