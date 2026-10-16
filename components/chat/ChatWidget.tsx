"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUp, Mic, MicOff, MessageSquare, PhoneOff, RotateCcw, X } from "lucide-react";
import { useSalesAgent, type ChatMessage } from "./useSalesAgent";
import type { ChatAction } from "@/lib/sales-agent/actions";

const TEASER_KEY = "asksaul-chat-teaser-dismissed";

function startersFor(path: string): { greeting: string; chips: string[] } {
  if (path.startsWith("/voice-agents/roofing"))
    return {
      greeting: "Hey, I'm Saul, the AI you'd be hiring. Ask me how I'd handle your storm calls, or what the founding program includes.",
      chips: ["How would you handle a hail-day rush?", "What does it cost?", "Is my city still open?"],
    };
  if (path.startsWith("/voice-agents/hvac"))
    return {
      greeting: "Hey, I'm Saul, the AI you'd be hiring. Ask me how I'd handle a 9 p.m. no-heat call, or what the founding program includes.",
      chips: ["How do you handle a no-heat call?", "What does it cost?", "Is my city still open?"],
    };
  if (path.startsWith("/voice-agents/waste"))
    return {
      greeting: "Hey, I'm Saul. I answer dumpster and roll-off calls for operators. Want to see how the quote intake works?",
      chips: ["How does dumpster intake work?", "Can I test a live demo?", "What does it cost?"],
    };
  if (path.startsWith("/voice-agents") || path.startsWith("/audit"))
    return {
      greeting: "Hey, I'm Saul, the AI that answers the calls your crew can't. This chat is a live demo. What do you want to know?",
      chips: ["What's the founding program?", "What does it cost?", "How does the free audit work?"],
    };
  return {
    greeting: "Hey, I'm Saul, AskSaul's AI assistant. Tell me what your business does and what's slowing you down, and I'll point you to what fits.",
    chips: ["I run a roofing or HVAC company", "What can you automate for us?", "I want to talk to Gregory"],
  };
}

function renderInline(text: string, keyBase: string) {
  // **bold**, [label](url), bare /paths, and phone numbers.
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|(?<![\w.])\/[a-z0-9][a-z0-9\-/#]*[a-z0-9]|\(\d{3}\) \d{3}-\d{4}|\d{3}\.\d{3}\.\d{4})/gi;
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const tok = m[0];
    const key = `${keyBase}-${i}`;
    if (tok.startsWith("**")) out.push(<strong key={key} className="font-semibold text-cloud">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("[")) {
      const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/) ?? [];
      out.push(
        <a key={key} href={href} className="font-medium text-cyan underline underline-offset-2" {...(href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {label}
        </a>
      );
    } else if (tok.startsWith("/")) out.push(<Link key={key} href={tok} className="font-medium text-cyan underline underline-offset-2">{tok}</Link>);
    else out.push(<a key={key} href={`tel:+1${tok.replace(/\D/g, "")}`} className="font-medium text-cyan underline underline-offset-2">{tok}</a>);
    last = i + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, b) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l));
        if (isList)
          return (
            <ul key={b} className="space-y-1.5">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                  <span>{renderInline(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ""), `${b}-${i}`)}</span>
                </li>
              ))}
            </ul>
          );
        return <p key={b}>{lines.map((l, i) => <span key={i}>{i > 0 && <br />}{renderInline(l, `${b}-${i}`)}</span>)}</p>;
      })}
    </div>
  );
}

