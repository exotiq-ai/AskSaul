import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
    );
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export type EventType =
  | "submitted"
  | "ghl_synced"
  | "ghl_failed"
  | "ghl_retry_attempted"
  | "email_sent"
  | "email_failed"
  | "email_opened"
  | "email_clicked"
  | "reviewed_by_saul"
  | "quote_drafted"
  | "quote_approved"
  | "quote_sent"
  | "quote_viewed"
  | "quote_accepted"
  | "quote_rejected"
  | "status_changed"
  | "note_added";

export type Actor = "system" | "saul" | "gregory" | "prospect";

export async function logEvent(params: {
  proposalId: string;
  eventType: EventType;
  actor?: Actor;
  payload?: Record<string, unknown>;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("proposal_events").insert({
    proposal_id: params.proposalId,
    event_type: params.eventType,
    actor: params.actor ?? "saul",
    payload: params.payload ?? {},
  });
  if (error) {
    // Don't blow up the tool call on audit failure — surface via stderr.
    console.error("[logEvent] failed:", error.message);
  }
}
