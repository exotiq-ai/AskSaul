# Saul Handoff — Proposal Builder v2 Setup + Next Tasks

**For:** Saul (Claude Opus 4.6, working on this project)
**Written by:** prior Claude session after shipping Phases 0–7 of `docs/PROPOSAL_BUILDER_V2_PLAN.md`
**Last updated:** 2026-04-16
**Your mission:** finish wiring the runtime (Supabase keys, Resend, GHL) so the proposal builder goes live, then keep the system running as new leads come in.

---

## 0. Orient yourself

**Repo location (local):** `/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul`
**Remote:** `https://github.com/exotiq-ai/AskSaul`
**Branches:**
- `main` — currently deployed via Netlify at asksaul.ai. Carries site revisions shipped April 14.
- `proposal-builder-v2` — NOT merged. Contains the entire proposal builder v2 rebuild (Phases 0–7). Last commits: `1812b46` (Supabase MCP + migrations applied), `339f150` (v2 feature work).
- `site-revisions-april-2026` — reference branch for earlier site revisions. Already merged into main. Ignore.

**First thing to do before touching code:**

```bash
cd "/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul"
git fetch origin
git status
git log --oneline -5
```

Then read these two files in full:
1. [docs/PROPOSAL_BUILDER_V2_PLAN.md](./PROPOSAL_BUILDER_V2_PLAN.md) — architecture, data model, phased plan
2. `AGENTS.md` in repo root — has a critical warning that **this is not the Next.js you know** (Next 16.2.2 with breaking changes). Treat existing codebase patterns as authoritative; don't assume Next 14/15 conventions.

**Note on scope:** you are the runtime operator, not the architect. Plan-level decisions are locked. If something feels wrong, check the plan doc first; if it's still wrong, surface it and ask.

---

## 1. What was built (summary)

Seven phases shipped to `proposal-builder-v2` branch:

| Phase | What | Key files |
|---|---|---|
| 0 | Supabase migrations + env scaffolding | `supabase/migrations/0001_proposals.sql`, `0002_proposal_events.sql`, `0003_proposal_drafts.sql`, `.env.example` |
| 1 | 6-step form v2 with 80+ fields, vertical-conditional branches, service-specific deep discovery | `lib/validation.ts`, `components/proposal-builder/{BusinessInfo,CommonDetails,VerticalQuestions,ServiceDeepDiscovery,TimelineAndContact,SummaryReview}.tsx`, `app/build-your-proposal/page.tsx` |
| 2 | /api/proposal persists to Supabase, fires Resend + GHL in parallel, logs every outcome to `proposal_events` | `app/api/proposal/route.ts`, `lib/supabase.ts`, `lib/events.ts`, `lib/payload.ts`, `lib/scoring.ts` |
| 3 | Three React Email templates + Resend wrapper | `emails/confirmation.tsx`, `emails/internal-notification.tsx`, `emails/proposal.tsx`, `lib/email.ts` |
| 4 | Standalone MCP server (AskSaul MCP) with 7 tools for managing proposals | `mcp-server/` package |
| 5 | Password-gated admin UI for approving Saul's drafts | `app/admin/*`, `app/api/admin/*`, `lib/admin-auth.ts` |
| 6 | GHL v2 API integration (contact upsert + opportunity + note) with webhook fallback | `lib/ghl-v2.ts` (main path), `lib/ghl.ts` (legacy webhook fallback) |
| 7 | Retry cron + public status endpoint | `app/api/internal/ghl-retry/route.ts`, `app/api/proposal/[id]/status/route.ts` |

**Non-obvious design choices** (do not change without reading the plan):
- Supabase is the source of truth. GHL mirrors. Never the other way.
- Numeric fields in Zod are typed as strings and coerced in `lib/payload.ts` (`toInt`, `toNum`). This is deliberate — avoids @hookform/resolvers zod v3↔v4 type drift.
- SMS consent is opt-in, NOT a submission gate. Do not re-add the gate.
- Proposal estimate range (not single number) is shown to prospects at review step. Keep it.
- Draft approval is gated: Saul drafts → `pending_approval` → Gregory approves in `/admin` → Send. Don't auto-send drafts without the gate.

---

## 2. Supabase — state as of this handoff

