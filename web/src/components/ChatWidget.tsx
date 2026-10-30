"use client";

import { useRef, useState, useEffect } from "react";
import { MessageCircle, X, Send, TicketCheck, CheckCircle2, Sparkles } from "lucide-react";
import clsx from "clsx";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { extractSuggestions } from "@/lib/chatMarkdown";

type Message = { role: "user" | "assistant"; content: string };
type Mode = "ai" | "ticket" | "sent";

const WELCOME = "Hi, I'm the **Edwyz AI assistant**.\n\nI can help you with:\n- Our services and how we work\n- Case studies and industries\n- Getting a project started\n\nWhat would you like to know?";
const STARTER_CHIPS = ["What services do you offer?", "Show me case studies", "I have a project in mind"];
const AI_UNAVAILABLE = "I'm having trouble right now. Let me connect you with our team directly — they'll get back to you within 1 business day.";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("ai");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Ticket form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "ai") {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, aiLoading, mode]);

  function openTicketForm() {
    const context = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n");
    setTicketMsg(context);
    setMode("ticket");
  }

  async function sendAiMessage(override?: string) {
    const text = (override ?? input).trim();
    if (!text || aiLoading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: AI_UNAVAILABLE }]);
        setTimeout(openTicketForm, 1400);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: json.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: AI_UNAVAILABLE }]);
      setTimeout(openTicketForm, 1400);
    } finally {
      setAiLoading(false);
    }
  }

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    setTicketLoading(true);
    setTicketError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          requirements: ticketMsg.trim(),
          source: "chat_ticket",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setTicketError(json.error ?? "Submission failed. Please try again.");
        return;
      }
      setMode("sent");
    } catch {
      setTicketError("Something went wrong. Please try again.");
    } finally {
      setTicketLoading(false);
    }
  }

  function reset() {
    setMode("ai");
    setMessages([{ role: "assistant", content: WELCOME }]);
    setInput("");
    setName("");
    setEmail("");
    setTicketMsg("");
    setTicketError("");
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-cyan/60 focus:outline-none";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          role="dialog"
          aria-label="Edwyz AI assistant"
          className="chat-pop mb-4 flex h-[min(560px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/40"
        >

          {/* ── Header ── */}
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-surface-2 to-surface px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric to-cyan text-black">
                <Sparkles size={17} aria-hidden />
                {mode === "ai" && <span aria-hidden className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-2 bg-emerald-400" />}
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight text-foreground">
                  {mode === "sent" ? "Message Sent!" : mode === "ticket" ? "Leave a Message" : "Edwyz AI Assistant"}
                </p>
                <p className="text-xs text-muted">
                  {mode === "sent"
                    ? "Our team will follow up soon"
                    : mode === "ticket"
                    ? "We reply within 1 business day"
                    : "Online · replies instantly"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {mode === "ai" && (
                <button
                  onClick={openTicketForm}
                  title="Leave a message instead"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  <TicketCheck size={16} />
                </button>
              )}
              <button
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="text-muted transition-colors hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── AI chat mode ── */}
          {mode === "ai" && (
            <>
              <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto scroll-smooth p-4">
                {messages.map((m, i) => {
                  const isAssistant = m.role === "assistant";
                  const shown = isAssistant ? extractSuggestions(m.content) : { text: m.content, suggestions: [] as string[] };
                  const isLast = i === messages.length - 1;
                  const chips = isAssistant && isLast && !aiLoading ? (i === 0 ? STARTER_CHIPS : shown.suggestions) : [];
                  return (
                    <div key={i} className={clsx("chat-in flex flex-col gap-2", isAssistant ? "items-start" : "items-end")}>
                      <div
                        className={clsx(
                          "max-w-[88%] px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                          isAssistant
                            ? "rounded-2xl rounded-tl-sm border border-border bg-surface-2 text-foreground/90"
                            : "rounded-2xl rounded-tr-sm bg-gradient-to-r from-electric to-cyan font-medium text-black shadow-md shadow-cyan/10",
                        )}
                      >
                        {isAssistant ? <ChatMarkdown text={shown.text} /> : <span className="whitespace-pre-wrap break-words">{m.content}</span>}
                      </div>
                      {chips.length > 0 && (
                        <div className="flex max-w-full flex-wrap gap-1.5">
                          {chips.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => sendAiMessage(c)}
                              className="rounded-full border border-cyan/40 bg-cyan/5 px-3 py-1.5 text-xs font-medium text-cyan transition-colors hover:border-cyan hover:bg-cyan/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {aiLoading && (
                  <div className="chat-in flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-surface-2 px-3.5 py-3" aria-label="The assistant is typing">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-cyan"
                        style={{ animation: `bounce 1s ${i * 0.15}s infinite` }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); sendAiMessage(); }}
                className="flex items-center gap-2 border-t border-border p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-cyan/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !input.trim()}
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-electric to-cyan text-black disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}

          {/* ── Ticket form mode ── */}
          {mode === "ticket" && (
            <form onSubmit={submitTicket} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                className={inputClass}
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address *"
                className={inputClass}
              />
              <textarea
                required
                rows={6}
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                placeholder="How can we help? *"
                className={clsx(inputClass, "resize-none")}
              />
              {ticketError && <p className="text-xs text-red-400">{ticketError}</p>}
              <button
                type="submit"
                disabled={ticketLoading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-electric to-cyan py-2.5 text-sm font-semibold text-black disabled:opacity-60"
              >
                {ticketLoading ? "Sending…" : "Submit Ticket"}
              </button>
              <button
                type="button"
                onClick={() => setMode("ai")}
                className="text-center text-xs text-muted transition-colors hover:text-foreground"
              >
                ← Back to AI chat
              </button>
            </form>
          )}

          {/* ── Sent confirmation ── */}
          {mode === "sent" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
              <CheckCircle2 size={52} className="text-cyan" />
              <div>
                <p className="font-semibold text-foreground">Ticket created!</p>
                <p className="mt-1 text-sm text-muted">
                  We&apos;ll reply to <span className="font-medium text-foreground">{email}</span> within 1 business day.
                </p>
              </div>
              <button onClick={reset} className="text-sm text-cyan hover:underline">
                Start a new chat
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── FAB ── */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-electric to-cyan text-black shadow-lg shadow-cyan/20 transition-transform hover:scale-105"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chat-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chat-pop {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-in { animation: chat-in 0.22s ease-out both; }
        .chat-pop { animation: chat-pop 0.2s ease-out both; transform-origin: bottom right; }
        @media (prefers-reduced-motion: reduce) {
          .chat-in, .chat-pop { animation: none; }
        }
      `}</style>
    </div>
  );
}
