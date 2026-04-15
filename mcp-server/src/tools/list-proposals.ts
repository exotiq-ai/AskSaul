import { getSupabaseAdmin } from "../supabase.js";
import { ListProposalsInput, type ListProposalsInputT } from "../schemas.js";

export const listProposalsTool = {
  name: "list_proposals",
  description:
    "List proposal submissions, newest first. Optionally filter by status, by creation date (since), and limit. Returns compact summaries only — call get_proposal for full detail.",
  inputSchema: {
    type: "object" as const,
    properties: {
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
      since: {
        type: "string",
        description: "ISO 8601 timestamp; only proposals created at/after this.",
      },
      limit: { type: "number", default: 25, minimum: 1, maximum: 200 },
    },
  },
  async run(raw: unknown) {
    const input: ListProposalsInputT = ListProposalsInput.parse(raw ?? {});
    const supabase = getSupabaseAdmin();
    let q = supabase
      .from("proposals")
      .select(
        "id, created_at, status, business_name, contact_first_name, contact_last_name, contact_email, services, industry_label, estimated_value_usd, lead_value_tag, timeline, budget"
      )
      .order("created_at", { ascending: false })
      .limit(input.limit);

    if (input.status) q = q.eq("status", input.status);
    if (input.since) q = q.gte("created_at", input.since);

    const { data, error } = await q;
    if (error) throw new Error(`list_proposals: ${error.message}`);
    return { proposals: data ?? [], count: data?.length ?? 0 };
  },
};