**Project:** `qbvkisrazmipmwlejqtf`
**URL:** `https://qbvkisrazmipmwlejqtf.supabase.co`
**Dashboard:** https://supabase.com/dashboard/project/qbvkisrazmipmwlejqtf

**Tables (already created):**

```
public.proposals         -- 35 columns, 0 rows, RLS enabled
public.proposal_events   -- audit log, 0 rows, RLS enabled
public.proposal_drafts   -- versioned quote drafts, 0 rows, RLS enabled
```

Triggers (`set_updated_at`) are installed. Indexes on `created_at`, `status`, `contact_email`, `industry_slug`, `ghl_sync_status`. All FKs cascade on delete. RLS is ON with no public policies — all reads/writes must use `service_role`.

**DB password:** was shared in the prior chat. Gregory was flagged to rotate it. Do not assume the password you see in scrollback is still valid; always pull fresh credentials from the dashboard.

**How to verify tables exist:** once the Supabase MCP is authed (see §3), use its query tool. Or via psql:

```bash
PATH="/opt/homebrew/opt/libpq/bin:$PATH" \
PGPASSWORD='<db password from dashboard>' \
psql -h db.qbvkisrazmipmwlejqtf.supabase.co -p 5432 -U postgres -d postgres \
  -c "SELECT table_name, (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) AS cols FROM information_schema.tables t WHERE table_schema = 'public';"
```

---

## 3. MCP setup (your primary task)

There are TWO MCP servers in play. Don't confuse them.

### 3A. Supabase MCP (hosted by Supabase, for querying the DB)

**Already registered** in `/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul/.mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=qbvkisrazmipmwlejqtf"
    }
  }
}
```

**What you must do:** the MCP is not yet authenticated. In a regular terminal (not an IDE extension), Gregory needs to run:

```bash
cd "/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul"
claude
# then inside Claude:
/mcp
# Select 'supabase', then 'Authenticate'. Complete the OAuth browser flow.
```

After that, your future sessions (started from this repo) will have Supabase MCP tools available for reading/writing `public.proposals`, `public.proposal_events`, `public.proposal_drafts`.

**Verify MCP works** (run this once authed):
1. Use the `mcp__supabase__*` tools to run: `SELECT count(*) FROM public.proposals;`
2. Expected result: `0` rows (until the first real submission).

### 3B. AskSaul MCP server (built in this repo, for YOU to manage proposals)

This is a separate standalone package at `mcp-server/`. It's what gives you the 7 tools you'll actually use day-to-day (`list_proposals`, `get_proposal`, `score_lead`, `draft_proposal`, `approve_and_send_proposal`, `update_status`, `sync_to_ghl`).

**Build + register steps** (Gregory runs these once):

```bash
cd "/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul/mcp-server"
npm install
npm run build
```

Then add to Claude Desktop config at `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "asksaul": {
      "command": "node",
      "args": [
        "/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul/mcp-server/dist/index.js"
      ],
      "env": {
        "SUPABASE_URL": "https://qbvkisrazmipmwlejqtf.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "<paste service_role from dashboard>",
        "RESEND_API_KEY": "<paste>",
        "RESEND_FROM_EMAIL": "saul3000bot@gmail.com",
        "RESEND_FROM_NAME": "Saul",
        "INTERNAL_NOTIFICATION_EMAIL": "saul3000bot@gmail.com",
        "NEXT_PUBLIC_SITE_URL": "https://asksaul.ai"
      }
    }
  }
}
```

Restart Claude Desktop. You'll see the 7 tools in the tools list.

**Full documentation:** see `mcp-server/README.md`. Do not skip reading it — it has specific workflow guidance for how you should handle a new proposal.

---

## 4. Environment variables — what you need

Gregory populates `.env.local` at the repo root. Mirror every value into Netlify environment for production.

