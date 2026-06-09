# AskSaul.ai Autonomous Sprint Plan

> **For Hermes/Avi:** Use subagent-driven-development for implementation. Avi stays orchestrator, product owner, reviewer, and integration lead. Subagents handle focused coding/research tasks only after this plan is decomposed into bite-sized tickets.

**Date:** 2026-06-08  
**Repo:** `/Users/gbot/Projects/AskSaul`  
**Live site:** `https://asksaul.ai`  
**Goal:** Turn AskSaul.ai from a strong general AI/web/automation brand site into a conversion-focused voice-agent and provider-program acquisition engine, with reliable GHL routing, a dedicated phone-agent page, honest/real chat behavior, and production-quality verification.

**Architecture:** Keep AskSaul.ai as a Next.js 16 App Router site. Add a dedicated voice-agent landing page and shared conversion components. Route all forms/chat/proposal submissions through hardened server API routes that reliably send structured lead payloads to the Ask Saul GHL location or an approved webhook/proxy. Upgrade the current rule-based chat either into a truthful lead-capture assistant or a live AI-backed assistant through a safe hosted endpoint, not a raw local OpenClaw gateway.

**Tech Stack:** Next.js 16.2.x, React 19, TypeScript, Tailwind v4, Zod, React Hook Form, GHL/LeadConnector, optional Cloudflare Worker/AI proxy, optional Telegram internal alerts, Playwright/browser QA.

---

## 0. Sprint North Star

This sprint succeeds if a local service provider who receives outreach can visit AskSaul.ai and immediately understand:

1. Saul can answer missed/after-hours calls for their business.
2. Saul can qualify callers, capture job context, and route the lead to GHL/CRM/Gregory/provider.
3. They can call the live demo number `(720) 292-7554`.
4. They can request setup through a low-friction form/survey.
5. Gregory receives the lead in the right GHL location with usable context.
6. The site looks premium, loads cleanly, passes build/type checks, and does not silently drop leads.

---

## 1. Known Current State

### Verified

- Repo cloned at `/Users/gbot/Projects/AskSaul`.
- Live site `https://asksaul.ai` returns `200` and matches current brand/site structure.
- `npm run build` passes.
- Current chat widget is rule-based, not real AI.
- `BUILD_SPEC.md` explicitly says launch chat is rule-based lead capture and real AI is Phase 2.
- Existing form APIs:
  - `app/api/proposal/route.ts`
  - `app/api/contact/route.ts`
  - `app/api/chat/route.ts`
- Existing GHL helper:
  - `lib/ghl.ts`
  - Uses `process.env.GHL_WEBHOOK_URL`.
  - If missing, it logs warning and returns successfully, which is risky for production lead capture.
- Saul Provider phone system context from lead-gen-saul:
  - Demo phone: `(720) 292-7554`
  - Ask Saul GHL location: `RxCVQeGoQ3RTJbbLG5gY`
  - GHL calendar booking link exists.

### Current blockers / risks

- `npm run lint` fails on existing repo issues:
  - mostly `react/no-unescaped-entities`
  - one `react-hooks/set-state-in-effect` issue in `components/ui/AnimatedSection.tsx`
- `npm audit --omit=dev` reports vulnerable `next`/`postcss`; update path likely Next `16.2.7` or whatever current safe patch is when executing.
- No `.env.example` found in repo.
- GHL submission can silently no-op if webhook env is absent.
- Current `Talk to Saul` framing can overpromise because the chat is static.
- No dedicated voice-agent/provider-program page yet.

---

## 2. Operating Model: Fast, Autonomous, Not Sloppy

### Avi role

Avi remains:

- Product owner: final copy, positioning, scope decisions.
- Architect: integration decisions, file organization, anti-bloat enforcement.
- Orchestrator: dispatches subagents only for isolated tasks.
- Integrator: reviews diffs, resolves conflicts, runs full verification.
- QA lead: browser checks, console checks, form simulation, build/lint/type/audit checks.

### Subagent role

Subagents may handle focused work such as:

