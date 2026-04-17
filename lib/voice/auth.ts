import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyToolSecret(req: Request): boolean {
  const header = req.headers.get("x-voice-tool-secret");
  const expected = process.env.VOICE_TOOL_SHARED_SECRET;
  if (!header || !expected) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ElevenLabs post-call webhooks sign with Stripe-style header:
//   ElevenLabs-Signature: t=<unix_ts>,v0=<hex>
// where <hex> = HMAC-SHA256(secret, `${ts}.${rawBody}`).
// Replay window: reject signatures older than 5 minutes.
const REPLAY_WINDOW_SEC = 5 * 60;

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  now: number = Math.floor(Date.now() / 1000),
): boolean {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const parts = new Map<string, string>();
  for (const kv of signatureHeader.split(",")) {
    const [k, v] = kv.trim().split("=", 2);
    if (k && v) parts.set(k, v);
  }
  const ts = parts.get("t");
  const provided = parts.get("v0");
  if (!ts || !provided) return false;

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum) || Math.abs(now - tsNum) > REPLAY_WINDOW_SEC) return false;

  const expected = createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function unauthorizedResponse() {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}
