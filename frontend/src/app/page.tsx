"use client";

import { useState } from "react";

type Intent = "order" | "returns" | "other" | null;

type ReturnsOption =
  | "return-item"
  | "refund"
  | "policy"
  | "human"
  | null;

export default function Home() {
  const [selectedIntent, setSelectedIntent] = useState<Intent>(null);
  const [returnsOption, setReturnsOption] = useState<ReturnsOption>(null);
  const [message, setMessage] = useState("");

  function handleIntent(intent: Exclude<Intent, null>) {
    setSelectedIntent(intent);
    setReturnsOption(null);
  }

  function handleBack() {
    setSelectedIntent(null);
    setReturnsOption(null);
  }

  function handleReturnsOption(option: Exclude<ReturnsOption, null>) {
    setReturnsOption(option);
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

        {/* Main chatbot area */}
        <section className="flex flex-1 flex-col justify-center py-10">
          <div className="mx-auto w-full max-w-3xl">
            {/* ------------------------------------------------ */}
            {/* MAIN INTENT SCREEN                               */}
            {/* ------------------------------------------------ */}
            {!selectedIntent && (
              <>
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

                {/* Intent cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleIntent("order")}
                    className="group rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
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
                    className="group rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
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

                {/* Other support */}
                <button
                  type="button"
                  onClick={() => handleIntent("other")}
                  className="mt-4 flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
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
              </>
            )}

            {/* ------------------------------------------------ */}
            {/* RETURNS & REFUNDS SCREEN                        */}
            {/* ------------------------------------------------ */}
            {selectedIntent === "returns" && (
              <div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="mb-8 text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  ← Back to support topics
                </button>

                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                    ↩️
                  </div>

                  <p className="mb-2 text-sm font-medium text-[var(--primary)]">
                    Returns & Refunds
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                    How can we help with your return?
                  </h1>

                  <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">
                    Choose an option below and we&apos;ll guide you through the
                    next steps.
                  </p>
                </div>

                {/* Returns options */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleReturnsOption("return-item")}
                    className="flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      ↩
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold text-[var(--foreground)]">
                        Return an item
                      </h2>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Find out whether your item is eligible and how to
                        return it.
                      </p>
                    </div>

                    <span className="text-[var(--primary)]">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReturnsOption("refund")}
                    className="flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      💰
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold text-[var(--foreground)]">
                        Check my refund
                      </h2>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Find out whether your refund has been processed.
                      </p>
                    </div>

                    <span className="text-[var(--primary)]">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReturnsOption("policy")}
                    className="flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      📋
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold text-[var(--foreground)]">
                        Return policy
                      </h2>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Learn about eligibility, time limits and item
                        conditions.
                      </p>
                    </div>

                    <span className="text-[var(--primary)]">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReturnsOption("human")}
                    className="flex w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      👤
                    </div>

                    <div className="flex-1">
                      <h2 className="font-semibold text-[var(--foreground)]">
                        Talk to a human
                      </h2>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Get help from Northstar customer support.
                      </p>
                    </div>

                    <span className="text-[var(--primary)]">→</span>
                  </button>
                </div>

                {/* Selected returns option */}
                {returnsOption && (
                  <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    {returnsOption === "return-item" && (
                      <>
                        <h3 className="font-semibold text-blue-950">
                          Return an item
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-blue-900">
                          We&apos;ll check the item type, purchase date and
                          condition to determine whether it qualifies for a
                          return.
                        </p>
                      </>
                    )}

                    {returnsOption === "refund" && (
                      <>
                        <h3 className="font-semibold text-blue-950">
                          Check my refund
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-blue-900">
                          Enter your order number to check whether your return
                          has been received, accepted or refunded.
                        </p>
                      </>
                    )}

                    {returnsOption === "policy" && (
                      <>
                        <h3 className="font-semibold text-blue-950">
                          Northstar return policy
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-blue-900">
                          Most eligible items can be returned within 30 days,
                          provided they meet Northstar&apos;s return
                          conditions.
                        </p>
                      </>
                    )}

                    {returnsOption === "human" && (
                      <>
                        <h3 className="font-semibold text-blue-950">
                          Human support
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-blue-900">
                          A support representative can help with cases that
                          require individual review.
                        </p>

                        <button
                          type="button"
                          className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
                        >
                          Contact Support
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------ */}
            {/* ORDER STATUS PLACEHOLDER                        */}
            {/* ------------------------------------------------ */}
            {selectedIntent === "order" && (
              <div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="mb-8 text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  ← Back to support topics
                </button>

                <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                    📦
                  </div>

                  <h1 className="text-2xl font-bold text-[var(--foreground)]">
                    Check your order
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Enter your order number and we&apos;ll help you check its
                    status.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      placeholder="Order number"
                      className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
                    >
                      Check status
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------ */}
            {/* OTHER / FALLBACK                                */}
            {/* ------------------------------------------------ */}
            {selectedIntent === "other" && (
              <div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="mb-8 text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  ← Back to support topics
                </button>

                <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                    💬
                  </div>

                  <h1 className="text-2xl font-bold text-[var(--foreground)]">
                    Tell us what you need
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Describe your question below. If we can&apos;t resolve it
                    automatically, we&apos;ll help you contact a support
                    representative.
                  </p>

                  <textarea
                    rows={5}
                    placeholder="Describe your issue..."
                    className="mt-6 w-full resize-none rounded-xl border border-[var(--border)] p-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    className="mt-4 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Free text input on main screen */}
            {!selectedIntent && (
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
            )}
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


