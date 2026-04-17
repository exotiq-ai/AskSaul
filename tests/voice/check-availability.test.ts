import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/voice/tools/check-availability/route";

describe("check-availability", () => {
  beforeEach(() => {
    process.env.VOICE_TOOL_SHARED_SECRET = "s";
  });

  it("returns use_tock status + url", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: JSON.stringify({
          conversation_id: "c1",
          date: "2026-05-01",
          time: "19:30",
          party_size: 2,
        }),
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("use_tock");
    expect(json.tock_url).toContain("exploretock.com/wolfstailor");
  });

  it("rejects missing secret", async () => {
    const res = await POST(new Request("http://x", { method: "POST", body: "{}" }));
    expect(res.status).toBe(401);
  });

  it("422 on missing fields", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: JSON.stringify({ conversation_id: "c1" }),
      }),
    );
    expect(res.status).toBe(422);
  });
});
