import { getSupabaseAdmin } from "../supabase.js";
import { GetProposalInput, type GetProposalInputT } from "../schemas.js";

export const getProposalTool = {
  name: "get_proposal",
  description:
    "Fetch a single proposal by id, including service_details, vertical_details, the latest draft, and the 20 most recent events. Use this when Saul needs full context to draft a quote or review a lead.",
  inputSchema: {
    type: "object" as const,
    properties: {
      proposalId: { type: "string", format: "uuid" },
    },
    required: ["proposalId"],
  },
  async run(raw: unknown) {
    const input: GetProposalInputT = GetProposalInput.parse(raw);
    const supabase = getSupabaseAdmin();

    const { data: proposal, error: pErr } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", input.proposalId)
      .single();
    if (pErr) throw new Error(`get_proposal: ${pErr.message}`);

    const { data: drafts, error: dErr } = await supabase
      .from("proposal_drafts")
      .select("*")
      .eq("proposal_id", input.proposalId)
      .order("version", { ascending: false })
      .limit(1);
    if (dErr) throw new Error(`get_proposal drafts: ${dErr.message}`);

    const { data: events, error: eErr } = await supabase
      .from("proposal_events")
      .select("id, created_at, event_type, actor, payload")
      .eq("proposal_id", input.proposalId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (eErr) throw new Error(`get_proposal events: ${eErr.message}`);

    return {
      proposal,
      latestDraft: drafts?.[0] ?? null,
      recentEvents: events ?? [],
    };
  },
};
