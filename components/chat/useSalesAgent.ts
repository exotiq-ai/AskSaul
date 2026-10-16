"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation } from "@elevenlabs/client";
import { SALES_AGENT_ID } from "@/lib/sales-agent/agent-id";
import { parseAgentMessage, type ChatAction } from "@/lib/sales-agent/actions";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: ChatAction[];
  streaming?: boolean;
  notice?: boolean;
};

type Mode = "text" | "voice";
type Status = "idle" | "connecting" | "connected" | "error";

const STORAGE_KEY = "asksaul-chat-v2";
const MAX_STORED = 40;

declare global {
  interface Window {
    gtag?: (command: "event", action: string, params?: Record<string, unknown>) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

function track(action: string, props: Record<string, unknown> = {}) {
  try {
    window.gtag?.("event", action, { event_category: "conversion", ...props });
    window.plausible?.(action, { props });
  } catch {
    /* analytics must never break chat */
  }
}

const uid = () => Math.random().toString(36).slice(2, 10);

function load(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]).filter((m) => !m.streaming) : [];
  } catch {
    return [];
  }
}

function save(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.filter((m) => !m.streaming && !m.notice).slice(-MAX_STORED)));
  } catch {
    /* private mode or storage full */
  }
}

function transcriptFor(messages: ChatMessage[]) {
  return messages
    .filter((m) => !m.notice && m.text)
    .slice(-30)
    .map((m) => ({ role: m.role, content: m.text.slice(0, 4000) }));
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Denver" });
}

