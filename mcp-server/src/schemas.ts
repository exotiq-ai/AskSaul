import { z } from "zod";

export const ListProposalsInput = z.object({
  status: z
    .enum([
      "submitted",
      "reviewed",
      "quoted",
      "accepted",
      "rejected",
      "lost",
      "won",
    ])
    .optional(),
  since: z
    .string()
    .describe("ISO 8601 timestamp; only proposals created at/after this")
    .optional(),
  limit: z.number().int().min(1).max(200).default(25),
});
export type ListProposalsInputT = z.infer<typeof ListProposalsInput>;

export const GetProposalInput = z.object({
  proposalId: z.string().uuid(),
});
export type GetProposalInputT = z.infer<typeof GetProposalInput>;

export const ScoreLeadInput = z.object({
  proposalId: z.string().uuid(),
  persist: z
    .boolean()
    .default(false)
    .describe("If true, write the recomputed value back to the proposal row."),
});
export type ScoreLeadInputT = z.infer<typeof ScoreLeadInput>;

export const DeliverableSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});
export type Deliverable = z.infer<typeof DeliverableSchema>;

export const DraftProposalInput = z.object({
  proposalId: z.string().uuid(),
  scopeSummary: z.string().min(1),
  deliverables: z.array(DeliverableSchema).min(1),
  priceUsd: z.number().int().nonnegative(),
  priceModel: z.enum(["fixed", "retainer", "hybrid"]),
  timelineWeeks: z.number().int().positive(),
  terms: z.string().optional(),
});
export type DraftProposalInputT = z.infer<typeof DraftProposalInput>;

export const ApproveAndSendInput = z.object({
  draftId: z.string().uuid(),
});
export type ApproveAndSendInputT = z.infer<typeof ApproveAndSendInput>;

export const UpdateStatusInput = z.object({
  proposalId: z.string().uuid(),
  status: z.enum([
    "submitted",
    "reviewed",
    "quoted",
    "accepted",
    "rejected",
    "lost",
    "won",
  ]),
  note: z.string().optional(),
});
export type UpdateStatusInputT = z.infer<typeof UpdateStatusInput>;

export const SyncToGhlInput = z.object({
  proposalId: z.string().uuid(),
});
export type SyncToGhlInputT = z.infer<typeof SyncToGhlInput>;
