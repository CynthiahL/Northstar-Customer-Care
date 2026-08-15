"use client";

import { useState } from "react";
import {
  sendChatMessage,
  type ChatResponse,
} from "../../lib/api";

type ChatMessage = {
  id: number;
  role: "user" | "support";
  content: string;
  response?: ChatResponse;
};

export default function ChatConversation() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    setIsSending(true);
    setChatError(null);

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");

    try {
      /*
       * Find the most recent support response.
       * This allows the backend to continue a conversation
       * such as:
       *
       * "Where is my order?"
       *       ↓
       * "Please provide your order number."
       *       ↓
       * "ORD-12345"
       */
      const previousSupportMessage =
        [...messages]
          .reverse()
          .find((item) => item.role === "support");

      const response = await sendChatMessage({
        message: trimmedMessage,
        intent: previousSupportMessage?.response?.intent ?? null,
        order_id: previousSupportMessage?.response?.order_id ?? null,
        state: previousSupportMessage?.response?.state ?? "new",
      });

      const supportMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "support",
        content: response.message,
        response,
      };

      setMessages((current) => [...current, supportMessage]);
    } catch (error) {
      console.error("Chat request failed:", error);

      setChatError(
        error instanceof Error
          ? error.message
          : "Unable to contact customer support.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mt-8">
      <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
        Or type your question
      </p>

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="mb-6 space-y-4">
          {messages.map((chatMessage) => (
            <div
              key={chatMessage.id}
              className={
                chatMessage.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={
                  chatMessage.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-[var(--primary)] px-4 py-3 text-sm leading-6 text-white"
                    : "max-w-[85%] rounded-2xl rounded-bl-md border border-[var(--border)] bg-white px-5 py-4 shadow-sm"
                }
              >
                {chatMessage.role === "support" && (
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                    Northstar Support
                  </p>
                )}

                <p
                  className={
                    chatMessage.role === "support"
                      ? "mt-2 text-sm leading-7 text-[var(--foreground)]"
                      : ""
                  }
                >
                  {chatMessage.content}
                </p>

                {chatMessage.response?.escalated && (
                  <div className="mt-4 rounded-xl bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-950">
                      Human support
                    </p>

                    <div className="mt-3 space-y-2 text-sm text-amber-900">
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {chatMessage.response.state}
                      </p>

                      <p>
                        <span className="font-medium">Escalated:</span>{" "}
                        {chatMessage.response.escalated
                          ? "true"
                          : "false"}
                      </p>

                      {chatMessage.response.ticket_id && (
                        <p>
                          <span className="font-medium">Ticket ID:</span>{" "}
                          {chatMessage.response.ticket_id}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-[var(--border)] bg-white px-5 py-4 shadow-sm">
                <p className="text-sm text-[var(--muted)]">
                  Checking with Northstar Support...
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {chatError && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm leading-6 text-red-900">
            {chatError}
          </p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type your question..."
            aria-label="Type your support question"
            disabled={isSending}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-gray-400 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}