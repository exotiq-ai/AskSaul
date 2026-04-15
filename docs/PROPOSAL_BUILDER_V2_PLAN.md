# Proposal Builder v2 — Architecture & Build Plan

**Status:** Planning
**Author:** Gregory + Claude
**Last updated:** 2026-04-15
**Target milestone:** Proposal builder that captures everything Saul needs to write a real fixed-price quote, persists to Supabase, is queryable via MCP, emails prospects via Resend, and syncs cleanly to GoHighLevel.

---

## 1. Context

### The problem with v1
The current builder (shipped April 2026 with the site revisions) captures enough to route a lead, but not enough for Saul to write a scoped proposal without a follow-up call. It also has zero persistence — data is POSTed to a GHL webhook and evaporates. Specifically:

- **Data loss on GHL failure.** `api/proposal/route.ts` catches webhook errors silently and returns 200 to the client. If GHL is down, the lead is gone.
- **No historical store.** Nothing in Supabase, no audit trail, no way to reopen a prospect's submission a week later.
- **No vertical depth.** We ask industry, but every industry gets the same downstream questions. MSPs don't get asked about PSA. Property managers don't get asked about door count. Home services don't get asked about job volume.
- **Service gaps.** Voice agent and custom app have zero discovery questions. Web projects don't ask about design/content ownership, CMS, hosting, domain, or existing site URL. Marketing projects don't ask about list size, sending volume, or team seats.
- **No confirmation email.** Customer submits, sees a success page, and waits in silence.
- **No Saul loop.** Saul (our AI assistant) has no API into this data. To write a proposal he'd need Gregory to manually paste the submission into chat.
- **Mandatory SMS consent gate.** The current refinement forces `smsConsent === true` to submit. That's TCPA-unfriendly and also blocks email-preferring prospects.

### What v2 needs to do
1. Capture every field Saul needs to write a scoped, fixed-price proposal without a discovery call — OR explicitly flag "discovery call required" as a branch.
2. Persist to Supabase as the source of truth.
3. Fire GHL webhook as a secondary side-effect (non-blocking, retryable).
4. Send a Resend confirmation email to the prospect within seconds.
5. Send a Resend internal-notification email to Gregory with lead summary.
6. Expose an MCP server so Saul can query proposals, draft quotes, and mark status.
7. Saul generates the proposal (as Markdown/HTML), sends via Resend from `saul3000bot@gmail.com` (or `saul@asksaul.ai` when the domain is wired), and updates the proposal record.
8. Once the proposal is accepted, Saul (or Gregory) pushes the enriched record to GHL as a new Opportunity with full context.

---

## 2. End-to-end system diagram

```
┌──────────────────────┐
│  /build-your-proposal │  (Next.js client)
│  5-step form, Zod     │
└──────────┬───────────┘
           │ POST /api/proposal
           ▼
┌──────────────────────────────────────────────┐
│  /api/proposal  (server route)               │
│  1. Validate (Zod)                           │
│  2. Insert into Supabase (proposals table)   │
│  3. Fire-and-retry GHL webhook (background)  │
│  4. Send Resend confirmation → prospect      │
│  5. Send Resend notification → Gregory       │
│  6. Return { success, proposalId }           │
└──────────┬───────────────────────────────────┘
           │
           ▼
┌──────────────────────┐          ┌──────────────────────┐
│  Supabase            │◄────────►│  MCP Server          │
│  proposals           │   read   │  (Node, stdio)       │
│  proposal_events     │   write  │  tools: list, get,   │
│  proposal_drafts     │          │  score, update_status│
└──────────┬───────────┘          └──────────┬───────────┘
           │                                 │
           │                                 │
           │                      ┌──────────▼──────────┐
           │                      │  Saul (Claude Agent)│
           │                      │  1. Pull proposal    │
           │                      │  2. Draft quote      │
           │                      │  3. Send via Resend  │
           │                      │  4. Mark status      │
           │                      │  5. Push to GHL      │
           │                      └──────────┬──────────┘
           │                                 │
           ▼                                 ▼
┌──────────────────────┐         ┌──────────────────────┐
│  GHL (CRM)           │◄────────│  Resend              │
│  Contact + Opportunity│         │  Transactional email │
└──────────────────────┘         └──────────────────────┘
```

---

## 3. Data model (Supabase)