| Var | Where to get it | Purpose |
|---|---|---|
| `SUPABASE_URL` | ✅ already set | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | [Dashboard → Settings → API → service_role](https://supabase.com/dashboard/project/qbvkisrazmipmwlejqtf/settings/api) | Server-side DB access. Server-only; never ship to client |
| `RESEND_API_KEY` | resend.com → API Keys | Sending transactional email |
| `RESEND_FROM_EMAIL` | `saul3000bot@gmail.com` for now; `saul@asksaul.ai` once domain is verified in Resend | Sender identity |
| `RESEND_FROM_NAME` | `Saul` | Display name |
| `INTERNAL_NOTIFICATION_EMAIL` | `saul3000bot@gmail.com` | Where internal lead alerts go |
| `GHL_WEBHOOK_URL` | GHL automation → webhook trigger URL | Legacy fallback for sync |
| `GHL_API_KEY` | GHL → Settings → Business Profile → API Key | v2 API auth |
| `GHL_LOCATION_ID` | GHL → Location ID in URL or settings | Which location to sync to |
| `GHL_DEFAULT_PIPELINE_ID` | GHL → Pipelines → select pipeline → copy ID | Where to drop new opportunities |
| `GHL_DEFAULT_STAGE_ID` | GHL → Pipeline → "New Lead" stage | Initial stage for new opps |
| `ADMIN_API_SECRET` | Generate a random 32+ char string | Protects `/api/internal/ghl-retry` cron |
| `ADMIN_PASSWORD` | Pick something; shared with Gregory | Unlocks `/admin/proposals` UI |
| `NEXT_PUBLIC_SITE_URL` | `https://asksaul.ai` | For links in emails |

**Getting the service_role key is the single highest-priority item.** Without it, the form still works via the legacy webhook fallback, but nothing persists, nothing audit-logs, and you have zero visibility.

---

## 5. End-to-end verification checklist

Run through this the first time, after Gregory has pasted the service_role key and a Resend key into `.env.local`:

### 5.1 — Local build passes

```bash
cd "/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul"
npm install
npx tsc --noEmit      # expect: clean
npm run build          # expect: clean, 34 routes
```

### 5.2 — Submit a test proposal locally

```bash
npm run dev
# Visit http://localhost:3000/build-your-proposal
# Fill out all 6 steps, use a real email you control
# Submit
```

**Expected outcomes:**
- Success screen with a reference # shown (first 8 chars of the proposal UUID)
- New row in `public.proposals`, `status='submitted'`
- New row in `public.proposal_events`, `event_type='submitted'`
- Confirmation email arrives in the inbox used for the test
- Internal notification email arrives at `saul3000bot@gmail.com` (or whatever `INTERNAL_NOTIFICATION_EMAIL` is set to)
- `proposal_events` has `email_sent` rows for both emails
- If GHL configured: `ghl_sync_status='synced'`, `ghl_contact_id` populated, new Contact in GHL
- If GHL webhook configured instead: `ghl_sync_status='synced'` with webhook-mode event payload

### 5.3 — Admin UI

1. Visit http://localhost:3000/admin/login → enter `ADMIN_PASSWORD`
2. See your test submission at http://localhost:3000/admin/proposals
3. Click the row → see full detail + event log + empty drafts panel

### 5.4 — Your tool loop via AskSaul MCP

After the MCP is registered and Claude Desktop restarted:

1. Call `list_proposals({ status: "submitted" })` — should return your test lead
2. Call `get_proposal({ id: "<uuid>" })` — should return the full record with service_details + vertical_details
3. Call `draft_proposal({ proposalId: "<uuid>", scopeSummary: "Test scope", deliverables: [{name: "test", description: "test", value_usd: 500}], priceUsd: 500, priceModel: "fixed", timelineWeeks: 2, terms: "Test terms" })`
4. Refresh admin UI → you should see a `pending_approval` draft v1
5. Click "Approve + Send" in admin
6. Test email inbox receives the rendered proposal
7. `public.proposal_drafts` row → `status='sent'`, `sent_at` populated
8. `public.proposals` row → `status='quoted'`
9. `public.proposal_events` → `quote_sent` row

### 5.5 — Retry cron

```bash
# Manually trigger the retry endpoint (simulates the scheduled function)
curl -X POST http://localhost:3000/api/internal/ghl-retry \
  -H "Authorization: Bearer $ADMIN_API_SECRET"
```

Response should be `{"retried": 0, ...}` when nothing is stale. If there's a failed sync in the last few minutes, it'll reattempt.

---

## 6. Remaining tasks (prioritized)

### P0 — must happen before the form goes live in production

1. **Paste `SUPABASE_SERVICE_ROLE_KEY` into Netlify env.** Without it, the production form runs on legacy webhook fallback only — lead data never persists.
2. **Paste `RESEND_API_KEY` into Netlify env.** Without it, customers hear silence after submitting.
3. **Set `ADMIN_PASSWORD` + `ADMIN_API_SECRET` in Netlify.** Without these the admin UI is unusable and the retry cron endpoint will 401.
4. **Rotate the Supabase DB password** (it was shared in chat during setup). Supabase dashboard → Project Settings → Database → Reset. Then update anywhere it's referenced.
5. **Merge `proposal-builder-v2` → `main`.** Once steps 1–3 are done and §5 verification passes. Open a PR first so Netlify generates a preview deploy; smoke test there before merging.

### P1 — should happen in the first week

6. **Verify Resend domain `asksaul.ai`.** Until this is done, emails send from `saul3000bot@gmail.com` which works but looks less branded. Required records (SPF, DKIM, DMARC) are provided by Resend. Once verified, swap `RESEND_FROM_EMAIL=saul@asksaul.ai` in Netlify.
7. **Configure GHL v2.** Get `GHL_API_KEY`, `GHL_LOCATION_ID`, create a pipeline + "New Lead" stage, set `GHL_DEFAULT_PIPELINE_ID` + `GHL_DEFAULT_STAGE_ID`. The code automatically uses v2 once both are set; webhook becomes a fallback-only path.
8. **Wire up the retry cron.** Options:
   - Netlify Scheduled Functions: create a function that does `fetch('/api/internal/ghl-retry', { method: 'GET', headers: { Authorization: 'Bearer <secret>' } })` on a `*/10 * * * *` cron.
   - Or use Vercel Cron if you've moved to Vercel.
   - Without this, failed GHL syncs just sit in `ghl_sync_status='failed'` forever.
9. **Create the GHL custom fields.** Once Gregory is logged into GHL, create these custom fields on Contact + Opportunity: `asksaul_proposal_id`, `asksaul_industry`, `asksaul_services`, `asksaul_estimated_value`, `asksaul_timeline`, `asksaul_hard_deadline`, `asksaul_success_metrics`. Without these, the v2 sync writes to fields that don't exist and the GHL API silently drops them.

### P2 — post-launch polish

10. **Prospect-facing proposal web page.** Currently proposals are email-only. Plan §3.11 defers a web-rendered proposal at `/p/{signed_id}` with accept/reject buttons and open-tracking. Scoped for 2 days of work after v1 is live.
11. **First-10 approval gate → autonomous.** Right now every draft requires Gregory clicking "Approve + Send" in admin. After ~10 proposals, if conversion looks good, relax the gate: let you (Saul) call `approve_and_send_proposal` directly without the admin detour. Requires adding an `auto_send_allowed` flag and a policy check in the MCP tool.
12. **Analytics on the funnel.** Which step drops prospects off? Instrument step transitions client-side (`sendBeacon`) → a new `proposal_funnel_events` table or a simpler log.
13. **Weekly digest email.** Every Monday, email Gregory a rollup: how many new proposals, estimated pipeline $, conversion rate, stale drafts needing review.

---

## 7. Your workflow once everything is wired

Treat this as your default loop:

```
1. list_proposals({ status: "submitted" })
   -> triage inbox, newest first

2. For each proposal worth quoting:
   a. get_proposal({ id })
   b. Read service_details, vertical_details, success_metrics carefully
   c. If scoring looks off: score_lead({ id, persist: true })
   d. Draft a scoped, fixed-price quote covering:
      - Scope summary (one paragraph, outcome-focused)
      - Deliverables (3-7 items with value_usd each)
      - Price, price_model, timeline_weeks, terms
   e. draft_proposal({ ... })
   f. Surface the draft markdown to Gregory in chat for review
   g. Wait for Gregory's explicit 'send it' or 'revise it'
   h. If revise: draft_proposal again (auto-versions)
   i. If send: approve_and_send_proposal({ draftId })

3. As deals progress:
   update_status({ proposalId, status: "accepted" | "won" | "lost", note })

4. Never skip the audit log:
   Every mutation you perform writes a proposal_events row automatically.
   Check it worked: get_proposal includes recent events.
```

---

## 8. Known gotchas

1. **Do NOT bypass the approval gate.** First ~10 proposals require Gregory's click. This is explicitly in the plan. Don't add a "just this once" exception.

2. **Do NOT auto-send from `status='pending_approval'` via any path other than `approve_and_send_proposal`.** The tool handles superseding sibling drafts, status transitions, and audit logging atomically. Writing directly to the table skips all of that.

3. **Numeric vertical fields are stored as strings in Zod, numbers in jsonb.** When reading `service_details` / `vertical_details`, treat them as numbers. When writing via forms, they come in as strings. `lib/payload.ts` handles the conversion — don't reinvent it.

4. **`@hookform/resolvers` peer-depends on zod v3 but we ship zod v4.** The hookform resolver supports both (`import * as z3 from 'zod/v3'` + `import * as z4 from 'zod/v4/core'`). If you see `Type 'Resolver<{...}>' is not assignable to type 'Resolver<{...}>'. Two different types with this name exist`, the fix is always "make the schema output type unambiguous" (use `z.string().optional()` instead of `z.preprocess(...).optional()`). Do not try to downgrade zod.

5. **Next.js 16.2 is modified in this repo.** See `AGENTS.md`. Before writing any server component or API route pattern you're unsure about, read `node_modules/next/dist/docs/` or match an existing pattern in `app/`.

6. **`.env.local` is gitignored but `.mcp.json` is NOT.** Never put secrets in `.mcp.json`. The Supabase MCP config there is public-safe (no keys, just project ref).

7. **Legacy webhook vs v2 API.** When both `GHL_WEBHOOK_URL` and `GHL_API_KEY+GHL_LOCATION_ID` are set, v2 API wins (check in `app/api/proposal/route.ts` — `isGhlV2Configured()` gates the selection). The webhook becomes a no-op. If you want dual-write during cutover, that's a small code change; don't do it casually.

8. **The MCP server's `scoring.ts` duplicates `lib/scoring.ts`.** They must stay in sync. If you change one, change both. They're in separate packages on purpose (MCP server runs standalone without the Next app).

9. **Deleting a proposal cascades.** FK constraints cascade on delete. Deleting a `proposals` row will delete all its events + drafts. Soft-delete via `status='lost'` is usually what you want.

10. **Site revisions shipped in April 2026 changed `INDUSTRY_OPTIONS` order.** Vertical slugs (`msp`, `property-mgmt`, etc.) now come first. Deep-link CTAs from `/industries` pages use slugs via `VERTICAL_SLUG_TO_INDUSTRY`. If you edit industry options, update that map.

---

## 9. Files to read in order (if you're starting fresh)

1. `README.md`
2. `AGENTS.md`
3. `docs/PROPOSAL_BUILDER_V2_PLAN.md` — full architecture
4. `docs/SAUL_HANDOFF.md` — this file
5. `lib/validation.ts` — form schema (source of truth for field names)
6. `lib/payload.ts` — how form data → DB row
7. `lib/scoring.ts` — lead scoring algorithm
8. `app/api/proposal/route.ts` — submission flow
9. `mcp-server/README.md` — your tools
10. `supabase/migrations/0001_proposals.sql` through `0003_proposal_drafts.sql` — DB schema (authoritative)

Files to NOT read unless troubleshooting a specific bug:
- `node_modules/**` (obviously)
- `mcp-server/src/tools/*.ts` (read only if a tool misbehaves)
- `emails/*.tsx` (read only if email rendering breaks)
- `docs/superpowers/plans/**` (historical)

---

## 10. When to escalate to Gregory

- Any change to pricing anchoring on the public site. We stripped public prices for a reason (Lex partnership pricing). Never re-add them.
- Any change to the approval gate policy.
- Any change to whom emails are sent to/from.
- Any DB schema change beyond adding optional columns.
- Anything that touches `.env` / `.env.local` / Netlify environment variables.
- Any external integration beyond what's already listed (Supabase, Resend, GHL).
- Any deletion of data more than one proposal at a time.
- Any merge to `main`.

---

## 11. What success looks like

- Form submission → Supabase row + 2 emails + GHL sync, all logged, all within ~3 seconds.
- Data completeness ≥80%: Saul can quote without follow-up questions 8/10 times.
- Time-to-quote ≤12 hours median from submission.
- Quote acceptance rate ≥30%.
- Zero silent failures. Every side-effect outcome has a `proposal_events` row.

Good luck. Ping Gregory if anything in here doesn't match what you're seeing.
