import { type NextRequest } from "next/server";
import { voiceAgentLeadSchema } from "@/lib/validation";
import { buildVoiceAgentLeadPayload, getAskSaulBookingUrl, sendToGHL } from "@/lib/ghl";
import { sendInternalLeadAlert } from "@/lib/internal-alerts";

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
  const bookingUrl = getAskSaulBookingUrl();

  try {
    await sendToGHL(payload);
  } catch (err) {
    console.error("[voice-agent/route] GHL webhook error:", err);
    return Response.json(
      { error: "We could not save this request. Please call Saul or try again." },
      { status: 502 }
    );
  }

  const alertResult = await sendInternalLeadAlert({
    route: "/voice-agents",
    source: payload.source,
    leadProject: payload.lead_project,
    name: result.data.name,
    email: result.data.email,
    phone: result.data.phone,
    businessName: result.data.businessName,
    intent: "voice-agent-lead",
    tags: payload.tags,
    summary: `${result.data.serviceType} in ${result.data.serviceArea}. Pain: ${result.data.missedCallPain}. Wants: ${result.data.desiredAgentTasks}`,
    bookingUrl,
  });
  if (!alertResult.ok) console.warn("[voice-agent/route] internal alert failed:", alertResult);

  return Response.json({ success: true, bookingUrl, alert: alertResult });
}
