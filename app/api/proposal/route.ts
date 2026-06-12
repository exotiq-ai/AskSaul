import { type NextRequest } from "next/server";
import { proposalSchema } from "@/lib/validation";
import { buildProposalPayload, getAskSaulBookingUrl, sendToGHL } from "@/lib/ghl";
import { sendInternalLeadAlert } from "@/lib/internal-alerts";

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
  let ghlResult: Awaited<ReturnType<typeof sendToGHL>>;

  try {
    ghlResult = await sendToGHL(payload);
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

  return Response.json({
    success: true,
    estimatedValue: payload.estimated_value,
    bookingUrl,
    sms: { ok: true, skipped: true, reason: "SMS intentionally disabled" },
    ghl: ghlResult,
    alert: alertResult,
  });
}
