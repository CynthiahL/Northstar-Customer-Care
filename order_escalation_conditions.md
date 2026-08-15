# Order Status Escalation Conditions

Ticket: #7  
Branch: feature/order  
Owner: Member 2  
Purpose: Document when the order-status flow should hand off to a human agent.

This is documentation only. It does not implement the escalation system. Member 4 owns the actual escalation mechanism.

---

## Assumed inputs available to Member 4

Member 4 will have access to:

1. The raw customer message.
2. The result of the Ticket #6 function:

    get_order_status(order_number)

3. The Ticket #6 response shape:

    {
      "success": true,
      "message": null,
      "order": {
        "orderId": "ORD1001",
        "status": "Processing",
        "deliveryDate": "2026-06-27",
        "carrier": "USPS"
      },
      "allowRetry": false
    }

4. Conversation or session state, including:
   - number of failed order-number attempts,
   - number of not-found attempts,
   - whether the customer already asked for a human.

---

## Escalation condition 1: Customer explicitly asks for a human

Escalate immediately if the customer explicitly asks for a person, human, agent, representative, live support, callback, or similar human assistance.

Examples:

    I want to talk to a human.
    Can I speak to a person?
    Agent please.
    Give me a representative.
    I need live support.
    Can someone call me back?

Rule:

- Escalate immediately.
- Do not require the customer to complete the order-status lookup first.
- This condition overrides all other order-status flow logic.

---

## Escalation condition 2: Repeated order not found

Escalate when the customer receives the exact not-found fallback message for two consecutive correctly formatted order IDs in the same session.

Exact fallback message:

    We couldn't find that order.

Count a not-found attempt only when all of these are true:

1. The customer submitted an order ID.
2. The order ID matched the valid format:

    ^ORD\d{4}$

3. The Ticket #6 function returned:

    {
      "success": false,
      "message": "We couldn't find that order.",
      "order": null,
      "allowRetry": true
    }

Escalation trigger:

    consecutive_not_found_count >= 2

Reset rules:

- Reset the counter if a valid order is found.
- Reset the counter if the customer starts a new session.
- If the customer explicitly asks for a human, escalate immediately.

---

## Escalation condition 3: Repeated invalid order-number input

Escalate when the customer repeatedly cannot provide a usable order number.

This applies to repeated empty or malformed order-number attempts.

Empty input fallback:

    Please enter an order number.

Malformed input fallback:

    That doesn't look like a valid order ID.

Count one failed attempt each time Ticket #6 returns either of those exact fallback messages.

A combination of empty and malformed attempts counts toward the same failure streak.

Escalation trigger:

    consecutive_invalid_order_input_count >= 3

Reset rules:

- Reset the counter when the customer submits a correctly formatted order ID.
- Reset the counter if the customer starts a new session.
- If the customer explicitly asks for a human, escalate immediately.

---

## Escalation condition 4: Order data anomaly

Escalate when a found order contains data that violates the expected Order Status data rules.

Escalate if any of the following are true.

### 4.1 Invalid status value

The order status is not one of the exact allowed values:

    Processing
    Shipped
    Out for Delivery
    Delivered
    Cancelled

### 4.2 Missing delivery date for active delivery states

The order status is one of:

    Shipped
    Out for Delivery
    Delivered

but deliveryDate is missing, null, empty, or not a valid YYYY-MM-DD date.

### 4.3 Missing carrier for active delivery states

The order status is one of:

    Shipped
    Out for Delivery
    Delivered

but carrier is missing, null, or empty.

### 4.4 Delivered order has future delivery date

The order status is:

    Delivered

but deliveryDate is later than the current date.

### 4.5 Returned order ID does not match requested order ID

The requested order ID and the returned orderId do not match.

Example:

Customer asks for:

    ORD1001

But Ticket #6 returns:

    {
      "orderId": "ORD1002"
    }

This should escalate because it indicates a lookup or data integrity problem.

---

## Escalation condition 5: Order appears delayed or stuck

Escalate when an order is still in a non-terminal state but is already past its expected delivery date.

Non-terminal statuses:

    Processing
    Shipped
    Out for Delivery

Terminal statuses:

    Delivered
    Cancelled

Escalate when all of the following are true:

1. The order was found successfully.
2. The order status is one of:

    Processing
    Shipped
    Out for Delivery

3. The order has a valid deliveryDate in YYYY-MM-DD format.
4. The current date is after deliveryDate.

Date comparison rule:

- Compare dates only as calendar dates.
- Use YYYY-MM-DD format.

Escalation trigger:

    status in ["Processing", "Shipped", "Out for Delivery"]
    AND deliveryDate is valid
    AND currentDate > deliveryDate

---

## Non-escalation rules

Do not escalate only because:

1. An order was found successfully and has no data anomaly.
2. The order status is Cancelled.
3. The order status is Delivered.

These cases should still escalate if another escalation condition applies, such as:

- customer explicitly asks for a human,
- order data is anomalous,
- repeated not-found attempts occur,
- repeated invalid order-number attempts occur,
- order appears delayed or stuck.