export function useSalesAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<Mode>("text");
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const conversation = useRef<Conversation | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const streamingId = useRef<string | null>(null);
  const fallback = useRef(false);
  const streamBuffer = useRef("");

  useEffect(() => {
    const restored = load();
    if (restored.length) setMessages(restored);
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    save(messages);
  }, [messages]);

  const upsertAssistant = useCallback((raw: string, done: boolean) => {
    const { text, actions } = parseAgentMessage(raw);
    // Ids are assigned here, outside the state updater, so every streamed delta
    // and the final message land on the same bubble.
    if (!streamingId.current) streamingId.current = uid();
    const id = streamingId.current;
    if (done) streamingId.current = null;
    setMessages((prev) =>
      prev.some((m) => m.id === id)
        ? prev.map((m) => (m.id === id ? { ...m, text, actions: actions.length ? actions : m.actions, streaming: !done } : m))
        : [...prev, { id, role: "assistant", text, actions, streaming: !done }]
    );
  }, []);

  const addNotice = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: uid(), role: "assistant", text, notice: true }]);
  }, []);

  const clientTools = useCallback(
    () => ({
      capture_lead: async (p: Record<string, unknown>) => {
        const intentMap: Record<string, string> = {
          "founding-spot": "founding-spot",
          "book-call": "book-demo",
          question: "send-context",
          "other-services": "automation-map",
        };
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: String(p.name ?? "").trim(),
              email: String(p.email ?? "").trim(),
              phone: String(p.phone ?? "").trim() || undefined,
              businessName: p.business_name ? String(p.business_name) : undefined,
              trade: p.trade ? String(p.trade) : undefined,
              city: p.city ? String(p.city) : undefined,
              summary: p.summary ? String(p.summary) : undefined,
              sourcePath: window.location.pathname,
              chatTranscript: transcriptFor(messagesRef.current),
              initialIntent: "site-chat-agent",
              handoffIntent: intentMap[String(p.intent)] ?? "send-context",
            }),
          });
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { error?: string };
            return `Error: could not save (${body.error ?? res.status}). Offer the form at /voice-agents#founding or Gregory's direct line.`;
          }
          track("chat_lead_captured", { intent: p.intent });
          return "Saved. Gregory has the visitor's details and this chat transcript.";
        } catch {
          return "Error: network problem saving the details. Offer the form at /voice-agents#founding or Gregory's direct line.";
        }
      },
      request_audit: async (p: Record<string, unknown>) => {
        const trade = String(p.trade ?? "").toLowerCase();
        try {
          const res = await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: String(p.name ?? ""),
              businessName: String(p.business_name ?? ""),
              email: String(p.email ?? ""),
              phone: String(p.phone ?? ""),
              trade: trade.includes("roof") ? "Roofing" : trade.includes("hvac") || trade.includes("heat") ? "HVAC" : "Other",
              city: String(p.city ?? ""),
              website: p.website ? String(p.website) : "",
              afterHoursTestOk: p.after_hours_test_ok === true,
              smsConsent: false,
            }),
          });
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { issues?: { message: string }[] };
            const why = body.issues?.map((i) => i.message).join("; ") || String(res.status);
            return `Error: audit request not saved (${why}). Ask for the missing details or send them to /audit.`;
          }
          track("chat_audit_requested", { trade });
          return "Audit request saved. A confirmation email is on its way to the visitor.";
        } catch {
          return "Error: network problem. Send them to /audit.";
        }
      },
    }),
    []
  );

  const fallbackReply = useCallback(
    async (text: string) => {
      setThinking(true);
      try {
        const res = await fetch("/api/chat/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...transcriptFor(messagesRef.current), { role: "user", content: text }] }),
        });
        const data = (await res.json()) as { reply?: string };
        upsertAssistant(data.reply ?? "Sorry, I'm having trouble right now. Call Gregory at 970.343.9634.", true);
      } catch {
        upsertAssistant("Sorry, I'm having trouble connecting. You can call Gregory directly at 970.343.9634.", true);
      } finally {
        setThinking(false);
      }
    },
    [upsertAssistant]
  );

  const connect = useCallback(
    async (nextMode: Mode) => {
      if (conversation.current) return conversation.current;
      setStatus("connecting");
      const { Conversation } = await import("@elevenlabs/client");
      const prior = transcriptFor(messagesRef.current)
        .map((t) => `${t.role === "user" ? "Visitor" : "Saul"}: ${t.content}`)
        .join("\n");
      const session = await Conversation.startSession({
        agentId: SALES_AGENT_ID,
        connectionType: nextMode === "text" ? "websocket" : "webrtc",
        ...(nextMode === "text"
          ? { textOnly: true, overrides: { conversation: { textOnly: true } } }
          : {
              overrides: {
                agent: {
                  firstMessage: prior
                    ? "Hey, Saul here, now by voice. Picking up where we left off."
                    : "Hey, this is Saul, the AI assistant for AskSaul. You're hearing exactly what your callers would hear. What kind of business do you run?",
                },
              },
            }),
        dynamicVariables: {
          page_path: window.location.pathname,
          today: todayLabel(),
          channel: nextMode,
          prior_transcript: prior ? `\nEarlier in this visit (continue naturally, don't repeat yourself):\n${prior.slice(-6000)}` : "",
        },
        clientTools: clientTools(),
        onConnect: () => setStatus("connected"),
        onDisconnect: (details) => {
          conversation.current = null;
          setStatus("idle");
          setThinking(false);
          setSpeaking(false);
          setMode("text");
          const reason = JSON.stringify(details ?? {}).toLowerCase();
          if (reason.includes("guardrail")) {
            addNotice("Let's keep this about AskSaul and your business. What kind of shop do you run?");
          }
        },
        onError: () => setStatus("error"),
        onModeChange: ({ mode: m }) => setSpeaking(m === "speaking"),
        onAgentChatResponsePart: (part: { text?: string; type?: string }) => {
          if (nextMode !== "text") return;
          if (part.type === "start") streamBuffer.current = "";
          if (part.type === "delta" && part.text) {
            setThinking(false);
            streamBuffer.current += part.text;
            upsertAssistant(streamBuffer.current, false);
          }
        },
        onMessage: ({ message, role }) => {
          if (role === "user") {
            if (nextMode === "voice") setMessages((prev) => [...prev, { id: uid(), role: "user", text: message }]);
            return;
          }
          setThinking(false);
          upsertAssistant(message, true);
          streamBuffer.current = "";
        },
      });
      conversation.current = session;
      return session;
    },
    [addNotice, clientTools, upsertAssistant]
  );

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim().slice(0, 1500);
      if (!clean) return;
      setMessages((prev) => [...prev, { id: uid(), role: "user", text: clean }]);
      if (fallback.current) return fallbackReply(clean);
      setThinking(true);
      try {
        const session = await connect(mode === "voice" ? "voice" : "text");
        session.sendUserMessage(clean);
      } catch {
        fallback.current = true;
        setStatus("error");
        await fallbackReply(clean);
      }
    },
    [connect, fallbackReply, mode]
  );

  const startVoice = useCallback(async () => {
    try {
      await conversation.current?.endSession();
      conversation.current = null;
      setMode("voice");
      await connect("voice");
      track("chat_voice_started");
    } catch {
      setMode("text");
      addNotice("I couldn't start voice here (microphone blocked?). You can call me instead at (970) 401-7285.");
    }
  }, [addNotice, connect]);

  const stopVoice = useCallback(async () => {
    await conversation.current?.endSession();
    conversation.current = null;
    setMode("text");
  }, []);

  const reset = useCallback(async () => {
    await conversation.current?.endSession();
    conversation.current = null;
    setMessages([]);
    setMode("text");
  }, []);

  useEffect(() => () => void conversation.current?.endSession(), []);

  return { messages, status, mode, thinking, speaking, send, startVoice, stopVoice, reset };
}
