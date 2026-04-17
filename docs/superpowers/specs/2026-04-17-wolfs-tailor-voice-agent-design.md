# The Wolf's Tailor — AI Reservationist Voice Agent: Design Spec

**Date:** 2026-04-17
**Author:** AskSaul (Gregory Ringler) with Claude
**Target branch:** `voice-agent/wolfs-tailor-mvp` → PR into `wolfs-tailor`
**Status:** Approved for implementation

---

## 1. Context and goal

The Wolf's Tailor is a two-Michelin-star tasting-menu restaurant in Denver. Their host team loses time to phone calls that follow predictable patterns (hours, pricing, dress code, cancellation policy, allergies, private dining intake). Most of those calls need a correct, warm, consistent answer — not a human.

**Goal:** ship a production-grade AI phone reservationist ("Sawyer") in ~4 working days, demo it on a 15-minute live call, then run a 30-day rollover-line pilot that measures calls handled versus escalated.

**Success criteria:**
- Sawyer handles hours/location/pricing/dress-code/cancellation/parking questions with zero hallucinations across a 35-scenario QA regression run.
- Sawyer never accommodates a soy / allium / citrus allergy request. Ever.
- Sawyer captures structured leads (bookings, private dining, messages, escalations) into Supabase with email notification to the internal inbox.
- Sub-1-second voice latency on phone calls.
- Live 15-min demo call passes end-to-end with no human intervention.
- Restaurant can update the KB by PR'ing a markdown file, without touching ElevenLabs.

**Non-goals (explicitly out of scope for MVP):**
- Direct Tock API bookings (lead capture + Tock link only).
- SMS follow-up (blocked on A2P 10DLC registration).
- Payment over the phone (Tock handles prepayment).
- Warm transfer via SIP (post-demo enhancement).
- Multi-tenancy — this spec is Wolf's-Tailor-specific. Future clients get their own KB folder + agent provisioning call.

---

## 2. Architecture

```
CALLER (phone or web)
   │
   ├─→ ElevenLabs native phone number (live demo + pilot line)
   └─→ Web widget at /demos/wolfs-tailor (iteration + marketing)
         │
         ▼
   ElevenLabs Conversational AI Agent "Sawyer"
     - voice: Jessica (cgSgspJ2msm6clMCkdW9)
     - tts: eleven_flash_v2_5
     - llm: GPT-4o-mini (upgradeable)
     - kb: synced from repo markdown files
         │
         │ HTTPS tool calls (authenticated)
         ▼
   AskSaul Next.js app (Netlify)
     /api/voice/tools/*
     /api/voice/webhook
         │
    ┌────┴────┬─────────┬──────────┐
    ▼         ▼         ▼          ▼
 Supabase  Resend   Admin UI   Repo KB
 leads     email    /admin/    docs/clients/
 call_logs          voice      wolfs-tailor/
```

**Repo layout added by this work:**

