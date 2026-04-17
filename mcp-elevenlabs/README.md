# @asksaul/mcp-elevenlabs

MCP server for managing ElevenLabs Conversational AI agents from repo files.

> **Status (Phase 1b):** REST client only. MCP server entrypoint and tools land in Tasks 1.10–1.12. `npm run dev` / `npm run build` / `npm run start` will not work until then.

## Tools (planned)

- `provision_agent` — create/update an agent from `docs/clients/<slug>/voice-config.json` + `system-prompt.md`.
- `sync_knowledge_base` — upload all markdown files under `docs/clients/<slug>/kb/` and attach to the agent.
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

See `../docs/superpowers/specs/2026-04-17-wolfs-tailor-voice-agent-design.md` for the design.
