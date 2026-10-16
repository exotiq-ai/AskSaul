#!/usr/bin/env node
// Builds the website sales agent's prompt from docs/sales-agent and creates or
// updates it on ElevenLabs. Usage:
//   SALES_AGENT_DIR=<private folder> node --env-file=.env.local scripts/sales-agent/provision.mjs [--dry-run] [--allow-host host]...
// Writes the agent id to lib/sales-agent/agent-id.ts on first create.
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
// The prompt and knowledge base are private sales material, kept outside this
// (public) repo. Point SALES_AGENT_DIR at the folder that holds
// system-prompt.md, agent-config.json, and kb/.
const DIR = process.env.SALES_AGENT_DIR;
if (!DIR) {
  console.error("Set SALES_AGENT_DIR to the private sales-agent folder (system-prompt.md, agent-config.json, kb/).");
  process.exit(1);
}
const ID_FILE = join(ROOT, "lib/sales-agent/agent-id.ts");
const API = "https://api.elevenlabs.io/v1";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const extraHosts = args.flatMap((a, i) => (a === "--allow-host" ? [args[i + 1]] : []));

export async function buildPrompt() {
  const system = await readFile(join(DIR, "system-prompt.md"), "utf8");
  const files = (await readdir(join(DIR, "kb"))).filter((f) => f.endsWith(".md")).sort();
  const docs = await Promise.all(files.map(async (f) => (await readFile(join(DIR, "kb", f), "utf8")).trim()));
  return `${system.trim()}\n\n---\n\n# KNOWLEDGE BASE\n\n${docs.join("\n\n---\n\n")}\n`;
}

async function currentAgentId() {
  try {
    const src = await readFile(ID_FILE, "utf8");
    return src.match(/"(agent_[a-z0-9]+)"/)?.[1];
  } catch {
    return undefined;
  }
}

async function api(path, init = {}) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY not set");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "xi-api-key": key, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} -> ${res.status}: ${body.slice(0, 800)}`);
  return body ? JSON.parse(body) : {};
}

const cfg = JSON.parse(await readFile(join(DIR, "agent-config.json"), "utf8"));
const prompt = await buildPrompt();

const agentConfig = {
  name: cfg.name,
  conversation_config: {
    agent: {
      first_message: "",
      language: "en",
      dynamic_variables: { dynamic_variable_placeholders: cfg.dynamic_variable_placeholders },
      prompt: {
        prompt,
        llm: cfg.llm,
        reasoning_effort: cfg.reasoning_effort,
        max_tokens: cfg.max_tokens,
      },
    },
    tts: { voice_id: cfg.voice_id, model_id: cfg.tts_model_id },
    conversation: {
      text_only: false,
      max_duration_seconds: cfg.max_duration_seconds,
      client_events: [
        "audio",
        "interruption",
        "user_transcript",
        "agent_response",
        "agent_response_correction",
        "agent_tool_request",
        "agent_tool_response",
        "agent_chat_response_part",
      ],
    },
  },
  platform_settings: {
    auth: {
      enable_auth: false,
      allowlist: [...cfg.allowed_hosts, ...extraHosts].map((hostname) => ({ hostname })),
    },
    call_limits: { agent_concurrency_limit: -1, daily_limit: cfg.daily_limit, bursting_enabled: true },
    overrides: {
      conversation_config_override: {
        conversation: { text_only: true },
        agent: { first_message: true },
      },
    },
    guardrails: { version: "1", focus: { is_enabled: true }, prompt_injection: { is_enabled: true } },
  },
};

console.log(`prompt: ${prompt.length} chars (~${Math.round(prompt.length / 4)} tokens), tools: ${cfg.client_tools.length}`);
console.log(`allowed hosts: ${agentConfig.platform_settings.auth.allowlist.map((h) => h.hostname).join(", ")}`);
if (dryRun) process.exit(0);

const toolConfigs = cfg.client_tools.map((t) => ({
  type: "client",
  name: t.name,
  description: t.description,
  expects_response: t.expects_response,
  response_timeout_secs: 20,
  parameters: t.parameters,
}));

// Keep one standalone tool per name: update in place, create missing, delete
// tools this agent no longer uses (so re-provisioning never piles up copies).
async function syncTools(agentId) {
  const attached = agentId
    ? (await api(`/convai/agents/${agentId}`)).conversation_config.agent.prompt.tool_ids ?? []
    : [];
  const byName = new Map();
  for (const id of attached) {
    const tool = await api(`/convai/tools/${id}`);
    byName.set(tool.tool_config.name, id);
  }
  const ids = [];
  for (const tc of toolConfigs) {
    const id = byName.get(tc.name);
    if (id) {
      await api(`/convai/tools/${id}`, { method: "PATCH", body: JSON.stringify({ tool_config: tc }) });
      ids.push(id);
      byName.delete(tc.name);
    } else {
      ids.push((await api("/convai/tools", { method: "POST", body: JSON.stringify({ tool_config: tc }) })).id);
    }
  }
  return { ids, stale: [...byName.values()] };
}

const existing = await currentAgentId();
const { ids: toolIds, stale } = await syncTools(existing);
agentConfig.conversation_config.agent.prompt.tool_ids = toolIds;

if (existing) {
  await api(`/convai/agents/${existing}`, { method: "PATCH", body: JSON.stringify(agentConfig) });
  for (const id of stale) await api(`/convai/tools/${id}`, { method: "DELETE" });
  console.log(`updated ${existing} (tools: ${toolIds.length}, removed: ${stale.length})`);
} else {
  const created = await api("/convai/agents/create", { method: "POST", body: JSON.stringify(agentConfig) });
  await writeFile(
    ID_FILE,
    `// Written by scripts/sales-agent/provision.mjs. Public id; access is limited by the agent's host allowlist.\nexport const SALES_AGENT_ID = "${created.agent_id}";\n`
  );
  console.log(`created ${created.agent_id}`);
}
