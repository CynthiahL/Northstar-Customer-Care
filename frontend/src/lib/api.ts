const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ChatIntent =
  | "get_order_status"
  | "initiate_return"
  | "get_refund_status"
  | "human_escalation"
  | "fallback";

export type ConversationState =
  | "new"
  | "awaiting_order_id"
  | "processing"
  | "resolved"
  | "escalated";

export type ChatRequest = {
  message: string;
  intent?: ChatIntent | null;
  order_id?: string | null;
  state?: ConversationState;
};

export type ChatResponse = {
  intent: ChatIntent;
  state: ConversationState;
  message: string;
  order_id?: string | null;
  escalated: boolean;
  ticket_id?: string | null;
};

export async function sendChatMessage(
  request: ChatRequest,
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: request.message,
      intent: request.intent ?? null,
      order_id: request.order_id ?? null,
      state: request.state ?? "new",
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }

  return response.json();
}


