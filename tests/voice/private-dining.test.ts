import { describe, it, expect, vi, beforeEach } from "vitest";

const { insertSpy, sendEmailSpy } = vi.hoisted(() => ({
  insertSpy: vi.fn().mockResolvedValue({ data: null, error: null }),
  sendEmailSpy: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/voice/supabase", () => ({
  getVoiceSupabase: () => ({ from: () => ({ insert: insertSpy }) }),
}));
vi.mock("@/lib/voice/email", () => ({ sendLeadEmail: sendEmailSpy }));

import { POST } from "@/app/api/voice/tools/private-dining-intake/route";

describe("POST /api/voice/tools/private-dining-intake", () => {
  beforeEach(() => {
    process.env.VOICE_TOOL_SHARED_SECRET = "s";
    insertSpy.mockClear();
    sendEmailSpy.mockClear();
  });

  const valid = (o: object = {}) =>
    JSON.stringify({
      conversation_id: "c1",
      name: "Bob",
      phone: "+17205551234",
      party_size: 10,
      ...o,
    });

  it("rejects missing secret", async () => {
    const res = await POST(new Request("http://x", { method: "POST", body: valid() }));
    expect(res.status).toBe(401);
  });

  it("captures a valid 10-top intake", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: valid(),
      }),
    );
    expect(res.status).toBe(200);
    expect(insertSpy).toHaveBeenCalledOnce();
    expect(sendEmailSpy).toHaveBeenCalledOnce();
    const row = insertSpy.mock.calls[0][0];
    expect(row.kind).toBe("private_dining");
    expect(row.party_size).toBe(10);
  });

  it("rejects party_size < 7 with 422", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: valid({ party_size: 4 }),
      }),
    );
    expect(res.status).toBe(422);
  });
});
