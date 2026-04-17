import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "node:crypto";

const { upsertSpy } = vi.hoisted(() => ({
  upsertSpy: vi.fn().mockResolvedValue({ data: null, error: null }),
}));
vi.mock("@/lib/voice/supabase", () => ({
  getVoiceSupabase: () => ({ from: () => ({ upsert: upsertSpy }) }),
}));

import { POST } from "@/app/api/voice/webhook/route";

describe("voice webhook", () => {
  beforeEach(() => {
    process.env.ELEVENLABS_WEBHOOK_SECRET = "whsec";
    upsertSpy.mockClear();
  });

  function signed(payload: object) {
    const body = JSON.stringify(payload);
    const sig = createHmac("sha256", "whsec").update(body).digest("hex");
    return new Request("http://x", {
      method: "POST",
      headers: { "elevenlabs-signature": sig, "content-type": "application/json" },
      body,
    });
  }

  it("rejects bad signature", async () => {
    const req = new Request("http://x", {
      method: "POST",
      headers: { "elevenlabs-signature": "nope" },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("upserts a call_logs row", async () => {
    const req = signed({
      conversation_id: "conv_1",
      started_at: "2026-04-17T01:00:00Z",
      ended_at: "2026-04-17T01:02:30Z",
      transcript: [{ role: "agent", content: "hi" }],
      metadata: { caller_number: "+1555" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(upsertSpy).toHaveBeenCalledOnce();
    const row = upsertSpy.mock.calls[0][0];
    expect(row.conversation_id).toBe("conv_1");
    expect(row.duration_sec).toBe(150);
  });

  it("infers outcome=lead_captured when create_lead tool was called", async () => {
    const req = signed({
      conversation_id: "conv_2",
      started_at: "2026-04-17T01:00:00Z",
      ended_at: "2026-04-17T01:05:00Z",
      tool_calls: [{ name: "create_lead" }],
    });
    await POST(req);
    expect(upsertSpy.mock.calls[0][0].outcome).toBe("lead_captured");
  });

  it("infers outcome=escalated when message_for_team was called", async () => {
    const req = signed({
      conversation_id: "conv_3",
      started_at: "2026-04-17T01:00:00Z",
      ended_at: "2026-04-17T01:05:00Z",
      tool_calls: [{ name: "message_for_team" }],
    });
    await POST(req);
    expect(upsertSpy.mock.calls[0][0].outcome).toBe("escalated");
  });
});
