import { type NextRequest } from "next/server";
import { proposalSchema } from "@/lib/validation";
import { buildProposalPayload, sendToGHL } from "@/lib/ghl";

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
      { error: "We could not save your proposal request. Please try again or contact AskSaul directly." },
      { status: 502 }
    );
  }

  return Response.json({ success: true, estimatedValue: payload.estimated_value });
}
