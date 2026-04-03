"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { ChatLeadData } from "@/lib/validation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "greeting" | "capture" | "response";
type Intent = "website" | "ai-setup" | "pricing" | "browsing";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GREETING = "Hey, I'm Saul. What can I help you figure out?";

const QUICK_REPLIES: { label: string; intent: Intent }[] = [
  { label: "I need a website", intent: "website" },
  { label: "Tell me about AI setups", intent: "ai-setup" },
  { label: "What do you charge?", intent: "pricing" },
  { label: "Just browsing", intent: "browsing" },
];

const RESPONSES: Record<Intent, string> = {
  website:
    "Nice. We build custom websites from $5,000, mobile-first and SEO-optimized. Typically 2-4 weeks to launch. Want to walk through what you actually need? [Build Your Proposal](/build-your-proposal)",
  "ai-setup":
    "OpenClaw deployments, self-hosted on your infrastructure. Starter at $500, Pro at $2,500. Your data stays yours, not on a third-party server. [See AI packages](/ai-automation)",
  pricing:
    "Depends on what you need. Websites from $5K, AI setups from $500, full marketing engine at $3,500 setup plus $1,000/mo. Build a proposal and we'll give you an exact number. [Build Your Proposal](/build-your-proposal)",
  browsing:
    "No problem. Poke around. If something sparks a question, I'm here. Check out the [portfolio](/portfolio) to see what we've built.",
};

// ─── Markdown link parser ─────────────────────────────────────────────────────

function parseLinks(text: string): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        className="text-cyan underline underline-offset-2 hover:text-cyan/80 transition-colors"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`
          max-w-[85%] px-4 py-3 text-base leading-relaxed
          ${
            isAssistant
              ? "bg-graphite text-cloud rounded-2xl rounded-tl-none"
              : "bg-cyan/15 border border-cyan/30 text-cloud rounded-2xl rounded-tr-none"
          }
        `}
      >
        {isAssistant ? parseLinks(message.content) : message.content}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("greeting");
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [transcript, setTranscript] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when transcript changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Focus close button when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Escape key closes widget
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function openWidget() {
    setIsOpen(true);
  }

  function closeWidget() {
    setIsOpen(false);
  }

  function handleQuickReply(label: string, intent: Intent) {
    setSelectedIntent(intent);
    setTranscript((prev) => [...prev, { role: "user", content: label }]);
    // Add capture prompt as assistant message
    setTranscript((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Just need your name and email first so I can follow up if needed.",
      },
    ]);
    setStep("capture");
  }

  function validateCapture(): boolean {
    let valid = true;
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError("");
    }
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email");
      valid = false;
    } else {
      setEmailError("");
    }
    return valid;
  }

  async function handleCaptureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateCapture() || !selectedIntent) return;

    const responseText = RESPONSES[selectedIntent];

    // Build full transcript including the response we're about to show
    const fullTranscript: Message[] = [
      ...transcript,
      { role: "assistant", content: responseText },
    ];

    setTranscript(fullTranscript);
    setStep("response");
    setIsSubmitting(true);
    setSubmitError("");

    const payload: ChatLeadData = {
      name: name.trim(),
      email: email.trim(),
      chatTranscript: fullTranscript,
      initialIntent: selectedIntent,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setSubmitError(
          (json as { error?: string }).error ||
            "Couldn't send your details. You can still browse the site."
        );
      } else {
        setLeadSubmitted(true);
      }
    } catch {
      setSubmitError(
        "Network error. Your details weren't saved, but feel free to look around."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Bubble trigger */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full bg-cyan/30 animate-ping"
            aria-hidden="true"
          />
          <button
            onClick={openWidget}
            aria-label="Open chat with Saul"
            className="relative flex items-center justify-center w-14 h-14 bg-cyan rounded-full shadow-lg hover:bg-cyan/90 hover:shadow-[0_0_20px_rgba(0,212,170,0.4)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian cursor-pointer"
          >
            {/* MessageCircle icon */}
            <svg
              className="w-6 h-6 text-obsidian"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Saul"
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-[400px] flex flex-col"
          style={{ maxHeight: "520px" }}
        >
          <div className="flex flex-col h-full bg-carbon/95 backdrop-blur-xl border border-wire/60 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-wire/60 shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Status dot */}
                <span
                  className="w-2 h-2 rounded-full bg-cyan shrink-0"
                  aria-hidden="true"
                />
                <span className="font-display font-semibold text-cloud text-sm">
                  Chat with Saul
                </span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeWidget}
                aria-label="Close chat"
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate hover:text-cloud hover:bg-graphite transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
              aria-live="polite"
              aria-atomic="false"
            >
              {transcript.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}

              {/* Quick reply pills (shown after greeting, before capture) */}
              {step === "greeting" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.map(({ label, intent }) => (
                    <button
                      key={intent}
                      onClick={() => handleQuickReply(label, intent)}
                      className="border border-cyan/40 text-cyan text-sm rounded-full px-4 py-2 hover:bg-cyan/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Name + email capture form */}
              {step === "capture" && (
                <div className="pt-1">
                  <form
                    onSubmit={handleCaptureSubmit}
                    className="space-y-3"
                    noValidate
                  >
                    <Input
                      id="chat-name"
                      name="chat-name"
                      label="Name"
                      placeholder="Your name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={nameError}
                      className="text-sm py-2"
                    />
                    <Input
                      id="chat-email"
                      name="chat-email"
                      type="email"
                      label="Email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={emailError}
                      className="text-sm py-2"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner className="w-3.5 h-3.5" />
                          Sending...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {/* Submit error (shown in response step) */}
              {step === "response" && submitError && (
                <div className="text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">
                  {submitError}
                </div>
              )}

              {/* Submitting indicator */}
              {step === "response" && isSubmitting && (
                <div className="flex items-center gap-2 text-xs text-slate">
                  <Spinner className="w-3 h-3" />
                  Saving your details...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Free-form input row */}
            <div className="px-4 py-3 border-t border-wire/60 shrink-0">
              {leadSubmitted ? (
                <p className="text-xs text-cyan text-center py-1">
                  Thanks. We'll be in touch.
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={
                      step === "response"
                        ? "Ask a follow-up..."
                        : "Or type a question..."
                    }
                    disabled={step !== "response" || isSubmitting}
                    aria-label="Free-form message"
                    className="flex-1 bg-graphite border border-wire rounded-lg px-3 py-2 text-sm text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        step === "response" &&
                        !isSubmitting
                      ) {
                        const target = e.currentTarget;
                        const value = target.value.trim();
                        if (!value) return;
                        setTranscript((prev) => [
                          ...prev,
                          { role: "user", content: value },
                        ]);
                        target.value = "";
                      }
                    }}
                  />
                  <button
                    aria-label="Send message"
                    disabled={step !== "response" || isSubmitting}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan/15 border border-cyan/30 text-cyan hover:bg-cyan/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    onClick={(e) => {
                      const input = (
                        e.currentTarget.previousElementSibling as HTMLInputElement | null
                      );
                      if (!input) return;
                      const value = input.value.trim();
                      if (!value || step !== "response" || isSubmitting) return;
                      setTranscript((prev) => [
                        ...prev,
                        { role: "user", content: value },
                      ]);
                      input.value = "";
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pb-2 shrink-0">
              <p className="text-dim text-xs text-center">Powered by AskSaul</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
