# Northstar Customer Support MVP — Handover Documentation

## 1. Project Overview

Northstar Customer Support is an MVP customer-support system for Northstar Retail Co.

The MVP demonstrates automated support for:

* Order status
* Returns
* Refunds
* Human support escalation

The system consists of a Next.js frontend and a FastAPI backend.

---

## 2. Repository Structure

The project is split into two repositories/directories.

### Frontend

Technology:

* Next.js
* React
* TypeScript

The frontend provides the customer-facing support interface.

Main areas include:

* Customer support UI
* Conversation interface
* Intent selection
* Returns and refunds flows
* Human escalation display
* API client for communicating with the backend

### Backend

Technology:

* Python
* FastAPI

The backend provides:

* Chat endpoint
* Intent classification
* Conversation state handling
* Order service
* Returns service
* Refund service
* Human escalation service
* Fallback handling

---

## 3. Backend Entry Point

The FastAPI application is started through:

```text
backend/main.py
```

The chat API is exposed through the backend chat endpoint.

The backend receives customer messages, determines the relevant intent, maintains conversation state, and routes the request to the appropriate service.

---

## 4. Customer Conversation Flow

The main conversation flow is:

```text
Customer message
       ↓
Chat API
       ↓
Intent classification
       ↓
Conversation state
       ↓
Relevant service
       ↓
Chat response
       ↓
Frontend conversation UI
```

The frontend maintains the conversation and sends the previous intent, order ID, and conversation state when continuing a conversation.

This allows multi-step interactions such as:

```text
Customer: Where is my order?
Support: Please provide your order number.
Customer: ORD-12345
Support: Order status response
```

---

## 5. Order Status Flow

The order-status flow requires an order number.

Example:

```text
Customer: Where is my order?
Support: Please provide your order number.
Customer: ORD-12345
```

The backend extracts or receives the order ID and passes the request to the order service.

### Current implementation

The order-status service currently returns a demonstration/stub response rather than querying a production order-management system.

---

## 6. Returns Flow

The returns flow supports the MVP return journey.

The flow includes:

1. Customer requests a return.
2. The system determines the return intent.
3. The customer provides the required information.
4. Return eligibility is checked.
5. The system provides the next step when the return can proceed.
6. Cases requiring additional review can be escalated to human support.

The return service is implemented in:

```text
backend/services/returns_service.py
```

---

## 7. Refund Flow

The refund flow supports refund-related customer questions.

Example:

```text
Customer: Where is my refund?
Support: Please provide your order number.
Customer: ORD-12345
```

The refund service handles the refund-related request.

The refund service is located at:

```text
backend/services/refund_service.py
```

### Current implementation

The refund functionality is part of the MVP demonstration and is not connected to a production payment or refund-processing system.

---

## 8. Human Escalation

Customers can request human support directly.

Example:

```text
Customer: I want to talk to a human.
```

The system returns an escalation response containing:

* Escalation status
* Confirmation that the request was escalated
* Ticket ID

Example:

```text
TICKET-001
```

The escalation service is located at:

```text
backend/services/escalation_service.py
```

### Current implementation

The ticket ID is a demonstration value. The MVP does not currently create a ticket in a live customer-support platform.

---

## 9. Fallback Handling

Requests that cannot be confidently handled by the implemented workflows are routed through the fallback service.

The fallback service is located at:

```text
backend/services/fallback_service.py
```

The purpose of the fallback flow is to prevent unsupported requests from being incorrectly processed as supported customer-service actions.

---

## 10. FAQ Knowledge Base

The FAQ knowledge base is stored in:

```text
knowledge/faq/
```

Current documents include:

```text
knowledge/faq/faq.md
knowledge/faq/returns_refunds.md
```

The knowledge base covers:

* Order status
* Returns
* Refunds
* Human support
* General support
* MVP limitations
* Example customer questions

The current FAQ is a static Markdown knowledge base.

It is not yet connected to a retrieval or semantic-search system.

---

## 11. Important Backend Services

The main backend services are:

```text
backend/services/
├── escalation_service.py
├── fallback_service.py
├── order_service.py
├── refund_service.py
└── returns_service.py
```

These services separate the customer-support logic into individual workflows.

This structure allows the MVP to be extended without putting all business logic directly inside the chat endpoint.

---

## 12. Frontend Conversation Component

The persistent conversation interface is implemented in:

```text
frontend/src/components/chat/ChatConversations.tsx
```

The main page integrates the conversation component through:

```text
frontend/src/app/page.tsx
```

The frontend supports continuing conversations by sending relevant previous conversation information to the backend.

---

## 13. Git Branches

The main development branches include:

```text
main
frontend/ui
feature/chat-endpoint
feature/returns-refunds-backend
```

### Frontend

```text
frontend/ui
```

Contains the customer-facing interface and conversation UI.

### Returns and refunds backend

```text
feature/returns-refunds-backend
```

Contains the backend returns/refunds conversation logic, escalation changes, FAQ knowledge base, and handover documentation.

The lead is responsible for reviewing and merging the branches into the appropriate target branch.

---

## 14. Running the Backend

From the backend project directory, install the Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI application using the project's configured entry point.

The backend entry point is:

```text
backend/main.py
```

---

## 15. Running the Frontend

From the frontend project directory, install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Before committing frontend changes, verify the production build:

```bash
npm run build
```

A successful build should complete without TypeScript or Next.js build errors.

---

## 16. Current MVP Limitations

The following limitations should be understood when evaluating or demonstrating the MVP.

### Order data

Order-status lookup is currently stubbed/demo functionality.

There is no live connection to a production order-management database.

### Refund processing

Refund functionality is implemented for the MVP conversation flow but is not connected to a production payment or refund-processing system.

### Return processing

Return eligibility is based on the rules implemented in the MVP backend.

It does not currently integrate with a live order-management or warehouse system.

### Human escalation

Human escalation is represented by a demonstration ticket ID such as:

```text
TICKET-001
```

No live support-ticketing platform is currently connected.

### FAQ

The FAQ is currently stored as static Markdown documents.

There is no production retrieval-augmented generation or semantic-search system connected to the knowledge base.

### Authentication

The MVP does not currently implement production customer authentication or account-level identity verification.

### Production data

The system is not connected to live:

* Customer databases
* Order databases
* Payment systems
* Refund systems
* Warehouse systems
* Customer-support ticketing systems

### Production readiness

The project is an MVP demonstration and should not be treated as a production customer-support system without additional security, authentication, integrations, testing, monitoring, and deployment work.

---

## 17. Recommended Next Steps

Future development can include:

1. Connect order status to a real order-management system.
2. Connect refunds to a real payment/refund service.
3. Connect returns to order and inventory systems.
4. Replace demonstration escalation tickets with a real support-ticketing platform.
5. Connect the FAQ knowledge base to retrieval/search functionality.
6. Add production authentication and customer identity verification.
7. Add automated backend tests for each support workflow.
8. Add production logging and monitoring.
9. Add deployment configuration and environment management.
10. Conduct security and privacy review before production use.

---

## 18. MVP Acceptance Summary

The current MVP demonstrates the core customer-support concept through:

* Automated intent handling
* Order-status conversation flow
* Returns flow
* Refund flow
* Conversation-state continuation
* Human escalation
* Frontend/backend integration
* FAQ knowledge documentation
* Handover documentation

The system provides a foundation for further integration with Northstar's production customer-support infrastructure.

The documented limitations should be considered when evaluating the current MVP.


