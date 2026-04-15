import { Resend } from "resend";

let cached: Resend | null = null;

function getResend(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY in environment.");
  cached = new Resend(key);
  return cached;
}

export interface SendProposalEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendProposalEmailResult {
  id: string;
}

export async function sendProposalEmail(
  params: SendProposalEmailParams
): Promise<SendProposalEmailResult> {
  const resend = getResend();
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const fromName = process.env.RESEND_FROM_NAME ?? "AskSaul";
  if (!fromEmail) throw new Error("Missing RESEND_FROM_EMAIL in environment.");

  const from = `${fromName} <${fromEmail}>`;
  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
  });

  if (error) throw new Error(`Resend send failed: ${error.message}`);
  if (!data?.id) throw new Error("Resend send returned no message id.");
  return { id: data.id };
}
