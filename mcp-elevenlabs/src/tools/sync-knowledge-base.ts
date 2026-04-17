import { z } from "zod";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { ElevenLabsClient, type KbDocument } from "../elevenlabs-client.js";

export const syncKnowledgeBaseInput = z.object({
  client_slug: z.string().default("wolfs-tailor"),
  kb_dir: z.string().default("docs/clients/wolfs-tailor/kb"),
  dry_run: z.boolean().default(false),
});

export type SyncInput = z.infer<typeof syncKnowledgeBaseInput>;

export interface SyncResult {
  uploaded: KbDocument[];
  skipped: string[];
  errors: { file: string; error: string }[];
}

export async function runSyncKnowledgeBase(input: SyncInput): Promise<SyncResult> {
  const client = new ElevenLabsClient();
  const files = (await readdir(input.kb_dir)).filter((f) => f.endsWith(".md"));
  const existing = await client.listKbDocuments().then((r) => r.documents).catch(() => []);
  const existingByName = new Map(existing.map((d) => [d.name, d] as const));

  const result: SyncResult = { uploaded: [], skipped: [], errors: [] };

  for (const file of files) {
    const docName = `${input.client_slug}/${file}`;
    const content = await readFile(join(input.kb_dir, file), "utf8");

    if (input.dry_run) {
      result.skipped.push(docName);
      continue;
    }

    try {
      // Re-upload replaces. Delete the old doc by name if it exists.
      const prior = existingByName.get(docName);
      if (prior) await client.deleteKbDocument(prior.id);

      const doc = await client.uploadKbFile(docName, content);
      result.uploaded.push(doc);
    } catch (err) {
      result.errors.push({ file, error: (err as Error).message });
    }
  }

  return result;
}

export const syncKnowledgeBaseTool = {
  name: "sync_knowledge_base",
  description:
    "Upload all markdown KB files for a client (docs/clients/<slug>/kb/*.md) to ElevenLabs. Set dry_run=true to see what would change.",
  inputSchema: {
    type: "object",
    properties: {
      client_slug: { type: "string", default: "wolfs-tailor" },
      kb_dir: { type: "string", default: "docs/clients/wolfs-tailor/kb" },
      dry_run: { type: "boolean", default: false },
    },
  },
  async run(raw: unknown) {
    const input = syncKnowledgeBaseInput.parse(raw);
    return runSyncKnowledgeBase(input);
  },
};
