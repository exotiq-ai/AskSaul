import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { verifyToolSecret, verifyWebhookSignature } from "@/lib/voice/auth";
import { createHmac } from "node:crypto";

describe("verifyToolSecret", () => {
  const OLD = process.env.VOICE_TOOL_SHARED_SECRET;
  beforeEach(() => { process.env.VOICE_TOOL_SHARED_SECRET = "secret_abc"; });
  afterEach(() => { process.env.VOICE_TOOL_SHARED_SECRET = OLD; });

  it("accepts matching secret", () => {
    const req = new Request("http://x", { headers: { "x-voice-tool-secret": "secret_abc" } });
    expect(verifyToolSecret(req)).toBe(true);
  });
  it("rejects wrong secret", () => {
    const req = new Request("http://x", { headers: { "x-voice-tool-secret": "wrong" } });
    expect(verifyToolSecret(req)).toBe(false);
  });
  it("rejects missing header", () => {
    const req = new Request("http://x");
    expect(verifyToolSecret(req)).toBe(false);
  });
});

describe("verifyWebhookSignature (ElevenLabs Stripe-style t=,v0= header)", () => {
  const OLD = process.env.ELEVENLABS_WEBHOOK_SECRET;
  beforeEach(() => { process.env.ELEVENLABS_WEBHOOK_SECRET = "whsec"; });
  afterEach(() => { process.env.ELEVENLABS_WEBHOOK_SECRET = OLD; });

  function sign(body: string, ts: number): string {
    const hex = createHmac("sha256", "whsec").update(`${ts}.${body}`).digest("hex");
    return `t=${ts},v0=${hex}`;
  }

  it("validates a correctly-signed recent payload", () => {
    const now = Math.floor(Date.now() / 1000);
    const body = '{"ok":true}';
    expect(verifyWebhookSignature(body, sign(body, now), now)).toBe(true);
  });

  it("rejects a malformed header", () => {
    expect(verifyWebhookSignature('{"ok":true}', "bad")).toBe(false);
    expect(verifyWebhookSignature('{"ok":true}', "t=123")).toBe(false);
  });

  it("rejects a mismatched signature", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(verifyWebhookSignature('{"ok":true}', `t=${now},v0=deadbeef`, now)).toBe(false);
  });

  it("rejects a signed body that was tampered with", () => {
    const now = Math.floor(Date.now() / 1000);
    const header = sign('{"ok":true}', now);
    expect(verifyWebhookSignature('{"ok":false}', header, now)).toBe(false);
  });

  it("rejects a stale timestamp (>5 min old)", () => {
    const ts = Math.floor(Date.now() / 1000) - 10 * 60;
    const now = Math.floor(Date.now() / 1000);
    const body = '{"ok":true}';
    expect(verifyWebhookSignature(body, sign(body, ts), now)).toBe(false);
  });

  it("rejects a future timestamp (>5 min ahead)", () => {
    const now = Math.floor(Date.now() / 1000);
    const ts = now + 10 * 60;
    const body = '{"ok":true}';
    expect(verifyWebhookSignature(body, sign(body, ts), now)).toBe(false);
  });
});
