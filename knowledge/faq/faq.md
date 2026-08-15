# Northstar Customer Support — FAQ Knowledge Base

## 1. Order Status

### Where is my order?

Northstar can help customers check the status of an order.

The customer should provide their order number.

Example:

`ORD-12345`

### What order number should I provide?

Customers should provide the order number associated with their purchase.

Example:

`ORD-12345`

### What happens if I do not provide an order number?

Northstar asks the customer to provide their order number before attempting an order-status lookup.

---

## 2. Returns

### How do I return an item?

Northstar can guide the customer through the return process.

The MVP return flow covers:

1. Starting a return request.
2. Checking return eligibility.
3. Walking the customer through the required return steps.
4. Confirming whether the case can proceed automatically or requires human review.

### What information may be required for a return?

The customer may need to provide their order information so Northstar can determine the applicable return path.

### What happens if my return requires human review?

Northstar can escalate the request to a human support representative when individual review is required.

---

## 3. Refunds

### Where is my refund?

Northstar can help customers with refund-related questions.

The customer should provide their order number.

Example:

`ORD-12345`

### What happens if I do not provide an order number?

Northstar asks the customer to provide their order number before processing the refund-related request.

### Can every refund be resolved automatically?

No. Cases requiring individual review may be escalated to human support.

---

## 4. Human Support

### How do I talk to a human?

Customers can say:

`I want to talk to a human`

Northstar will escalate the request to a human support representative.

### What happens after escalation?

The MVP returns an escalation response containing:

- Escalation status
- Confirmation that the request was escalated
- A ticket ID

Example:

`TICKET-001`

### When should a request be escalated?

A request should be escalated when it requires individual review or cannot be safely resolved through the available automated support flow.

---

## 5. MVP Limitations

Northstar is currently an MVP.

The current implementation includes conversation flows and service stubs for demonstration and testing. It does not yet represent a fully connected production customer-support system.

Current limitations include:

- Order-status lookups are currently stubbed.
- Refund processing is not connected to a production payment/refund system.
- Human escalation generates a demonstration ticket ID rather than creating a ticket in a live support platform.
- The FAQ is currently a static knowledge-base document.
- No production customer authentication or account-level identity system is currently implemented.
- Production order, return, and refund databases are not connected.

---

## 6. Example Customer Questions

### Order Status

- Where is my order?
- What is the status of my order?
- Can you check my order?
- Where is `ORD-12345`?

### Returns

- I want to return an item.
- Can I return my order?
- How do I return something?
- Is my item eligible for return?

### Refunds

- Where is my refund?
- When will I get my refund?
- Can you check my refund?
- What happened to my refund?

### Human Support

- I want to talk to a human.
- Can I speak to a support representative?
- I need help from a person.
- Please connect me to an agent.


