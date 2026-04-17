import { describe, it, expect, vi, beforeEach } from "vitest";

const { insertSpy, sendEmailSpy } = vi.hoisted(() => ({
  insertSpy: vi.fn().mockResolvedValue({ data: null, error: null }),
  sendEmailSpy: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/voice/supabase", () => ({
  getVoiceSupabase: () => ({ from: () => ({ insert: insertSpy }) }),
}));
vi.mock("@/lib/voice/email", () => ({ sendLeadEmail: sendEmailSpy }));

import { POST } from "@/app/api/voice/tools/create-lead/route";

describe("POST /api/voice/tools/create-lead", () => {
  beforeEach(() => {
    process.env.VOICE_TOOL_SHARED_SECRET = "s";
    insertSpy.mockClear();
    sendEmailSpy.mockClear();
  });

  const body = (o: object = {}) =>
    JSON.stringify({
      conversation_id: "c1",
      name: "Alice",
      phone: "+17205551234",
      date: "2026-05-01",
      party_size: 2,
      ...o,
    });

  it("rejects missing secret", async () => {
    const res = await POST(new Request("http://x", { method: "POST", body: body() }));
    expect(res.status).toBe(401);
  });

  it("writes row + sends email on valid input", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body(),
      }),
    );
    expect(res.status).toBe(200);
    expect(insertSpy).toHaveBeenCalledOnce();
    expect(sendEmailSpy).toHaveBeenCalledOnce();
    const json = await res.json();
    expect(json.status).toBe("captured");
  });

  it("flags allium allergy and still captures", async () => {
    await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body({ allergies: "Severe garlic allergy" }),
      }),
    );
    const emailArg = sendEmailSpy.mock.calls[0][0];
    expect(emailArg.allergy_flag).toBe(true);
  });

  it("returns 422 on invalid payload", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: JSON.stringify({ name: "Alice" }),
      }),
    );
    expect(res.status).toBe(422);
  });
});