### `proposals` (main table)
Every form submission becomes one row. Designed to hold everything Saul needs — extend via `service_details` JSON for service-specific depth rather than N columns.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | `default gen_random_uuid()` |
| `created_at` | `timestamptz` | `default now()` |
| `updated_at` | `timestamptz` | trigger to auto-update |
| `status` | `text` | enum: `submitted`, `reviewed`, `quoted`, `accepted`, `rejected`, `lost`, `won` |
| `source` | `text` | `asksaul-proposal-builder`, future: `chat-widget`, `manual` |
| `referrer` | `text` | `document.referrer` on form load |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` | `text` | captured from URL |
| `services` | `text[]` | `ai-assistant`, `website`, `marketing`, `automation`, `voice-agent`, `custom-app`, `not-sure` |
| `industry_slug` | `text` | normalized slug (msp, property-mgmt, …) |
| `industry_label` | `text` | human-readable label |
| `business_name` | `text` | required |
| `business_website` | `text` | new: current URL if any |
| `team_size` | `text` | enum |
| `revenue_range` | `text` | optional enum |
| `monthly_spend` | `text` | optional enum (sales/marketing tool spend) |
| `current_tools` | `text[]` | multi-select |
| `contact_first_name` | `text` | required |
| `contact_last_name` | `text` | optional |
| `contact_email` | `text` | required, format-validated |
| `contact_phone` | `text` | E.164 normalized |
| `preferred_contact` | `text` | enum |
| `role_in_company` | `text` | new: founder, marketing lead, ops, assistant, … |
| `decision_maker` | `boolean` | new: am I the decision maker? |
| `timeline` | `text` | enum |
| `hard_deadline` | `date` | new: nullable — "I need this live by DATE" |
| `budget` | `text` | optional enum |
| `success_metrics` | `text` | new: free text — "how will you know this worked?" |
| `compliance_needs` | `text[]` | new: `hipaa`, `soc2`, `pci`, `gdpr`, `none`, `other` |
| `service_details` | `jsonb` | all branch-specific answers (see §3.2) |
| `vertical_details` | `jsonb` | industry-specific answers (see §3.3) |
| `notes` | `text` | free text |
| `sms_consent` | `boolean` | honest capture, default false |
| `marketing_sms_opt_in` | `boolean` | default false |
| `estimated_value_usd` | `integer` | computed by server |
| `lead_value_tag` | `text` | `high-value`, `mid-value`, `starter` |
| `tags` | `text[]` | service-lead, industry, spend bucket, etc. |
| `ghl_sync_status` | `text` | `pending`, `synced`, `failed`, `skipped` |
| `ghl_synced_at` | `timestamptz` | nullable |
| `ghl_contact_id` | `text` | once synced |
| `ghl_opportunity_id` | `text` | once an opportunity is created |
| `resend_confirmation_id` | `text` | Resend message id for the customer confirmation |
| `resend_internal_notification_id` | `text` | Resend message id for Gregory's notification |

### `proposal_events` (audit log)
Every state change is an event row.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `proposal_id` | `uuid` fk → proposals.id | indexed |
| `created_at` | `timestamptz` | `default now()` |
| `event_type` | `text` | `submitted`, `ghl_synced`, `ghl_failed`, `email_sent`, `email_opened`, `email_clicked`, `reviewed_by_saul`, `quote_drafted`, `quote_sent`, `quote_viewed`, `quote_accepted`, `quote_rejected`, `status_changed` |
| `actor` | `text` | `system`, `saul`, `gregory`, `prospect` |
| `payload` | `jsonb` | event-specific data (email id, webhook status, draft content, etc.) |

### `proposal_drafts` (Saul's quote drafts)
Saul iterates on the proposal before sending. One proposal can have many drafts.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` pk | |
| `proposal_id` | `uuid` fk → proposals.id | |
| `version` | `integer` | auto-increment per proposal |
| `created_at` | `timestamptz` | |
| `created_by` | `text` | `saul`, `gregory` |
| `status` | `text` | `draft`, `approved`, `sent`, `superseded` |
| `scope_summary` | `text` | one-paragraph description of what we'll build |
| `deliverables` | `jsonb` | array of `{name, description, value_usd}` |
| `price_usd` | `integer` | total quoted |
| `price_model` | `text` | `fixed`, `retainer`, `hybrid` |
| `timeline_weeks` | `integer` | |
| `terms` | `text` | payment terms, scope boundaries |
| `markdown_body` | `text` | full rendered proposal |
| `html_body` | `text` | rendered HTML for Resend send |
| `sent_at` | `timestamptz` | nullable |
| `sent_to_email` | `text` | nullable |
| `resend_message_id` | `text` | nullable |

