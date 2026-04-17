import { z } from "zod";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ElevenLabsClient, type AgentConfig, type KbAttachment } from "../elevenlabs-client.js";

export const provisionAgentInput = z.object({
  client_dir: z.string().default("docs/clients/wolfs-tailor"),
  existing_agent_id: z.string().optional(),
  attach_kb_docs: z.boolean().default(true),
});

export type ProvisionInput = z.infer<typeof provisionAgentInput>;

export async function runProvisionAgent(input: ProvisionInput) {
  const client = new ElevenLabsClient();

  const cfg = JSON.parse(await readFile(join(input.client_dir, "voice-config.json"), "utf8"));
  const systemPrompt = await readFile(join(input.client_dir, "system-prompt.md"), "utf8");

  const kbDocs: KbAttachment[] = [];
  if (input.attach_kb_docs) {
    const docs = (await client.listKbDocuments()).documents;
    const slug = cfg.client_slug;
    for (const d of docs) {
      if (d.name.startsWith(`${slug}/`)) {
        kbDocs.push({ type: "file", id: d.id, name: d.name });
      }
    }
  }

  const agentConfig: AgentConfig = {
    name: cfg.agent_name,
    conversation_config: {
      agent: {
        prompt: {
          prompt: systemPrompt,
          llm: cfg.llm,
          temperature: cfg.temperature,
          // KB attaches on prompt per live API shape.
          // Tools attached in Task 2.14 after the endpoints exist.
          knowledge_base: kbDocs,
        },
        first_message: cfg.first_message,
        language: cfg.language,
      },
      tts: {
        voice_id: cfg.voice_id,
        model_id: cfg.tts_model_id,
        stability: cfg.voice_settings.stability,
        similarity_boost: cfg.voice_settings.similarity_boost,
        style: cfg.voice_settings.style,
        use_speaker_boost: cfg.voice_settings.use_speaker_boost,
      },
      conversation: { max_duration_seconds: cfg.max_duration_seconds },
    },
  };

  if (input.existing_agent_id) {
    await client.updateAgent(input.existing_agent_id, agentConfig);
    return { agent_id: input.existing_agent_id, action: "updated", kb_docs: kbDocs.length };
  }

  const created = await client.createAgent(agentConfig);
  return { agent_id: created.agent_id, action: "created", kb_docs: kbDocs.length };
}

export const provisionAgentTool = {
  name: "provision_agent",
  description:
    "Create or update the agent for a client from voice-config.json + system-prompt.md. Attaches all KB docs matching the client slug. Pass existing_agent_id to update in place.",
  inputSchema: {
    type: "object",
    properties: {
      client_dir: { type: "string", default: "docs/clients/wolfs-tailor" },
      existing_agent_id: { type: "string" },
      attach_kb_docs: { type: "boolean", default: true },
    },
  },
  async run(raw: unknown) {
    const input = provisionAgentInput.parse(raw);
    return runProvisionAgent(input);
  },
};
