# AskSaul MCP Server

Standalone MCP (Model Context Protocol) server that lets **Saul** (a Claude agent) manage AskSaul proposals end-to-end: list incoming leads, pull full detail, recompute lead scores, draft quotes, and send approved quotes via Resend.

The server talks to the same Supabase tables the Next.js app writes to:

- `proposals` — canonical submissions (see `supabase/migrations/0001_proposals.sql`)
- `proposal_events` — audit log (see `supabase/migrations/0002_proposal_events.sql`)
- `proposal_drafts` — versioned quote drafts (see `supabase/migrations/0003_proposal_drafts.sql`)

It uses the **service_role** Supabase key and bypasses RLS. Run it locally only; never expose over the network.

## Setup

```bash
cd mcp-server
npm install
npm run build
```

Required env vars:

| Var                         | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `SUPABASE_URL`              | Supabase project URL                           |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (bypasses RLS)                |
| `RESEND_API_KEY`            | Resend API key                                 |
| `RESEND_FROM_EMAIL`         | Sender address (must be on a verified domain)  |
| `RESEND_FROM_NAME`          | Optional sender display name (default AskSaul) |
| `INTERNAL_NOTIFICATION_EMAIL` | Optional reply-to on outbound quote emails   |
| `ADMIN_API_SECRET`          | Reserved for future admin endpoints            |
| `NEXT_PUBLIC_SITE_URL`      | Used in email links (optional)                 |

## Registering with Claude Desktop

Add an entry to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "asksaul": {
      "command": "node",
      "args": [
        "/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul/mcp-server/dist/index.js"
      ],
      "env": {
        "SUPABASE_URL": "https://YOUR-PROJECT.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "sb_service_...",
        "RESEND_API_KEY": "re_...",
        "RESEND_FROM_EMAIL": "gregory@asksaul.ai",
        "RESEND_FROM_NAME": "Gregory at AskSaul",
        "INTERNAL_NOTIFICATION_EMAIL": "gregory@asksaul.ai",
        "NEXT_PUBLIC_SITE_URL": "https://asksaul.ai"
      }
    }
  }
}
```

Then restart Claude Desktop. Saul will see the tools below.

During development you can also run `npm run dev` and point a local MCP-aware client at it.

## Tools Saul has

All tools return structured JSON.

| Tool                         | When Saul should call it                                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `list_proposals`             | Triage inbox. Filter by `status` / `since` / `limit`. Returns compact summaries.                                                   |
| `get_proposal`               | Pull full context for one proposal before drafting: all columns + service_details + vertical_details + latest draft + recent events. |
| `score_lead`                 | Recompute `estimated_value_usd` with the same algorithm the Next.js app runs at submit time. Pass `persist: true` to write back.   |
| `draft_proposal`             | Compose a new quote draft (scope, deliverables, price, timeline, terms). Auto-versions; inserts `pending_approval`. Logs `quote_drafted`. |
| `approve_and_send_proposal`  | After Gregory confirms a draft, send it via Resend. Marks draft `sent`, sets parent proposal `quoted`, logs `quote_sent`. Supersedes older drafts. |
| `update_status`              | Move a proposal through the pipeline (`reviewed`, `accepted`, `won`, etc.) with an optional note. Logs `status_changed`.           |
| `sync_to_ghl`                | Stub — throws until Phase 6. Registered so Saul can discover the future capability.                                                |

## Workflow Saul should follow

1. `list_proposals({ status: "submitted" })` to see what's new.
2. `get_proposal({ proposalId })` for any lead worth quoting.
3. (Optional) `score_lead({ proposalId, persist: true })` if the form data changed or scoring seems off.
4. `update_status({ proposalId, status: "reviewed", note })` after triage.
5. `draft_proposal({ ... })` to compose a quote. Show Gregory the returned `draft.markdown_body`.
6. Wait for Gregory's explicit approval in chat.
7. `approve_and_send_proposal({ draftId })`.
8. Later: `update_status` again as the deal progresses to `accepted` / `won` / `lost`.

## Files

```
mcp-server/
  package.json
  tsconfig.json
  README.md
  src/
    index.ts                         MCP server entry + tool registry
    supabase.ts                      Admin client + logEvent helper
    emailer.ts                       Resend wrapper
    renderer.ts                      Markdown -> HTML for drafts
    scoring.ts                       Mirror of lib/ghl.ts calculateEstimatedValue
    schemas.ts                       Zod input schemas
    tools/
      list-proposals.ts
      get-proposal.ts
      score-lead.ts
      draft-proposal.ts
      approve-and-send-proposal.ts
      update-status.ts
      sync-to-ghl.ts
```

## Notes

- Every mutation writes a `proposal_events` row via `logEvent`. Don't skip this — it's the audit trail Gregory relies on.
- Scoring is duplicated here rather than imported from the Next.js app. If `lib/ghl.ts::calculateEstimatedValue` changes, update `src/scoring.ts` to match.
- The server uses stdio transport only. Do not run behind HTTP.
