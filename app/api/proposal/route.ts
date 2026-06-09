import { type NextRequest } from "next/server";
import { proposalSchema } from "@/lib/validation";
import { buildProposalPayload, getAskSaulBookingUrl, sendToGHL } from "@/lib/ghl";
import { sendInternalLeadAlert } from "@/lib/internal-alerts";
import { sendSendblueMessage } from "@/lib/sendblue";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = proposalSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 422 }
    );
  }

  const payload = buildProposalPayload(result.data);
  const bookingUrl = getAskSaulBookingUrl();

  try {
    await sendToGHL(payload);
  } catch (err) {
    console.error("[proposal/route] GHL webhook error:", err);
    return Response.json(
      { error: "We could not save your Automation Map request. Please try again or contact AskSaul directly." },
      { status: 502 }
    );
  }

  const alertResult = await sendInternalLeadAlert({
    route: "/build-your-proposal",
    source: payload.source,
    leadProject: payload.lead_project,
    name: result.data.name,
    email: result.data.email,
    phone: result.data.phone,
    businessName: result.data.businessName,
    intent: result.data.services.join(", "),
    tags: payload.tags,
    summary: result.data.notes || `Services: ${result.data.services.join(", ")}; timeline: ${result.data.timeline}; budget: ${result.data.budget ?? "not provided"}`,
    bookingUrl,
  });
  if (!alertResult.ok) console.warn("[proposal/route] internal alert failed:", alertResult);

  let smsResult: Awaited<ReturnType<typeof sendSendblueMessage>> | undefined;
  try {
    smsResult = await sendSendblueMessage({
      to: result.data.phone,
      body: `Thanks for requesting your AskSaul Automation Map. Gregory has your context and will review it. If you want to grab a demo time now: ${bookingUrl} Reply STOP to opt out.`,
    });
    if (!smsResult.ok) {
      console.warn("[proposal/route] Sendblue thank-you SMS failed:", smsResult);
    }
  } catch (err) {
    console.warn("[proposal/route] Sendblue thank-you SMS threw after lead capture succeeded:", err);
    smsResult = { ok: false, error: "Sendblue request threw after lead capture succeeded" };
  }

  return Response.json({
    success: true,
    estimatedValue: payload.estimated_value,
    bookingUrl,
    sms: smsResult ?? { ok: false, error: "SMS not attempted" },
    alert: alertResult,
  });
}
