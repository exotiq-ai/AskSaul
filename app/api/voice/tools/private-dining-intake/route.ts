import { type NextRequest } from "next/server";
import { privateDiningInput } from "@/lib/voice/schemas";
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

  const parsed = privateDiningInput.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;

  const mergedNotes =
    [d.preferred_experience && `prefers: ${d.preferred_experience}`, d.notes]
      .filter(Boolean)
      .join(" | ") || undefined;

  const sb = getVoiceSupabase();
  const { error } = await sb.from("voice_leads").insert({
    conversation_id: d.conversation_id,
    kind: "private_dining",
    name: d.name,
    phone: d.phone,
    email: d.email,
    party_size: d.party_size,
    requested_date: d.requested_date,
    occasion: d.occasion,
    notes: mergedNotes,
  });
  if (error) console.error("[private-dining-intake] supabase error:", error);

  try {
    await sendLeadEmail({
      kind: "private_dining",
      name: d.name,
      phone: d.phone,
      email: d.email,
      party_size: d.party_size,
      occasion: d.occasion,
      allergy_flag: false,
      notes: mergedNotes,
      conversation_id: d.conversation_id,
    });
  } catch (e) {
    console.error("[private-dining-intake] resend error:", e);
  }

  return Response.json({
    status: "captured",
    confirmation:
      "Perfect. Someone from our events team will reach out within one business day to walk you through options.",
  });
}
