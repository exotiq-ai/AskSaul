import { type NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation";
import { buildContactPayload, sendToGHL } from "@/lib/ghl";

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

  try {
    await sendToGHL(payload);
  } catch (err) {
    console.error("[contact/route] GHL webhook error:", err);
  }

  return Response.json({ success: true });
}
