import { type NextRequest } from "next/server";
import { voiceAgentLeadSchema } from "@/lib/validation";
import { buildVoiceAgentLeadPayload, sendToGHL } from "@/lib/ghl";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = voiceAgentLeadSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 422 }
    );
  }

  const payload = buildVoiceAgentLeadPayload(result.data);

  try {
    await sendToGHL(payload);
  } catch (err) {
    console.error("[voice-agent/route] GHL webhook error:", err);
    return Response.json(
      { error: "We could not save this request. Please call Saul or try again." },
      { status: 502 }
    );
  }

  return Response.json({ success: true });
}
