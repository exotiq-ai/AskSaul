import { type NextRequest } from "next/server";
import { messageForTeamInput } from "@/lib/voice/schemas";
import { verifyToolSecret, unauthorizedResponse } from "@/lib/voice/auth";
import { getVoiceSupabase } from "@/lib/voice/supabase";
import { sendLeadEmail } from "@/lib/voice/email";

export async function POST(request: NextRequest | Request) {
  if (!verifyToolSecret(request as Request)) return unauthorizedResponse();

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = messageForTeamInput.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;

  const sb = getVoiceSupabase();
  const { error } = await sb.from("voice_leads").insert({
    conversation_id: d.conversation_id,
    kind: "escalation",
    name: d.name,
    phone: d.phone,
    reason: d.reason,
    notes: d.notes,
  });
  if (error) console.error("[message-for-team] supabase error:", error);

  try {
    await sendLeadEmail({
      kind: "escalation",
      name: d.name,
      phone: d.phone,
      reason: d.reason,
      notes: d.notes,
      allergy_flag: false,
      conversation_id: d.conversation_id,
    });
  } catch (e) {
    console.error("[message-for-team] resend error:", e);
  }

  return Response.json({
    status: "captured",
    confirmation: "Thanks for letting me know. Someone will reach out within one business day.",
  });
}
