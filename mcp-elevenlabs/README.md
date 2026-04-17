# @asksaul/mcp-elevenlabs

MCP server for managing ElevenLabs Conversational AI agents from repo files.

> **Status (Phase 1c):** runnable. `sync_knowledge_base` and `provision_agent` are live — the Wolf's Tailor agent (Sawyer) was provisioned from `docs/clients/wolfs-tailor/` with 15 KB docs attached. Run `npm run build` then `npm run start` to expose the MCP server over stdio, or `npm run dev` for watch mode.

## Tools

- `sync_knowledge_base` — upload all markdown files under `docs/clients/<slug>/kb/` to the ElevenLabs KB (one doc per file, named `<slug>/<filename>.md`). Re-uploads replace prior versions.
- `provision_agent` — create or update an agent from `docs/clients/<slug>/voice-config.json` + `system-prompt.md`. Attaches every KB doc whose name starts with `<slug>/`. Pass `existing_agent_id` (or set `ELEVENLABS_AGENT_ID`) to update in place.

## Tools (planned for later phases)

- `list_agents`, `get_agent`, `delete_agent`
- `list_conversations`, `get_transcript`
- `tune_voice`, `assign_phone_number`
- `run_qa_regression` — run `docs/clients/<slug>/qa-scenarios.jsonl` against the agent.

## Quickstart

```bash
export ELEVENLABS_API_KEY=sk_...
npm install
npm run dev   # watches src/, exposes MCP over stdio
```

From the repo root, the CLI wrappers are the easiest way to drive the tools:

```bash
npm run voice:sync-kb -- --dry-run   # preview the sync
npm run voice:sync-kb                # upload KB docs
npm run voice:provision              # create / update the agent
```

See `../docs/superpowers/specs/2026-04-17-wolfs-tailor-voice-agent-design.md` for the design.

## Notes on the live ElevenLabs agent API

- Knowledge base attaches live at `conversation_config.agent.prompt.knowledge_base`, not at the top level of the agent config. Each attachment is `{ type: "file" | "url" | "text", id, name? }`. Confirmed via `GET /v1/convai/agents/{id}`.
- English-language agents reject `eleven_flash_v2_5` / `eleven_turbo_v2_5` for the TTS `model_id`; use `eleven_flash_v2` or `eleven_turbo_v2`.
