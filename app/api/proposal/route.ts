import { type NextRequest } from "next/server";
import { proposalSchema } from "@/lib/validation";
import { buildProposalPayload, sendToGHL } from "@/lib/ghl";
import { sendSendblueMessage } from "@/lib/sendblue";

const DEFAULT_BOOKING_URL =
  "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-3d837e4b-c899-44ff-b612-275f498c2128";

function getBookingUrl() {
  return process.env.ASKSAUL_DEMO_BOOKING_URL || DEFAULT_BOOKING_URL;
}

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

  try {
    await sendToGHL(payload);
  } catch (err) {
    console.error("[proposal/route] GHL webhook error:", err);
    return Response.json(
      { error: "We could not save your Automation Map request. Please try again or contact AskSaul directly." },
      { status: 502 }
    );
  }

  let smsResult: Awaited<ReturnType<typeof sendSendblueMessage>> | undefined;
  try {
    smsResult = await sendSendblueMessage({
      to: result.data.phone,
      body: `Thanks for requesting your AskSaul Automation Map. Gregory has your context and will review it. If you want to grab a demo time now: ${getBookingUrl()} Reply STOP to opt out.`,
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
    sms: smsResult ?? { ok: false, error: "SMS not attempted" },
  });
}
