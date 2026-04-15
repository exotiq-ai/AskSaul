import { getSupabaseAdmin, logEvent } from "../supabase.js";
import { UpdateStatusInput, type UpdateStatusInputT } from "../schemas.js";

export const updateStatusTool = {
  name: "update_status",
  description:
    "Update a proposal's status (submitted|reviewed|quoted|accepted|rejected|lost|won) and log a status_changed event with an optional note. Use this when moving a lead through the pipeline (e.g., mark as 'reviewed' after Saul's initial triage, or 'won' after the prospect signs).",
  inputSchema: {
    type: "object" as const,
    properties: {
      proposalId: { type: "string", format: "uuid" },
      status: {
        type: "string",
        enum: [
          "submitted",
          "reviewed",
          "quoted",
          "accepted",
          "rejected",
          "lost",
          "won",
        ],
      },
      note: { type: "string" },
    },
    required: ["proposalId", "status"],
  },
  async run(raw: unknown) {
    const input: UpdateStatusInputT = UpdateStatusInput.parse(raw);
    const supabase = getSupabaseAdmin();

    const { data: before, error: bErr } = await supabase
      .from("proposals")
      .select("id, status")
      .eq("id", input.proposalId)
      .single();
    if (bErr) throw new Error(`update_status read: ${bErr.message}`);

    const { error: uErr } = await supabase
      .from("proposals")
      .update({ status: input.status })
      .eq("id", input.proposalId);
    if (uErr) throw new Error(`update_status write: ${uErr.message}`);

    await logEvent({
      proposalId: input.proposalId,
      eventType: "status_changed",
      actor: "saul",
      payload: {
        from: before.status,
        to: input.status,
        ...(input.note ? { note: input.note } : {}),
      },
    });

    return {
      proposalId: input.proposalId,
      previousStatus: before.status,
      status: input.status,
    };
  },
};
