import { type NextRequest } from "next/server";

type ChatTurn = { role: "user" | "assistant"; content: string };
type ChatAction = {
  id: "waste-demos" | "automation-map" | "book-demo" | "send-context";
  label: string;
  description?: string;
  kind: "link" | "capture";
  href?: string;
  handoffIntent?: "waste-demo" | "automation-map" | "book-demo" | "send-context";
};

const SYSTEM_PROMPT = `You are Saul, the AskSaul.ai website assistant for Gregory Ringler in Denver.
Your job: help visitors understand AskSaul services and route them toward the right next step.
Voice: practical, direct, operator-to-operator. Avoid hype.
Core offer: Get Your Automation Map — a 3-minute intake that identifies the 1–3 workflows most worth automating first.
Services: AI assistants and automation, AI voice agents, websites and apps, Saul Marketing / CRM follow-up systems.
Important pages: /build-your-proposal, /voice-agents, /voice-agents/waste, /ai-automation, /web-development, /marketing-engine, /portfolio, /contact.
Waste page: /voice-agents/waste shows Saul voice agents for dumpster rental, roll-off, junk removal, and waste businesses with live demo sites.
Do not guarantee revenue or claim AskSaul rents dumpsters. Do not say the site chat replaces a human consultation.
Do not ask for name, email, or phone during normal chat. Contact capture is optional and happens only after the visitor chooses to send context or book a demo.
If the visitor shows buying intent, ask one useful follow-up about their business type or bottleneck, then recommend the best next action.
Keep replies under 120 words unless the user asks for detail. Include one clear next step when useful.`;

function fallbackReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("waste") || lower.includes("dumpster") || lower.includes("roll") || lower.includes("junk")) {
    return "Saul handles dumpster and roll-off calls: ZIP check, debris type, size, timing, and a clean lead summary to your CRM. You can test the live demos at /voice-agents/waste, or call Gregory at 970.343.9634.";
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
    return "For roofing and HVAC shops: Saul Night Manager (answering only) is from $1,750/mo, Phone Rings + Phone Answered (Google visibility plus Saul) is $3,500 to $4,500/mo, and Full Engine (adds Google Ads management) is $5,000+/mo. Founding clients get the build on us and a 12-month rate lock. Details at /voice-agents#founding.";
  }
  if (lower.includes("audit")) {
    return "The free Missed-Call & Visibility Audit checks your Google profile, reviews vs your top 3 competitors, AI search, and your website on a phone, then gives you the top 3 fixes. Request it at /audit. You keep it either way.";
  }
  if (lower.includes("founding") || lower.includes("roof") || lower.includes("hvac") || lower.includes("call") || lower.includes("phone")) {
    return "Saul answers the calls your crew can't, says up front it's an AI, takes the job details, and books or routes by your rules. The Founding Client Program is open to 10 Front Range roofing and HVAC shops until Dec 31. See /voice-agents#founding, or hear Saul at (970) 401-7285.";
  }
  return "I'm having trouble connecting right now. You can hear Saul on the phone at (970) 401-7285, get the Automation Map at /build-your-proposal, or reach Gregory directly at 970.343.9634.";
}

function suggestedActionsFor(message: string, reply: string): ChatAction[] {
  const text = `${message} ${reply}`.toLowerCase();
  const actions: ChatAction[] = [];

  if (text.includes("waste") || text.includes("dumpster") || text.includes("roll-off") || text.includes("roll off") || text.includes("junk")) {
    actions.push({
      id: "waste-demos",
      label: "Test live waste demos",
      description: "Call Saul on the dumpster rental demo sites.",
      kind: "link",
      href: "/voice-agents/waste#live-demos",
      handoffIntent: "waste-demo",
    });
  }

  if (text.includes("book") || text.includes("demo") || text.includes("call") || text.includes("calendar")) {
    actions.push({
      id: "book-demo",
      label: "Book a demo",
      description: "Send this context, then open Gregory's booking link.",
      kind: "capture",
      handoffIntent: "book-demo",
    });
  }

  actions.push({
    id: "automation-map",
    label: "Get Automation Map",
    description: "Find the 1–3 workflows worth automating first.",
    kind: "link",
    href: "/build-your-proposal",
    handoffIntent: "automation-map",
  });

  actions.push({
    id: "send-context",
    label: "Send Gregory this context",
    description: "Share this chat transcript for follow-up.",
    kind: "capture",
    handoffIntent: "send-context",
  });

  const unique = actions.filter((action, index, list) => list.findIndex((item) => item.id === action.id) === index);
  return unique.slice(0, 3);
}

async function callOpenAICompatible(messages: ChatTurn[]): Promise<string | null> {
  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const apiKey = openAiKey || openRouterKey;
  if (!apiKey) return null;

  const baseUrl = openRouterKey && !openAiKey ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1";
  const model =
    process.env.ASKSAUL_CHAT_MODEL ||
    (openRouterKey && !openAiKey ? "openai/gpt-4.1-mini" : "gpt-4o-mini");

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(openRouterKey && !openAiKey
        ? {
            "HTTP-Referer": "https://asksaul.ai",
            "X-Title": "AskSaul.ai website chat",
          }
        : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 220,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.warn(`[chat/respond] LLM failed ${res.status}: ${text.slice(0, 300)}`);
    return null;
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function POST(request: NextRequest) {
  let body: { messages?: ChatTurn[] };
  try {
    body = (await request.json()) as { messages?: ChatTurn[] };
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter(
        (m): m is ChatTurn =>
          Boolean(m) &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
    : [];

  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const liveReply = await callOpenAICompatible(messages).catch((err) => {
    console.warn("[chat/respond] LLM exception:", err);
    return null;
  });

  const reply = liveReply ?? fallbackReply(lastUser);

  return Response.json({
    reply,
    actions: suggestedActionsFor(lastUser, reply),
    mode: liveReply ? "live" : "fallback",
  });
}
