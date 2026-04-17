import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ElevenLabsClient } from "../src/elevenlabs-client.js";

describe("ElevenLabsClient", () => {
  const OLD_KEY = process.env.ELEVENLABS_API_KEY;
  const fetchSpy = vi.fn();

  beforeEach(() => {
    process.env.ELEVENLABS_API_KEY = "sk_test_fake";
    global.fetch = fetchSpy as unknown as typeof fetch;
    fetchSpy.mockReset();
  });

  afterEach(() => {
    process.env.ELEVENLABS_API_KEY = OLD_KEY;
  });

  it("sends xi-api-key header on every request", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const client = new ElevenLabsClient();
    await client.getSubscription();
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.elevenlabs.io/v1/user/subscription",
      expect.objectContaining({
        headers: expect.objectContaining({ "xi-api-key": "sk_test_fake" }),
      })
    );
  });

  it("throws a useful error on non-2xx responses", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("bad key", { status: 401 }));
    const client = new ElevenLabsClient();
    await expect(client.getSubscription()).rejects.toThrow(/401/);
  });

  it("uploads a KB file via multipart", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({ id: "doc_123" }), { status: 200 }));
    const client = new ElevenLabsClient();
    const doc = await client.uploadKbFile("hours.md", "hours content");
    expect(doc.id).toBe("doc_123");
    const [, init] = fetchSpy.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBeInstanceOf(FormData);
  });
});