### `service_details` JSON shape (§3.2)
Per service selected, a sub-object with branch-specific answers.

```json
{
  "ai-assistant": {
    "user_count_bucket": "small-team",
    "platforms": ["telegram", "slack"],
    "use_cases": ["customer-support", "sales"],
    "tier_preference": "team",          // new
    "monthly_message_volume": "1k-10k", // new
    "addons_interest": ["managed-care", "additional-channel"], // new
    "vps_hosting_preference": "we-provision" // new
  },
  "website": {
    "existing": "yes-redesign",
    "existing_url": "https://example.com", // new
    "pages": "5-10",
    "ecommerce": "yes",
    "ecommerce_platform_preference": "shopify",  // new
    "cms_preference": "nextjs-headless",         // new
    "design_status": "needs-design",             // new: has-figma, needs-design, redesign-existing
    "content_status": "will-provide",            // new: will-provide, need-copywriting, partial
    "domain_owned": true,                        // new
    "hosting_preference": "we-host",             // new: we-host, client-host, dont-know
    "integrations": ["stripe", "calendly", "hubspot"], // new
    "launch_blocker_date": "2026-06-01"          // new
  },
  "marketing": {
    "current_tools": ["gohighlevel"],
    "pain_points": ["lead-capture", "follow-up"],
    "list_size_bucket": "1k-10k",        // new
    "email_volume_monthly": "10k-50k",   // new
    "sms_volume_monthly": "under-1k",    // new
    "team_seats_needed": 3,              // new
    "review_sources": ["google", "facebook"], // new
    "automation_complexity": "behavioral-triggers" // new
  },
  "automation": {
    "processes_text": "…",
    "tools_text": "…",
    "integrations_required": ["quickbooks", "google-sheets"], // new
    "data_sources": ["crm", "spreadsheets"]                   // new
  },
  "voice-agent": {
    "use_case": "after-hours-intake",      // new
    "expected_call_volume": "under-500/mo", // new
    "languages": ["english", "spanish"]     // new
  },
  "custom-app": {
    "one_line_description": "…",           // new
    "user_types": ["admin", "customer"],   // new
    "key_features": "…",                   // new
    "auth_requirements": "sso-required"    // new
  },
  "not-sure": {
    "biggest_headache": "…",
    "would_automate": "…"
  }
}
```

### `vertical_details` JSON shape (§3.3)
Only populated when industry matches one of the 8 Priority verticals; otherwise empty. Questions are vertical-specific and surface conditionally in Step 3.

```json
{
  "msp": {
    "psa_system": "connectwise",
    "ticket_volume_monthly": "1k-5k",
    "client_count": 45,
    "recurring_revenue_percent": 70
  },
  "property-mgmt": {
    "door_count": 350,
    "portfolio_type": "single-family-and-multifamily",
    "tenant_portal_needed": true,
    "rent_collection_integrated": false
  },
  "home-services": {
    "trades": ["hvac", "plumbing"],
    "jobs_per_month": "100-500",
    "seasonal_peaks": ["summer", "winter"],
    "dispatching_tool": "servicetitan"
  },
  "title-insurance": {
    "deals_per_month": 80,
    "offices": 3,
    "target_sla_days": 7
  },
  "professional-services": {
    "practice_area": "estate-planning",
    "billable_hours_tracked": true,
    "client_portal_needed": false
  },
  "real-estate": {
    "team_type": "brokerage",
    "agent_count": 22,
    "mls_integration_needed": true
  },
  "startup": {
    "stage": "seed",
    "runway_months": 14,
    "key_metric": "mrr-growth"
  },
  "pe-portfolio": {
    "portfolio_company_count": 8,
    "unified_reporting_required": true
  }
}
```

---

## 4. Form UX redesign

Keep the 5-step structure. Redistribute and add conditional depth.

### Step 1 — Services
**No change.** Multi-select 7 service chips, required min 1.
Add an "info tooltip" on each service chip explaining what's included so visitors don't overselect.

