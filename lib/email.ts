import { Resend } from "resend";

/**
 * Resend wrapper. Never throws — callers get {id|null, error|null} and decide
 * whether to log / retry / alert. We want email failures to be observable but
 * not block proposal submission.
 */

let cached: Resend | null = null;

function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export interface SendResult {
  id: string | null;
  error: string | null;
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
  fromName?: string;
}

export async function sendEmail(args: SendArgs): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    return { id: null, error: "RESEND_API_KEY not set" };
  }

  const fromEmail = args.from ?? process.env.RESEND_FROM_EMAIL ?? "saul3000bot@gmail.com";
  const fromName = args.fromName ?? process.env.RESEND_FROM_NAME ?? "Saul";
  const from = `${fromName} <${fromEmail}>`;

  try {
    const result = await resend.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
    });

    if (result.error) {
      return { id: null, error: result.error.message ?? "Unknown Resend error" };
    }
    return { id: result.data?.id ?? null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { id: null, error: message };
  }
}