```
AskSaul/
├── app/
│   ├── api/voice/
│   │   ├── tools/
│   │   │   ├── check-availability/route.ts
│   │   │   ├── create-lead/route.ts
│   │   │   ├── private-dining-intake/route.ts
│   │   │   ├── message-for-team/route.ts
│   │   │   └── get-menu-theme/route.ts
│   │   └── webhook/route.ts
│   ├── admin/voice/
│   │   ├── page.tsx              (call log inbox)
│   │   └── [callId]/page.tsx     (transcript view)
│   └── demos/wolfs-tailor/
│       └── page.tsx              (widget + hero + samples)
├── lib/voice/
│   ├── auth.ts                   (shared-secret verification)
│   ├── schemas.ts                (Zod schemas for tool payloads)
│   ├── supabase.ts               (voice-scoped client)
│   ├── email.ts                  (Resend templates)
│   ├── elevenlabs.ts             (SDK wrapper)
│   └── menu-theme.ts             (current seasonal theme)
├── docs/clients/wolfs-tailor/
│   ├── kb/                       (15 markdown files → agent KB)
│   │   ├── identity.md
│   │   ├── location.md
│   │   ├── hours.md
│   │   ├── menu.md
│   │   ├── allergies.md
│   │   ├── reservations.md
│   │   ├── private-dining.md
│   │   ├── dress-code.md
│   │   ├── payment.md
│   │   ├── occasions.md
│   │   ├── kids-pets.md
│   │   ├── sustainability.md
│   │   ├── faq.md
│   │   ├── escalation.md
│   │   └── never-do.md
│   ├── system-prompt.md
│   ├── voice-config.json
│   └── qa-scenarios.jsonl        (regression suite)
├── mcp-elevenlabs/               (new MCP package)
│   ├── src/
│   │   ├── index.ts
│   │   ├── tools/
│   │   │   ├── provision-agent.ts
│   │   │   ├── sync-knowledge-base.ts
│   │   │   ├── list-agents.ts
│   │   │   ├── get-agent.ts
│   │   │   ├── list-conversations.ts
│   │   │   ├── get-transcript.ts
│   │   │   ├── tune-voice.ts
│   │   │   ├── run-qa-regression.ts
│   │   │   └── assign-phone-number.ts
│   │   ├── elevenlabs-client.ts
│   │   └── schemas.ts
│   ├── package.json
│   └── tsconfig.json
└── supabase/migrations/
    └── 0004_voice_agent.sql      (follows existing 0001/0002/0003 numbering from proposal-builder-v2)
```

---

## 3. Components

### 3.1 ElevenLabs agent "Sawyer"

Provisioned and updated via the MCP server. Config lives in `docs/clients/wolfs-tailor/voice-config.json` and the system prompt in `system-prompt.md` — both are git-tracked sources of truth.

