"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { ChatLeadData } from "@/lib/validation";

type Step = "chat" | "capture";
type HandoffIntent = "waste-demo" | "automation-map" | "book-demo" | "send-context";
type ChatAction = {
  id: "waste-demos" | "automation-map" | "book-demo" | "send-context";
  label: string;
  description?: string;
  kind: "link" | "capture";
  href?: string;
  handoffIntent?: HandoffIntent;
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BOOKING_URL =
  "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-3d837e4b-c899-44ff-b612-275f498c2128";

const GREETING =
  "Hey, I'm Saul. Ask me anything about voice agents, Automation Maps, websites, follow-up systems, or what Gregory should build first.";

const QUICK_PROMPTS = [
  "Show me waste voice-agent demos",
  "Help me map what to automate",
  "What can Saul do for missed calls?",
  "I want to book a demo",
];

const DEFAULT_ACTIONS: ChatAction[] = [
  {
    id: "waste-demos",
    label: "Test live waste demos",
    description: "Dumpster, roll-off, and junk-removal voice-agent examples.",
    kind: "link",
    href: "/voice-agents/waste#live-demos",
    handoffIntent: "waste-demo",
  },
  {
    id: "automation-map",
    label: "Get Automation Map",
    description: "3-minute intake to find your highest-leverage workflows.",
    kind: "link",
    href: "/build-your-proposal",
    handoffIntent: "automation-map",
  },
  {
    id: "book-demo",
    label: "Book a demo",
    description: "Send this context, then open Gregory's calendar.",
    kind: "capture",
    handoffIntent: "book-demo",
  },
];

function parseLinks(text: string): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <a key={match.index} href={match[2]} className="text-cyan underline underline-offset-2 hover:text-cyan/80 transition-colors">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-base leading-relaxed ${
          isAssistant
            ? "bg-graphite text-cloud rounded-2xl rounded-tl-none"
            : "bg-cyan/15 border border-cyan/30 text-cloud rounded-2xl rounded-tr-none"
        }`}
      >
        {isAssistant ? parseLinks(message.content) : message.content}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("chat");
  const [captureIntent, setCaptureIntent] = useState<HandoffIntent>("send-context");
  const [suggestedActions, setSuggestedActions] = useState<ChatAction[]>(DEFAULT_ACTIONS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [transcript, setTranscript] = useState<Message[]>([{ role: "assistant", content: GREETING }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [bookingUrl, setBookingUrl] = useState(BOOKING_URL);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, suggestedActions, step]);

  useEffect(() => {
    if (isOpen) setTimeout(() => closeButtonRef.current?.focus(), 50);
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function validateCapture(): boolean {
    let valid = true;
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else setNameError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email");
      valid = false;
    } else setEmailError("");

    return valid;
  }

  async function sendFreeformMessage(override?: string) {
    const value = (override ?? currentMessage).trim();
    if (!value || isSubmitting || isThinking) return;

    const nextTranscript: Message[] = [...transcript, { role: "user", content: value }];
    setTranscript(nextTranscript);
    setCurrentMessage("");
    setIsThinking(true);
    setSubmitError("");
    setStep("chat");

    try {
      const res = await fetch("/api/chat/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextTranscript }),
      });
      if (!res.ok) throw new Error("chat response failed");

      const json = (await res.json()) as { reply?: string; actions?: ChatAction[] };
      setTranscript((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            json.reply ||
            "I can help route you. Tell me if the leak is missed calls, slow follow-up, admin drag, or website conversion.",
        },
      ]);
      setSuggestedActions(json.actions?.length ? json.actions : DEFAULT_ACTIONS);
    } catch {
      setTranscript((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't reach the live chat brain, but I can still point you around: start with [Get Your Automation Map](/build-your-proposal), test [waste voice demos](/voice-agents/waste), or send Gregory this chat context.",
        },
      ]);
      setSuggestedActions(DEFAULT_ACTIONS);
    } finally {
      setIsThinking(false);
    }
  }

  function handleAction(action: ChatAction) {
    if (action.kind === "link" && action.href) {
      window.location.href = action.href;
      return;
    }

    const intent = action.handoffIntent ?? "send-context";
    setCaptureIntent(intent);
    setStep("capture");
    setLeadSubmitted(false);
    setSubmitError("");
    setTranscript((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          intent === "book-demo"
            ? "Yes. I can send Gregory this chat context first, then open the demo booking link. What name and email should he use?"
            : "Absolutely. I can send Gregory this chat context so he has the details before following up. What name and email should he use?",
      },
    ]);
  }

  async function handleCaptureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateCapture()) return;

    const successText =
      captureIntent === "book-demo"
        ? "Got it. I sent this context to Gregory. You can book the demo now."
        : "Got it. I sent this context to Gregory so he can follow up with the right details.";

    const fullTranscript: Message[] = [...transcript, { role: "assistant", content: successText }];
    setTranscript(fullTranscript);
    setIsSubmitting(true);
    setSubmitError("");

    const payload: ChatLeadData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      businessName: businessName.trim() || undefined,
      sourcePath: window.location.pathname,
      chatTranscript: fullTranscript,
      initialIntent: captureIntent,
      handoffIntent: captureIntent,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setSubmitError((json as { error?: string }).error || "Couldn't send your details. You can still browse the site.");
      } else {
        const json = (await res.json().catch(() => ({}))) as { bookingUrl?: string };
        setBookingUrl(json.bookingUrl || BOOKING_URL);
        setLeadSubmitted(true);
        setStep("chat");
        setSuggestedActions(
          captureIntent === "book-demo"
            ? [
                {
                  id: "book-demo",
                  label: "Open booking calendar",
                  description: "Pick a time with Gregory.",
                  kind: "link",
                  href: json.bookingUrl || BOOKING_URL,
                  handoffIntent: "book-demo",
                },
              ]
            : DEFAULT_ACTIONS
        );
      }
    } catch {
      setSubmitError("Network error. Your details weren't saved, but you can keep chatting or use the Automation Map.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <span className="absolute inset-0 rounded-full bg-cyan/30 animate-ping" aria-hidden="true" />
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open chat with Saul"
            className="relative flex items-center justify-center w-14 h-14 bg-cyan rounded-full shadow-lg hover:bg-cyan/90 hover:shadow-[0_0_20px_rgba(0,212,170,0.4)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian cursor-pointer"
          >
            <svg className="w-6 h-6 text-obsidian" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      )}

      {isOpen && (
        <div role="dialog" aria-modal="true" aria-label="Chat with Saul" className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-[420px] flex flex-col" style={{ maxHeight: "620px" }}>
          <div className="flex flex-col h-full bg-carbon/95 backdrop-blur-xl border border-wire/60 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-wire/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan shrink-0" aria-hidden="true" />
                <span className="font-display font-semibold text-cloud text-sm">Chat with Saul</span>
                <span className="rounded-full border border-cyan/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan">Live assistant</span>
              </div>
              <button ref={closeButtonRef} onClick={() => setIsOpen(false)} aria-label="Close chat" className="flex items-center justify-center w-7 h-7 rounded-lg text-slate hover:text-cloud hover:bg-graphite transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 cursor-pointer">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" aria-live="polite" aria-atomic="false">
              {transcript.map((msg, i) => <MessageBubble key={i} message={msg} />)}

              {transcript.length === 1 && step === "chat" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_PROMPTS.map((label) => (
                    <button key={label} onClick={() => void sendFreeformMessage(label)} className="border border-cyan/40 text-cyan text-sm rounded-full px-4 py-2 hover:bg-cyan/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 cursor-pointer">
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {step === "chat" && suggestedActions.length > 0 && transcript.length > 1 && (
                <div className="grid gap-2 pt-1">
                  {suggestedActions.map((action) => (
                    <button key={action.id} onClick={() => handleAction(action)} className="text-left rounded-2xl border border-wire bg-obsidian/55 p-3 hover:border-cyan/35 hover:bg-cyan/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60">
                      <span className="block text-sm font-semibold text-cloud">{action.label}</span>
                      {action.description ? <span className="mt-1 block text-xs leading-relaxed text-slate">{action.description}</span> : null}
                    </button>
                  ))}
                </div>
              )}

              {step === "capture" && (
                <div className="pt-1">
                  <form onSubmit={handleCaptureSubmit} className="space-y-3" noValidate>
                    <Input id="chat-name" name="chat-name" label="Name" placeholder="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={nameError} className="text-sm py-2" />
                    <Input id="chat-email" name="chat-email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} className="text-sm py-2" />
                    <Input id="chat-phone" name="chat-phone" type="tel" label="Phone (optional)" placeholder="Best callback number" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="text-sm py-2" />
                    <Input id="chat-business" name="chat-business" label="Business (optional)" placeholder="Company / market" autoComplete="organization" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="text-sm py-2" />
                    <div className="grid grid-cols-2 gap-2">
                      <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => setStep("chat")}>Keep chatting</Button>
                      <Button type="submit" variant="primary" size="sm" className="w-full" disabled={isSubmitting}>{isSubmitting ? <><Spinner className="w-3.5 h-3.5" />Sending...</> : "Send context"}</Button>
                    </div>
                  </form>
                </div>
              )}

              {submitError && <div className="text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">{submitError}</div>}
              {isSubmitting && <div className="flex items-center gap-2 text-xs text-slate"><Spinner className="w-3 h-3" />Saving your details...</div>}
              {isThinking && <div className="flex items-center gap-2 text-xs text-slate"><Spinner className="w-3 h-3" />Saul is thinking...</div>}
              {leadSubmitted && (
                <div className="rounded-2xl border border-cyan/25 bg-cyan/10 p-3 text-sm text-cloud">
                  Context sent to Gregory. {captureIntent === "book-demo" ? <a href={bookingUrl} className="font-semibold text-cyan underline underline-offset-2">Open the booking calendar.</a> : "He has the transcript now."}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-wire/60 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={step === "capture" ? "Finish or cancel the form above..." : "Ask Saul anything..."}
                  disabled={step === "capture" || isSubmitting || isThinking}
                  aria-label="Ask Saul a question"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-1 bg-graphite border border-wire rounded-lg px-3 py-2 text-sm text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && step !== "capture" && !isSubmitting && !isThinking) {
                      e.preventDefault();
                      void sendFreeformMessage();
                    }
                  }}
                />
                <button aria-label="Send message" disabled={step === "capture" || isSubmitting || isThinking || !currentMessage.trim()} className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan/15 border border-cyan/30 text-cyan hover:bg-cyan/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" onClick={() => void sendFreeformMessage()}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="pb-2 shrink-0"><p className="text-dim text-xs text-center">Powered by AskSaul</p></div>
          </div>
        </div>
      )}
    </>
  );
}
