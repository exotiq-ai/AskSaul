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
    return "Yes. Saul can handle dumpster rental, roll-off, junk removal, and hauling calls by asking for ZIP, debris type, size/timing, and contact details, then sending a clean lead summary to GHL or your CRM. Best next step: test the live demos on /voice-agents/waste or send Gregory this chat context for a waste-agent demo.";
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("charge")) {
    return "Pricing depends on the workflow, integrations, and how much Saul should own. Websites start around $5K, smaller AI setups can start lower, and voice/CRM systems are scoped by call flow and handoff complexity. The fastest accurate next step is the Automation Map at /build-your-proposal.";
  }
  if (lower.includes("voice") || lower.includes("call") || lower.includes("phone")) {
    return "Saul voice agents are built for missed calls, after-hours intake, qualification, and CRM/GHL handoff. You can test the waste-industry examples at /voice-agents/waste, or send Gregory this chat context if you want a demo for your own business.";
  }
  if (lower.includes("website") || lower.includes("web")) {
    return "AskSaul builds conversion-focused websites and apps when the site needs to do more than look good: intake, quote flows, booking, CRM handoff, and SEO. See /web-development or start with /build-your-proposal.";
  }
  return "I can help map the right AskSaul path. Tell me what is leaking right now: missed calls, slow follow-up, repetitive admin, weak website conversion, or tools that do not talk to each other. If you want the fastest structured next step, use /build-your-proposal.";
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
