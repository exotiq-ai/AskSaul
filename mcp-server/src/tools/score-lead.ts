import { getSupabaseAdmin } from "../supabase.js";
import { ScoreLeadInput, type ScoreLeadInputT } from "../schemas.js";
import { calculateEstimatedValue, getLeadValueTag } from "../scoring.js";
import { logEvent } from "../supabase.js";

export const scoreLeadTool = {
  name: "score_lead",
  description:
    "Recompute the estimated value (USD) for a proposal using the same algorithm the Next.js app uses at submit time. By default returns the value only; set persist=true to write estimated_value_usd and lead_value_tag back to the proposal row.",
  inputSchema: {
    type: "object" as const,
    properties: {
      proposalId: { type: "string", format: "uuid" },
      persist: { type: "boolean", default: false },
    },
    required: ["proposalId"],
  },
  async run(raw: unknown) {
    const input: ScoreLeadInputT = ScoreLeadInput.parse(raw);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("proposals")
      .select("id, services, budget, monthly_spend, service_details, estimated_value_usd, lead_value_tag")
      .eq("id", input.proposalId)
      .single();
    if (error) throw new Error(`score_lead: ${error.message}`);

    const newEstimate = calculateEstimatedValue({
      services: data.services ?? [],
      budget: data.budget,
      monthly_spend: data.monthly_spend,
      service_details: data.service_details ?? {},
    });
    const newTag = getLeadValueTag(newEstimate);

    if (input.persist) {
      const { error: updErr } = await supabase
        .from("proposals")
        .update({
          estimated_value_usd: newEstimate,
          lead_value_tag: newTag,
        })
        .eq("id", input.proposalId);
      if (updErr) throw new Error(`score_lead persist: ${updErr.message}`);

      await logEvent({
        proposalId: input.proposalId,
        eventType: "note_added",
        payload: {
          reason: "score_lead recompute",
          previous: {
            estimated_value_usd: data.estimated_value_usd,
            lead_value_tag: data.lead_value_tag,
          },
          next: {
            estimated_value_usd: newEstimate,
            lead_value_tag: newTag,
          },
        },
      });
    }

    return {
      proposalId: input.proposalId,
      previous: {
        estimated_value_usd: data.estimated_value_usd,
        lead_value_tag: data.lead_value_tag,
      },
      computed: {
        estimated_value_usd: newEstimate,
        lead_value_tag: newTag,
      },
      persisted: input.persist,
    };
  },
};
