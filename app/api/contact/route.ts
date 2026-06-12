import { type NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation";
import { buildContactPayload, getAskSaulBookingUrl, sendToGHL } from "@/lib/ghl";
import { sendInternalLeadAlert } from "@/lib/internal-alerts";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 422 }
    );
  }

  const payload = buildContactPayload(result.data);
  const bookingUrl = getAskSaulBookingUrl();

  let ghlResult: Awaited<ReturnType<typeof sendToGHL>>;
  try {
    ghlResult = await sendToGHL(payload);
  } catch (err) {
    console.error("[contact/route] GHL webhook error:", err);
    return Response.json(
      { error: "We could not save your message. Please email or call AskSaul directly." },
      { status: 502 }
    );
  }

  const alertResult = await sendInternalLeadAlert({
    route: "/contact",
    source: payload.source,
    leadProject: payload.lead_project,
    name: `${result.data.firstName} ${result.data.lastName}`.trim(),
    email: result.data.email,
    phone: result.data.phone,
    intent: "contact-form",
    tags: payload.tags,
    summary: result.data.message,
    bookingUrl,
  });
  if (!alertResult.ok) console.warn("[contact/route] internal alert failed:", alertResult);

  return Response.json({ success: true, bookingUrl, ghl: ghlResult, alert: alertResult });
}
