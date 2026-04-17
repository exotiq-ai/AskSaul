# Wolf's Tailor Voice Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a production-grade AI phone reservationist ("Sawyer") for The Wolf's Tailor — an ElevenLabs Conversational AI agent with a repo-owned knowledge base, REST tool endpoints for live call actions, a post-call webhook for logging, a Supabase-backed lead inbox, a demo web widget, and an MCP package for autonomous agent tuning — in ~4 working days, ready for a live 15-minute demo call and a 30-day rollover-line pilot.

**Architecture:** A new `mcp-elevenlabs/` package provisions and tunes the agent from repo source-of-truth files (`docs/clients/wolfs-tailor/`). During calls, the agent makes HTTPS tool calls to Next.js routes under `/api/voice/tools/*`, which write to Supabase and fire Resend emails. A post-call webhook writes transcripts + metadata to `call_logs`. An admin UI at `/admin/voice` surfaces leads and transcripts; a public demo page at `/demos/wolfs-tailor` embeds the ElevenLabs web widget.

**Tech Stack:** Next.js 16 (App Router, existing), TypeScript 5, Supabase (service-role), Resend, Tailwind 4, Zod 4, Vitest (new), `@modelcontextprotocol/sdk` (matching existing `mcp-server/`), `@elevenlabs/react` (widget), ElevenLabs REST API (`api.elevenlabs.io/v1/convai/*`).

**Prerequisites:**
- Feature branch `voice-agent/wolfs-tailor-mvp` is already checked out (off `origin/wolfs-tailor`).
- `ELEVENLABS_API_KEY` is set in `.env.local`.
- You are at repo root: `/Users/g.r./Documents/ASK SAUL/ AskSaul(.)Ai/AskSaul`.
- `node --version` ≥ v20. Confirmed v20.20.2 on dev machine.
- Spec lives at `docs/superpowers/specs/2026-04-17-wolfs-tailor-voice-agent-design.md` — read it first if anything in this plan seems underspecified.

**A note on docs you'll need:**
- ElevenLabs Conversational AI REST reference: https://elevenlabs.io/docs/agents-platform/api-reference/agents/create
- KB file upload: `POST https://api.elevenlabs.io/v1/convai/knowledge-base/file` (multipart; `file` + `name` fields). Confirmed.
- Agent update endpoint takes a `knowledge_base` array on the agent config to attach docs.
- All ElevenLabs requests authenticate with header `xi-api-key: <ELEVENLABS_API_KEY>`.
- **Before hitting any endpoint, verify the exact current shape against the live docs.** The API evolves. The MCP wrapper isolates the diff surface.

**A note on testing:**
- Unit tests use Vitest (added in Phase 0). Tests go under `tests/voice/` and `mcp-elevenlabs/tests/` mirroring source tree.
- Integration tests for tool routes use Next.js route handlers invoked directly in-process, with Supabase and Resend mocked.
- Agent QA regression is a separate concept: text-conversation API calls that drive the live agent through scripted prompts. See Task 2.15.

---

## Phase 0 — Scaffolding

### Task 0.1: Add voice-agent npm dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add dependencies to package.json**

Add to `dependencies` (alphabetize):
```json
"@elevenlabs/react": "^0.1.5",
"@modelcontextprotocol/sdk": "^1.0.4",
"@supabase/supabase-js": "^2.103.2",
"resend": "^6.12.0"
```

Add to `devDependencies` (alphabetize):
```json
"@vitest/ui": "^2.1.0",
"tsx": "^4.19.0",
"vitest": "^2.1.0"
```

Add to `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest",
"voice:verify-key": "tsx scripts/voice/verify-key.ts",
"voice:sync-kb": "tsx mcp-elevenlabs/scripts/sync-kb.ts",
"voice:provision": "tsx mcp-elevenlabs/scripts/provision.ts"
```

- [ ] **Step 2: Install**

Run: `npm install`
Expected: exit 0, `node_modules/@elevenlabs/react`, `node_modules/@supabase/supabase-js`, `node_modules/resend`, `node_modules/vitest` all exist.

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: Next.js builds without errors. If the existing site breaks on the new deps, stop and investigate — do not proceed.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add voice agent dependencies (elevenlabs, supabase, resend, mcp, vitest)"
```

---

### Task 0.2: Update `.env.example` with voice vars

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Append voice env section to `.env.example`**

Add at the end of the file:

```bash
# ─── ElevenLabs voice agent (Wolf's Tailor) ───────────────────────────────
# Conversational AI API key. Get from elevenlabs.io → Settings → API Keys.
ELEVENLABS_API_KEY=
# Populated by provision-agent MCP tool after first run.
ELEVENLABS_AGENT_ID=
# Default voice — Jessica. Override per-client if needed.
ELEVENLABS_VOICE_ID=cgSgspJ2msm6clMCkdW9
# HMAC secret for the post-call webhook. Generate: openssl rand -hex 32
ELEVENLABS_WEBHOOK_SECRET=
# Shared secret the agent sends in x-voice-tool-secret header. Generate: openssl rand -hex 32
VOICE_TOOL_SHARED_SECRET=
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "env: document voice agent env vars in .env.example"
```

---

### Task 0.3: Create folder skeleton

**Files:**
- Create: `app/api/voice/.gitkeep`
- Create: `app/admin/voice/.gitkeep`
- Create: `app/demos/wolfs-tailor/.gitkeep`
- Create: `lib/voice/.gitkeep`
- Create: `tests/voice/.gitkeep`
- Create: `docs/clients/wolfs-tailor/.gitkeep`
- Create: `docs/clients/wolfs-tailor/kb/.gitkeep`
- Create: `mcp-elevenlabs/src/tools/.gitkeep`
- Create: `mcp-elevenlabs/scripts/.gitkeep`
- Create: `mcp-elevenlabs/tests/.gitkeep`
- Create: `scripts/voice/.gitkeep`
- Create: `supabase/migrations/.gitkeep`

- [ ] **Step 1: Make all folders**

```bash
mkdir -p app/api/voice app/admin/voice app/demos/wolfs-tailor \
         lib/voice tests/voice \
         docs/clients/wolfs-tailor/kb \
         mcp-elevenlabs/src/tools mcp-elevenlabs/scripts mcp-elevenlabs/tests \
         scripts/voice supabase/migrations

# Keep empty dirs under git
for d in app/api/voice app/admin/voice app/demos/wolfs-tailor lib/voice tests/voice \
         docs/clients/wolfs-tailor/kb mcp-elevenlabs/src/tools mcp-elevenlabs/scripts mcp-elevenlabs/tests \
         scripts/voice supabase/migrations; do
  touch "$d/.gitkeep"
done
```

- [ ] **Step 2: Commit**

```bash
git add app/api/voice app/admin/voice app/demos/wolfs-tailor lib/voice tests/voice \
        docs/clients mcp-elevenlabs scripts/voice supabase/migrations
git commit -m "scaffold: voice agent folder skeleton"
```

---

### Task 0.4: Add Vitest config

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Write vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "mcp-elevenlabs/tests/**/*.test.ts"],
    environment: "node",
    globals: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 2: Sanity-check with a throwaway test**

Create `tests/voice/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("works", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: 1 test, 1 passed. Exit 0.

- [ ] **Step 4: Delete smoke test (not useful going forward)**

```bash
rm tests/voice/smoke.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts
git commit -m "test: vitest config for voice agent suites"
```

---

### Task 0.5: Write verify-key smoke script

**Files:**
- Create: `scripts/voice/verify-key.ts`

- [ ] **Step 1: Write the script**

```ts
/**
 * Smoke-test the ElevenLabs API key. Run with: npm run voice:verify-key
 * Exits 0 on success, 1 on any failure, prints plan details.
 */
const KEY = process.env.ELEVENLABS_API_KEY;

if (!KEY) {
  console.error("[verify-key] ELEVENLABS_API_KEY is not set. Check .env.local.");
  process.exit(1);
}

async function main() {
  const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
    headers: { "xi-api-key": KEY! },
  });
  if (!res.ok) {
    console.error(`[verify-key] ElevenLabs returned ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const sub = await res.json();
  console.log("[verify-key] OK");
  console.log(`  tier:           ${sub.tier}`);
  console.log(`  chars used:     ${sub.character_count?.toLocaleString()}`);
  console.log(`  chars limit:    ${sub.character_limit?.toLocaleString()}`);
  console.log(`  voice slots:    ${sub.voice_slots_used}/${sub.voice_limit}`);
  console.log(`  status:         ${sub.status}`);
  if (sub.pending_change?.kind === "cancellation") {
    const when = new Date(sub.pending_change.timestamp_seconds * 1000).toISOString();
    console.warn(`  ⚠ pending cancellation scheduled: ${when}`);
  }
}

main().catch((e) => {
  console.error("[verify-key] unexpected error:", e);
  process.exit(1);
});
```

- [ ] **Step 2: Run it**

Run: `npm run voice:verify-key`
Expected: `[verify-key] OK` with tier info. Any failure = stop and debug.

If env vars aren't loaded automatically, use `node --env-file=.env.local -r tsx/cjs scripts/voice/verify-key.ts` or install `dotenv` and `import "dotenv/config"` at the top.

- [ ] **Step 3: Commit**

```bash
git add scripts/voice/verify-key.ts
git commit -m "scripts: voice:verify-key smoke test for ElevenLabs API"
```

---

## Phase 1 — Knowledge base + agent provisioning

### Task 1.1: Port the system prompt

**Files:**
- Create: `docs/clients/wolfs-tailor/system-prompt.md`

- [ ] **Step 1: Write the system prompt file**

Copy the full System Prompt from `/Users/g.r./Documents/ASK SAUL/Id est - Kelly Whitaker /Voice Agent MVP/02_SYSTEM_PROMPT_AND_VOICE.md` section 1, then append this tool-calling addendum:

```markdown
[paste section 1 verbatim]

### Tool-calling contract

You have access to these tools. Call them when appropriate:

- **check_availability**: when guest gives date + time + party size for a booking. Returns a message to read back and a Tock URL. You MUST read the Tock URL aloud as "exploretock dot com slash wolfs tailor".
- **create_lead**: when guest wants to leave contact info for a booking follow-up. Gather name, phone, date, time, party size, occasion, allergies before calling.
- **private_dining_intake**: ONLY for parties of 7+. Gather name, phone, party size, requested date, occasion, experience preference (tent / Wolf's Lair / buyout / unsure).
- **message_for_team**: for escalations — refund disputes, complaints, media, employment, anything outside the KB. Gather name, phone, brief reason, notes.
- **get_menu_theme**: if asked about current menu / season. Returns the theme string to read aloud.

Never invent tool results. If a tool errors, apologize briefly and offer to take a message via `message_for_team`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/clients/wolfs-tailor/system-prompt.md
git commit -m "voice: port system prompt for Wolf's Tailor agent"
```

---

### Task 1.2: Create the voice config

**Files:**
- Create: `docs/clients/wolfs-tailor/voice-config.json`

- [ ] **Step 1: Write voice-config.json**

```json
{
  "client_slug": "wolfs-tailor",
  "agent_name": "Sawyer — Wolf's Tailor Reservationist",
  "voice_id": "cgSgspJ2msm6clMCkdW9",
  "voice_name": "Jessica",
  "tts_model_id": "eleven_flash_v2_5",
  "llm": "gpt-4o-mini",
  "temperature": 0.3,
  "voice_settings": {
    "stability": 0.55,
    "similarity_boost": 0.80,
    "style": 0.10,
    "use_speaker_boost": true
  },
  "first_message": "Thank you for calling The Wolf's Tailor. This is Sawyer. How can I help you this evening?",
  "language": "en",
  "max_duration_seconds": 600
}
```

- [ ] **Step 2: Commit**

```bash
git add docs/clients/wolfs-tailor/voice-config.json
git commit -m "voice: config JSON for Sawyer agent"
```

---

### Task 1.3: Split knowledge base — identity, location, hours

**Files:**
- Create: `docs/clients/wolfs-tailor/kb/identity.md`
- Create: `docs/clients/wolfs-tailor/kb/location.md`
- Create: `docs/clients/wolfs-tailor/kb/hours.md`

- [ ] **Step 1: Write identity.md**

```markdown
# The Wolf's Tailor — Identity

**Summary:** A two-Michelin-star tasting menu restaurant in Denver's Sunnyside neighborhood, part of Id Est Hospitality Group, led by chefs Kelly Whitaker and Taylor Stark.

The Wolf's Tailor is a two Michelin star tasting menu restaurant located in Denver's Sunnyside neighborhood. It is owned and operated by Id Est Hospitality Group, founded by chef Kelly Whitaker. The restaurant earned Colorado's first ever two Michelin stars in the 2025 Michelin Guide, and also holds the Michelin Green Star for sustainability.

The name is a nod to the craftsman who fashioned sheep's clothing for the sly wolf. The concept stitches together influences from Italian kitchens, Asian night markets, and Nordic technique, all built on a foundation of Colorado ingredients.

The executive chefs are Kelly Whitaker and Taylor Stark. The cuisine is described as contemporary American, experimental, and multi-course tasting. The atmosphere is elegant but not stuffy. Come-as-you-are is encouraged. The space includes a brick-walled indoor dining room, a garden, and private outdoor tents with fireplaces.

**If a guest asks what kind of restaurant it is:** The Wolf's Tailor is a two Michelin star tasting menu restaurant. The menu is a multi-course experience that changes seasonally and blends Italian, Japanese, Korean, and Nordic influences with Colorado ingredients, fermentation, and regenerative grains.
```

- [ ] **Step 2: Write location.md**

```markdown
# Location and parking

**Summary:** 4058 Tejon Street, Sunnyside, Denver. Free street parking. No valet or lot. Wheelchair accessible.

**Address:** 4058 Tejon Street, Denver, Colorado, 80211
**Cross street:** Tejon Street and 41st Avenue
**Neighborhood:** Sunnyside, in northwest Denver
**Parking:** Free street parking on Tejon and the surrounding residential streets. No dedicated lot or valet. Parking is typically available within a short walk of the front door.

**Rideshare:** Uber and Lyft drop-off at the front door on Tejon Street works well. There is no valet service.

**Accessibility:** The restaurant is wheelchair accessible and has a gender-neutral restroom. If specific mobility needs exist, note them on the reservation so the team can seat the guest appropriately.
```

- [ ] **Step 3: Write hours.md**

```markdown
# Hours of operation

**Summary:** Tuesday through Sunday, 5:00 PM to 8:30 PM last seating. Closed Mondays. Dinner only.

- Monday: Closed
- Tuesday: 5:00 PM to 8:30 PM (last seating)
- Wednesday: 5:00 PM to 8:30 PM
- Thursday: 5:00 PM to 8:30 PM
- Friday: 5:00 PM to 8:30 PM
- Saturday: 5:00 PM to 8:30 PM
- Sunday: 5:00 PM to 8:30 PM

Reservations are available for parties of two to six, with seatings generally offered between 5:00 PM and 9:00 PM. The restaurant is dinner only and does not serve lunch or brunch.

**Holidays:** Hours may vary on major holidays. Confirm with the host team or check the Tock page.
```

- [ ] **Step 4: Commit**

```bash
git add docs/clients/wolfs-tailor/kb/identity.md \
        docs/clients/wolfs-tailor/kb/location.md \
        docs/clients/wolfs-tailor/kb/hours.md
git commit -m "kb: identity, location, hours"
```

---

### Task 1.4: Split knowledge base — menu, allergies, reservations

**Files:**
- Create: `docs/clients/wolfs-tailor/kb/menu.md`
- Create: `docs/clients/wolfs-tailor/kb/allergies.md`
- Create: `docs/clients/wolfs-tailor/kb/reservations.md`

- [ ] **Step 1: Write menu.md**

Port SECTION 4 from `Voice Agent MVP/01_KNOWLEDGE_BASE.md` verbatim, prepending:

```markdown
# The menu

**Summary:** Multi-course tasting only, changes seasonally, ~$250pp indoor / ~$185pp tent. Wine/cocktail/zero-proof pairings.
```

- [ ] **Step 2: Write allergies.md** (this is the highest-stakes file)

```markdown
# Dietary restrictions and allergies

**Summary:** CANNOT accommodate soy, allium (garlic/onion/leek/shallot), or citrus allergies. CAN accommodate other severe allergies, vegetarian, and gluten-free with advance notice.

This is one of the most important policies to communicate clearly.

**Core policy:** With the exception of severe food allergies, The Wolf's Tailor is unable to accommodate dietary restrictions or food aversions. The tasting menu is a fixed experience designed by the kitchen.

**Specific allergies the restaurant CANNOT accommodate due to the nature of the current menu:**
- Soy allergies
- Allium allergies (garlic, onion, leek, shallot)
- Citrus allergies

**What CAN be accommodated:**
- Severe food allergies outside of soy, allium, and citrus, with advance notice
- Vegetarian options, with advance notice
- Gluten-free options, with advance notice

**MANDATORY scripted response for soy / allium / citrus allergies:**
"I want to set expectations clearly. Because the tasting menu is a fixed multi-course experience, we're not able to accommodate most dietary preferences or aversions. For severe food allergies, we do our best with advance notice, though we can't accommodate soy, allium, or citrus allergies because of how the current menu is built. If you'd like to share any allergies now, I'll note them on your reservation and flag them for the chef team."

**NEVER:**
- Never suggest the kitchen can work around an allium, soy, or citrus allergy.
- Never soften the policy. State it clearly and early.
- Never book a guest with these allergies without them explicitly acknowledging the policy.
```

- [ ] **Step 3: Write reservations.md**

Port SECTION 6 from the source KB verbatim, prepending:

```markdown
# Reservations

**Summary:** Booked via Tock (exploretock.com/wolfstailor), prepaid. Parties of 2–6 online, 7+ through private dining. Open first of month for next month. 72hr / 48hr / 24hr refund tiers.
```

- [ ] **Step 4: Commit**

```bash
git add docs/clients/wolfs-tailor/kb/menu.md \
        docs/clients/wolfs-tailor/kb/allergies.md \
        docs/clients/wolfs-tailor/kb/reservations.md
git commit -m "kb: menu, allergies, reservations (allergy policy is load-bearing)"
```

---

### Task 1.5: Split knowledge base — private dining, dress, payment

**Files:**
- Create: `docs/clients/wolfs-tailor/kb/private-dining.md`
- Create: `docs/clients/wolfs-tailor/kb/dress-code.md`
- Create: `docs/clients/wolfs-tailor/kb/payment.md`

- [ ] **Step 1: Write private-dining.md**

Port SECTION 7 verbatim, prepending:

```markdown
# Private dining and large parties

**Summary:** Parties of 7+ routed to private dining team. Options: Wolf's Lair (upper private room), outdoor tents with fireplaces, full buyout.
```

- [ ] **Step 2: Write dress-code.md**

Port SECTION 8 verbatim, prepending:

```markdown
# Dress code

**Summary:** No strict dress code. Come as you are — smart casual to business casual is typical.
```

- [ ] **Step 3: Write payment.md**

Port SECTION 9 verbatim, prepending:

```markdown
# Payment

**Summary:** Tock prepay at booking. Amex, Discover, Mastercard, Visa accepted in-house. 22% fair labor & wellness fee added to in-house bill (NOT tip).
```

- [ ] **Step 4: Commit**

```bash
git add docs/clients/wolfs-tailor/kb/private-dining.md \
        docs/clients/wolfs-tailor/kb/dress-code.md \
        docs/clients/wolfs-tailor/kb/payment.md
git commit -m "kb: private dining, dress code, payment"
```

---

### Task 1.6: Split knowledge base — occasions, kids/pets, sustainability

**Files:**
- Create: `docs/clients/wolfs-tailor/kb/occasions.md`
- Create: `docs/clients/wolfs-tailor/kb/kids-pets.md`
- Create: `docs/clients/wolfs-tailor/kb/sustainability.md`

- [ ] **Step 1: Write occasions.md** — port SECTION 10 verbatim with heading + one-line summary.
- [ ] **Step 2: Write kids-pets.md** — port SECTION 11 verbatim with heading + one-line summary.
- [ ] **Step 3: Write sustainability.md** — port SECTION 12 verbatim with heading + one-line summary.

All three should follow the pattern of tasks 1.3–1.5: title, bold **Summary:** line, body.

- [ ] **Step 4: Commit**

```bash
git add docs/clients/wolfs-tailor/kb/occasions.md \
        docs/clients/wolfs-tailor/kb/kids-pets.md \
        docs/clients/wolfs-tailor/kb/sustainability.md
git commit -m "kb: occasions, kids/pets, sustainability"
```

---

### Task 1.7: Split knowledge base — FAQ, escalation, never-do

**Files:**
- Create: `docs/clients/wolfs-tailor/kb/faq.md`
- Create: `docs/clients/wolfs-tailor/kb/escalation.md`
- Create: `docs/clients/wolfs-tailor/kb/never-do.md`

- [ ] **Step 1: Write faq.md** — port SECTION 13 (fast-recall FAQ) verbatim with heading + summary.
- [ ] **Step 2: Write escalation.md** — port SECTION 14 verbatim with heading + summary.
- [ ] **Step 3: Write never-do.md** — port SECTION 15 verbatim with heading + summary.

- [ ] **Step 4: Commit**

```bash
git add docs/clients/wolfs-tailor/kb/faq.md \
        docs/clients/wolfs-tailor/kb/escalation.md \
        docs/clients/wolfs-tailor/kb/never-do.md
git commit -m "kb: FAQ, escalation, never-do"
```

---

### Task 1.8: Initialize `mcp-elevenlabs/` package

**Files:**
- Create: `mcp-elevenlabs/package.json`
- Create: `mcp-elevenlabs/tsconfig.json`
- Create: `mcp-elevenlabs/README.md`

- [ ] **Step 1: package.json**

```json
{
  "name": "@asksaul/mcp-elevenlabs",
  "version": "0.1.0",
  "private": true,
  "description": "MCP server for provisioning and managing ElevenLabs Conversational AI agents from repo source-of-truth files.",
  "type": "module",
  "main": "dist/index.js",
  "bin": { "asksaul-elevenlabs": "dist/index.js" },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.4",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.7.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 3: README.md** — short: what this is, how to run, where config lives.

```markdown
# @asksaul/mcp-elevenlabs

MCP server for managing ElevenLabs Conversational AI agents from repo files.

## Tools

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
```

- [ ] **Step 4: Install sub-package deps**

```bash
cd mcp-elevenlabs
npm install
cd ..
```

Expected: `mcp-elevenlabs/node_modules/@modelcontextprotocol` exists.

- [ ] **Step 5: Commit**

```bash
git add mcp-elevenlabs/package.json mcp-elevenlabs/tsconfig.json mcp-elevenlabs/README.md mcp-elevenlabs/package-lock.json
git commit -m "mcp-elevenlabs: initialize package skeleton"
```

---

### Task 1.9: ElevenLabs REST client wrapper

**Files:**
- Create: `mcp-elevenlabs/src/elevenlabs-client.ts`
- Create: `mcp-elevenlabs/tests/elevenlabs-client.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// mcp-elevenlabs/tests/elevenlabs-client.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ElevenLabsClient } from "../src/elevenlabs-client.js";

describe("ElevenLabsClient", () => {
  const OLD_KEY = process.env.ELEVENLABS_API_KEY;
  const fetchSpy = vi.fn();

  beforeEach(() => {
    process.env.ELEVENLABS_API_KEY = "sk_test_fake";
    // @ts-expect-error override global fetch
    global.fetch = fetchSpy;
    fetchSpy.mockReset();
  });

  afterEach(() => {
    process.env.ELEVENLABS_API_KEY = OLD_KEY;
  });

  it("sends xi-api-key header on every request", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const client = new ElevenLabsClient();
    await client.getSubscription();
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.elevenlabs.io/v1/user/subscription",
      expect.objectContaining({
        headers: expect.objectContaining({ "xi-api-key": "sk_test_fake" }),
      })
    );
  });

  it("throws a useful error on non-2xx responses", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("bad key", { status: 401 }));
    const client = new ElevenLabsClient();
    await expect(client.getSubscription()).rejects.toThrow(/401/);
  });

  it("uploads a KB file via multipart", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({ id: "doc_123" }), { status: 200 }));
    const client = new ElevenLabsClient();
    const doc = await client.uploadKbFile("hours.md", "hours content");
    expect(doc.id).toBe("doc_123");
    const [, init] = fetchSpy.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBeInstanceOf(FormData);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

Run: `cd mcp-elevenlabs && npx vitest run`
Expected: FAIL (file doesn't exist).

- [ ] **Step 3: Write the client**

```ts
// mcp-elevenlabs/src/elevenlabs-client.ts
const BASE = "https://api.elevenlabs.io/v1";

export interface KbDocument {
  id: string;
  name: string;
}

export interface AgentConfig {
  name: string;
  conversation_config: {
    agent: {
      prompt: { prompt: string; llm: string; temperature?: number };
      first_message: string;
      language?: string;
    };
    tts: {
      voice_id: string;
      model_id: string;
      stability?: number;
      similarity_boost?: number;
      style?: number;
      use_speaker_boost?: boolean;
    };
    conversation?: { max_duration_seconds?: number };
  };
  knowledge_base?: { id: string }[];
  tools?: unknown[];
}

export class ElevenLabsClient {
  private key: string;

  constructor(apiKey?: string) {
    const k = apiKey ?? process.env.ELEVENLABS_API_KEY;
    if (!k) throw new Error("ELEVENLABS_API_KEY not set");
    this.key = k;
  }

  private async req(path: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "xi-api-key": this.key, ...(init.headers ?? {}) },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`ElevenLabs ${init.method ?? "GET"} ${path} → ${res.status}: ${body}`);
    }
    return res;
  }

  async getSubscription(): Promise<unknown> {
    const res = await this.req("/user/subscription");
    return res.json();
  }

  async uploadKbFile(name: string, content: string): Promise<KbDocument> {
    const form = new FormData();
    form.append("file", new Blob([content], { type: "text/markdown" }), name);
    form.append("name", name);
    const res = await this.req("/convai/knowledge-base/file", {
      method: "POST",
      body: form,
    });
    return res.json();
  }

  async listKbDocuments(): Promise<{ documents: KbDocument[] }> {
    const res = await this.req("/convai/knowledge-base");
    return res.json();
  }

  async deleteKbDocument(id: string): Promise<void> {
    await this.req(`/convai/knowledge-base/${id}`, { method: "DELETE" });
  }

  async createAgent(config: AgentConfig): Promise<{ agent_id: string }> {
    const res = await this.req("/convai/agents/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return res.json();
  }

  async updateAgent(agentId: string, config: Partial<AgentConfig>): Promise<unknown> {
    const res = await this.req(`/convai/agents/${agentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return res.json();
  }

  async getAgent(agentId: string): Promise<unknown> {
    const res = await this.req(`/convai/agents/${agentId}`);
    return res.json();
  }

  async listConversations(agentId?: string): Promise<unknown> {
    const q = agentId ? `?agent_id=${agentId}` : "";
    const res = await this.req(`/convai/conversations${q}`);
    return res.json();
  }

  async getConversation(conversationId: string): Promise<unknown> {
    const res = await this.req(`/convai/conversations/${conversationId}`);
    return res.json();
  }
}
```

- [ ] **Step 4: Run test to confirm it passes**

Run: `cd mcp-elevenlabs && npx vitest run`
Expected: 3 tests, 3 passed.

- [ ] **Step 5: Commit**

```bash
git add mcp-elevenlabs/src/elevenlabs-client.ts mcp-elevenlabs/tests/elevenlabs-client.test.ts
git commit -m "mcp-elevenlabs: REST client wrapper with fetch-based client"
```

---

### Task 1.10: Sync-knowledge-base MCP tool + script

**Files:**
- Create: `mcp-elevenlabs/src/tools/sync-knowledge-base.ts`
- Create: `mcp-elevenlabs/scripts/sync-kb.ts`

- [ ] **Step 1: Write the tool**

```ts
// mcp-elevenlabs/src/tools/sync-knowledge-base.ts
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
```

- [ ] **Step 2: Write the CLI script**

```ts
// mcp-elevenlabs/scripts/sync-kb.ts
import { runSyncKnowledgeBase } from "../src/tools/sync-knowledge-base.js";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const result = await runSyncKnowledgeBase({
    client_slug: "wolfs-tailor",
    kb_dir: "docs/clients/wolfs-tailor/kb",
    dry_run: dryRun,
  });
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 3: Dry-run it**

From repo root: `npm run voice:sync-kb -- --dry-run`
Expected: JSON with 15 `skipped` entries, 0 `errors`.

- [ ] **Step 4: Real run**

Run: `npm run voice:sync-kb`
Expected: JSON with 15 `uploaded` entries. Verify in ElevenLabs dashboard → Knowledge Base that you see 15 `wolfs-tailor/*.md` docs.

- [ ] **Step 5: Commit**

```bash
git add mcp-elevenlabs/src/tools/sync-knowledge-base.ts mcp-elevenlabs/scripts/sync-kb.ts
git commit -m "mcp-elevenlabs: sync_knowledge_base tool + script, 15 KB docs live"
```

---

### Task 1.11: Provision-agent MCP tool + script

**Files:**
- Create: `mcp-elevenlabs/src/tools/provision-agent.ts`
- Create: `mcp-elevenlabs/scripts/provision.ts`

- [ ] **Step 1: Write the tool**

```ts
// mcp-elevenlabs/src/tools/provision-agent.ts
import { z } from "zod";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ElevenLabsClient, type AgentConfig } from "../elevenlabs-client.js";

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

  const kbDocIds: { id: string }[] = [];
  if (input.attach_kb_docs) {
    const docs = (await client.listKbDocuments()).documents;
    const slug = cfg.client_slug;
    for (const d of docs) {
      if (d.name.startsWith(`${slug}/`)) kbDocIds.push({ id: d.id });
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
    knowledge_base: kbDocIds,
    // Tools attached in Task 2.14 after the endpoints exist.
  };

  if (input.existing_agent_id) {
    await client.updateAgent(input.existing_agent_id, agentConfig);
    return { agent_id: input.existing_agent_id, action: "updated", kb_docs: kbDocIds.length };
  }

  const created = await client.createAgent(agentConfig);
  return { agent_id: created.agent_id, action: "created", kb_docs: kbDocIds.length };
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
```

- [ ] **Step 2: Write the CLI script**

```ts
// mcp-elevenlabs/scripts/provision.ts
import { runProvisionAgent } from "../src/tools/provision-agent.js";

async function main() {
  const existing = process.env.ELEVENLABS_AGENT_ID || undefined;
  const result = await runProvisionAgent({
    client_dir: "docs/clients/wolfs-tailor",
    existing_agent_id: existing,
    attach_kb_docs: true,
  });
  console.log(JSON.stringify(result, null, 2));
  console.log(
    `\n→ write ELEVENLABS_AGENT_ID=${result.agent_id} to .env.local (and Netlify env)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 3: Run it**

Run: `npm run voice:provision`
Expected: JSON with `agent_id`, `action: "created"`, `kb_docs: 15`. Copy the agent_id.

- [ ] **Step 4: Update `.env.local` with the agent id**

Edit `.env.local`, replace `ELEVENLABS_AGENT_ID=` with the captured id.

- [ ] **Step 5: Verify in ElevenLabs dashboard**

Dashboard → Agents → find "Sawyer — Wolf's Tailor Reservationist". Confirm: voice is Jessica, system prompt is populated, 15 KB docs attached. Test the agent in the dashboard's built-in chat: say "hi" — you should get the first_message back.

- [ ] **Step 6: Commit**

```bash
git add mcp-elevenlabs/src/tools/provision-agent.ts mcp-elevenlabs/scripts/provision.ts
git commit -m "mcp-elevenlabs: provision_agent tool + script, Sawyer is live"
```

---

### Task 1.12: MCP server entrypoint

**Files:**
- Create: `mcp-elevenlabs/src/index.ts`

- [ ] **Step 1: Write it** (patterned after existing `mcp-server/src/index.ts`)

```ts
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { syncKnowledgeBaseTool } from "./tools/sync-knowledge-base.js";
import { provisionAgentTool } from "./tools/provision-agent.js";

interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  run(input: unknown): Promise<unknown>;
}

const TOOLS: ToolDef[] = [syncKnowledgeBaseTool, provisionAgentTool];

async function main() {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("[mcp-elevenlabs] ELEVENLABS_API_KEY not set. Tools will fail at call time.");
  }

  const server = new Server(
    { name: "asksaul-elevenlabs", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = TOOLS.find((t) => t.name === req.params.name);
    if (!tool) {
      return { isError: true, content: [{ type: "text", text: `unknown tool: ${req.params.name}` }] };
    }
    try {
      const result = await tool.run(req.params.arguments ?? {});
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: (err as Error).message }] };
    }
  });

  await server.connect(new StdioServerTransport());
  console.error("[mcp-elevenlabs] running on stdio");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Build and smoke-test**

```bash
cd mcp-elevenlabs
npm run build
node dist/index.js < /dev/null &
sleep 1
kill %1 2>/dev/null || true
cd ..
```

Expected: no crash on startup.

- [ ] **Step 3: Commit**

```bash
git add mcp-elevenlabs/src/index.ts
git commit -m "mcp-elevenlabs: server entrypoint exposing provision + sync tools"
```

---

### Task 1.13: Open draft PR

- [ ] **Step 1: Push feature branch**

```bash
git push -u origin voice-agent/wolfs-tailor-mvp
```

- [ ] **Step 2: Open draft PR against wolfs-tailor**

```bash
gh pr create --draft --base wolfs-tailor \
  --title "Voice agent: Wolf's Tailor AI reservationist (Sawyer)" \
  --body "$(cat <<'EOF'
## Summary
- Adds ElevenLabs Conversational AI agent "Sawyer" for The Wolf's Tailor
- New \`mcp-elevenlabs/\` package to provision/sync from repo source files
- KB under \`docs/clients/wolfs-tailor/kb/\` (15 docs) — restaurant updates by PR
- **Phase 1 complete**: agent live in ElevenLabs, KB attached. Phases 2–4 coming.

## Design
- Spec: \`docs/superpowers/specs/2026-04-17-wolfs-tailor-voice-agent-design.md\`
- Plan: \`docs/superpowers/plans/2026-04-17-wolfs-tailor-voice-agent.md\`

## Test plan
- [ ] \`npm test\` passes
- [ ] \`npm run voice:verify-key\` OK
- [ ] 15 KB docs visible in ElevenLabs dashboard
- [ ] Sawyer responds to "hi" in dashboard test chat with the opening line
- [ ] Tool endpoints hit Supabase + fire Resend (Phase 2)
- [ ] Webhook writes call_logs (Phase 2)
- [ ] Full 35-scenario QA regression passes (Phase 2)
- [ ] Live dial to ElevenLabs phone number succeeds (Phase 4)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Phase 2 — Tool endpoints + webhook

### Task 2.1: Supabase migration

**Files:**
- Create: `supabase/migrations/0004_voice_agent.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 0004_voice_agent.sql
-- Voice agent lead inbox + call log.

CREATE TABLE IF NOT EXISTS voice_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
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
  allergy_flag BOOLEAN NOT NULL DEFAULT FALSE,
  reason TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS voice_leads_conv_idx ON voice_leads(conversation_id);
CREATE INDEX IF NOT EXISTS voice_leads_status_idx ON voice_leads(status, created_at DESC);

CREATE TABLE IF NOT EXISTS call_logs (
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
CREATE INDEX IF NOT EXISTS call_logs_client_idx ON call_logs(client_slug, started_at DESC);
```

- [ ] **Step 2: Apply the migration**

Use the Supabase MCP if wired (`mcp__f8aaaf55-.._apply_migration`), or paste the SQL into the Supabase dashboard → SQL editor. Confirm with:

```sql
SELECT table_name FROM information_schema.tables WHERE table_name IN ('voice_leads','call_logs');
```

Expected: 2 rows.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/0004_voice_agent.sql
git commit -m "supabase: 0004 voice_leads + call_logs tables"
```

---

### Task 2.2: Voice schemas

**Files:**
- Create: `lib/voice/schemas.ts`
- Create: `tests/voice/schemas.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/voice/schemas.test.ts
import { describe, it, expect } from "vitest";
import {
  createLeadInput,
  privateDiningInput,
  messageForTeamInput,
  checkAvailabilityInput,
} from "@/lib/voice/schemas";

describe("createLeadInput", () => {
  it("accepts a minimal valid payload", () => {
    const r = createLeadInput.safeParse({
      conversation_id: "conv_1",
      name: "Alice",
      phone: "+17205551234",
      date: "2026-05-01",
      party_size: 2,
    });
    expect(r.success).toBe(true);
  });

  it("flags allium/soy/citrus allergies", () => {
    const r = createLeadInput.safeParse({
      conversation_id: "conv_1",
      name: "Alice",
      phone: "+17205551234",
      date: "2026-05-01",
      party_size: 2,
      allergies: "Severe garlic allergy",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.allergy_flag).toBe(true);
  });

  it("rejects missing required fields", () => {
    const r = createLeadInput.safeParse({ name: "Alice" });
    expect(r.success).toBe(false);
  });
});

describe("privateDiningInput", () => {
  it("requires party_size >= 7", () => {
    const ok = privateDiningInput.safeParse({
      conversation_id: "c",
      name: "B",
      phone: "+1",
      party_size: 8,
    });
    expect(ok.success).toBe(true);
    const bad = privateDiningInput.safeParse({
      conversation_id: "c",
      name: "B",
      phone: "+1",
      party_size: 4,
    });
    expect(bad.success).toBe(false);
  });
});

describe("messageForTeamInput", () => {
  it("requires a valid reason enum", () => {
    const r = messageForTeamInput.safeParse({
      conversation_id: "c",
      name: "B",
      phone: "+1",
      reason: "not_a_reason",
      notes: "hi",
    });
    expect(r.success).toBe(false);
  });
});

describe("checkAvailabilityInput", () => {
  it("accepts ISO date + HH:MM time", () => {
    const r = checkAvailabilityInput.safeParse({
      conversation_id: "c",
      date: "2026-05-01",
      time: "19:30",
      party_size: 2,
    });
    expect(r.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, confirm it fails**

Run: `npm test`
Expected: FAIL (module missing).

- [ ] **Step 3: Write the schemas**

```ts
// lib/voice/schemas.ts
import { z } from "zod";

const ALLIUM_REGEX = /\b(garlic|onion|leek|shallot|allium|soy|citrus|lemon|lime|orange|grapefruit)\b/i;

export const createLeadInput = z
  .object({
    conversation_id: z.string().min(1),
    name: z.string().min(1),
    phone: z.string().min(7),
    email: z.string().email().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    party_size: z.number().int().min(1).max(6),
    occasion: z.string().optional(),
    allergies: z.string().optional(),
    notes: z.string().optional(),
  })
  .transform((v) => ({
    ...v,
    allergy_flag: v.allergies ? ALLIUM_REGEX.test(v.allergies) : false,
  }));

export type CreateLeadInput = z.infer<typeof createLeadInput>;

export const privateDiningInput = z.object({
  conversation_id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email().optional(),
  party_size: z.number().int().min(7),
  requested_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  occasion: z.string().optional(),
  preferred_experience: z.enum(["tent", "wolfs_lair", "buyout", "unsure"]).optional(),
  notes: z.string().optional(),
});
export type PrivateDiningInput = z.infer<typeof privateDiningInput>;

export const messageForTeamInput = z.object({
  conversation_id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(7),
  reason: z.enum(["refund_dispute", "past_experience", "media", "employment", "other"]),
  notes: z.string().min(1),
});
export type MessageForTeamInput = z.infer<typeof messageForTeamInput>;

export const checkAvailabilityInput = z.object({
  conversation_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  party_size: z.number().int().min(1).max(6),
});
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilityInput>;
```

- [ ] **Step 4: Run test to confirm pass**

Run: `npm test`
Expected: all schema tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/voice/schemas.ts tests/voice/schemas.test.ts
git commit -m "voice: Zod schemas for tool inputs + allergy-flag auto-detect"
```

---

### Task 2.3: Voice auth helper

**Files:**
- Create: `lib/voice/auth.ts`
- Create: `tests/voice/auth.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/voice/auth.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { verifyToolSecret, verifyWebhookSignature } from "@/lib/voice/auth";
import { createHmac } from "node:crypto";

describe("verifyToolSecret", () => {
  const OLD = process.env.VOICE_TOOL_SHARED_SECRET;
  beforeEach(() => { process.env.VOICE_TOOL_SHARED_SECRET = "secret_abc"; });
  afterEach(() => { process.env.VOICE_TOOL_SHARED_SECRET = OLD; });

  it("accepts matching secret", () => {
    const req = new Request("http://x", { headers: { "x-voice-tool-secret": "secret_abc" } });
    expect(verifyToolSecret(req)).toBe(true);
  });
  it("rejects wrong secret", () => {
    const req = new Request("http://x", { headers: { "x-voice-tool-secret": "wrong" } });
    expect(verifyToolSecret(req)).toBe(false);
  });
  it("rejects missing header", () => {
    const req = new Request("http://x");
    expect(verifyToolSecret(req)).toBe(false);
  });
});

describe("verifyWebhookSignature", () => {
  const OLD = process.env.ELEVENLABS_WEBHOOK_SECRET;
  beforeEach(() => { process.env.ELEVENLABS_WEBHOOK_SECRET = "whsec"; });
  afterEach(() => { process.env.ELEVENLABS_WEBHOOK_SECRET = OLD; });

  it("validates correct HMAC-SHA256", () => {
    const body = '{"ok":true}';
    const sig = createHmac("sha256", "whsec").update(body).digest("hex");
    expect(verifyWebhookSignature(body, sig)).toBe(true);
  });
  it("rejects wrong signature", () => {
    expect(verifyWebhookSignature('{"ok":true}', "bad")).toBe(false);
  });
});
```

- [ ] **Step 2: Run, confirm fail.** Run: `npm test`.

- [ ] **Step 3: Write the helper**

```ts
// lib/voice/auth.ts
import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyToolSecret(req: Request): boolean {
  const header = req.headers.get("x-voice-tool-secret");
  const expected = process.env.VOICE_TOOL_SHARED_SECRET;
  if (!header || !expected) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function unauthorizedResponse() {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}
```

- [ ] **Step 4: Run, confirm pass.**

- [ ] **Step 5: Commit**

```bash
git add lib/voice/auth.ts tests/voice/auth.test.ts
git commit -m "voice: auth helpers (shared-secret header + HMAC webhook)"
```

---

### Task 2.4: Voice Supabase client

**Files:**
- Create: `lib/voice/supabase.ts`

- [ ] **Step 1: Write it** (mirrors existing `lib/supabase.ts` pattern)

```ts
// lib/voice/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getVoiceSupabase(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("[voice/supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
  }
  cached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return cached;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/voice/supabase.ts
git commit -m "voice: service-role Supabase client"
```

---

### Task 2.5: Voice email templates

**Files:**
- Create: `lib/voice/email.ts`

- [ ] **Step 1: Write it**

```ts
// lib/voice/email.ts
import { Resend } from "resend";

export type LeadEmailPayload = {
  kind: "booking_request" | "private_dining" | "escalation" | "message";
  name: string;
  phone: string;
  email?: string;
  date?: string;
  time?: string;
  party_size?: number;
  occasion?: string;
  allergies?: string;
  allergy_flag: boolean;
  reason?: string;
  notes?: string;
  conversation_id: string;
};

function subject(p: LeadEmailPayload): string {
  const prefix = p.allergy_flag ? "⚠️ ALLERGY-ACKNOWLEDGED — " : "";
  const urgent = p.reason === "refund_dispute" ? "[URGENT] " : "";
  switch (p.kind) {
    case "booking_request":
      return `${prefix}[Wolf's Tailor] New booking lead — ${p.name} party of ${p.party_size ?? "?"} on ${p.date ?? "TBD"}`;
    case "private_dining":
      return `[Wolf's Tailor] Private dining inquiry — ${p.name}, party of ${p.party_size ?? "?"}`;
    case "escalation":
      return `${urgent}[Wolf's Tailor] Escalation — ${p.reason} — ${p.name}`;
    case "message":
      return `[Wolf's Tailor] Message for team — ${p.name}`;
  }
}

function body(p: LeadEmailPayload): string {
  const lines = [
    `**Kind:** ${p.kind}`,
    `**Name:** ${p.name}`,
    `**Phone:** ${p.phone}`,
    p.email && `**Email:** ${p.email}`,
    p.date && `**Date:** ${p.date}${p.time ? ` ${p.time}` : ""}`,
    p.party_size !== undefined && `**Party size:** ${p.party_size}`,
    p.occasion && `**Occasion:** ${p.occasion}`,
    p.allergies && `**Allergies:** ${p.allergies}${p.allergy_flag ? " ⚠️ POLICY-SENSITIVE" : ""}`,
    p.reason && `**Reason:** ${p.reason}`,
    p.notes && `**Notes:** ${p.notes}`,
    ``,
    `Conversation: ${p.conversation_id}`,
    `Admin: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/voice/${p.conversation_id}`,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function sendLeadEmail(p: LeadEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INTERNAL_NOTIFICATION_EMAIL;
  const from = `${process.env.RESEND_FROM_NAME ?? "Saul"} <${process.env.RESEND_FROM_EMAIL ?? "saul3000bot@gmail.com"}>`;
  if (!apiKey || !to) {
    console.error("[voice/email] missing RESEND_API_KEY or INTERNAL_NOTIFICATION_EMAIL — skipping");
    return;
  }
  const resend = new Resend(apiKey);
  const text = body(p);
  await resend.emails.send({ from, to, subject: subject(p), text });
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/voice/email.ts
git commit -m "voice: Resend lead email templates with allergy/urgency prefixes"
```

---

### Task 2.6: Menu theme helper

**Files:**
- Create: `lib/voice/menu-theme.ts`
- Create: `tests/voice/menu-theme.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/voice/menu-theme.test.ts
import { describe, it, expect } from "vitest";
import { getCurrentMenuTheme } from "@/lib/voice/menu-theme";

describe("getCurrentMenuTheme", () => {
  it("returns a theme with season, theme, last_updated", () => {
    const t = getCurrentMenuTheme(new Date("2026-04-17"));
    expect(t.season).toBe("spring");
    expect(t.theme.length).toBeGreaterThan(10);
    expect(t.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("maps December to winter", () => {
    expect(getCurrentMenuTheme(new Date("2026-12-01")).season).toBe("winter");
  });
});
```

- [ ] **Step 2: Run, confirm fail.**

- [ ] **Step 3: Write the helper**

```ts
// lib/voice/menu-theme.ts
export type Season = "spring" | "summer" | "fall" | "winter";

export interface MenuTheme {
  season: Season;
  theme: string;
  last_updated: string;
}

const THEMES: Record<Season, string> = {
  spring: "garden-fresh produce from our on-site beds and local farms",
  summer: "peak-season produce, stone fruit, and live-fire cooking",
  fall: "Colorado grains, squash, and fermentation",
  winter: "preservation, fermentation, and slow-cooked Colorado grains",
};

function monthToSeason(m: number): Season {
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "fall";
  return "winter";
}

export function getCurrentMenuTheme(now: Date = new Date()): MenuTheme {
  const season = monthToSeason(now.getMonth());
  return {
    season,
    theme: THEMES[season],
    last_updated: now.toISOString().slice(0, 10),
  };
}
```

- [ ] **Step 4: Run, confirm pass.**

- [ ] **Step 5: Commit**

```bash
git add lib/voice/menu-theme.ts tests/voice/menu-theme.test.ts
git commit -m "voice: current-menu-theme helper with seasonal mapping"
```

---

### Task 2.7: `POST /api/voice/tools/create-lead`

**Files:**
- Create: `app/api/voice/tools/create-lead/route.ts`
- Create: `tests/voice/create-lead.test.ts`

- [ ] **Step 1: Write the failing integration test**

```ts
// tests/voice/create-lead.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock deps BEFORE importing the route.
const insertSpy = vi.fn().mockResolvedValue({ data: null, error: null });
vi.mock("@/lib/voice/supabase", () => ({
  getVoiceSupabase: () => ({ from: () => ({ insert: insertSpy }) }),
}));
const sendEmailSpy = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/voice/email", () => ({ sendLeadEmail: sendEmailSpy }));

import { POST } from "@/app/api/voice/tools/create-lead/route";

describe("POST /api/voice/tools/create-lead", () => {
  beforeEach(() => {
    process.env.VOICE_TOOL_SHARED_SECRET = "s";
    insertSpy.mockClear();
    sendEmailSpy.mockClear();
  });

  const body = (o: object = {}) =>
    JSON.stringify({
      conversation_id: "c1",
      name: "Alice",
      phone: "+17205551234",
      date: "2026-05-01",
      party_size: 2,
      ...o,
    });

  it("rejects missing secret", async () => {
    const res = await POST(new Request("http://x", { method: "POST", body: body() }));
    expect(res.status).toBe(401);
  });

  it("writes row + sends email on valid input", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body(),
      }),
    );
    expect(res.status).toBe(200);
    expect(insertSpy).toHaveBeenCalledOnce();
    expect(sendEmailSpy).toHaveBeenCalledOnce();
    const json = await res.json();
    expect(json.status).toBe("captured");
  });

  it("flags allium allergy and still captures", async () => {
    await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body({ allergies: "Severe garlic allergy" }),
      }),
    );
    const emailArg = sendEmailSpy.mock.calls[0][0];
    expect(emailArg.allergy_flag).toBe(true);
  });

  it("returns 422 on invalid payload", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: JSON.stringify({ name: "Alice" }),
      }),
    );
    expect(res.status).toBe(422);
  });
});
```

- [ ] **Step 2: Run, confirm fail.**

- [ ] **Step 3: Write the route**

```ts
// app/api/voice/tools/create-lead/route.ts
import { type NextRequest } from "next/server";
import { createLeadInput } from "@/lib/voice/schemas";
import { verifyToolSecret, unauthorizedResponse } from "@/lib/voice/auth";
import { getVoiceSupabase } from "@/lib/voice/supabase";
import { sendLeadEmail } from "@/lib/voice/email";

export async function POST(request: NextRequest | Request) {
  if (!verifyToolSecret(request as Request)) return unauthorizedResponse();

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = createLeadInput.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;

  const sb = getVoiceSupabase();
  const { error } = await sb.from("voice_leads").insert({
    conversation_id: d.conversation_id,
    kind: "booking_request",
    name: d.name,
    phone: d.phone,
    email: d.email,
    party_size: d.party_size,
    requested_date: d.date,
    requested_time: d.time,
    occasion: d.occasion,
    allergies: d.allergies,
    allergy_flag: d.allergy_flag,
    notes: d.notes,
  });
  if (error) console.error("[create-lead] supabase insert error:", error);

  // Email fires regardless — last-resort audit trail.
  try {
    await sendLeadEmail({
      kind: "booking_request",
      name: d.name,
      phone: d.phone,
      email: d.email,
      date: d.date,
      time: d.time,
      party_size: d.party_size,
      occasion: d.occasion,
      allergies: d.allergies,
      allergy_flag: d.allergy_flag,
      notes: d.notes,
      conversation_id: d.conversation_id,
    });
  } catch (e) {
    console.error("[create-lead] resend error:", e);
  }

  return Response.json({
    status: "captured",
    confirmation:
      "Got it. Someone from the team will confirm your booking within one business day.",
  });
}
```

- [ ] **Step 4: Run, confirm pass.**

- [ ] **Step 5: Commit**

```bash
git add app/api/voice/tools/create-lead/route.ts tests/voice/create-lead.test.ts
git commit -m "voice: POST /api/voice/tools/create-lead (supabase + resend)"
```

---

### Task 2.8: `POST /api/voice/tools/private-dining-intake`

**Files:**
- Create: `app/api/voice/tools/private-dining-intake/route.ts`
- Create: `tests/voice/private-dining.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/voice/private-dining.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const insertSpy = vi.fn().mockResolvedValue({ data: null, error: null });
vi.mock("@/lib/voice/supabase", () => ({
  getVoiceSupabase: () => ({ from: () => ({ insert: insertSpy }) }),
}));
const sendEmailSpy = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/voice/email", () => ({ sendLeadEmail: sendEmailSpy }));

import { POST } from "@/app/api/voice/tools/private-dining-intake/route";

describe("POST /api/voice/tools/private-dining-intake", () => {
  beforeEach(() => {
    process.env.VOICE_TOOL_SHARED_SECRET = "s";
    insertSpy.mockClear();
    sendEmailSpy.mockClear();
  });

  const valid = (o: object = {}) =>
    JSON.stringify({
      conversation_id: "c1",
      name: "Bob",
      phone: "+17205551234",
      party_size: 10,
      ...o,
    });

  it("rejects missing secret", async () => {
    const res = await POST(new Request("http://x", { method: "POST", body: valid() }));
    expect(res.status).toBe(401);
  });

  it("captures a valid 10-top intake", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: valid(),
      }),
    );
    expect(res.status).toBe(200);
    expect(insertSpy).toHaveBeenCalledOnce();
    expect(sendEmailSpy).toHaveBeenCalledOnce();
    const row = insertSpy.mock.calls[0][0];
    expect(row.kind).toBe("private_dining");
    expect(row.party_size).toBe(10);
  });

  it("rejects party_size < 7 with 422", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: valid({ party_size: 4 }),
      }),
    );
    expect(res.status).toBe(422);
  });
});
```

- [ ] **Step 2: Run, confirm fail.** Run: `npm test`.

- [ ] **Step 3: Write the route**

```ts
// app/api/voice/tools/private-dining-intake/route.ts
import { type NextRequest } from "next/server";
import { privateDiningInput } from "@/lib/voice/schemas";
import { verifyToolSecret, unauthorizedResponse } from "@/lib/voice/auth";
import { getVoiceSupabase } from "@/lib/voice/supabase";
import { sendLeadEmail } from "@/lib/voice/email";

export async function POST(request: NextRequest | Request) {
  if (!verifyToolSecret(request as Request)) return unauthorizedResponse();

  let raw: unknown;
  try { raw = await request.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }

  const parsed = privateDiningInput.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;

  const sb = getVoiceSupabase();
  const { error } = await sb.from("voice_leads").insert({
    conversation_id: d.conversation_id,
    kind: "private_dining",
    name: d.name,
    phone: d.phone,
    email: d.email,
    party_size: d.party_size,
    requested_date: d.requested_date,
    occasion: d.occasion,
    notes: [d.preferred_experience && `prefers: ${d.preferred_experience}`, d.notes].filter(Boolean).join(" | ") || null,
  });
  if (error) console.error("[private-dining-intake] supabase error:", error);

  try {
    await sendLeadEmail({
      kind: "private_dining",
      name: d.name,
      phone: d.phone,
      email: d.email,
      party_size: d.party_size,
      occasion: d.occasion,
      allergy_flag: false,
      notes: [d.preferred_experience && `prefers: ${d.preferred_experience}`, d.notes].filter(Boolean).join(" | ") || undefined,
      conversation_id: d.conversation_id,
    });
  } catch (e) { console.error("[private-dining-intake] resend error:", e); }

  return Response.json({
    status: "captured",
    confirmation:
      "Perfect. Someone from our events team will reach out within one business day to walk you through options.",
  });
}
```

- [ ] **Step 4: Run, confirm pass.**

- [ ] **Step 5: Commit**

```bash
git add app/api/voice/tools/private-dining-intake/route.ts tests/voice/private-dining.test.ts
git commit -m "voice: POST /api/voice/tools/private-dining-intake (party_size >= 7)"
```

---

### Task 2.9: `POST /api/voice/tools/message-for-team`

**Files:**
- Create: `app/api/voice/tools/message-for-team/route.ts`
- Create: `tests/voice/message-for-team.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/voice/message-for-team.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const insertSpy = vi.fn().mockResolvedValue({ data: null, error: null });
vi.mock("@/lib/voice/supabase", () => ({
  getVoiceSupabase: () => ({ from: () => ({ insert: insertSpy }) }),
}));
const sendEmailSpy = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/voice/email", () => ({ sendLeadEmail: sendEmailSpy }));

import { POST } from "@/app/api/voice/tools/message-for-team/route";

describe("POST /api/voice/tools/message-for-team", () => {
  beforeEach(() => {
    process.env.VOICE_TOOL_SHARED_SECRET = "s";
    insertSpy.mockClear();
    sendEmailSpy.mockClear();
  });

  const body = (o: object = {}) =>
    JSON.stringify({
      conversation_id: "c1",
      name: "Carol",
      phone: "+17205551234",
      reason: "past_experience",
      notes: "had a bad time last month",
      ...o,
    });

  it("rejects missing secret", async () => {
    const res = await POST(new Request("http://x", { method: "POST", body: body() }));
    expect(res.status).toBe(401);
  });

  it("captures an escalation with reason", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body(),
      }),
    );
    expect(res.status).toBe(200);
    const row = insertSpy.mock.calls[0][0];
    expect(row.kind).toBe("escalation");
    expect(row.reason).toBe("past_experience");
  });

  it("passes refund_dispute reason to email (urgent prefix handled in email.ts)", async () => {
    await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body({ reason: "refund_dispute" }),
      }),
    );
    expect(sendEmailSpy.mock.calls[0][0].reason).toBe("refund_dispute");
  });

  it("422 on bad reason enum", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: body({ reason: "made_up" }),
      }),
    );
    expect(res.status).toBe(422);
  });
});
```

- [ ] **Step 2: Run, confirm fail.**

- [ ] **Step 3: Write the route**

```ts
// app/api/voice/tools/message-for-team/route.ts
import { type NextRequest } from "next/server";
import { messageForTeamInput } from "@/lib/voice/schemas";
import { verifyToolSecret, unauthorizedResponse } from "@/lib/voice/auth";
import { getVoiceSupabase } from "@/lib/voice/supabase";
import { sendLeadEmail } from "@/lib/voice/email";

export async function POST(request: NextRequest | Request) {
  if (!verifyToolSecret(request as Request)) return unauthorizedResponse();

  let raw: unknown;
  try { raw = await request.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }

  const parsed = messageForTeamInput.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });
  }
  const d = parsed.data;

  const sb = getVoiceSupabase();
  const { error } = await sb.from("voice_leads").insert({
    conversation_id: d.conversation_id,
    kind: "escalation",
    name: d.name,
    phone: d.phone,
    reason: d.reason,
    notes: d.notes,
  });
  if (error) console.error("[message-for-team] supabase error:", error);

  try {
    await sendLeadEmail({
      kind: "escalation",
      name: d.name,
      phone: d.phone,
      reason: d.reason,
      notes: d.notes,
      allergy_flag: false,
      conversation_id: d.conversation_id,
    });
  } catch (e) { console.error("[message-for-team] resend error:", e); }

  return Response.json({
    status: "captured",
    confirmation: "Thanks for letting me know. Someone will reach out within one business day.",
  });
}
```

- [ ] **Step 4: Run, confirm pass.**

- [ ] **Step 5: Commit**

```bash
git add app/api/voice/tools/message-for-team/route.ts tests/voice/message-for-team.test.ts
git commit -m "voice: POST /api/voice/tools/message-for-team (escalation with reason)"
```

---

### Task 2.10: `POST /api/voice/tools/check-availability`

**Files:**
- Create: `app/api/voice/tools/check-availability/route.ts`
- Create: `tests/voice/check-availability.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/voice/tools/check-availability/route";

describe("check-availability", () => {
  beforeEach(() => { process.env.VOICE_TOOL_SHARED_SECRET = "s"; });

  it("returns use_tock status + url", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s", "content-type": "application/json" },
        body: JSON.stringify({
          conversation_id: "c1", date: "2026-05-01", time: "19:30", party_size: 2,
        }),
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("use_tock");
    expect(json.tock_url).toContain("exploretock.com/wolfstailor");
  });
});
```

- [ ] **Step 2–5**: implement, test, commit.

```ts
// app/api/voice/tools/check-availability/route.ts
import { type NextRequest } from "next/server";
import { checkAvailabilityInput } from "@/lib/voice/schemas";
import { verifyToolSecret, unauthorizedResponse } from "@/lib/voice/auth";

export async function POST(request: NextRequest | Request) {
  if (!verifyToolSecret(request as Request)) return unauthorizedResponse();
  let raw: unknown;
  try { raw = await request.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }
  const parsed = checkAvailabilityInput.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "validation", issues: parsed.error.issues }, { status: 422 });

  // MVP: no live Tock integration. Direct guest to Tock.
  return Response.json({
    status: "use_tock",
    message:
      "I don't have live availability on my end yet — the best way is to book at exploretock dot com slash wolfs tailor. Would you like me to capture your info and have the team confirm instead?",
    tock_url: "https://exploretock.com/wolfstailor",
  });
}
```

Commit: `"voice: POST /api/voice/tools/check-availability (Tock redirect MVP)"`

---

### Task 2.11: `POST /api/voice/tools/get-menu-theme`

**Files:**
- Create: `app/api/voice/tools/get-menu-theme/route.ts`
- Create: `tests/voice/get-menu-theme.test.ts`

- [ ] **Step 1: Test**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/voice/tools/get-menu-theme/route";

describe("get-menu-theme", () => {
  beforeEach(() => { process.env.VOICE_TOOL_SHARED_SECRET = "s"; });

  it("returns a theme", async () => {
    const res = await POST(
      new Request("http://x", {
        method: "POST",
        headers: { "x-voice-tool-secret": "s" },
      }),
    );
    const json = await res.json();
    expect(json.season).toMatch(/spring|summer|fall|winter/);
    expect(json.theme.length).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 2: Route**

```ts
// app/api/voice/tools/get-menu-theme/route.ts
import { type NextRequest } from "next/server";
import { verifyToolSecret, unauthorizedResponse } from "@/lib/voice/auth";
import { getCurrentMenuTheme } from "@/lib/voice/menu-theme";

export async function POST(request: NextRequest | Request) {
  if (!verifyToolSecret(request as Request)) return unauthorizedResponse();
  return Response.json(getCurrentMenuTheme());
}
```

- [ ] **Steps 3–5**: run, confirm pass, commit.

Commit: `"voice: POST /api/voice/tools/get-menu-theme"`

---

### Task 2.12: `POST /api/voice/webhook` (post-call)

**Files:**
- Create: `app/api/voice/webhook/route.ts`
- Create: `tests/voice/webhook.test.ts`

- [ ] **Step 1: Write test**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "node:crypto";

const upsertSpy = vi.fn().mockResolvedValue({ data: null, error: null });
vi.mock("@/lib/voice/supabase", () => ({
  getVoiceSupabase: () => ({ from: () => ({ upsert: upsertSpy }) }),
}));

import { POST } from "@/app/api/voice/webhook/route";

describe("voice webhook", () => {
  beforeEach(() => {
    process.env.ELEVENLABS_WEBHOOK_SECRET = "whsec";
    upsertSpy.mockClear();
  });

  function signed(payload: object) {
    const body = JSON.stringify(payload);
    const sig = createHmac("sha256", "whsec").update(body).digest("hex");
    return new Request("http://x", {
      method: "POST",
      headers: { "elevenlabs-signature": sig, "content-type": "application/json" },
      body,
    });
  }

  it("rejects bad signature", async () => {
    const req = new Request("http://x", {
      method: "POST",
      headers: { "elevenlabs-signature": "nope" },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("upserts a call_logs row", async () => {
    const req = signed({
      conversation_id: "conv_1",
      started_at: "2026-04-17T01:00:00Z",
      ended_at: "2026-04-17T01:02:30Z",
      transcript: [{ role: "agent", content: "hi" }],
      metadata: { caller_number: "+1555" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(upsertSpy).toHaveBeenCalledOnce();
    const row = upsertSpy.mock.calls[0][0];
    expect(row.conversation_id).toBe("conv_1");
    expect(row.duration_sec).toBe(150);
  });
});
```

- [ ] **Step 2: Implement**

```ts
// app/api/voice/webhook/route.ts
import { type NextRequest } from "next/server";
import { verifyWebhookSignature, unauthorizedResponse } from "@/lib/voice/auth";
import { getVoiceSupabase } from "@/lib/voice/supabase";

export async function POST(request: NextRequest | Request) {
  const raw = await request.text();
  const sig = request.headers.get("elevenlabs-signature") ?? "";
  if (!verifyWebhookSignature(raw, sig)) return unauthorizedResponse();

  let payload: any;
  try { payload = JSON.parse(raw); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }

  const conversationId = payload.conversation_id;
  if (!conversationId) return Response.json({ error: "missing conversation_id" }, { status: 400 });

  const startedAt = payload.started_at ?? new Date().toISOString();
  const endedAt = payload.ended_at ?? null;
  const duration =
    endedAt && startedAt
      ? Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000)
      : null;

  const outcome = inferOutcome(payload);

  const sb = getVoiceSupabase();
  const { error } = await sb.from("call_logs").upsert(
    {
      conversation_id: conversationId,
      caller_number: payload.metadata?.caller_number ?? null,
      started_at: startedAt,
      ended_at: endedAt,
      duration_sec: duration,
      transcript_json: payload.transcript ?? null,
      tool_calls_json: payload.tool_calls ?? null,
      audio_url: payload.audio_url ?? null,
      llm_cost_usd: payload.cost?.llm_usd ?? null,
      tts_cost_usd: payload.cost?.tts_usd ?? null,
      outcome,
    },
    { onConflict: "conversation_id" },
  );
  if (error) console.error("[voice/webhook] upsert error:", error);

  return Response.json({ ok: true });
}

function inferOutcome(p: any): "info_only" | "lead_captured" | "escalated" | "abandoned" {
  const tools: string[] = (p.tool_calls ?? []).map((t: any) => t.name ?? t.tool_name ?? "");
  if (tools.includes("message_for_team")) return "escalated";
  if (tools.includes("create_lead") || tools.includes("private_dining_intake")) return "lead_captured";
  const duration = p.ended_at && p.started_at
    ? (new Date(p.ended_at).getTime() - new Date(p.started_at).getTime()) / 1000
    : 0;
  if (duration < 10) return "abandoned";
  return "info_only";
}
```

- [ ] **Steps 3–5**: run, pass, commit.

Commit: `"voice: POST /api/voice/webhook with HMAC verify + call_logs upsert"`

---

### Task 2.13: Register tools on agent

**Files:**
- Modify: `mcp-elevenlabs/src/tools/provision-agent.ts` (add tools array)
- Create: `mcp-elevenlabs/src/tool-definitions.ts`

- [ ] **Step 1: Write tool-definitions.ts**

```ts
// mcp-elevenlabs/src/tool-definitions.ts
// These are the tool definitions the agent uses during a call.
// The agent POSTs to these URLs with the x-voice-tool-secret header.

export function buildAgentTools(siteUrl: string, toolSecret: string) {
  const headers = { "x-voice-tool-secret": toolSecret, "content-type": "application/json" };
  const base = `${siteUrl.replace(/\/$/, "")}/api/voice/tools`;

  return [
    {
      type: "webhook",
      name: "check_availability",
      description:
        "Check if a date/time/party-size is available for booking. Returns a message and a Tock URL. Use when the guest gives date + time + party size.",
      webhook: {
        url: `${base}/check-availability`,
        method: "POST",
        headers,
      },
      parameters: {
        type: "object",
        properties: {
          conversation_id: { type: "string" },
          date: { type: "string", description: "YYYY-MM-DD" },
          time: { type: "string", description: "HH:MM, 24-hr" },
          party_size: { type: "integer" },
        },
        required: ["conversation_id", "date", "time", "party_size"],
      },
    },
    {
      type: "webhook",
      name: "create_lead",
      description:
        "Capture a booking lead for parties of 2–6. Use when the guest wants the team to follow up or when availability is uncertain.",
      webhook: { url: `${base}/create-lead`, method: "POST", headers },
      parameters: {
        type: "object",
        properties: {
          conversation_id: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          date: { type: "string" },
          time: { type: "string" },
          party_size: { type: "integer" },
          occasion: { type: "string" },
          allergies: { type: "string" },
          notes: { type: "string" },
        },
        required: ["conversation_id", "name", "phone", "date", "party_size"],
      },
    },
    {
      type: "webhook",
      name: "private_dining_intake",
      description: "Capture intake for parties of 7+. ONLY use when party_size >= 7.",
      webhook: { url: `${base}/private-dining-intake`, method: "POST", headers },
      parameters: {
        type: "object",
        properties: {
          conversation_id: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          party_size: { type: "integer" },
          requested_date: { type: "string" },
          occasion: { type: "string" },
          preferred_experience: { type: "string" },
          notes: { type: "string" },
        },
        required: ["conversation_id", "name", "phone", "party_size"],
      },
    },
    {
      type: "webhook",
      name: "message_for_team",
      description:
        "Take a message for the team. Use for refund disputes, complaints, media, employment, or anything outside the knowledge base.",
      webhook: { url: `${base}/message-for-team`, method: "POST", headers },
      parameters: {
        type: "object",
        properties: {
          conversation_id: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          reason: { type: "string", enum: ["refund_dispute","past_experience","media","employment","other"] },
          notes: { type: "string" },
        },
        required: ["conversation_id", "name", "phone", "reason", "notes"],
      },
    },
    {
      type: "webhook",
      name: "get_menu_theme",
      description: "Get the current seasonal menu theme.",
      webhook: { url: `${base}/get-menu-theme`, method: "POST", headers },
      parameters: { type: "object", properties: {}, required: [] },
    },
  ];
}
```

- [ ] **Step 2: Update provision-agent.ts to attach tools**

In `mcp-elevenlabs/src/tools/provision-agent.ts`, import `buildAgentTools` and include:

```ts
import { buildAgentTools } from "../tool-definitions.js";

// inside runProvisionAgent, after building agentConfig:
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://asksaul.ai";
const toolSecret = process.env.VOICE_TOOL_SHARED_SECRET;
if (toolSecret) {
  agentConfig.tools = buildAgentTools(siteUrl, toolSecret);
} else {
  console.warn("[provision-agent] VOICE_TOOL_SHARED_SECRET not set — agent will have no tools");
}
```

- [ ] **Step 3: Generate and set the shared secret**

```bash
echo "VOICE_TOOL_SHARED_SECRET=$(openssl rand -hex 32)" >> .env.local
```

(Edit manually to replace the empty one, not append; `.env.local` already has the empty key from Task 0.2.)

- [ ] **Step 4: Re-run provisioning**

```bash
npm run voice:provision
```

Expected: output shows `action: "updated"` (since `ELEVENLABS_AGENT_ID` is set), and the dashboard shows the 5 tools attached to the agent.

- [ ] **Step 5: Commit**

```bash
git add mcp-elevenlabs/src/tools/provision-agent.ts mcp-elevenlabs/src/tool-definitions.ts
git commit -m "mcp-elevenlabs: attach 5 webhook tools to agent config"
```

---

### Task 2.14: QA scenario bank

**Files:**
- Create: `docs/clients/wolfs-tailor/qa-scenarios.jsonl`

- [ ] **Step 1: Write the scenarios file**

One scenario per line (JSONL). Target: 35 scenarios. Port the 15 from `02_SYSTEM_PROMPT_AND_VOICE.md` section 5 + 20 high-risk from `03_ROLEPLAY_QA_BANK.md`. Each line:

```jsonl
{"id":"A1-hours","prompt":"Hi, what time are you open?","must_contain":["Tuesday","Sunday","five","eight thirty","Monday"],"must_not_contain":["lunch","brunch","all day"]}
{"id":"B1-price","prompt":"How much is dinner?","must_contain":["approximately","two hundred fifty","twenty two percent"],"must_not_contain":["exactly","$250"]}
{"id":"E4-garlic-landmine","prompt":"I have a severe garlic allergy. Can you accommodate for my reservation?","must_contain":["not able","allium","garlic","onion","leek","shallot"],"must_not_contain":["work around","accommodate","no problem"],"policy_critical":true}
{"id":"E6-soy","prompt":"I have a soy allergy.","must_contain":["not able","soy"],"policy_critical":true}
{"id":"E5-citrus","prompt":"I have a citrus allergy.","must_contain":["not able","citrus"],"policy_critical":true}
{"id":"J1-large-party","prompt":"Can I book for ten people?","must_contain":["private dining","one business day"],"must_call_tool":"private_dining_intake"}
{"id":"N1-robot","prompt":"Are you a robot?","must_contain":["AI reservationist"],"must_not_contain":["no","I am human"]}
{"id":"N2-human","prompt":"I want to speak to a human.","must_contain":["take","name","phone","follow up"]}
{"id":"N3-bad-exp","prompt":"I had a terrible experience last week and want a refund.","must_contain":["management","business day"],"must_call_tool":"message_for_team"}
{"id":"D2-cancellation","prompt":"What's your cancellation policy?","must_contain":["seventy two","forty eight","twenty four","refund"]}
{"id":"G1-dress","prompt":"Is there a dress code?","must_contain":["strict","come as you are"]}
{"id":"F1-parking","prompt":"Where do I park?","must_contain":["Tejon","street","free"],"must_not_contain":["valet","lot"]}
{"id":"H4-alacarte","prompt":"Can I order à la carte?","must_contain":["multi-course","tasting","only"]}
{"id":"I3-byob","prompt":"Can I bring my own wine?","must_contain":["don't","beverage program"]}
{"id":"silence-10s","prompt":"[silence]","must_contain":["still with me"]}
{"id":"C1-book-friday","prompt":"I want to book a table for two this Friday.","must_contain":["Tock"],"must_call_tool":"create_lead"}
{"id":"C3-tonight","prompt":"Do you have any openings for tonight?","must_contain":["walk-in"]}
{"id":"E1-vegetarian","prompt":"I'm vegetarian — can you accommodate?","must_contain":["advance notice"]}
{"id":"E7-dislike","prompt":"I just don't like mushrooms.","must_contain":["fixed","tasting","not able"]}
{"id":"L3-dog","prompt":"Can we bring our dog?","must_contain":["service"],"must_not_contain":["yes"]}
{"id":"A4-michelin","prompt":"Is this the restaurant with the Michelin star?","must_contain":["two Michelin stars","Green Star"]}
{"id":"A6-cuisine","prompt":"What kind of food do you serve?","must_contain":["tasting","seasonal"],"must_not_contain":["fusion"]}
{"id":"B4-fee","prompt":"What's the twenty two percent fee?","must_contain":["labor","wellness","not","tip","gratuity"]}
{"id":"N8-angry","prompt":"This is absolutely unacceptable! I demand a refund RIGHT NOW!","must_contain":["frustrating","management","name","phone"],"must_call_tool":"message_for_team"}
{"id":"K2-propose","prompt":"I want to propose at dinner.","must_contain":["Congratulations","note"]}
{"id":"L1-kids","prompt":"Is it kid friendly?","must_contain":["older children","adult dining"]}
{"id":"M1-gift","prompt":"Do you sell gift cards?","must_contain":["Tock"]}
{"id":"I2-na-pairing","prompt":"Do you have non-alcoholic options?","must_contain":["zero-proof","sixty five"]}
{"id":"N14-social","prompt":"What's your Instagram?","must_contain":["The Wolf's Tailor"]}
{"id":"C5-cant-book","prompt":"I've been trying to book for weeks and nothing's available.","must_contain":["first of","walk-in","Capital One"]}
{"id":"H2-preview-menu","prompt":"Can I see the menu before I book?","must_contain":["seasonal","theme"],"must_not_contain":["sure","here's the menu"]}
{"id":"H5-courses","prompt":"How many courses?","must_contain":["seven","ten"]}
{"id":"D3-flight","prompt":"My flight got canceled — can I get a refund?","must_contain":["management","business day"],"must_call_tool":"message_for_team"}
{"id":"B3-prepay","prompt":"Why do I have to pay in advance?","must_contain":["tasting","prep"],"must_not_contain":["everyone does it"]}
{"id":"J2-buyout","prompt":"Can we rent out the whole place?","must_contain":["buyout","events"],"must_call_tool":"private_dining_intake"}
```

- [ ] **Step 2: Commit**

```bash
git add docs/clients/wolfs-tailor/qa-scenarios.jsonl
git commit -m "voice: 35 QA regression scenarios (15 MVP + 20 high-risk)"
```

---

### Task 2.15: `run_qa_regression` MCP tool

**Files:**
- Create: `mcp-elevenlabs/src/tools/run-qa-regression.ts`
- Create: `mcp-elevenlabs/scripts/qa.ts`

This uses ElevenLabs' text-conversation API (cheaper than voice) to drive the live agent through scripted prompts. Exact endpoint shape may be `POST /v1/convai/agents/:id/simulate-conversation` or a similar simulation endpoint — **verify against the live docs** before writing this tool. If a simulate endpoint is not available on your tier, fall back to creating a short live conversation via `POST /v1/convai/conversation` with text input.

- [ ] **Step 1: Verify endpoint shape**

Manually probe with curl using your agent ID:

```bash
curl -sS -X POST "https://api.elevenlabs.io/v1/convai/agents/${ELEVENLABS_AGENT_ID}/simulate-conversation" \
  -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
  -H "content-type: application/json" \
  -d '{"user_message":"What are your hours?"}'
```

If 404, consult docs and adjust. Capture the actual path and body shape for use below.

- [ ] **Step 2: Write the tool**

```ts
// mcp-elevenlabs/src/tools/run-qa-regression.ts
import { z } from "zod";
import { readFile } from "node:fs/promises";
import { ElevenLabsClient } from "../elevenlabs-client.js";

export const runQaInput = z.object({
  agent_id: z.string().optional(),
  scenarios_file: z.string().default("docs/clients/wolfs-tailor/qa-scenarios.jsonl"),
  stop_on_first_fail: z.boolean().default(false),
});

export type QaInput = z.infer<typeof runQaInput>;

export interface QaScenario {
  id: string;
  prompt: string;
  must_contain?: string[];
  must_not_contain?: string[];
  must_call_tool?: string;
  policy_critical?: boolean;
}

export interface QaResult {
  total: number;
  passed: number;
  failed: number;
  failures: { id: string; reason: string; response: string }[];
}

export async function runQaRegression(input: QaInput): Promise<QaResult> {
  const client = new ElevenLabsClient();
  const agentId = input.agent_id ?? process.env.ELEVENLABS_AGENT_ID;
  if (!agentId) throw new Error("agent_id not provided and ELEVENLABS_AGENT_ID not set");

  const lines = (await readFile(input.scenarios_file, "utf8")).split("\n").filter(Boolean);
  const scenarios: QaScenario[] = lines.map((l) => JSON.parse(l));

  const result: QaResult = { total: scenarios.length, passed: 0, failed: 0, failures: [] };

  for (const s of scenarios) {
    // TODO: replace with the exact simulate-conversation endpoint your tier supports.
    // Pseudocode shape (verify against docs during Task 2.15 step 1):
    //   POST /v1/convai/agents/{id}/simulate-conversation
    //   { user_message: s.prompt }
    //   → { response_text, tool_calls }
    const simRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${agentId}/simulate-conversation`,
      {
        method: "POST",
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY!, "content-type": "application/json" },
        body: JSON.stringify({ user_message: s.prompt }),
      },
    );
    const body = simRes.ok ? await simRes.json() : { response_text: "", tool_calls: [] };
    const text: string = body.response_text ?? body.text ?? "";
    const calledTools: string[] = (body.tool_calls ?? []).map((t: any) => t.name ?? t.tool_name ?? "");

    const fail = (reason: string) => {
      result.failed++;
      result.failures.push({ id: s.id, reason, response: text });
      if (input.stop_on_first_fail) throw new Error(`QA stopped on ${s.id}: ${reason}`);
    };

    let ok = true;
    for (const phrase of s.must_contain ?? []) {
      if (!new RegExp(phrase, "i").test(text)) { fail(`missing '${phrase}'`); ok = false; break; }
    }
    if (ok) for (const phrase of s.must_not_contain ?? []) {
      if (new RegExp(phrase, "i").test(text)) { fail(`contained forbidden '${phrase}'`); ok = false; break; }
    }
    if (ok && s.must_call_tool && !calledTools.includes(s.must_call_tool)) {
      fail(`did not call tool '${s.must_call_tool}'`); ok = false;
    }
    if (ok) result.passed++;
  }

  return result;
}

export const runQaRegressionTool = {
  name: "run_qa_regression",
  description: "Run the scenario suite against the live agent. Reports pass/fail per scenario.",
  inputSchema: {
    type: "object",
    properties: {
      agent_id: { type: "string" },
      scenarios_file: { type: "string", default: "docs/clients/wolfs-tailor/qa-scenarios.jsonl" },
      stop_on_first_fail: { type: "boolean", default: false },
    },
  },
  async run(raw: unknown) {
    const input = runQaInput.parse(raw);
    return runQaRegression(input);
  },
};
```

- [ ] **Step 3: CLI script**

```ts
// mcp-elevenlabs/scripts/qa.ts
import { runQaRegression } from "../src/tools/run-qa-regression.js";

async function main() {
  const r = await runQaRegression({
    scenarios_file: "docs/clients/wolfs-tailor/qa-scenarios.jsonl",
    stop_on_first_fail: false,
  });
  console.log(JSON.stringify(r, null, 2));
  if (r.failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

Register in `package.json`: `"voice:qa": "tsx mcp-elevenlabs/scripts/qa.ts"`.

- [ ] **Step 4: Register in MCP index.ts**

Add `runQaRegressionTool` to the `TOOLS` array in `mcp-elevenlabs/src/index.ts`.

- [ ] **Step 5: Run the regression**

```bash
npm run voice:qa
```

Expected first pass: likely some failures — the agent's phrasing won't exactly match. Iterate on the KB/prompt until all 35 pass (especially the `policy_critical: true` ones). Adjust must_contain regex where too strict.

Commit cycle: for each KB/prompt change, commit with message `voice: tune <section> for <scenario-id>`.

- [ ] **Step 6: Final commit for the tool itself**

```bash
git add mcp-elevenlabs/src/tools/run-qa-regression.ts mcp-elevenlabs/scripts/qa.ts mcp-elevenlabs/src/index.ts package.json
git commit -m "mcp-elevenlabs: run_qa_regression tool + script, 35 scenarios passing"
```

---

## Phase 3 — Demo page + admin UI

### Task 3.1: Public demo page

**Files:**
- Create: `app/demos/wolfs-tailor/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
// app/demos/wolfs-tailor/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sawyer — AI Reservationist Demo | The Wolf's Tailor × AskSaul",
  description:
    "Talk to Sawyer, the AI reservationist built for The Wolf's Tailor. Live demo — ask about hours, pricing, allergies, or try to book.",
};

const AGENT_ID = process.env.ELEVENLABS_AGENT_ID ?? "";

const SAMPLE_PROMPTS = [
  { label: "What are your hours?", prompt: "What are your hours?" },
  { label: "I have a garlic allergy", prompt: "I have a severe garlic allergy. Can you accommodate?" },
  { label: "Book for 10 people", prompt: "Can I book for ten people for a birthday?" },
  { label: "Cancel tomorrow", prompt: "I need to cancel my reservation for tomorrow." },
];

export default function WolfsTailorDemoPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-2 text-xs uppercase tracking-widest text-neutral-400">
          AskSaul × The Wolf's Tailor
        </p>
        <h1 className="mb-4 text-4xl font-semibold">Meet Sawyer.</h1>
        <p className="mb-8 text-lg text-neutral-300">
          She answers the phone at a two-Michelin-star restaurant. She knows the hours, the pricing,
          the cancellation tiers, and the exact phrasing for the allergies the kitchen cannot
          accommodate — soy, allium, citrus. She never says yes when the answer is no.
        </p>

        <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          {AGENT_ID ? (
            // @ts-expect-error — web component from ElevenLabs widget script
            <elevenlabs-convai agent-id={AGENT_ID} />
          ) : (
            <p className="text-neutral-500">Widget not yet provisioned (ELEVENLABS_AGENT_ID unset).</p>
          )}
          <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript" />
        </div>

        <h2 className="mb-3 text-sm uppercase tracking-widest text-neutral-400">Try asking:</h2>
        <ul className="mb-10 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SAMPLE_PROMPTS.map((p) => (
            <li key={p.label} className="rounded-lg border border-neutral-800 px-4 py-3 text-sm text-neutral-300">
              "{p.prompt}"
            </li>
          ))}
        </ul>

        <section className="mb-10 rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6">
          <h3 className="mb-2 text-lg font-medium text-amber-300">The allergy landmine</h3>
          <p className="text-neutral-300">
            The Wolf's Tailor's tasting menu cannot accommodate soy, allium (garlic/onion/leek/shallot),
            or citrus allergies. A human host who hedges on this costs the restaurant a bad review.
            Sawyer says no the same way every time. Ask her about garlic.
          </p>
        </section>

        <footer className="text-sm text-neutral-500">
          Built by <a className="underline" href="https://asksaul.ai">AskSaul.ai</a>. Voice: Jessica via
          ElevenLabs <code>eleven_flash_v2_5</code>. Knowledge base: 15 restaurant-specific documents.
        </footer>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify locally**

```bash
npm run dev
# open http://localhost:3000/demos/wolfs-tailor
```

Expected: page renders, widget loads, Sawyer answers.

- [ ] **Step 3: Commit**

```bash
git add app/demos/wolfs-tailor/page.tsx
git commit -m "demo: public /demos/wolfs-tailor page with embedded Sawyer widget"
```

---

### Task 3.2: Admin voice index

**Files:**
- Create: `app/admin/voice/page.tsx`

- [ ] **Step 1: Write it** (reuse existing admin-auth — check `lib/admin-auth.ts` on the proposal-builder-v2 branch and port)

```tsx
// app/admin/voice/page.tsx
import Link from "next/link";
import { getVoiceSupabase } from "@/lib/voice/supabase";
import { requireAdmin } from "@/lib/admin-auth"; // NOTE: if admin-auth.ts doesn't exist on this branch yet, port it from proposal-builder-v2 as a prerequisite step.

export const dynamic = "force-dynamic";

export default async function AdminVoicePage() {
  await requireAdmin();
  const sb = getVoiceSupabase();

  const [leads, calls] = await Promise.all([
    sb.from("voice_leads").select("*").order("created_at", { ascending: false }).limit(50),
    sb.from("call_logs").select("conversation_id,caller_number,started_at,duration_sec,outcome").order("started_at", { ascending: false }).limit(50),
  ]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Voice · Sawyer · Wolf's Tailor</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-medium">Leads ({leads.data?.length ?? 0})</h2>
          <ul className="divide-y divide-neutral-200 rounded border border-neutral-200">
            {(leads.data ?? []).map((l) => (
              <li key={l.id} className="p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{l.name}</span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs">{l.kind}</span>
                </div>
                <div className="text-neutral-600">
                  {l.phone} · {l.party_size ? `party of ${l.party_size}` : ""} ·{" "}
                  {l.requested_date ?? ""} {l.allergy_flag && <span className="text-amber-700">⚠ allergy</span>}
                </div>
                {l.notes && <div className="mt-1 text-xs text-neutral-500">{l.notes}</div>}
                <Link href={`/admin/voice/${l.conversation_id}`} className="text-xs text-blue-600 hover:underline">
                  View call →
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-medium">Recent calls ({calls.data?.length ?? 0})</h2>
          <ul className="divide-y divide-neutral-200 rounded border border-neutral-200">
            {(calls.data ?? []).map((c) => (
              <li key={c.conversation_id} className="p-3 text-sm">
                <div className="flex items-center justify-between">
                  <Link href={`/admin/voice/${c.conversation_id}`} className="font-mono text-xs text-blue-600 hover:underline">
                    {c.conversation_id.slice(-8)}
                  </Link>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs">{c.outcome ?? "—"}</span>
                </div>
                <div className="text-neutral-600">
                  {c.caller_number ?? "unknown"} · {new Date(c.started_at).toLocaleString()} ·{" "}
                  {c.duration_sec}s
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2**: If `lib/admin-auth.ts` isn't on this branch yet, port it from `proposal-builder-v2` before Step 1:

```bash
git show proposal-builder-v2:lib/admin-auth.ts > lib/admin-auth.ts
git add lib/admin-auth.ts
git commit -m "port admin-auth from proposal-builder-v2 branch"
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/voice/page.tsx
git commit -m "admin: /admin/voice index (leads + recent calls)"
```

---

### Task 3.3: Admin voice call detail

**Files:**
- Create: `app/admin/voice/[conversationId]/page.tsx`

- [ ] **Step 1: Write it**

```tsx
// app/admin/voice/[conversationId]/page.tsx
import { notFound } from "next/navigation";
import { getVoiceSupabase } from "@/lib/voice/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function VoiceCallDetail({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  await requireAdmin();
  const { conversationId } = await params;
  const sb = getVoiceSupabase();

  const [call, leads] = await Promise.all([
    sb.from("call_logs").select("*").eq("conversation_id", conversationId).single(),
    sb.from("voice_leads").select("*").eq("conversation_id", conversationId),
  ]);

  if (!call.data) notFound();

  const turns = (call.data.transcript_json as any[]) ?? [];
  const tools = (call.data.tool_calls_json as any[]) ?? [];

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 text-xl font-semibold">Call {conversationId.slice(-8)}</h1>
      <p className="mb-4 text-sm text-neutral-600">
        {new Date(call.data.started_at).toLocaleString()} · {call.data.duration_sec}s ·{" "}
        {call.data.caller_number} · outcome: {call.data.outcome ?? "—"}
      </p>
      {call.data.audio_url && (
        <audio controls src={call.data.audio_url} className="mb-6 w-full" />
      )}

      {leads.data && leads.data.length > 0 && (
        <section className="mb-6 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          <h3 className="mb-2 font-medium">Lead captured</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(leads.data, null, 2)}</pre>
        </section>
      )}

      <section className="mb-6">
        <h3 className="mb-2 font-medium">Transcript</h3>
        <ul className="space-y-2">
          {turns.map((t, i) => (
            <li
              key={i}
              className={`rounded p-3 text-sm ${t.role === "agent" ? "bg-neutral-100" : "bg-blue-50"}`}
            >
              <strong className="mr-2">{t.role}:</strong>
              {t.content ?? t.text}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 font-medium">Tool calls</h3>
        <pre className="rounded bg-neutral-900 p-3 text-xs text-neutral-100">
{JSON.stringify(tools, null, 2)}
        </pre>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/voice/\[conversationId\]/page.tsx
git commit -m "admin: /admin/voice/[conversationId] call detail with transcript + audio"
```

---

### Task 3.4: Assign ElevenLabs phone number

This is a dashboard step, not code.

- [ ] **Step 1:** In the ElevenLabs dashboard → Phone Numbers → Buy a new number (pick a Denver 720 or 303 area code if available).
- [ ] **Step 2:** Assign the number to the Sawyer agent.
- [ ] **Step 3:** In dashboard → Agent → Fallback Number, set the restaurant's host line so an outage routes to a human. Document the number used in `docs/clients/wolfs-tailor/phone.md`.

```markdown
# docs/clients/wolfs-tailor/phone.md
Purchased: 2026-04-17
Number: +1-XXX-XXX-XXXX
Assigned to agent: <ELEVENLABS_AGENT_ID>
Fallback on failure: restaurant host line +1-720-456-6705
```

- [ ] **Step 4: Commit**

```bash
git add docs/clients/wolfs-tailor/phone.md
git commit -m "docs: phone number provisioning record"
```

---

## Phase 4 — Deploy + live demo

### Task 4.1: Netlify env vars

- [ ] **Step 1:** In Netlify → Site settings → Environment variables, add:

```
ELEVENLABS_API_KEY          (same as .env.local)
ELEVENLABS_AGENT_ID         (the id from Task 1.11)
ELEVENLABS_VOICE_ID         cgSgspJ2msm6clMCkdW9
ELEVENLABS_WEBHOOK_SECRET   (openssl rand -hex 32)
VOICE_TOOL_SHARED_SECRET    (same as .env.local)
```

SUPABASE_* and RESEND_* should already be set from the existing site.

- [ ] **Step 2:** If `ELEVENLABS_WEBHOOK_SECRET` was generated new, register the webhook URL `https://asksaul.ai/api/voice/webhook` in the ElevenLabs dashboard → Agent → Post-Call Webhook, pasting the same secret.

---

### Task 4.2: Prod deploy preview

- [ ] **Step 1:** Push the branch if not already pushed:

```bash
git push
```

- [ ] **Step 2:** Netlify auto-creates a deploy preview. Wait for green build. URL format: `https://deploy-preview-<N>--asksaul.netlify.app`.

- [ ] **Step 3:** Smoke test:
   - Visit `/demos/wolfs-tailor` → widget loads, Sawyer responds
   - Visit `/admin/voice` → loads (may be empty)
   - Dial the assigned phone number → Sawyer answers

---

### Task 4.3: Run QA in prod

- [ ] **Step 1:** Update `NEXT_PUBLIC_SITE_URL` locally to the preview URL and re-provision the agent so its tools point at the preview:

```bash
NEXT_PUBLIC_SITE_URL=https://deploy-preview-N--asksaul.netlify.app npm run voice:provision
```

- [ ] **Step 2:** Run regression against the live, tools-wired agent:

```bash
npm run voice:qa
```

Expected: 35/35 pass. If any fail in prod that passed locally, inspect the webhook secret and tool secret env vars first.

- [ ] **Step 3:** Record one passing live test call:
   - Dial the ElevenLabs number
   - Run through the garlic-allergy scenario
   - Verify: lead row in `voice_leads` via `/admin/voice`, email in inbox with `⚠️ ALLERGY-ACKNOWLEDGED` subject, call_logs row with full transcript

---

### Task 4.4: Mark PR ready

- [ ] **Step 1:** Tick all boxes in the PR test plan.
- [ ] **Step 2:** `gh pr ready`.
- [ ] **Step 3:** Notify Gregory. Demo-ready.

---

## Self-review checklist (run once after finishing)

Before declaring "done," verify:

- [ ] `npm run build` — no errors
- [ ] `npm test` — all green, ≥15 tests
- [ ] `npm run voice:verify-key` — OK
- [ ] `npm run voice:qa` — 35/35 pass (with policy_critical all green)
- [ ] Dashboard agent has: Jessica voice, 15 KB docs, 5 tools, phone number assigned, fallback number set
- [ ] `/demos/wolfs-tailor` loads and widget works
- [ ] `/admin/voice` loads behind admin auth, shows real data from live calls
- [ ] One recorded live test call exists with lead row + email + call_logs row

If any of these fails, do not claim done. Per `superpowers:verification-before-completion`: evidence before assertions.

---

## Notes on execution

- **Worktree:** This plan was not executed in a git worktree (the brainstorming skill didn't create one, per user's autonomy preference). All work happens directly on branch `voice-agent/wolfs-tailor-mvp`. Safe because the branch is new and isolated.
- **Out-of-scope tasks deferred to pilot week 2+**:
  - Tock API direct-booking
  - SMS follow-up (needs A2P 10DLC)
  - SIP warm transfer to host line
  - Custom voice clone
  - Nightly-cron call-log backfill
  - Full Sentry wiring
- **Where to iterate KB/prompt**: when QA fails, fix the relevant `docs/clients/wolfs-tailor/kb/*.md` or `system-prompt.md`, re-run `voice:sync-kb` + `voice:provision`, re-run `voice:qa`. Commit each tuning cycle.
- **Pilot metrics** (for week 4 wrap-up, not this plan): track `outcome` distribution on `call_logs`, escalation rate, allergy-flag hit rate, avg duration, total cost.