### Step 2 — About your business
**Fields (required unless noted):**
- Industry (dropdown, 18 options) [required]
- Business name [required]
- Business website (optional, URL validated) ← new
- Team size [required]
- Role in company (founder, marketing lead, ops, assistant, other) ← new
- Are you the decision maker? (yes / shared / no, I'm researching) ← new
- Monthly revenue range (optional)
- Monthly spend on sales/marketing tools (optional)

### Step 3 — Your stack + vertical depth
**Above-the-fold common questions:**
- Current tools (multi-select, 13 options) — already exists
- Compliance requirements (HIPAA, SOC2, PCI, GDPR, none, other) ← new

**Then:** if industry matches one of the 8 Priority verticals, render vertical-specific follow-up questions (see §3.3). Otherwise skip.

### Step 4 — Project details (new name; used to be "A few more questions")
**Service-specific branches.** When a service is selected in Step 1, render its discovery block here. Each block has ~3–6 questions per §3.2.

Priority: make each block one screen with compact toggles so selecting 2 services feels like "one scroll" not "two forms." Keep optional fields clearly tagged.

### Step 5 — Timeline + success + contact
- Timeline (enum: asap, 1-2-weeks, 1-2-months, exploring) [required]
- Hard deadline (date picker, optional) ← new
- Budget (enum, optional)
- Success metrics (free text, 2–3 sentences) ← new: "How will you know this worked?"
- Contact: first name, last name, email, phone, preferred contact, SMS consent (opt-in, NOT a submission gate) ← changed
- Marketing SMS opt-in (clearly separate)
- Notes (free text, optional)

### Step 6 — Review & submit
- Show everything with edit-back-to-step links (already exists)
- Show the estimated_value Saul calculated: *"Based on what you've told us, we're looking at roughly $X–$Y. Build your proposal and we'll send you a real number within 24 hours."* ← new
- Submit button with loading spinner
- Success screen: explain timing ("you'll hear from Saul in under 24 hours"), show the confirmation number, offer to book a call, show a calendar link

### UX fixes (applies across all steps)
- Scroll to first error on validation failure.
- `aria-invalid` and `aria-describedby` on errored fields.
- Loading spinner (not just "Submitting...") on submit.
- Don't clear sessionStorage until Supabase insert is confirmed 2xx.
- Show SMS consent as opt-in checkbox, NOT a submission gate.
- Progress bar at top reflects 6 steps if we add step 6, or 5 if we collapse review into step 5.
- Mobile: progress indicator is a dot stepper not text labels.

---

## 5. API changes

### `POST /api/proposal`
New flow (pseudocode):

```ts
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = proposalSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'validation' }, { status: 422 });

  const payload = buildSupabasePayload(parsed.data);
  const { data, error } = await supabase
    .from('proposals')
    .insert(payload)
    .select('id, contact_email, contact_first_name, business_name, estimated_value_usd')
    .single();
  if (error) return Response.json({ error: 'persistence' }, { status: 500 });

  // Fire side-effects in parallel, don't block user response on failures
  const [confirmRes, internalRes, ghlRes] = await Promise.allSettled([
    sendConfirmationEmail(data),
    sendInternalNotification(data),
    pushToGhl(parsed.data, data.id),
  ]);

  // Log each to proposal_events
  await logEvents(data.id, { confirmRes, internalRes, ghlRes });

  return Response.json({
    success: true,
    proposalId: data.id,
    estimatedValue: data.estimated_value_usd,
  });
}
```

**Key change:** Supabase insert is the canonical "submission succeeded" signal. GHL and email are best-effort side-effects logged to `proposal_events`. Failures are retryable from a cron or the MCP tool.

### New: `GET /api/proposal/:id/status` (public, limited fields)
Allows prospect to check "did my submission go through?" via a magic link in the confirmation email.

### New: `POST /api/internal/ghl-retry` (protected)
Scheduled cron (Vercel Cron / Netlify Scheduled Function) re-fires GHL webhook for any proposal where `ghl_sync_status = 'failed'` and `created_at < now() - interval '5 minutes'`.

---

## 6. Email flows (Resend)

### Customer confirmation — send immediately
- **From:** `Saul <hello@asksaul.ai>` (once domain is verified) or `Gregory <saul3000bot@gmail.com>` as interim
- **Subject:** `Got it, {{first_name}}. Saul is on it.`
- **Body:** Warm confirmation, what to expect, rough timing, link to book a call, quote back their services + industry + timeline so they know it captured correctly.
- **Template:** React Email component, stored in `emails/confirmation.tsx`.

### Internal notification — send to Gregory
- **From:** `AskSaul Builder <hello@asksaul.ai>`
- **To:** `saul3000bot@gmail.com` (or wherever Gregory triages leads)
- **Subject:** `New proposal: {{business_name}} · {{services}} · ~$ {{estimated_value}}`
- **Body:** Bulleted summary of every field, link to the proposal record in whatever admin dashboard we build (Retool/Supabase Studio/custom), plain-text copy at the bottom for skimming on mobile.

### Saul's proposal send (from Saul's agent loop, not /api/proposal)
- **From:** `Saul <saul@asksaul.ai>` or Gregory's address with "on behalf of"
- **Subject:** `{{business_name}} — proposal from AskSaul`
- **Body:** Rendered from `proposal_drafts.html_body`. Markdown source lives in `markdown_body` for easy edit.
- Triggers `proposal_events` row: `quote_sent`.

### Domain verification prerequisites
- Resend domain verification for `asksaul.ai` (SPF, DKIM, DMARC, return-path CNAME).
- Until then, send from a verified address with reply-to set to the target.

---

## 7. MCP server for Saul

A small Node MCP server that exposes Supabase reads/writes via tool calls. Lives in a new top-level `mcp-server/` directory (not shipped with the Next app; deployed separately or run locally by Saul).

### Tools
- `list_proposals({ status?, since?, limit? })` — returns summaries
- `get_proposal({ id })` — full record including `service_details` and `vertical_details`
- `score_lead({ id })` — re-runs `calculateEstimatedValue` on the stored data
- `draft_proposal({ id, scope_summary, deliverables[], price_usd, price_model, timeline_weeks, terms })` — inserts `proposal_drafts` row, returns draft id + markdown
- `send_proposal({ draft_id, from, reply_to })` — renders HTML, sends via Resend, updates draft status, logs event
- `update_status({ id, status, note })` — state transitions
- `sync_to_ghl({ id })` — force-pushes to GHL (also callable from the retry cron)

### Implementation stack
- `@anthropic-ai/sdk` or `@modelcontextprotocol/sdk`
- `@supabase/supabase-js` with service_role key (server-only)
- `resend` SDK
- Deployed to Fly.io, Railway, or run locally via Claude Desktop / Claude Agent SDK

### Auth
MCP server talks to Supabase via the `service_role` key (stored in env). Saul's Claude session is the only consumer; protect the MCP endpoint with a shared secret.

---

## 8. GoHighLevel sync

### Trigger points
1. **On proposal submission** — create a new Contact in GHL with all captured fields as custom fields, tag with service/industry/value tags, attach a note containing the full Markdown summary of service_details + vertical_details.
2. **On proposal sent by Saul** — add note, move Opportunity stage to "Proposal sent."
3. **On proposal accepted** — Opportunity stage → "Won"; create onboarding sub-pipeline trigger.
4. **On proposal rejected/lost** — Opportunity stage → "Lost," log reason.

### Custom fields to create in GHL (mirrored from Supabase columns)
- `asksaul_proposal_id` (text, unique) — primary key for matching
- `asksaul_industry`, `asksaul_services` (multi-text)
- `asksaul_estimated_value` (number)
- `asksaul_timeline`, `asksaul_hard_deadline`
- `asksaul_success_metrics` (long text)
- `asksaul_stack` (long text) — dumped service_details + vertical_details JSON

### Sync strategy
- **Push, not pull.** Supabase is the source of truth; GHL mirrors.
- The existing `sendToGHL` webhook becomes "enrich and push to a proper GHL endpoint with contact upsert + opportunity create," not a raw JSON webhook.
- Use GHL's v2 API with OAuth or API key. Store token in env.
- On any sync failure, log to `proposal_events` with `ghl_failed` and retry via cron.

---

## 9. Phased rollout

### Phase 0 — Infrastructure setup (prereq, 1 day of work)
- Create Supabase project, run migrations for `proposals`, `proposal_events`, `proposal_drafts`.
- Enable Row Level Security; service_role for server, no client-side access.
- Create Resend account, verify `asksaul.ai` domain.
- Add env vars to Netlify: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `GHL_API_KEY` (if moving off webhook), `GHL_LOCATION_ID`.
- Install packages: `@supabase/supabase-js`, `resend`, `@react-email/components`.

### Phase 1 — Form v2 fields + validation (2–3 days)
- Expand `lib/validation.ts` with new schemas (`service_details_schema`, `vertical_details_schema`, new top-level fields).
- Add URL input, date picker, textarea, radio patterns as shared components.
- Update `BusinessInfo`, new `CommonDetails` component for Step 3 enhancements, expand `QuestionFlow` with per-service deep blocks and vertical-conditional blocks.
- Update `ContactPreferences` → `TimelineAndContact` with success metrics + hard deadline.
- Update `SummaryReview` to render all new fields grouped sensibly.
- Fix SMS consent (opt-in, not a gate).

### Phase 2 — Supabase persistence (1–2 days)
- Add `lib/supabase.ts` server client.
- Rewrite `/api/proposal/route.ts` to insert, return 4xx/5xx correctly, log events.
- Remove silent GHL-failure path; GHL becomes background task.
- Add `lib/events.ts` with `logProposalEvent(proposalId, type, payload)`.

### Phase 3 — Resend emails (1 day)
- Create `emails/confirmation.tsx` (React Email component).
- Create `emails/internal-notification.tsx`.
- Add `lib/email.ts` wrapper around Resend SDK.
- Wire into `/api/proposal`.
- Until domain is verified: send from Resend's default domain with reply-to set.

### Phase 4 — MCP server (2–3 days)
- Scaffold `mcp-server/` with TypeScript + MCP SDK.
- Implement tools per §7.
- Deploy to Fly.io or Railway (or run locally via Claude Desktop config).
- Document how Gregory registers the server in Claude.

### Phase 5 — Saul's proposal flow (2 days + iteration)
- Saul's system prompt / skill: "You review new proposals in AskSaul, draft a fixed-price quote using the service_details/vertical_details context, and send via Resend once Gregory approves."
- Build a `draft_proposal` markdown template that Saul fills in.
- Add a review/approve step (Gregory sees drafts in Supabase Studio or a simple `/admin/proposals` Next route, approves, then Saul calls `send_proposal`).

### Phase 6 — GHL upgrade (2 days)
- Swap the raw webhook for a proper GHL v2 API integration.
- Create custom fields in GHL.
- Map Supabase → GHL on insert + on state transitions.
- Retry cron (Vercel/Netlify scheduled function hitting `/api/internal/ghl-retry`).

### Phase 7 — Admin dashboard (optional, 1–2 days)
- Simple `/admin/proposals` route (password-protected) listing submissions, filters, view details, link to Supabase Studio for editing.
- Or use Supabase Studio + Retool / internal.io if we don't want to roll it ourselves.

**Total effort estimate: ~12–16 days of focused work** depending on how much of Phase 7 and Saul's iteration we scope now.

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Resend domain verification delays email | Start Phase 3 with Resend default sender + reply-to; upgrade later |
| GHL v2 API auth complexity | Keep the webhook as fallback during Phase 6; flip when API path is stable |
| MCP server goes offline → Saul can't work | Saul's prompt includes fallback: "If MCP unavailable, ask Gregory to paste the proposal record" |
| Form gets too long, abandonment spikes | Measure submission rate pre/post v2; A/B test at 4-step vs 6-step if abandonment climbs |
| Vertical questions feel like a gauntlet | Hide vertical questions behind a collapsed "Tell us more about your {industry}" section; optional |
| Supabase is now a business-critical store | Enable PITR, nightly backups, monitor via Supabase status |
| Unvalidated free-text in `success_metrics` | Cap length at 2000 chars; sanitize in email templates |

---

## 11. Open decisions (before Phase 1 starts)

1. **Sender identity.** `saul@asksaul.ai` (verified domain, requires DNS work) vs `saul3000bot@gmail.com` (works today, looks less branded). Recommend: prioritize domain verification in Phase 0.
2. **Admin dashboard vs Supabase Studio.** Build a tiny `/admin` route or rely on Studio? Studio is fine for v1; custom UI only if we find ourselves living in it daily.
3. **Saul approval loop.** Fully automated "Saul drafts → sends" or "Saul drafts → Gregory approves → sends"? Recommend approval gate for first 10 proposals, then review.
4. **Retention.** How long do we keep rejected/lost proposals in Supabase? Recommend 2 years for pattern analysis.
5. **Prospect-visible proposal page.** Do we want to render the proposal as a web page (`/p/{signed_id}`) with accept/reject buttons, or email-only? Web page is higher effort but much better UX + analytics. Defer to Phase 5 iteration.
6. **PDF generation.** Send the proposal as HTML email + optional PDF attachment? Puppeteer / react-pdf / `@vercel/og`?
7. **Lead scoring transparency.** Show the prospect their `estimated_value` range on the success screen? Pro: manages expectations. Con: anchors low if our estimate is conservative.

---

## 12. Files touched / created

### New
- `docs/PROPOSAL_BUILDER_V2_PLAN.md` (this file)
- `supabase/migrations/0001_proposals.sql`
- `supabase/migrations/0002_proposal_events.sql`
- `supabase/migrations/0003_proposal_drafts.sql`
- `lib/supabase.ts` (server client)
- `lib/email.ts` (Resend wrapper)
- `lib/events.ts` (event logger)
- `lib/ghl-v2.ts` (replace `ghl.ts` webhook-only version)
- `emails/confirmation.tsx`
- `emails/internal-notification.tsx`
- `emails/proposal.tsx` (Saul's send template)
- `components/proposal-builder/CommonDetails.tsx` (Step 3 common block)
- `components/proposal-builder/VerticalQuestions.tsx` (industry-conditional)
- `components/proposal-builder/SuccessMetrics.tsx`
- `components/proposal-builder/PhoneInput.tsx` (E.164 normalized)
- `components/proposal-builder/DatePicker.tsx` (hard deadline)
- `app/api/internal/ghl-retry/route.ts`
- `app/api/proposal/[id]/status/route.ts`
- `app/admin/proposals/page.tsx` (optional Phase 7)
- `mcp-server/` (separate package)

### Modified
- `lib/validation.ts` — expand schemas
- `app/api/proposal/route.ts` — Supabase insert + side-effects
- `app/build-your-proposal/page.tsx` — new field flow
- `components/proposal-builder/BusinessInfo.tsx` — role, decision-maker, website
- `components/proposal-builder/QuestionFlow.tsx` — per-service deep blocks
- `components/proposal-builder/ContactPreferences.tsx` — success metrics, hard deadline, SMS fix
- `components/proposal-builder/SummaryReview.tsx` — render all new fields
- `components/proposal-builder/SubmissionConfirmation.tsx` — confirmation #, timing expectations
- `lib/ghl.ts` → deprecate in favor of `lib/ghl-v2.ts`

---

## 13. Verification plan

End-to-end test per phase:

- **Phase 1:** Fill form with new fields locally, confirm Zod validates, confirm payload shape matches Supabase schema.
- **Phase 2:** Submit → Supabase row exists with correct JSON blobs → confirm `proposal_events.submitted` row logged.
- **Phase 3:** Submit → check Resend logs for both emails sent → open both, verify rendering.
- **Phase 4:** `list_proposals()` from Saul via MCP returns recent submission → `get_proposal(id)` returns full record.
- **Phase 5:** Saul drafts a proposal from Supabase data → review in `proposal_drafts` → approve → send → confirm customer receives branded proposal email → `proposal_events.quote_sent` logged.
- **Phase 6:** New submission → GHL contact created with all custom fields populated → `ghl_sync_status = 'synced'` → tag new submission as "rejected" in Supabase → confirm GHL opportunity moved to Lost stage.
- **Load test (lightweight):** 10 concurrent submissions, confirm no double-inserts, all side-effects succeed or log failure.

---

## 14. Success metrics for v2

Measured 30 days post-launch:

1. **Submission completion rate** (started step 1 → submitted step 6) — target ≥70%, matches or beats v1.
2. **Data completeness score** — percentage of proposals where Saul can draft a quote without follow-up questions — target ≥80%.
3. **Time-to-quote** — median hours from submission to Saul sending proposal — target ≤12 hours.
4. **Quote acceptance rate** — percentage of proposals sent that convert to accepted — target ≥30% (industry baseline is 20–25% for warm inbound).
5. **GHL sync success rate** — target ≥99% on first attempt, 100% after retry.
6. **Email deliverability** — customer confirmation open rate ≥50%, internal notification 100%.
