import { type NextRequest } from "next/server";
import { chatLeadSchema } from "@/lib/validation";
import { BOOKING_URL, buildChatPayload, sendToGHL } from "@/lib/ghl";

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

  try {
    await sendToGHL(payload);
  } catch (err) {
    console.error("[chat/route] GHL webhook error:", err);
    return Response.json(
      { error: "We could not save your chat details. Please try again or contact AskSaul directly." },
      { status: 502 }
    );
  }

  return Response.json({
    success: true,
    bookingUrl: result.data.handoffIntent === "book-demo" ? BOOKING_URL : undefined,
  });
}
