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

describe("verifyWebhookSignature", () => {
  const OLD = process.env.ELEVENLABS_WEBHOOK_SECRET;
  beforeEach(() => { process.env.ELEVENLABS_WEBHOOK_SECRET = "whsec"; });
  afterEach(() => { process.env.ELEVENLABS_WEBHOOK_SECRET = OLD; });

  it("validates correct HMAC-SHA256", () => {
    const body = '{"ok":true}';
    const sig = createHmac("sha256", "whsec").update(body).digest("hex");
    expect(verifyWebhookSignature(body, sig)).toBe(true);
  });
  it("rejects wrong signature", () => {
    expect(verifyWebhookSignature('{"ok":true}', "bad")).toBe(false);
  });
});
