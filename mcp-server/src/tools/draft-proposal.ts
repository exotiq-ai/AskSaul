import { getSupabaseAdmin, logEvent } from "../supabase.js";
import { DraftProposalInput, type DraftProposalInputT } from "../schemas.js";
import { renderDraft } from "../renderer.js";

export const draftProposalTool = {
  name: "draft_proposal",
  description:
    "Compose a quote draft for a proposal. Renders markdown + HTML bodies and inserts a new proposal_drafts row with status='pending_approval'. Auto-increments the version number. Log a quote_drafted event. Returns the new draft row so Saul can show Gregory before sending.",
  inputSchema: {
    type: "object" as const,
    properties: {
      proposalId: { type: "string", format: "uuid" },
      scopeSummary: { type: "string", minLength: 1 },
      deliverables: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
          required: ["title"],
        },
      },
      priceUsd: { type: "integer", minimum: 0 },
      priceModel: { type: "string", enum: ["fixed", "retainer", "hybrid"] },
      timelineWeeks: { type: "integer", minimum: 1 },
      terms: { type: "string" },
    },
    required: [
      "proposalId",
      "scopeSummary",
      "deliverables",
      "priceUsd",
      "priceModel",
      "timelineWeeks",
    ],
  },
  async run(raw: unknown) {
    const input: DraftProposalInputT = DraftProposalInput.parse(raw);
    const supabase = getSupabaseAdmin();

    const { data: proposal, error: pErr } = await supabase
      .from("proposals")
      .select("id, business_name, contact_first_name, contact_email")
      .eq("id", input.proposalId)
      .single();
    if (pErr) throw new Error(`draft_proposal lookup: ${pErr.message}`);

    const { data: versionRows, error: vErr } = await supabase
      .from("proposal_drafts")
      .select("version")
      .eq("proposal_id", input.proposalId)
      .order("version", { ascending: false })
      .limit(1);
    if (vErr) throw new Error(`draft_proposal version: ${vErr.message}`);
    const nextVersion = (versionRows?.[0]?.version ?? 0) + 1;

    const rendered = renderDraft({
      businessName: proposal.business_name,
      contactFirstName: proposal.contact_first_name,
      scopeSummary: input.scopeSummary,
      deliverables: input.deliverables,
      priceUsd: input.priceUsd,
      priceModel: input.priceModel,
      timelineWeeks: input.timelineWeeks,
      terms: input.terms,
    });

    const { data: draft, error: iErr } = await supabase
      .from("proposal_drafts")
      .insert({
        proposal_id: input.proposalId,
        version: nextVersion,
        created_by: "saul",
        status: "pending_approval",
        scope_summary: input.scopeSummary,
        deliverables: input.deliverables,
        price_usd: input.priceUsd,
        price_model: input.priceModel,
        timeline_weeks: input.timelineWeeks,
        terms: input.terms ?? null,
        markdown_body: rendered.markdown,
        html_body: rendered.html,
      })
      .select("*")
      .single();
    if (iErr) throw new Error(`draft_proposal insert: ${iErr.message}`);

    await logEvent({
      proposalId: input.proposalId,
      eventType: "quote_drafted",
      actor: "saul",
      payload: {
        draft_id: draft.id,
        version: nextVersion,
        price_usd: input.priceUsd,
        price_model: input.priceModel,
        timeline_weeks: input.timelineWeeks,
      },
    });

    return { draft };
  },
};
