import { Resend } from "resend";

export type LeadEmailPayload = {
  kind: "booking_request" | "private_dining" | "escalation";
  name: string;
  phone: string;
  email?: string;
  date?: string;
  time?: string;
  party_size?: number;
  occasion?: string;
  allergies?: string;
  allergy_flag: boolean;
  reason?: string;
  notes?: string;
  conversation_id: string;
};

function subject(p: LeadEmailPayload): string {
  const prefix = p.allergy_flag ? "⚠️ ALLERGY-ACKNOWLEDGED — " : "";
  const urgent = p.reason === "refund_dispute" ? "[URGENT] " : "";
  switch (p.kind) {
    case "booking_request":
      return `${prefix}[Wolf's Tailor] New booking lead — ${p.name} party of ${p.party_size ?? "?"} on ${p.date ?? "TBD"}`;
    case "private_dining":
      return `[Wolf's Tailor] Private dining inquiry — ${p.name}, party of ${p.party_size ?? "?"}`;
    case "escalation":
      return `${urgent}[Wolf's Tailor] Escalation — ${p.reason} — ${p.name}`;
  }
}

function body(p: LeadEmailPayload): string {
  const lines = [
    `**Kind:** ${p.kind}`,
    `**Name:** ${p.name}`,
    `**Phone:** ${p.phone}`,
    p.email && `**Email:** ${p.email}`,
    p.date && `**Date:** ${p.date}${p.time ? ` ${p.time}` : ""}`,
    p.party_size !== undefined && `**Party size:** ${p.party_size}`,
    p.occasion && `**Occasion:** ${p.occasion}`,
    p.allergies && `**Allergies:** ${p.allergies}${p.allergy_flag ? " ⚠️ POLICY-SENSITIVE" : ""}`,
    p.reason && `**Reason:** ${p.reason}`,
    p.notes && `**Notes:** ${p.notes}`,
    ``,
    `Conversation: ${p.conversation_id}`,
    `Admin: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/voice/${p.conversation_id}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function sendLeadEmail(p: LeadEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INTERNAL_NOTIFICATION_EMAIL;
  const from = `${process.env.RESEND_FROM_NAME ?? "Saul"} <${process.env.RESEND_FROM_EMAIL ?? "saul3000bot@gmail.com"}>`;
  if (!apiKey || !to) {
    console.error("[voice/email] missing RESEND_API_KEY or INTERNAL_NOTIFICATION_EMAIL — skipping");
    return;
  }
  const resend = new Resend(apiKey);
  const text = body(p);
  await resend.emails.send({ from, to, subject: subject(p), text });
}
