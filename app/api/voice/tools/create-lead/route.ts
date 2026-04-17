import { type NextRequest } from "next/server";
import { createLeadInput } from "@/lib/voice/schemas";
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

  const parsed = createLeadInput.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;

  const sb = getVoiceSupabase();
  const { error } = await sb.from("voice_leads").insert({
    conversation_id: d.conversation_id,
    kind: "booking_request",
    name: d.name,
    phone: d.phone,
    email: d.email,
    party_size: d.party_size,
    requested_date: d.date,
    requested_time: d.time,
    occasion: d.occasion,
    allergies: d.allergies,
    allergy_flag: d.allergy_flag,
    notes: d.notes,
  });
  if (error) console.error("[create-lead] supabase insert error:", error);

  try {
    await sendLeadEmail({
      kind: "booking_request",
      name: d.name,
      phone: d.phone,
      email: d.email,
      date: d.date,
      time: d.time,
      party_size: d.party_size,
      occasion: d.occasion,
      allergies: d.allergies,
      allergy_flag: d.allergy_flag,
      notes: d.notes,
      conversation_id: d.conversation_id,
    });
  } catch (e) {
    console.error("[create-lead] resend error:", e);
  }

  return Response.json({
    status: "captured",
    confirmation:
      "Got it. Someone from the team will confirm your booking within one business day.",
  });
}
