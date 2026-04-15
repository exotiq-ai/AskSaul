import type { ProposalFormData, ContactFormData, ChatLeadData } from "./validation";
import { buildGhlWebhookPayload } from "./payload";
import {
  calculateEstimatedValue,
  getLeadValueTag,
  buildTags,
} from "./scoring";

// Re-export scoring for backwards compatibility
export {
  calculateEstimatedValue,
  getLeadValueTag,
} from "./scoring";

// ─── Legacy payload builders ────────────────────────────────────────────────
// Kept for the contact form + chat widget, which still POST to the legacy
// GHL webhook. The proposal builder uses Supabase as its canonical path now.

export function buildProposalPayload(
  data: ProposalFormData,
  proposalId: string = "",
) {
  return buildGhlWebhookPayload(data, proposalId);
}

export function buildContactPayload(data: ContactFormData) {
  return {
    source: "asksaul-contact-form",
    timestamp: new Date().toISOString(),
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? "",
      message: data.message,
      referralSource: data.referralSource ?? "",
    },
    tags: ["contact-form", "website-lead"],
  };
}

export function buildChatPayload(data: ChatLeadData) {
  return {
    source: "asksaul-chat-widget",
    timestamp: new Date().toISOString(),
    contact: {
      name: data.name,
      email: data.email,
    },
    chatTranscript: data.chatTranscript,
    initialIntent: data.initialIntent ?? "browsing",
    tags: ["chat-widget", "website-lead"],
  };
}

// Helper used elsewhere
export function buildLeadTags(data: ProposalFormData): string[] {
  const value = calculateEstimatedValue(data);
  return buildTags(data, getLeadValueTag(value));
}

// ─── Webhook POST ───────────────────────────────────────────────────────────

export interface GhlSyncResult {
  ok: boolean;
  status: number | null;
  error: string | null;
}

/**
 * Fire the legacy GHL webhook. Callers decide how to handle failures; this
 * does NOT swallow errors — it returns them so the API route can log to
 * proposal_events.
 */
export async function sendToGHL(payload: unknown): Promise<GhlSyncResult> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    return { ok: false, status: null, error: "GHL_WEBHOOK_URL not set" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        status: res.status,
        error: `GHL webhook ${res.status}: ${body.slice(0, 200)}`,
      };
    }

    return { ok: true, status: res.status, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, status: null, error: message };
  }
}
