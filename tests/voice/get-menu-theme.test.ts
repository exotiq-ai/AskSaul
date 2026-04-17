import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/voice/tools/get-menu-theme/route";

describe("get-menu-theme", () => {
  beforeEach(() => {
    process.env.VOICE_TOOL_SHARED_SECRET = "s";
  });

  it("returns a theme", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s" },
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.season).toMatch(/spring|summer|fall|winter/);
    expect(json.theme.length).toBeGreaterThan(10);
  });

  it("rejects missing secret", async () => {
    const res = await POST(new Request("http://x", { method: "POST" }));
    expect(res.status).toBe(401);
  });
});
