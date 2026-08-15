"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Compass,
  Headphones,
  Loader2,
  Package,
  Paperclip,
  RotateCcw,
  Send,
  Star,
  Ticket,
  Truck,
} from "lucide-react"

/* -------------------------------------------------------------------------- */
/*  API Payload Interface Contracts                                           */
/* -------------------------------------------------------------------------- */

interface SessionState {
  consecutive_not_found: number
  consecutive_invalid: number
}

interface ChatRequest {
  message: string
  intent: string | null
  order_id: string | null
  state: string
  session_state: SessionState
}

interface ChatResponse {
  intent: string
  state: string
  message: string
  order_id: string | null
  escalated: boolean
  ticket_id: string | null
  session_state: SessionState
}

interface Message {
  id: string
  sender: "user" | "agent"
  text: string
  ticketId?: string | null
}

/* -------------------------------------------------------------------------- */
/*  Live System Endpoint Configurations                                       */
/* -------------------------------------------------------------------------- */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  const completePayload: ChatRequest = {
    message: payload.message,
    intent: payload.intent || null,
    order_id: payload.order_id || null,
    state: payload.state || "new",
    session_state: payload.session_state || {
      consecutive_not_found: 0,
      consecutive_invalid: 0,
    },
  }

  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(completePayload),
  })

    if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const dynamicMessage = errorBody?.detail && typeof errorBody.detail === "object"
      ? JSON.stringify(errorBody.detail)
      : errorBody?.detail;

    throw new Error(dynamicMessage || `Server Error: HTTP ${response.status}`);
  }


  return response.json()
}


/* -------------------------------------------------------------------------- */
/*  UI Config Arrays & Shared Data Setup                                      */
/* -------------------------------------------------------------------------- */

const QUICK_ACTIONS = [
  { id: "get_order_status", label: "Track Order", icon: Package }, // Changed track_order -> get_order_status
  { id: "initiate_return", label: "Return/Exchange", icon: RotateCcw }, // Changed return_exchange -> initiate_return
  { id: "get_order_status", label: "Shipping Info", icon: Truck },
  { id: "human_escalation", label: "Contact Agent", icon: Headphones }, // Changed contact_agent -> human_escalation
] as const


const SIDEBAR_LINKS = [
  { id: "kb", label: "Knowledge Base", icon: BookOpen },
  { id: "contact", label: "Contact Options", icon: Headphones },
  { id: "tickets", label: "My Tickets", icon: Ticket },
] as const

const RETURN_CATEGORIES = [
  { id: "apparel", label: "Apparel", emoji: "👕" },
  { id: "electronics", label: "Electronics", emoji: "💻" },
  { id: "home", label: "Home Goods", emoji: "🏠" },
  { id: "other", label: "Other", emoji: "📦" },
] as const

const RETURN_CONDITIONS = [
  { id: "unopened", label: "Unopened / Tags on", emoji: "🏷️", escalate: false },
  { id: "worn", label: "Opened / Lightly used", emoji: "👟", escalate: false },
  { id: "damaged", label: "Damaged / Defective", emoji: "💥", escalate: true },
  { id: "wrong", label: "Received Wrong Item", emoji: "📦", escalate: true },
] as const

let idCounter = 0
const uid = () => `m-${++idCounter}-${Date.now()}`

