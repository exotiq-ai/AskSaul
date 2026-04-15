import { SyncToGhlInput, type SyncToGhlInputT } from "../schemas.js";

export const syncToGhlTool = {
  name: "sync_to_ghl",
  description:
    "Push a proposal (contact + opportunity) to GoHighLevel. Stub for Phase 6 — not yet implemented. Calling this today raises an error; the interface exists so Saul can discover the eventual capability.",
  inputSchema: {
    type: "object" as const,
    properties: {
      proposalId: { type: "string", format: "uuid" },
    },
    required: ["proposalId"],
  },
  async run(raw: unknown) {
    const _input: SyncToGhlInputT = SyncToGhlInput.parse(raw);
    throw new Error("sync-to-ghl: implement after Phase 6");
  },
};
