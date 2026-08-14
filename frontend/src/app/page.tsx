"use client";

import { useState } from "react";

type Intent = "order" | "returns" | "other" | null;

export default function Home() {
  const [selectedIntent, setSelectedIntent] = useState<Intent>(null);
  const [message, setMessage] = useState("");

  function handleIntent(intent: Exclude<Intent, null>) {
    setSelectedIntent(intent);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    console.log("Customer message:", message);

    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <div>
            <p className="text-lg font-bold tracking-tight text-[var(--foreground)]">
              Northstar
            </p>
            <p className="text-sm text-[var(--muted)]">Customer Support</p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-[var(--muted)] shadow-sm ring-1 ring-[var(--border)]">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Support online
          </div>
        </header>

        {/* Chat area */}
        <section className="flex flex-1 flex-col justify-center py-10">
          <div className="mx-auto w-full max-w-3xl">
            {/* Welcome message */}
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                👋
              </div>

              <p className="mb-2 text-sm font-medium text-[var(--primary)]">
                Northstar Support
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Hello! How can we help you today?
              </h1>

              <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">
                Choose a support topic below, or describe your question and
                we&apos;ll help you find the right answer.
              </p>
            </div>

            {/* Intent selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleIntent("order")}
                className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md ${
                  selectedIntent === "order"
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-[var(--border)]"
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  📦
                </div>

                <h2 className="font-semibold text-[var(--foreground)]">
                  Order Status
                </h2>

                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  Check where your order is and whether it has shipped.
                </p>

                <span className="mt-4 inline-flex text-sm font-medium text-[var(--primary)]">
                  Check my order →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleIntent("returns")}
                className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md ${
                  selectedIntent === "returns"
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-[var(--border)]"
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  ↩️
                </div>

                <h2 className="font-semibold text-[var(--foreground)]">
                  Returns & Refunds
                </h2>

                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  Learn how to return an item or check your refund status.
                </p>

                <span className="mt-4 inline-flex text-sm font-medium text-[var(--primary)]">
                  Get returns help →
                </span>
              </button>
            </div>

            {/* Other support option */}
            <button
              type="button"
              onClick={() => handleIntent("other")}
              className={`mt-4 flex w-full items-center justify-between rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md ${
                selectedIntent === "other"
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-[var(--border)]"
              }`}
            >
              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  Something else
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  Tell us what you need help with.
                </p>
              </div>

              <span className="text-xl text-[var(--primary)]">→</span>
            </button>

            {/* Selected intent feedback */}
            {selectedIntent && (
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  {selectedIntent === "order" &&
                    "You selected Order Status. The order support flow will appear here."}

                  {selectedIntent === "returns" &&
                    "You selected Returns & Refunds. The returns support flow will appear here."}

                  {selectedIntent === "other" &&
                    "Tell us what you need help with and we’ll guide you to the right support."}
                </p>
              </div>
            )}

            {/* Free-text input */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
                Or type your question
              </p>

              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="e.g. Where is my order?"
                    aria-label="Type your support question"
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] pt-5 text-center text-xs text-[var(--muted)]">
          Northstar Retail Co. • Customer Support
        </footer>
      </div>
    </main>
  );
}