- Route/component implementation.
- Copy draft variants.
- Test creation.
- SEO/metadata/schema review.
- Lint fixes.
- GHL payload mapping review.
- Visual QA notes.

Subagents must not:

- Push to remote.
- Change live credentials.
- Deploy without Avi/Gregory approval.
- Touch unrelated projects.
- Invent pricing, claims, phone numbers, or GHL IDs.
- Replace brand voice with generic AI copy.
- Make broad rewrites without a narrow task spec.

### Quality gates

Every implementation task must pass:

1. **Spec review:** Does it satisfy the assigned task exactly?
2. **Code quality review:** Is it maintainable, typed, safe, and consistent?
3. **Integration check:** Does it work with neighboring pieces?
4. **Verification:** At minimum `npm run build`; eventually lint/type/build/browser QA/form QA.

### Parallelization rule

Only parallelize tasks that do not touch the same files.

Good parallel examples:

- Subagent A: draft voice-agent page copy in markdown.
- Subagent B: inspect existing form/GHL schema and propose payload fields.
- Subagent C: review design inspirations for flow diagram.

Bad parallel examples:

- Two agents both editing `app/ai-automation/page.tsx`.
- One agent refactoring `lib/validation.ts` while another edits forms depending on it.
- Multiple agents making homepage copy changes at once.

---

## 3. Sprint Phases

## Phase A — Stabilize and protect the current site

**Goal:** Make the repo safe to modify and prevent lead-loss bugs before adding new conversion paths.

### A1. Create branch and baseline report

**Objective:** Establish a clean sprint branch and baseline evidence.

**Files:** none or docs only.

**Steps:**

1. Check git status.
2. Create branch, suggested:
   - `feat/voice-agent-conversion-sprint`
3. Record baseline commands and outputs in sprint notes:
   - `npm run build`
   - `npm run lint`
   - `npm audit --omit=dev`
4. Do not fix anything yet until baseline is captured.

**Acceptance:** Branch exists, baseline failures are documented.

### A2. Fix lint without changing behavior

**Objective:** Get lint to pass or reduce failures to known acceptable warnings.

**Files likely touched:**

- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/portfolio/page.tsx`
- `app/services/page.tsx`
- `components/chat/ChatWidget.tsx`
- `components/ui/AnimatedSection.tsx`
- possibly `app/blog/[slug]/page.tsx`
- possibly `app/marketing-engine/page.tsx`

**Rules:**

- Do not rewrite copy beyond escaping apostrophes/quotes unless needed.
- For `AnimatedSection`, fix the React hook lint issue cleanly without breaking reduced-motion behavior.
- Remove truly unused imports or variables only if safe.

**Commands:**

- `npm run lint`
- `npm run build`

**Acceptance:** Lint and build pass.

### A3. Patch dependency security issues carefully

**Objective:** Update vulnerable packages without breaking the site.

**Steps:**

1. Inspect current Next patch release and advisories.
2. Prefer patch-level update within Next 16 if possible.
3. Run:
   - `npm install next@<safe-patch> eslint-config-next@<matching-patch>` if needed.
   - `npm audit --omit=dev`
   - `npm run build`
   - `npm run lint`
4. If update causes breakage, revert and document the blocker rather than forcing a risky upgrade.

**Acceptance:** Audit materially improved or blocker documented with exact reason.

### A4. Add environment documentation

**Objective:** Make required production env explicit.

**Files:**

- Create: `.env.example`
- Maybe update: `README.md`

**Include:**

```env
GHL_WEBHOOK_URL=
NEXT_PUBLIC_SITE_URL=https://asksaul.ai
ASKSAUL_DEMO_PHONE=(720) 292-7554
ASKSAUL_BOOKING_URL=https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-3d837e4b-c899-44ff-b612-275f498c2128
CHAT_MODE=static
```

If direct GHL API is chosen later, add placeholders only, never real secrets:

```env
GHL_API_KEY=
GHL_LOCATION_ID=RxCVQeGoQ3RTJbbLG5gY
```

**Acceptance:** Future deploys know which env vars are required.

---

## Phase B — Harden lead capture and GHL routing

**Goal:** No public form should pretend success if we have not actually captured or routed the lead.

### B1. Decide routing architecture

**Preferred hierarchy:**

1. **Best:** Direct API/proxy with Ask Saul GHL location token and structured contact/custom field writes.
2. **Good:** GHL inbound webhook URL, but fail loudly if missing/misconfigured.
3. **Fallback:** Save locally/log and alert Gregory via Telegram, but do not tell user everything is handled unless there is a confirmed capture path.

**Decision point:** If current production has only `GHL_WEBHOOK_URL`, harden that first. Direct GHL API can be Phase B2/B3.

### B2. Stop silent GHL no-op

**Objective:** Prevent `sendToGHL()` from silently succeeding when `GHL_WEBHOOK_URL` is missing in production.

**Files:**

- Modify: `lib/ghl.ts`
- Modify routes if needed:
  - `app/api/proposal/route.ts`
  - `app/api/contact/route.ts`
  - `app/api/chat/route.ts`

**Behavior:**

- In development/test, missing webhook may log and return controlled response.
- In production, missing webhook must throw or return a visible server error.
- API routes should preserve good UX but not falsely claim success if no capture happened.

**Acceptance:**

- Missing webhook in production mode returns error.
- Valid webhook flow still returns success.
- Build/lint pass.

### B3. Normalize lead payloads for GHL

**Objective:** Make GHL payloads useful for follow-up and segmentation.

**Files:**

- `lib/ghl.ts`
- `lib/validation.ts`
- possibly form components.

**Required tags/fields for voice-agent leads:**

- `ask-saul`
- `website-lead`
- `voice-agent-lead`
- `phone-agent-prospect`
- `lead-project:ask_saul_phone_agents` or equivalent field/tag
- `source: asksaul-voice-agent-page` for voice page form

**Key payload values:**

- Name
- Email
- Phone
- Business name
- Service type
- Service area/city
- Current call handling
- Missed-call pain point
- Desired agent tasks
- Preferred callback window
- Consent fields
- Referrer/source page
- Transcript if chat-generated

**Acceptance:** Payloads are structured and auditable.

### B4. Add basic API route tests or test scripts

**Objective:** Avoid regressions on form submissions.

**Options:**

- Add lightweight Node/tsx test script for payload builder functions.
- Or add route handler tests if project already supports test runner.

**Acceptance:** At minimum, payload builder tests run and prove voice/contact/proposal payload shapes.

---

## Phase C — Dedicated voice-agent provider page

**Goal:** Create the page that converts outreach prospects.

### C1. Page strategy and route

**Route:** `/voice-agents` preferred.

**Nav:** Add to Services dropdown or top-level secondary CTA if space allows.

**Page title:**

- `AI Phone Agents for Local Service Businesses | AskSaul.ai`

**Meta description:**

- `Saul answers missed and after-hours calls, qualifies service leads, captures job details, and routes the context into your CRM or to Gregory for follow-up.`

### C2. Page copy outline

**Hero:**

Headline options:

- `Missed calls should still turn into booked jobs.`
- `Saul answers when your team cannot.`
- `The phone agent that catches jobs before they call someone else.`

Subhead:

- `Saul answers after-hours and missed calls, asks the right questions, captures job details, and sends the lead into your CRM or follow-up flow.`

CTAs:

- Primary: `Call Saul: (720) 292-7554`
- Secondary: `Book a 15-minute setup call`
- Tertiary: `See how it works`

Trust strip:

- `Free setup pilot`
- `No contract`
- `CRM/GHL handoff`
- `Built for service businesses`

**Use cases:**

- After-hours calls
- Missed calls while on a job
- Quote requests
- Emergency triage
- Scheduling intake
- Basic FAQs
- CRM notes and lead summary

**Program offer section:**

- `Free setup, no contract, pay only when a Saul-handled call turns into a closed job` if Gregory confirms this offer remains active.
- If not confirmed, phrase as `Pilot terms available for qualified local service providers`.

**FAQ:**

- Does Saul replace my receptionist?
- Can Saul work with GHL?
- What happens after Saul answers?
- Can I hear a demo?
- What does setup cost?
- What if the caller has an emergency?
- Does Saul book appointments or just collect info?

### C3. Voice-agent flow illustration

**Objective:** Build a branded visual explaining the flow without technical weeds.

**Component:**

- Create: `components/voice-agents/VoiceAgentFlow.tsx`

**Flow nodes:**

1. Customer calls.
2. Saul answers.
3. Saul qualifies the job.
4. Lead details are logged.
5. CRM/GHL gets updated.
6. Gregory/provider follows up or booking is created.

**Style:**

- Match existing dark AskSaul visual language.
- Use cyan accent and subtle grid/glow.
- Avoid enterprise architecture vibes.
- Use plain words, not API labels.

**Acceptance:** Screenshot/browser visual inspection confirms it is clear at a glance on desktop and mobile.

### C4. Provider setup form

**Component:**

- Create: `components/voice-agents/VoiceAgentLeadForm.tsx`

**Fields:**

- Name
- Business name
- Phone
- Email
- Service type
- Service area/city
- How calls are handled now
- What Saul should handle
- Biggest missed-call pain
- Preferred callback window
- SMS consent required
- Optional marketing SMS opt-in

**API:**

- Create: `app/api/voice-agent-lead/route.ts`
- Add schema: `voiceAgentLeadSchema` in `lib/validation.ts`
- Add payload builder: `buildVoiceAgentLeadPayload` in `lib/ghl.ts`

**Acceptance:** Form validates, submits, displays clear success/error, and payload includes GHL-ready fields/tags.

### C5. Add internal links

**Files likely touched:**

- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `components/home/ServiceLanes.tsx`
- `app/ai-automation/page.tsx`
- `app/services/page.tsx`

**Rules:**

- Do not clutter nav.
- Add “AI Phone Agents” as a service lane or sublink.
- Add CTA from AI automation page to `/voice-agents`.

**Acceptance:** Visitors can reach the page from homepage, nav/service page, and AI page.

---

## Phase D — Upgrade or truthfully reframe chat

**Goal:** Fix the mismatch between “Talk to Saul” and static chat behavior.

### D1. Immediate truthfulness fix

If live AI is not done in this sprint, update chat copy to be honest:

- Button can remain “Talk to Saul” if the first message says:
  - `I can point you in the right direction and get Gregory the context. For deeper questions, I’ll capture your details and he’ll follow up.`
- Add no fake typing or claims that imply live reasoning.

**Acceptance:** No visitor is misled into believing the static chat is a real AI if it is not.

### D2. Live AI chat architecture

**Do not expose local OpenClaw directly.**

Preferred live path:

```text
ChatWidget
→ /api/chat/message
→ hosted AI proxy or Cloudflare Worker
→ constrained AskSaul knowledge/prompt
→ response + optional lead-capture action
→ /api/chat/lead or GHL payload
```

**Minimal live AI endpoint behavior:**

- Answers only AskSaul services, pricing ranges, process, voice-agent demo, GHL/CRM basics, booking/contact next steps.
- Refuses/redirects unrelated requests.
- Does not invent exact availability, results, or guarantees.
- Pushes high-intent visitors to phone/demo/proposal form.
- Captures lead when user asks pricing/setup/booking.

### D3. Chat UI/service abstraction

**Files:**

- `components/chat/ChatWidget.tsx`
- Create: `lib/chat/staticResponses.ts`
- Create: `lib/chat/types.ts`
- Create: `app/api/chat/message/route.ts` if live mode is implemented.

**Env:**

- `CHAT_MODE=static|live`

**Acceptance:** Static mode still works. Live mode can be enabled later without rewriting the UI.

---

## Phase E — Homepage and conversion polish

**Goal:** Make the site feel like a polished, current AI/voice-agent company rather than a broad services brochure.

### E1. Homepage voice-agent CTA

Add a focused voice-agent module above or near the existing “Meet Saul” section:

- `New: AI phone agents for local service businesses`
- Short paragraph explaining missed calls → qualified leads.
- CTA to `/voice-agents` and call `(720) 292-7554`.

### E2. Rework “What Saul does” examples

Add one or two voice-agent examples:

- `Answers the call when you are on a job.`
- `Turns a missed quote request into a clean CRM note.`

### E3. Portfolio/proof positioning

Current proof is decent but mostly internal/platform work. Add “live provider phone agent” as a small proof module only if we can phrase truthfully:

- `Live demo phone agent connected to ElevenLabs, Twilio, Cloudflare Worker, Supabase, and GHL.`

Avoid implying customer revenue/results until real results exist.

---

## Phase F — SEO, AI search, and structured content

**Goal:** Make voice-agent content crawlable and AI-readable.

### F1. Metadata and schema

For `/voice-agents`, add:

- Unique metadata title/description.
- FAQ schema.
- Service schema if existing schema utilities support it.
- Breadcrumbs if current pattern exists.

### F2. AI-readable files

Current repo has sitemap/robots, but no `llms.txt`/`agents.txt` found.

Create or update:

- `public/llms.txt`
- `public/llms-full.txt`
- optionally `public/agents.txt`

Include:

- AskSaul summary
- Services
- Voice-agent page summary
- Pricing direction/ranges only if approved
- Contact/demo phone
- Important limitations/no-hype language

**Acceptance:** Raw `curl /llms.txt` returns markdown/text, not app shell HTML.

---

## Phase G — QA, accessibility, and deployment readiness

**Goal:** Ship only when the site is demonstrably working.

### G1. Automated checks

Run:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

If test scripts are added:

```bash
npm test
# or exact added test command
```

### G2. Browser QA routes

Check with browser and console:

- `/`
- `/voice-agents`
- `/ai-automation`
- `/build-your-proposal`
- `/contact`

For each:

- Page loads.
- No console errors.
- Main CTA works.
- Mobile layout is acceptable.
- No invisible/blank sections due to animation issues.

### G3. Form QA

Use safe non-production mode unless Gregory authorizes live GHL tests.

Test:

- Contact form validation.
- Proposal builder selected `voice-agent` path.
- Voice-agent lead form.
- Chat lead capture.

Verify:

- Payload shape.
- Error state if webhook/API unavailable.
- Success state if endpoint receives acceptable response.

### G4. Visual QA

Use screenshot/browser vision for:

- Homepage above fold.
- Voice-agent page above fold.
- Flow illustration.
- Provider form section.
- Mobile viewport.

Reject if:

- Looks generic/AI-slop.
- Text is too dense.
- Flow illustration is too technical.
- CTAs are unclear.
- Phone number is hidden.

### G5. Final human confirmation before deployment

Before pushing/deploying, Gregory should confirm:

- Provider program offer language.
- Whether to show pay-per-close terms publicly.
- Whether `(720) 292-7554` should be prominent on all pages or only voice-agent page.
- Whether forms should submit live into GHL during QA.

---

## 4. Subagent Dispatch Plan

## Wave 1 — Discovery and specs, parallel

### Subagent 1: Voice-agent page copy and information architecture

**Goal:** Draft conversion-focused copy for `/voice-agents` using the current site voice and Saul Provider facts.

**Inputs:**

- This plan.
- Existing `BUILD_SPEC.md` voice rules.
- Current provider facts:
  - `(720) 292-7554`
  - GHL/CRM routing
  - Free setup/no contract/pay-per-close language must be flagged for Gregory confirmation.

**Output:** Markdown sections, CTA copy, FAQ, no code.

### Subagent 2: GHL payload/schema audit

**Goal:** Inspect existing form schemas/payload builders and propose exact additions for voice-agent lead routing.

**Files to inspect:**

- `lib/validation.ts`
- `lib/ghl.ts`
- `app/api/*/route.ts`
- `components/proposal-builder/*`
- `components/contact/*`

**Output:** Exact schema fields, payload shape, tags, route plan, risks.

### Subagent 3: Design/UX pattern for flow illustration

**Goal:** Propose the visual structure for the phone-agent flow illustration within current AskSaul design language.

**Output:** Component plan, layout notes, mobile behavior, copy labels.

## Wave 2 — Implementation, sequential or carefully parallel

### Implementer A: Lint/security stabilization

Takes Phase A tasks.

### Implementer B: Voice-agent page/components

Takes C1-C4 after copy/design are approved by Avi.

### Implementer C: GHL/API hardening

Takes Phase B after payload plan is approved.

### Implementer D: Chat truthfulness/abstraction

Takes Phase D after Avi chooses static truthfulness vs live AI MVP.

## Wave 3 — Review

### Reviewer 1: Spec compliance

Checks every changed file against this plan and task specs.

### Reviewer 2: Code quality/security

Checks:

- Type safety
- Input validation
- Server/client boundaries
- Secret handling
- No silent lead loss
- No hallucinated business claims
- No overbroad rewrites

### Reviewer 3: Conversion/copy QA

Checks:

- Founder-direct voice
- Clarity for local service providers
- CTA strength
- No generic AI buzzwords
- No unsupported claims

Avi verifies all reviewer findings before final report.

---

## 5. Proposed Task Breakdown

### Task 1: Baseline branch and verification log

**Objective:** Start safely and document current state.

**Files:** Create `docs/plans/2026-06-08-sprint-baseline.md` or append to this plan.

**Commands:**

```bash
git status --short
git checkout -b feat/voice-agent-conversion-sprint
npm run build
npm run lint
npm audit --omit=dev
```

**Acceptance:** Baseline recorded.

### Task 2: Lint cleanup

**Objective:** Fix existing lint issues without feature changes.

**Acceptance:** `npm run lint` and `npm run build` pass.

### Task 3: Dependency audit patch

**Objective:** Safely update vulnerable Next/PostCSS path.

**Acceptance:** `npm audit --omit=dev` improved or blocker recorded; build/lint pass.

### Task 4: Env documentation

**Objective:** Create `.env.example` and update README.

**Acceptance:** Required env vars are documented without secrets.

### Task 5: GHL helper hardening

**Objective:** Stop silent success when webhook missing in production.

**Acceptance:** API routes surface real failures; dev behavior remains workable.

### Task 6: Voice-agent schema/payload/API

**Objective:** Add `voiceAgentLeadSchema`, `buildVoiceAgentLeadPayload`, and `/api/voice-agent-lead`.

**Acceptance:** Payload is GHL-ready and validation works.

### Task 7: Voice-agent form component

**Objective:** Build provider setup form.

**Acceptance:** Validates required fields, submits to API, handles success/error.

### Task 8: Voice-agent flow illustration

**Objective:** Build clear visual flow component.

**Acceptance:** Desktop/mobile visual QA passes.

### Task 9: `/voice-agents` page

**Objective:** Compose hero, flow, use cases, offer, form, FAQs, CTA.

**Acceptance:** Page builds, looks premium, and conversion path is obvious.

### Task 10: Internal linking

**Objective:** Add links from nav/home/services/AI page.

**Acceptance:** Page is discoverable without clutter.

### Task 11: Chat truthfulness or live mode foundation

**Objective:** Either truthfully reframe static chat or add `CHAT_MODE` abstraction.

**Acceptance:** No overpromise; future live mode is easy.

### Task 12: AI-readable files

**Objective:** Add/update `llms.txt`, `llms-full.txt`, possibly `agents.txt`.

**Acceptance:** Raw fetch returns text/markdown with AskSaul and voice-agent content.

### Task 13: Browser and form QA

**Objective:** Exercise key routes and forms.

**Acceptance:** No console errors, core routes load, forms handle success/error correctly.

### Task 14: Final review and handoff

**Objective:** Summarize changes, verification, blockers, and deploy readiness.

**Acceptance:** Gregory gets concise report with exact commands run and remaining confirmations.

---

## 6. Design Direction

Keep the existing AskSaul dark technical brand, but sharpen it.

Recommended design influences:

- Linear: precision, dark surfaces, tasteful motion.
- ElevenLabs: voice/audio visual language, waveform feel.
- Vercel/Raycast: clean developer-grade polish.
- Stripe: conversion clarity and gradient accents.

Avoid:

- Generic robot mascots.
- “AI magic” imagery.
- Overly technical architecture diagrams.
- Clip-art phone icons everywhere.
- Dense dashboard screenshots that distract from the buyer story.

Voice-agent page should feel like:

- “This is real and live.”
- “I understand how missed service calls become lost revenue.”
- “I can try this right now by calling the number.”
- “Gregory will get the context, not a vague form fill.”

---

## 7. Copy Rules

Use founder-direct, specific, no hype.

Good:

- `Missed calls should still turn into booked jobs.`
- `Saul asks what kind of job it is, where the customer is, how urgent it is, and how to reach them.`
- `You get the summary instead of a voicemail with half the details missing.`
- `Call the live demo and hear it yourself.`

Avoid:

- `Revolutionize your customer engagement.`
- `Cutting-edge AI voice solution.`
- `Never miss a lead again.` unless softened, because edge cases exist.
- `Guaranteed revenue.`
- `Fully autonomous employee.`

When discussing pricing/offer:

- Use confirmed terms only.
- If pay-per-close offer remains active, make it clear and bounded.
- If not confirmed, say `pilot terms available`.

---

## 8. Deployment / Side-Effect Policy

This plan authorizes local repo changes and local verification.

Do **not** do these without Gregory confirmation:

- Deploy to production.
- Push to `main` if Gregory wants preview first.
- Send live SMS.
- Create live GHL workflows.
- Create real appointments.
- Use production GHL forms for test leads unless marked QA and cleaned.
- Rotate/change production credentials.

Safe to do autonomously:

- Create feature branch.
- Write code.
- Run local build/lint/tests.
- Browser QA locally.
- Create synthetic local/test payloads.
- Prepare deployment instructions.

---

## 9. Definition of Done

Minimum sprint done:

- `/voice-agents` page exists and looks premium.
- Voice-agent flow illustration is clear.
- Provider form exists and posts to a hardened API route.
- Chat no longer overpromises static AI, or live AI MVP is implemented safely.
- GHL routing no longer silently no-ops in production.
- Homepage/services/AI pages link to voice-agent page.
- Env docs exist.
- `npm run build` passes.
- `npm run lint` passes or any remaining lint blockers are documented with rationale.
- Browser QA completed on key routes.
- Final report includes exact commands and results.

Ideal sprint done:

- Production-safe dependency patch applied.
- Payload builder tests added.
- `/llms.txt` and `/llms-full.txt` added.
- Optional Telegram alert path for high-intent form/chat leads.
- Preview URL available for Gregory before production deploy.

---

## 10. Open Questions for Gregory

Avi can proceed on most of the sprint without blocking, but these affect final public copy and live routing:

1. Should the public provider-program offer say `Free setup, no contract, pay $50 only if you close a job from one of Saul's calls`?
2. Should `(720) 292-7554` be shown globally in nav/footer, or only on `/voice-agents` and related CTAs?
3. Do we want all AskSaul.ai forms to route directly to Ask Saul GHL location `RxCVQeGoQ3RTJbbLG5gY`, or keep the current generic webhook for now?
4. Do you want a preview branch/deploy first, or should Avi prepare for direct production after QA?
5. For live AI chat, should we use a simple hosted LLM proxy first, or wait until we expose a secure Saul/OpenClaw-backed public endpoint?

---

## 11. Avi Recommendation

Proceed in this order:

1. Stabilize lint/build/env.
2. Build `/voice-agents` and the flow illustration.
3. Harden GHL routing and add the provider lead form.
4. Add homepage/internal CTAs.
5. Reframe chat truthfully now.
6. Add live AI chat after the page/form funnel is solid.

Reason: the voice-agent page and GHL lead capture are the revenue path. Live chat is valuable, but it should not delay a clear demo number + form + booking funnel.