- **System prompt**: ported verbatim from `Voice Agent MVP/02_SYSTEM_PROMPT_AND_VOICE.md` section 1, with additions for the tool-calling contracts.
- **Voice**: Jessica, `cgSgspJ2msm6clMCkdW9`.
- **TTS model**: `eleven_flash_v2_5` for sub-100ms latency.
- **Voice settings**: stability 0.55, similarity 0.80, style 0.10, speaker_boost on.
- **LLM**: GPT-4o-mini (via ElevenLabs' hosted LLM). Temperature 0.3. Promote to Claude Sonnet 4.5 for hard scenarios after pilot week one if QA shows drift.
- **Tools**: all 5 REST endpoints registered with descriptions the LLM uses to pick the right one.

### 3.2 Knowledge base

Source of truth: `docs/clients/wolfs-tailor/kb/*.md` — 15 files, each a single KB document on the ElevenLabs side.

Split from the existing `01_KNOWLEDGE_BASE.md` — one file per SECTION. Each file begins with a title and one-sentence summary (used by ElevenLabs' retrieval layer) followed by the full content.

The restaurant updates the KB by PR'ing a markdown file. Merge to main → `mcp sync-knowledge-base` runs → agent KB updated. No dashboard clicks.

### 3.3 REST tool endpoints

All at `app/api/voice/tools/*/route.ts`. All authenticated via `x-voice-tool-secret` header (verified against `VOICE_TOOL_SHARED_SECRET` env var). All validate input with Zod schemas in `lib/voice/schemas.ts`. All return JSON the agent can read aloud naturally.

**`POST /api/voice/tools/check-availability`**
- Input: `{ date: string, time: string, party_size: int }`
- MVP behavior: does NOT check Tock. Returns `{ status: "use_tock", message: "I don't have live availability yet — the best way is exploretock.com/wolfstailor. Want me to capture your info and have the team confirm?", tock_url: "..." }`.
- Future: Tock API integration upgrade path documented inline.

**`POST /api/voice/tools/create-lead`**
- Input: `{ name, phone, email?, date, time?, party_size, occasion?, allergies?, notes? }`
- Writes `voice_leads` row with `kind = "booking_request"`.
- Fires Resend email to `INTERNAL_NOTIFICATION_EMAIL` with subject `[Wolf's Tailor] New booking lead — {name} party of {size} on {date}`.
- Returns `{ status: "captured", confirmation: "Got it, someone from the team will confirm within one business day." }`.
- If allergies include allium/soy/citrus: email subject prefixed `⚠️ ALLERGY-ACKNOWLEDGED` and body includes the exact allergy string for human review.

**`POST /api/voice/tools/private-dining-intake`**
- Input: `{ name, phone, email?, party_size, requested_date?, occasion?, preferred_experience?, notes? }` — `party_size` must be ≥ 7.
- Writes `voice_leads` with `kind = "private_dining"`.
- Fires Resend email to internal inbox with events-team routing hint.
- Returns `{ status: "captured", confirmation: "Someone from our events team will reach out within one business day to walk you through options." }`.

**`POST /api/voice/tools/message-for-team`**
- Input: `{ name, phone, reason: enum["refund_dispute", "past_experience", "media", "employment", "other"], notes }`
- Writes `voice_leads` with `kind = "escalation"` and the reason as a column.
- Email subject tagged by reason (refund disputes get a `[URGENT]` prefix).
- Returns `{ status: "captured", confirmation: "Someone will reach out within one business day." }`.

**`POST /api/voice/tools/get-menu-theme`**
- Input: none.
- Returns `{ season: "spring" | "summer" | "fall" | "winter", theme: string, last_updated: ISO8601 }` from `lib/voice/menu-theme.ts` (static, updated monthly via PR).
- MVP: spring 2026 theme → "garden-fresh produce from our on-site beds and local farms."

### 3.4 Post-call webhook

**`POST /api/voice/webhook`**
- HMAC-verified against `ELEVENLABS_WEBHOOK_SECRET` (header: `elevenlabs-signature`).
- Writes `call_logs` row: `{ conversation_id, caller_number, started_at, ended_at, duration_sec, transcript_json, tool_calls_json, audio_url, llm_cost_usd, tts_cost_usd, outcome: enum["info_only", "lead_captured", "escalated", "abandoned"] }`.
- Joins to `voice_leads` via `conversation_id` for the admin UI transcript + lead view.
- Retry-safe: idempotent on `conversation_id` (unique constraint). ElevenLabs retries 3x on 5xx.

### 3.5 Supabase schema

```sql
-- voice_leads: anything the agent captured that needs human follow-up
CREATE TABLE voice_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,         -- ElevenLabs conversation id
  client_slug TEXT NOT NULL DEFAULT 'wolfs-tailor',
  kind TEXT NOT NULL CHECK (kind IN ('booking_request','private_dining','escalation','message')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  party_size INT,
  requested_date DATE,
  requested_time TIME,
  occasion TEXT,
  allergies TEXT,
  allergy_flag BOOLEAN NOT NULL DEFAULT FALSE,  -- true if soy/allium/citrus mentioned
  reason TEXT,                                  -- for escalations
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
CREATE INDEX voice_leads_conv_idx ON voice_leads(conversation_id);
CREATE INDEX voice_leads_status_idx ON voice_leads(status, created_at DESC);

-- call_logs: one row per call for admin review + metrics
CREATE TABLE call_logs (
  conversation_id TEXT PRIMARY KEY,
  client_slug TEXT NOT NULL DEFAULT 'wolfs-tailor',
  caller_number TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_sec INT,
  transcript_json JSONB,
  tool_calls_json JSONB,
  audio_url TEXT,
  llm_cost_usd NUMERIC(10,4),
  tts_cost_usd NUMERIC(10,4),
  outcome TEXT CHECK (outcome IN ('info_only','lead_captured','escalated','abandoned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX call_logs_client_idx ON call_logs(client_slug, started_at DESC);
```

RLS disabled (service-role only; admin UI uses the same auth as existing `/admin`).

### 3.6 MCP server (`mcp-elevenlabs/`)

Mirrors the existing `mcp-server/` pattern (Node, `@modelcontextprotocol/sdk`, Zod, tsx dev, tsc build).

9 tools total — listed in § 3 of the conversation, specified in detail during implementation. Each tool is a file in `src/tools/` with a `handler(input: z.infer<Schema>): Promise<Result>` signature and a registered Zod schema.

`elevenlabs-client.ts` wraps the REST API with typed methods so swapping to the official SDK later is a drop-in.

### 3.7 Admin UI

Under `/admin/voice`, reusing existing basic-auth (`ADMIN_PASSWORD`). Two pages:
- **Index**: split-view — leads (filterable by status/kind) on left, recent calls on right. Both sortable by date.
- **Call detail** (`/admin/voice/[conversationId]`): transcript reader, audio player, tool-call timeline, linked lead card if present.

Minimal styling — reuses Tailwind primitives already in the project.

### 3.8 Demo page (`/demos/wolfs-tailor`)

- Hero: "Meet Sawyer — AI Reservationist for The Wolf's Tailor"
- Embedded ElevenLabs web widget (official `@elevenlabs/react` or the script-tag widget).
- 4 sample prompts as clickable chips: "hours?", "garlic allergy", "book for 10", "cancel tomorrow".
- Allergy-landmine explainer block (the hero narrative from the demo brief).
- Footer CTA back to asksaul.ai.

Public, un-gated. Indexed only if we explicitly opt in later.

---

## 4. Data flow — the hero scenario (garlic allergy)

1. Caller dials ElevenLabs number → Sawyer opens.
2. "Hi, I want to book for two on Friday. I have a severe garlic allergy."
3. Agent retrieves `allergies.md` → delivers allium-refusal script verbatim (system-prompt hard rule enforces).
4. Caller: "Okay, I'll proceed anyway."
5. Agent: asks for name, phone, email, date, time, occasion.
6. Agent calls `create-lead` with `{ ..., allergies: "severe garlic (acknowledged allium policy)" }`.
7. Next.js writes `voice_leads` row with `allergy_flag = true`.
8. Resend email to internal inbox: `⚠️ ALLERGY-ACKNOWLEDGED — booking lead — {name}…`.
9. Agent: "Perfect, someone from our team will confirm within one business day. Anything else?"
10. Call ends → webhook fires → `call_logs` row written, joined to the lead via `conversation_id`.

---

## 5. Error handling

| Failure | Impact | Handling |
|---|---|---|
| Tool endpoint 5xx / timeout | Agent can't capture lead | System-prompt fallback: agent switches to `message-for-team` flow. Still captures name+phone. |
| Supabase insert fails | Lead row missing | Resend email fires regardless — email is last-resort audit trail. Log to Sentry (if wired; else console + next.js server logs). |
| Resend fails | Internal team not notified | Supabase row still written. Admin UI `/admin/voice` shows it. Add an "unseen leads" cron later. |
| Webhook retry exhausts | No call log | `mcp get-transcript` can pull any conversation on demand from ElevenLabs. Nightly-cron backfill is a post-MVP add. |
| Agent hallucinates | Wrong info to caller | Mitigations (in order): (a) system-prompt hard rules, (b) KB grounding, (c) QA regression on every agent update, (d) human spot-check of first 50 calls during pilot. |
| Caller silent 10s | Dead air | Scripted prompt from QA bank. Hang up gracefully after 20s. |
| ElevenLabs outage | No calls answered | Phone number is configured in ElevenLabs with an on-failure forward to the restaurant's host line (verified as supported before Phase 3; if not, documented as a known gap for pilot). |

---

## 6. Testing strategy

**Unit tests (Vitest)**
- Tool endpoint handlers with mocked Supabase/Resend. Validate Zod schemas, allergy-flag logic, error paths.
- HMAC verification for webhook.
- `menu-theme.ts` current-season selection.

**Integration tests**
- Full tool call: POST to route → assert Supabase row + Resend mock called.
- Webhook ingestion: POST sample payload → assert `call_logs` row + idempotency on repeat.

**Agent QA regression**
- 35-scenario suite in `qa-scenarios.jsonl`: your 15 from `02_SYSTEM_PROMPT_AND_VOICE.md` test section + 20 high-risk from the QA bank (allergy variants, rude callers, silence, "are you a robot", competitor questions, price hallucination traps).
- Each scenario: `{ prompt, must_contain: [...], must_not_contain: [...], must_call_tool?: string }`.
- Run via ElevenLabs text-conversation API (cheap, fast). Store golden transcripts on first pass.
- MCP tool `run_qa_regression` runs the suite and reports diffs.
- Gate: must pass 100% before any agent-config PR merges.

**Manual gate**
- Live 15-min demo call is the final human gate. Follows `superpowers:verification-before-completion` — no "ready" claim without a recorded passing test call.

---

## 7. Rollout plan

**Phase 0 — Scaffolding (~0.5 day)**
- Feature branch `voice-agent/wolfs-tailor-mvp` off `origin/wolfs-tailor` (already created).
- Add `@supabase/supabase-js`, `resend`, `@elevenlabs/react` to `package.json`. Note: wolfs-tailor branch is behind main and lacks these deps — they need to be added fresh here rather than cherry-picked. When main eventually merges into wolfs-tailor (or vice versa), npm will dedupe.
- Create folder skeleton (api routes, lib/voice, docs/clients/wolfs-tailor, mcp-elevenlabs, supabase/migrations).
- Smoke-test ElevenLabs API key via a temporary `scripts/verify-key.ts` (already verified at brainstorming time — subscription tier confirmed, 33M chars/yr available).

**Phase 1 — Agent + KB (~1 day)**
- Split `01_KNOWLEDGE_BASE.md` into the 15 `.md` files.
- Port `02_SYSTEM_PROMPT_AND_VOICE.md` → `system-prompt.md` with tool-calling additions.
- Build MCP `provision-agent` + `sync-knowledge-base` tools.
- Push live: run provisioning → agent exists in ElevenLabs → KB populated → verify in dashboard.
- **Open draft PR against `wolfs-tailor` at end of Phase 1.**

**Phase 2 — Tools + webhook (~1 day)**
- Supabase migration: `voice_leads` + `call_logs`.
- Implement all 5 tool endpoints + webhook with Zod + tests.
- Resend email templates (HTML + text).
- Register tools on the agent via MCP.
- Run full 35-scenario QA regression. Iterate until 100%.

**Phase 3 — Demo page + admin UI (~1 day)**
- `/demos/wolfs-tailor` with widget + sample prompts + allergy narrative.
- `/admin/voice` index + call detail pages.
- Assign ElevenLabs phone number.

**Phase 4 — Deploy + live demo (~0.5 day)**
- Netlify env vars: `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`, `ELEVENLABS_WEBHOOK_SECRET`, `VOICE_TOOL_SHARED_SECRET`, Supabase + Resend creds.
- Prod deploy off feature branch preview → smoke test with a real call.
- Mark PR ready for review. Merge into `wolfs-tailor` once Gregory approves.
- Hand off for the live 15-min demo call.

**Total: ~4 working days.**

---

## 8. Environment variables

Added to `.env.example` (empty) and `.env.local` (values):

```
ELEVENLABS_API_KEY=              # Conversational AI key
ELEVENLABS_AGENT_ID=             # populated by provision-agent MCP tool
ELEVENLABS_VOICE_ID=cgSgspJ2msm6clMCkdW9   # Jessica
ELEVENLABS_WEBHOOK_SECRET=       # generated on first webhook registration
VOICE_TOOL_SHARED_SECRET=        # generated with openssl rand -hex 32
```

---

## 9. Open questions

None blocking. Flagged for follow-up after pilot week 1:
- Promote LLM to Claude Sonnet 4.5 for hard scenarios?
- Tock API integration (direct booking) — needs Tock partner access.
- SMS follow-up — needs A2P 10DLC registration (already flagged in the MVP brief).
- Warm transfer to host line during service hours — needs SIP config.
- Custom voice clone of an actual Wolf's Tailor host (premium upsell per demo brief).

---

## 10. What gets shipped

- Feature branch PR against `wolfs-tailor` with ~20 new files.
- Live ElevenLabs agent "Sawyer" with Jessica voice, 15-section KB, 5 tools.
- Live phone number caller can dial for the demo.
- Live web widget at `/demos/wolfs-tailor`.
- Admin inbox at `/admin/voice`.
- 35-scenario QA regression passing 100%.
- One recorded passing test call before handoff.
