import { type NextRequest } from "next/server";
import { chatLeadSchema } from "@/lib/validation";
import { BOOKING_URL, buildChatPayload, getAskSaulBookingUrl, sendToGHL } from "@/lib/ghl";
import { sendInternalLeadAlert } from "@/lib/internal-alerts";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = chatLeadSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 422 }
    );
  }

  const payload = buildChatPayload(result.data);
  const bookingUrl = getAskSaulBookingUrl() || BOOKING_URL;

  try {
    await sendToGHL(payload);
  } catch (err) {
    console.error("[chat/route] GHL webhook error:", err);
    return Response.json(
      { error: "We could not save your chat details. Please try again or contact AskSaul directly." },
      { status: 502 }
    );
  }

  const lastUserMessage = [...result.data.chatTranscript]
    .reverse()
    .find((turn) => turn.role === "user")?.content;
  const alertResult = await sendInternalLeadAlert({
    route: result.data.sourcePath ?? "site-chat",
    source: payload.source,
    leadProject: payload.lead_project,
    name: result.data.name,
    email: result.data.email,
    phone: result.data.phone,
    businessName: result.data.businessName,
    intent: result.data.handoffIntent ?? result.data.initialIntent ?? "send-context",
    tags: payload.tags,
    summary: lastUserMessage,
    bookingUrl,
  });
  if (!alertResult.ok) console.warn("[chat/route] internal alert failed:", alertResult);

  return Response.json({
    success: true,
    bookingUrl: result.data.handoffIntent === "book-demo" ? bookingUrl : undefined,
    alert: alertResult,
  });
}