function ActionButtons({ actions }: { actions: ChatAction[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((a) => {
        const cls = `inline-flex items-center rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
          a.primary ? "bg-cyan text-obsidian hover:bg-cyan/90" : "border border-cyan/40 text-cyan hover:bg-cyan/10"
        }`;
        if (a.external || a.href.startsWith("tel:"))
          return (
            <a key={a.id} href={a.href} className={cls} {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {a.label}
            </a>
          );
        return (
          <Link key={a.id} href={a.href} className={cls}>
            {a.label}
          </Link>
        );
      })}
    </div>
  );
}

function Bubble({ m }: { m: ChatMessage }) {
  if (m.role === "user")
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-cyan px-4 py-2.5 text-[15px] leading-relaxed text-obsidian">{m.text}</div>
      </div>
    );
  return (
    <div className="flex gap-2.5">
      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan/15 font-display text-xs font-bold text-cyan ring-1 ring-cyan/30" aria-hidden="true">
        S
      </span>
      <div className="min-w-0 max-w-[88%]">
        <div className={`rounded-2xl rounded-tl-md px-4 py-2.5 text-[15px] leading-relaxed ${m.notice ? "bg-warning/10 text-slate" : "bg-graphite text-slate"}`}>
          <RichText text={m.text} />
          {m.streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-cyan align-middle" aria-hidden="true" />}
        </div>
        {!m.streaming && m.actions && m.actions.length > 0 && <ActionButtons actions={m.actions} />}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-2.5" aria-label="Saul is typing">
      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan/15 font-display text-xs font-bold text-cyan ring-1 ring-cyan/30">S</span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-graphite px-4 py-3.5">
        {[0, 150, 300].map((d) => (
          <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-dim" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [input, setInput] = useState("");
  const { messages, mode, thinking, speaking, send, startVoice, stopVoice, reset } = useSalesAgent();
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { greeting, chips } = startersFor(pathname);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {}
    if (dismissed) return;
    const t = setTimeout(() => setTeaser(true), pathname.startsWith("/voice-agents") || pathname.startsWith("/audit") ? 9000 : 20000);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const dismissTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {}
  };

  const openChat = () => {
    dismissTeaser();
    setOpen(true);
  };

  const submit = (text: string) => {
    if (!text.trim() || thinking) return;
    setInput("");
    void send(text);
  };

  return (
    <>
      {!open && (
        <div className="chat-launcher fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {teaser && (
            <div className="rise relative max-w-[260px] rounded-2xl rounded-br-md border border-wire bg-carbon p-4 pr-8 text-sm text-slate shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <button onClick={dismissTeaser} className="absolute right-2 top-2 p-1 text-dim hover:text-cloud" aria-label="Dismiss">
                <X className="h-3.5 w-3.5" />
              </button>
              <button onClick={openChat} className="text-left">
                <span className="font-semibold text-cloud">Questions? Ask Saul.</span> I&apos;m the AI you&apos;d be hiring, so this chat is the demo.
              </button>
            </div>
          )}
          <button
            onClick={openChat}
            className="group relative flex h-14 items-center gap-2 rounded-full bg-cyan pl-4 pr-5 font-semibold text-obsidian shadow-[0_10px_40px_rgba(0,212,170,0.45)] transition-transform hover:scale-[1.03]"
            aria-label="Chat with Saul"
          >
            <span className="ring-pulse absolute inset-0 rounded-full bg-cyan/40" aria-hidden="true" />
            <MessageSquare className="relative h-5 w-5" />
            <span className="relative hidden sm:inline">Ask Saul</span>
          </button>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Chat with Saul"
          className="fixed inset-0 z-50 flex flex-col bg-obsidian sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100vh-3rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-3xl sm:border sm:border-wire sm:shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
        >
          <header className="flex items-center gap-3 border-b border-wire bg-carbon px-4 py-3.5">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cyan/15 font-display font-bold text-cyan ring-1 ring-cyan/40">
              S
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-carbon bg-success" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight text-cloud">Saul</p>
              <p className="truncate text-xs text-dim">AI assistant · replies instantly</p>
            </div>
            {messages.length > 0 && mode === "text" && (
              <button onClick={() => void reset()} className="rounded-full p-2 text-dim hover:bg-graphite hover:text-cloud" aria-label="Start over" title="Start over">
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => void (mode === "voice" ? stopVoice() : startVoice())}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                mode === "voice" ? "bg-error/15 text-error" : "bg-cyan/10 text-cyan hover:bg-cyan/20"
              }`}
              aria-label={mode === "voice" ? "End voice" : "Talk to Saul by voice"}
            >
              {mode === "voice" ? <PhoneOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              {mode === "voice" ? "End" : "Talk"}
            </button>
            <button onClick={() => setOpen(false)} className="rounded-full p-2 text-dim hover:bg-graphite hover:text-cloud" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
            <Bubble m={{ id: "greeting", role: "assistant", text: greeting }} />
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pl-9">
                {chips.map((c) => (
                  <button key={c} onClick={() => submit(c)} className="rounded-full border border-wire bg-carbon px-3.5 py-2 text-left text-sm text-cloud transition-colors hover:border-cyan/50">
                    {c}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m) => (
              <Bubble key={m.id} m={m} />
            ))}
            {thinking && <Typing />}
          </div>

          {mode === "voice" ? (
            <div className="flex flex-col items-center gap-3 border-t border-wire bg-carbon px-4 py-5">
              <div className="flex h-10 items-end gap-1" aria-hidden="true">
                {Array.from({ length: 9 }, (_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full bg-cyan ${speaking ? "wave-bar" : ""}`}
                    style={{ height: speaking ? `${30 + ((i * 37) % 70)}%` : "20%", ["--d" as string]: `${i * 90}ms` }}
                  />
                ))}
              </div>
              <p className="text-sm text-slate">{speaking ? "Saul is talking…" : "Listening. Go ahead and talk."}</p>
              <button onClick={() => void stopVoice()} className="flex items-center gap-2 rounded-full bg-error/15 px-4 py-2 text-sm font-semibold text-error">
                <MicOff className="h-4 w-4" /> End voice
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="border-t border-wire bg-carbon p-3"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-wire bg-obsidian p-1.5 pl-4 focus-within:border-cyan/60">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit(input);
                    }
                  }}
                  rows={1}
                  maxLength={1500}
                  placeholder="Ask anything about AskSaul…"
                  aria-label="Message Saul"
                  className="max-h-32 flex-1 resize-none bg-transparent py-2 text-[15px] text-cloud placeholder:text-dim focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan text-obsidian transition-opacity disabled:opacity-30"
                  aria-label="Send"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 px-1 text-center text-[11px] text-dim">
                Saul is an AI and can make mistakes. Chats may be saved to follow up. <Link href="/privacy" className="underline">Privacy</Link>
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}