/* -------------------------------------------------------------------------- */
/*  Main Page Component Controller                                             */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      sender: "agent",
      text: "Hi, I'm the Northstar Support Assistant. I can track orders, start returns, share shipping details, or connect you with a person. How can I help today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [view, setView] = useState<"chat" | "return">("chat")
  const [activeLink, setActiveLink] = useState<string>("contact")
  const [conversationState, setConversationState] = useState<string>("new")
  const [currentIntent, setCurrentIntent] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  
  const [sessionState, setSessionState] = useState<SessionState>({
    consecutive_not_found: 0,
    consecutive_invalid: 0,
  })

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isSending, view])

  async function dispatch(rawMessage: string, forcedIntent: string | null = null) {
    const text = rawMessage.trim()
    if (!text || isSending) return

    setMessages((prev) => [...prev, { id: uid(), sender: "user", text }])
    setInput("")
    setIsSending(true)

    const payload: ChatRequest = {
      message: text,
      intent: forcedIntent ?? currentIntent,
      order_id: orderId,
      state: conversationState,
      session_state: sessionState,
    }

    try {
      const res = await sendChatMessage(payload)
      setSessionState(res.session_state)
      setConversationState(res.state)
      setCurrentIntent(res.intent)
      setOrderId(res.order_id)
      
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          sender: "agent",
          text: res.message,
          ticketId: res.escalated ? res.ticket_id : null,
        },
      ])

      if (res.state === "return_flow" || res.intent === "initiate_return") {
        setView("return")
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          sender: "agent",
          text: "A connection drop occurred with our core analytics server. Staging request retry loop.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  async function escalateReturn(conditionLabel: string) {
    setView("chat")
    setIsSending(true)

    const payload: ChatRequest = {
      message: `Return request - condition: ${conditionLabel}. Please connect me to an agent.`,
      intent: "human_escalation",
      order_id: orderId,
      state: "escalated",
      session_state: { ...sessionState, consecutive_invalid: sessionState.consecutive_invalid + 1 },
    }

    setMessages((prev) => [
      ...prev,
      { id: uid(), sender: "user", text: `I selected "${conditionLabel}" for my return.` },
    ])

    try {
      const res = await sendChatMessage(payload)
      setSessionState(res.session_state)
      setConversationState(res.state)
      setCurrentIntent(res.intent)
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          sender: "agent",
          text: res.message,
          ticketId: res.escalated ? res.ticket_id : null,
        },
      ])
    } catch (e) {
      console.error(e)
    } finally {
      setIsSending(false)
    }
  }

  async function completeReturn(summary: string) {
    setView("chat")
    await dispatch(summary, "initiate_return")
  }

  function handleQuickAction(id: string, label: string) {
    if (id === "initiate_return") {
      setView("return")
      return
    }
    dispatch(label, id)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    dispatch(input)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault()
      dispatch(input)
    }
  }

    return (
    <main className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-slate-50 px-4 py-6 md:flex">
        <div className="flex items-center gap-2 px-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Compass className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-emerald-900">Northstar</span>
        </div>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Support navigation">
          {SIDEBAR_LINKS.map((link) => {
            const LinkIcon = link.icon
            const active = activeLink === link.id
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => setActiveLink(link.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <LinkIcon className="size-4" />
                {link.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-800">Need more help?</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">Our team is available Mon-Fri, 8am-8pm ET.</p>
        </div>
      </aside>

      {/* Main Execution View Layer */}
      <section className="flex flex-1 items-stretch justify-center p-4 md:p-8">
        <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <header className="flex items-center gap-3 border-b border-border px-5 py-4 bg-white">
            <span className="relative flex size-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
              <Compass className="size-5" />
              <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-white bg-emerald-400" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-slate-900">
                Northstar Customer Support Assistant
              </h1>
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                Online • Typically replies instantly
              </p>
            </div>
            {view === "return" && (
              <button
                type="button"
                onClick={() => setView("chat")}
                className="ml-auto rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
              >
                Back to chat
              </button>
            )}
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-50/40 px-4 py-5 md:px-6">
            {view === "chat" ? (
              <ChatThread messages={messages} isSending={isSending} />
            ) : (
              <ReturnFlow onComplete={completeReturn} onEscalate={escalateReturn} />
            )}
          </div>

          {view === "chat" && (
            <footer className="border-t border-border bg-white p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.id}
                      type="button"
                      disabled={isSending}
                      onClick={() => handleQuickAction(action.id, action.label)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:border-emerald-500 hover:bg-emerald-50/20 hover:text-emerald-700 disabled:opacity-50 transition shadow-sm"
                    >
                      <Icon className="size-3.5" />
                      {action.label}
                    </button>
                  )
                })}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-3 border border-border rounded-xl px-4 py-2 bg-slate-50 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition">
                <button type="button" className="text-slate-400 hover:text-slate-600" aria-label="Attach a file">
                  <Paperclip className="size-4" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  aria-label="Message"
                  className="flex-1 bg-transparent text-sm outline-none text-slate-800 placeholder-slate-400"
                />
                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-40 transition"
                >
                  {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </button>
              </form>
            </footer>
          )}
        </div>
      </section>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/*  Subcomponent Block Components                                             */
/* -------------------------------------------------------------------------- */

function ChatThread({ messages, isSending }: { messages: Message[]; isSending: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
          {msg.sender === "agent" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500 border border-amber-100 shadow-sm">
              <Star className="size-4 fill-amber-400" />
            </div>
          )}
          <div className={`rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
            msg.sender === "user"
              ? "bg-emerald-600 text-white rounded-br-none"
              : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
          }`}>
            <p>{msg.text}</p>
            {msg.ticketId && (
              <span className="mt-2 flex w-fit items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 font-mono text-xs font-bold text-amber-700 border border-amber-200">
                <Ticket className="size-3.5" />
                Reference: {msg.ticketId}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function ReturnFlow({
  onComplete,
  onEscalate,
}: {
  onComplete: (summary: string) => void
  onEscalate: (conditionLabel: string) => void
}) {
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState<(typeof RETURN_CATEGORIES)[number] | null>(null)
  const [date, setDate] = useState("")
  const [condition, setCondition] = useState<(typeof RETURN_CONDITIONS)[number] | null>(null)

  const steps = ["Category", "Purchase date", "Condition", "Eligibility"]

  function pickCondition(c: (typeof RETURN_CONDITIONS)[number]) {
    setCondition(c)
    if (c.escalate) {
      onEscalate(c.label)
      return
    }
    setStep(3)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <ol className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-100 pb-4">
        {steps.map((label, i) => {
          const active = i === step
          const done = i < step
          return (
            <li key={label} className="flex items-center gap-1.5">
              <span className={`flex size-5 items-center justify-center rounded-full text-[10px] ${
                done ? "bg-emerald-600 text-white" : active ? "border-2 border-emerald-600 text-emerald-600" : "border border-slate-200"
              }`}>
                {done ? "✓" : i + 1}
              </span>
              <span className={active ? "text-emerald-700 font-bold" : ""}>{label}</span>
            </li>
          )
        })}
      </ol>

      {/* Step 0 */}
      {step === 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-800">What type of product item are you returning?</h2>
          <div className="grid grid-cols-2 gap-3">
            {RETURN_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { setCategory(c); setStep(1); }}
                className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition ${
                  category?.id === c.id ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-sm font-semibold text-slate-700">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus-within:border-emerald-500 transition">
              <Calendar className="size-4 text-slate-400" />
              <input
                type="date"
                value={date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-slate-700"
              />
            </div>
            <div className="flex justify-between gap-3 mt-2">
              <button type="button" onClick={() => setStep(0)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition">Back</button>
              <button type="button" disabled={!date} onClick={() => setStep(2)} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 transition">Continue</button>
            </div>
          </div>
        )}

        {/* Step 2: Item Physical Condition */}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-800">What is the condition of the return item?</h2>
            <div className="space-y-2">
              {RETURN_CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pickCondition(c)}
                  className={`w-full flex items-center justify-between border rounded-xl p-3.5 text-left text-sm font-medium transition ${
                    condition?.id === c.id ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{c.emoji}</span>
                    <span className="text-slate-700 font-semibold">{c.label}</span>
                  </div>
                  {c.escalate && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
                      <AlertTriangle className="size-3" /> Agent
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition w-fit mt-2">Back</button>
          </div>
        )}

        {/* Step 3: Eligibility & Submission Output */}
        {step === 3 && category && condition && (
          <div className="flex flex-col items-center gap-4 text-center py-2">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Item eligible for immediate return!</h2>
              <p className="mt-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl font-medium">
                {category.emoji} {category.label} • {condition.label} (Received: {date || "Recently"})
              </p>
            </div>
            <button
              type="button"
              onClick={() => onComplete(`Initiate automated return request for ${category.label} in ${condition.label} condition.`)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 shadow-md transition"
            >
              Confirm & Submit Return
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    )
  }
  
  function StepBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
    >
      Back
    </button>
  );
}

  