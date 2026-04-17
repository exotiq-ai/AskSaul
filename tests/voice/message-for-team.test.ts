import { describe, it, expect, vi, beforeEach } from "vitest";

const { insertSpy, sendEmailSpy } = vi.hoisted(() => ({
  insertSpy: vi.fn().mockResolvedValue({ data: null, error: null }),
  sendEmailSpy: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/voice/supabase", () => ({
  getVoiceSupabase: () => ({ from: () => ({ insert: insertSpy }) }),
}));
vi.mock("@/lib/voice/email", () => ({ sendLeadEmail: sendEmailSpy }));

import { POST } from "@/app/api/voice/tools/message-for-team/route";

describe("POST /api/voice/tools/message-for-team", () => {
  beforeEach(() => {
    process.env.VOICE_TOOL_SHARED_SECRET = "s";
    insertSpy.mockClear();
    sendEmailSpy.mockClear();
  });

  const body = (o: object = {}) =>
    JSON.stringify({
      conversation_id: "c1",
      name: "Carol",
      phone: "+17205551234",
      reason: "past_experience",
      notes: "had a bad time last month",
      ...o,
    });

  it("rejects missing secret", async () => {
    const res = await POST(new Request("http://x", { method: "POST", body: body() }));
    expect(res.status).toBe(401);
  });

  it("captures an escalation with reason", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body(),
      }),
    );
    expect(res.status).toBe(200);
    const row = insertSpy.mock.calls[0][0];
    expect(row.kind).toBe("escalation");
    expect(row.reason).toBe("past_experience");
  });

  it("passes refund_dispute reason to email", async () => {
    await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body({ reason: "refund_dispute" }),
      }),
    );
    expect(sendEmailSpy.mock.calls[0][0].reason).toBe("refund_dispute");
  });

  it("422 on bad reason enum", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body({ reason: "made_up" }),
      }),
    );
    expect(res.status).toBe(422);
  });
});
