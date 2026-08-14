"use client";

import { useState } from "react";

type ItemType = "clothing" | "electronics" | "home" | "other" | null;

type ItemCondition =
  | "unused"
  | "used"
  | "damaged"
  | "wrong-item"
  | null;

type Step = "item" | "date" | "condition" | "result";

interface ReturnItemFlowProps {
  onBack: () => void;
  onHumanSupport: () => void;
}

export default function ReturnItemFlow({
  onBack,
  onHumanSupport,
}: ReturnItemFlowProps) {
  const [step, setStep] = useState<Step>("item");
  const [itemType, setItemType] = useState<ItemType>(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [condition, setCondition] = useState<ItemCondition>(null);
  const [eligible, setEligible] = useState<boolean | null>(null);

  function handleCheckEligibility() {
    const isEscalationCase =
      condition === "damaged" || condition === "wrong-item";

    setEligible(!isEscalationCase);
    setStep("result");
  }

  function handleStartOver() {
    setStep("item");
    setItemType(null);
    setDeliveryDate("");
    setCondition(null);
    setEligible(null);
  }

  return (
    <div>
      {/* Header */}
      <button
        type="button"
        onClick={onBack}
        className="mb-8 text-sm font-medium text-[var(--primary)] hover:underline"
      >
        ← Back to Returns & Refunds
      </button>

      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
          ↩️
        </div>

        <p className="mb-2 text-sm font-medium text-[var(--primary)]">
          Return an item
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Let&apos;s check your return eligibility
        </h1>

        <p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">
          Answer a few questions and we&apos;ll guide you through the next
          steps.
        </p>
      </div>

      {/* Step 1 — Item type */}
      {step === "item" && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            What type of item are you returning?
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { value: "clothing", label: "Clothing", icon: "👕" },
              { value: "electronics", label: "Electronics", icon: "💻" },
              { value: "home", label: "Home & Living", icon: "🏠" },
              { value: "other", label: "Other", icon: "📦" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setItemType(item.value as ItemType)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  itemType === item.value
                    ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                    : "border-[var(--border)] hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <span className="text-xl">{item.icon}</span>

                <span className="font-medium text-[var(--foreground)]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!itemType}
            onClick={() => setStep("date")}
            className="mt-6 w-full rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2 — Delivery date */}
      {step === "date" && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            When did you receive the item?
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            We use the delivery date to check whether the item is still within
            the return window.
          </p>

          <label
            htmlFor="delivery-date"
            className="mt-6 block text-sm font-medium text-[var(--foreground)]"
          >
            Delivery date
          </label>

          <input
            id="delivery-date"
            type="date"
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep("item")}
              className="flex-1 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-gray-50"
            >
              Back
            </button>

            <button
              type="button"
              disabled={!deliveryDate}
              onClick={() => setStep("condition")}
              className="flex-1 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Condition */}
      {step === "condition" && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            What condition is the item in?
          </h2>

          <div className="mt-5 space-y-3">
            {[
              {
                value: "unused",
                label: "Unused / unopened",
              },
              {
                value: "used",
                label: "Used but in good condition",
              },
              {
                value: "damaged",
                label: "Damaged",
              },
              {
                value: "wrong-item",
                label: "Wrong item received",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setCondition(option.value as ItemCondition)
                }
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                  condition === option.value
                    ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                    : "border-[var(--border)] hover:border-blue-300"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    condition === option.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {condition === option.value && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>

                <span className="text-sm font-medium text-[var(--foreground)]">
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep("date")}
              className="flex-1 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-gray-50"
            >
              Back
            </button>

            <button
              type="button"
              disabled={!condition}
              onClick={handleCheckEligibility}
              className="flex-1 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check eligibility
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Result */}
      {step === "result" && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          {eligible ? (
            <>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                ✓
              </div>

              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Your item appears eligible
              </h2>

              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Based on the information you provided, your item appears to
                qualify for return within Northstar&apos;s 30-day return
                window.
              </p>

              <div className="mt-6 rounded-xl bg-green-50 p-4">
                <p className="text-sm leading-6 text-green-900">
                  You can continue with the return process. Northstar may
                  verify the item when it is received.
                </p>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
              >
                Start return
              </button>
            </>
          ) : (
            <>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                👤
              </div>

              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                This return needs human review
              </h2>

              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                This type of issue requires individual assistance from
                Northstar Support.
              </p>

              <button
                type="button"
                onClick={onHumanSupport}
                className="mt-6 w-full rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
              >
                Talk to a human
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleStartOver}
            className="mt-3 w-full rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-gray-50"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}


