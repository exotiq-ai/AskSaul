const TELEGRAM_API_BASE = "https://api.telegram.org";

export type InternalAlertPayload = {
  route: string;
  source: string;
  leadProject?: string;
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  intent?: string;
  tags?: string[];
  summary?: string;
  bookingUrl?: string;
};

export type InternalAlertResult =
  | { ok: true; skipped?: false }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string; status?: number };

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function truncate(value: string, max = 700): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function buildMessage(payload: InternalAlertPayload): string {
  const lines = [
    "🚨 New AskSaul.ai lead",
    `Source: ${payload.source}`,
    `Route: ${payload.route}`,
    payload.leadProject ? `Project: ${payload.leadProject}` : undefined,
    payload.intent ? `Intent: ${payload.intent}` : undefined,
    payload.name ? `Name: ${payload.name}` : undefined,
    payload.businessName ? `Business: ${payload.businessName}` : undefined,
    payload.email ? `Email: ${payload.email}` : undefined,
    payload.phone ? `Phone: ${payload.phone}` : undefined,
    payload.tags?.length ? `Tags: ${payload.tags.join(", ")}` : undefined,
    payload.summary ? `Summary: ${truncate(payload.summary)}` : undefined,
    payload.bookingUrl ? `Booking: ${payload.bookingUrl}` : undefined,
  ].filter(Boolean);

  return lines.join("\n").slice(0, 3500);
}

export async function sendInternalLeadAlert(payload: InternalAlertPayload): Promise<InternalAlertResult> {
  const webhookUrl = text(process.env.ASKSAUL_INTERNAL_ALERT_WEBHOOK_URL);
  const telegramToken = text(process.env.TELEGRAM_BOT_TOKEN ?? process.env.ASKSAUL_TELEGRAM_BOT_TOKEN);
  const telegramChatId = text(process.env.TELEGRAM_CHAT_ID ?? process.env.ASKSAUL_TELEGRAM_CHAT_ID);
  const telegramThreadId = text(process.env.TELEGRAM_THREAD_ID ?? process.env.ASKSAUL_TELEGRAM_THREAD_ID);

  const message = buildMessage(payload);

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, payload }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: body.slice(0, 500) || "Internal alert webhook failed" };
    }
    return { ok: true };
  }

  if (telegramToken && telegramChatId) {
    const body: Record<string, string> = {
      chat_id: telegramChatId,
      text: message,
      disable_web_page_preview: "true",
    };
    if (telegramThreadId) body.message_thread_id = telegramThreadId;

    const res = await fetch(`${TELEGRAM_API_BASE}/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const responseText = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: responseText.slice(0, 500) || "Telegram alert failed" };
    }
    return { ok: true };
  }

  return { ok: true, skipped: true, reason: "No internal alert webhook or Telegram env configured" };
}
