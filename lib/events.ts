import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

export type ProposalEventType =
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

export type ProposalEventActor = "system" | "saul" | "gregory" | "prospect";

/**
 * Append-only audit log row. Never throws — logging failures shouldn't kill
 * the caller's flow; they just surface in the console for now.
 */
export async function logProposalEvent(
  proposalId: string,
  eventType: ProposalEventType,
  payload: Record<string, unknown> = {},
  actor: ProposalEventActor = "system",
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("proposal_events").insert({
      proposal_id: proposalId,
      event_type: eventType,
      actor,
      payload,
    });
    if (error) {
      console.error("[events] insert failed", {
        proposalId,
        eventType,
        error: error.message,
      });
    }
  } catch (err) {
    console.error("[events] unexpected error", { proposalId, eventType, err });
  }
}
