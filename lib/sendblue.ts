const SENDBLUE_BASE_URL = "https://api.sendblue.com";

export type SendblueResult =
  | { ok: true; skipped?: false; messageHandle?: string }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string; status?: number };

type SendblueMessage = {
  to: string;
  body: string;
};

export async function sendSendblueMessage({ to, body }: SendblueMessage): Promise<SendblueResult> {
  const apiKeyId = process.env.SENDBLUE_API_KEY_ID ?? "";
  const apiSecretKey = process.env.SENDBLUE_API_SECRET_KEY ?? "";
  const fromNumber = process.env.SENDBLUE_FROM_NUMBER ?? "";

  if (!to.trim()) {
    return { ok: true, skipped: true, reason: "No phone number provided" };
  }

  if (process.env.SENDBLUE_OUTBOUND_DRY_RUN === "true" || process.env.SENDBLUE_OUTBOUND_DRY_RUN === "1") {
    console.info("[sendblue][dry-run]", { to, fromNumber, body });
    return { ok: true, skipped: true, reason: "SENDBLUE_OUTBOUND_DRY_RUN enabled" };
  }

  if (!apiKeyId || !apiSecretKey || !fromNumber) {
    const reason = "SENDBLUE_API_KEY_ID, SENDBLUE_API_SECRET_KEY, and SENDBLUE_FROM_NUMBER are required";
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: reason };
    }
    console.warn(`[sendblue] ${reason}`);
    return { ok: true, skipped: true, reason };
  }

  const res = await fetch(`${SENDBLUE_BASE_URL}/api/send-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sb-api-key-id": apiKeyId,
      "sb-api-secret-key": apiSecretKey,
    },
    body: JSON.stringify({
      number: to,
      content: body,
      from_number: fromNumber,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, error: text.slice(0, 500) || "Sendblue request failed" };
  }

  let messageHandle: string | undefined;
  try {
    const parsed = JSON.parse(text || "{}") as { message_handle?: string; messageHandle?: string };
    messageHandle = parsed.message_handle ?? parsed.messageHandle;
  } catch {
    // Sendblue succeeded but did not return JSON. Keep the submission successful.
  }

  return { ok: true, messageHandle };
}
