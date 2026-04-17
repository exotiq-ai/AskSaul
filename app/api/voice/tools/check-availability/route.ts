import { type NextRequest } from "next/server";
import { checkAvailabilityInput } from "@/lib/voice/schemas";
import { verifyToolSecret, unauthorizedResponse } from "@/lib/voice/auth";

export async function POST(request: NextRequest | Request) {
  if (!verifyToolSecret(request as Request)) return unauthorizedResponse();

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = checkAvailabilityInput.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }

  return Response.json({
    status: "use_tock",
    message:
      "I don't have live availability on my end yet — the best way is to book at exploretock dot com slash wolfs tailor. Would you like me to capture your info and have the team confirm instead?",
    tock_url: "https://exploretock.com/wolfstailor",
  });
}
