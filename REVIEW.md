# AskSaul.ai — Site Review & Launch TODO

**Date:** April 2, 2026
**Reviewer:** Saul
**Build:** 50 files, 7,942 lines of TypeScript/TSX
**Status:** Functional, pre-production

---

## SITE RATING: 7.5 / 10

### Story & Copy: 8 / 10

**What's working:**
- Hero headline is strong and customer-facing ("Your competitors are automating...")
- "What Saul does on a Tuesday morning" section is the best conversion content on the site
- Mock chat demo with Meridian Properties shows real capability, not just pricing lookup
- Industry badges create instant identification for visitors
- Problem statement speaks to actual pain without assuming prior AI experience
- We/I voice is consistent (we on service pages, I on about)
- No fabricated claims, no buzzwords, no "empower/leverage/synergy"

**What needs work:**
- Chat widget still says "I build custom websites" (should be "We build"). Minor but breaks voice consistency.
- Blog articles are solid but some em dashes slipped through in blog-data.ts (the Q&A pattern lines)
- About page could use a stronger opening hook. Currently reads a bit like a LinkedIn bio.
- No testimonials section yet. Even one real quote from a client would add trust.

### Design & UI: 7 / 10

**What's working:**
- Color palette is distinctive. No purple. The obsidian/carbon/cyan system is cohesive.
- Glass-morphism cards with backdrop-blur look premium
- Typography hierarchy is clear (Syne headings, Plus Jakarta body, JetBrains mono)
- Hover states and glow effects are tasteful, not overdone
- Text readability is solid after the Slate/Dim color bumps
- Dark theme with no white flash on load

**What needs work:**
- No favicon or app icons set. The default Next.js icon shows in the browser tab.
- No Open Graph images. Sharing on LinkedIn/Twitter/Slack will show a blank preview.
- Portfolio cards could use image hover zoom or a more dynamic treatment
- The Navbar "Services" dropdown on mobile could be smoother
- No loading states on form submissions (the button says "Submitting..." but no spinner)
- The chat widget bubble could use a more polished entrance animation
- Font loading: Syne is a good fallback but Clash Display (the spec choice) would be stronger. Consider self-hosting Clash Display WOFF2 files.

### User Flow & Features: 7.5 / 10

**What's working:**
- Proposal builder flow is smooth: 5 steps, clear progress, back buttons, sessionStorage persistence
- Multi-select on Step 1 and Step 3 works correctly
- Form validation catches errors per-step before advancing
- Lead scoring logic is solid and matches the spec
- GHL webhook payloads are properly structured
- SMS compliance checkboxes with proper TCPA disclosures
- Chat widget captures leads with name/email before responses
- Sitemap and robots.txt properly configured for AI crawlers
- Structured data (JSON-LD) on every page
- 404 page is styled and branded

**What needs work:**
- FAQSchema component exists but is NOT imported on any service page. FAQ structured data is missing from Google/AI search.
- No form success toast or animation. After contact form submit, feedback is minimal.
- Chat widget responses include markdown links but they render as text, not clickable links on some paths.
- Blog posts have no "Related posts" section at the bottom (spec requirement).
- No RSS feed generated (spec requirement).
- Double-submit prevention exists on proposal builder but not on contact form.
- No skip-navigation link for accessibility (spec requirement).

---

## LAUNCH TODO

### 🔴 Blockers (Must have before deploy)

- [ ] **GHL_WEBHOOK_URL** — Get the webhook URL from GoHighLevel and set as environment variable in Netlify
- [ ] **Favicon + App Icons** — Create and add /app/icon.tsx or static favicon.ico, apple-touch-icon.png
- [ ] **Open Graph Images** — Generate branded OG images for homepage and key pages. Critical for LinkedIn/Twitter link previews.
- [ ] **Privacy Policy page** (/privacy) — Required by SMS compliance checkboxes. Must cover data collection, SMS terms, cookie usage.
- [ ] **Terms of Service page** (/terms) — Required by SMS compliance checkboxes.
- [ ] **FAQSchema integration** — Import FAQSchema component on /ai-automation, /web-development, /marketing-engine pages. This is free SEO.
- [ ] **Fix chat widget "I build" voice** — Change to "We build" for consistency
- [ ] **Fix em dashes in blog-data.ts** — Replace all instances with commas or restructured sentences
- [ ] **Domain setup** — Point asksaul.ai DNS to Netlify
- [ ] **SSL certificate** — Verify after domain setup (Netlify auto-provisions)
- [ ] **Environment variables in Netlify** — GHL_WEBHOOK_URL, NOTIFICATION_EMAIL, SITE_URL

### 🟡 Should Have (First week post-launch)

- [ ] **Skip navigation link** — Add to layout.tsx for accessibility
- [ ] **Contact form double-submit prevention** — Add submitting state like proposal builder
- [ ] **Blog "Related posts"** — Add 2-3 related posts at bottom of each blog post
- [ ] **RSS feed** — Add /blog/feed.xml generation
- [ ] **Loading spinner on form submit** — Better UX than just "Submitting..." text
- [ ] **Exotiq.rent screenshot** — Capture and add to portfolio when ready
- [ ] **Calendly/GHL calendar embed** — Replace the mailto fallback on contact page
- [ ] **Google Analytics / Plausible** — Add analytics tracking
- [ ] **Test webhook payloads** — Use webhook.site to verify GHL payload format before connecting real GHL
- [ ] **404 test** — Verify /nonexistent-page renders the styled 404

### 🟢 Nice to Have (Post-launch polish)

- [ ] **Testimonials section** — Add when you have real client quotes
- [ ] **Clash Display font** — Self-host WOFF2 files to replace Syne
- [ ] **Blog post OG images** — Auto-generate per post
- [ ] **Image optimization** — Run portfolio screenshots through compression
- [ ] **Performance audit** — Run Lighthouse, target 90+ scores
- [ ] **Chat widget Phase 2** — Connect to live OpenClaw-powered Saul instance
- [ ] **Voice agent teaser** — Add email capture for ElevenLabs early access
- [ ] **A/B test hero copy** — Test alternative headlines
- [ ] **Client intake CRM** — Auto-create GHL contacts from proposal submissions

---

## GHL INTEGRATION GUIDE

### Setup Steps:
1. Create a GHL sub-account for AskSaul.ai
2. Create an Inbound Webhook workflow trigger in GHL
3. Copy the webhook URL
4. Set `GHL_WEBHOOK_URL` in Netlify environment variables
5. Test with a proposal builder submission
6. Verify the contact appears in GHL with correct tags

### Webhook Payload Fields GHL Receives:
- `source` — "asksaul-proposal-builder" or "asksaul-contact-form" or "asksaul-chat-widget"
- `contact.firstName`, `contact.lastName`, `contact.email`, `contact.phone`
- `business.name`, `business.industry`, `business.teamSize`
- `services_requested` — array of service IDs
- `timeline`, `budget`, `notes`
- `tags` — array including value tier ("high-value", "mid-value", "starter")
- `estimated_value` — dollar amount from lead scoring

### GHL Pipeline Mapping:
- Tag "high-value" ($10K+) → Priority pipeline
- Tag "mid-value" ($3K-$10K) → Standard pipeline  
- Tag "starter" (under $3K) → Starter pipeline
- Tag "proposal-builder" → Came through proposal flow
- Tag "contact-form" → Came through simple contact
- Tag "chat-widget" → Came through chat widget

---

## CHATBOT KNOWLEDGE BASE

### For Phase 1 (Current Rule-Based Chat Widget):
The chat widget is already built with pre-written responses for 4 intents:
- "I need a website" → Routes to /build-your-proposal
- "Tell me about AI setups" → Routes to /ai-automation
- "What do you charge?" → Gives price ranges, routes to /build-your-proposal
- "Just browsing" → Routes to /portfolio

### For Phase 2 (Live OpenClaw-Powered Saul):

The chat widget UI has a clean interface contract with a `CHAT_MODE` environment variable ready for "static" (current) vs "live" (Phase 2). The API endpoint is /api/chat.

**Knowledge Base Content for Live Saul:**

```markdown
# AskSaul.ai Chatbot Knowledge Base

## Identity
- Name: Saul
- Role: AI assistant for AskSaul.ai, helping visitors understand services and start projects
- Tone: Direct, helpful, slightly witty. Never pushy. Never generic.
- Goal: Help visitors figure out what they need and route them to the proposal builder

## Services & Pricing

### AI & Automation (OpenClaw Deployments)
- Starter (solopreneurs): $500 one-time setup, ~$20-80/mo API costs
- Team (2-10 people): $1,000 one-time setup, ~$50-200/mo API costs
- Pro (customer-facing): $2,500 one-time setup, ~$100-500/mo API costs
- Developer (technical teams): $1,200 one-time setup, ~$50-300/mo API costs
- Add-ons: additional channel $150, custom skill $350, managed care $200-500/mo, quarterly audit $250, VPS $75/mo+hosting

### Websites & Apps
- Custom business website: $5,000-$15,000
- Web application: scoped per project
- E-commerce: scoped per project
- Redesign/migration: from $3,500
- SEO + maintenance retainer: $500-$1,500/mo

### Marketing Engine (GoHighLevel White-Label)
- Setup: $3,500 one-time
- Monthly: $1,000/mo all-in
- Includes: CRM, email+SMS sequences, funnels, pipeline management, scheduling, review management, social posting, call tracking

## Key Differentiators
- Self-hosted AI (your data stays yours)
- Security-hardened (zero critical findings before handoff)
- Done-for-you (not DIY tools)
- No monthly subscription to AskSaul (you pay API costs directly)
- Built by Gregory Ringler, solo founder in Denver, CO

## Common Questions

Q: How long does setup take?
A: AI Starter: 2-4 hours. Team: 4-8 hours. Pro: 8-16 hours. Websites: 4-8 weeks. Marketing Engine: 2-4 weeks.

Q: What are API costs?
A: You pay the AI model provider (Anthropic, OpenAI) directly based on usage. Most businesses spend $20-200/mo. We do not mark this up.

Q: Can I try before I buy?
A: Build a proposal (free, takes 3 minutes) and we will scope exactly what you need with a fixed price. No commitment until you approve.

Q: Do I own the code/data?
A: Yes. Full ownership. No lock-in. You can move to another provider at any time.

Q: What if something breaks?
A: Every tier includes post-setup support. Managed care add-ons available for ongoing maintenance.

## Routing Rules
- If visitor asks about pricing → give ranges, suggest proposal builder
- If visitor asks about a specific service → give brief info, link to service page
- If visitor wants to start a project → route to /build-your-proposal
- If visitor wants to talk to a human → route to /contact or suggest booking a call
- If visitor asks technical questions about OpenClaw → answer from knowledge base, link to blog posts
- Never make up capabilities or pricing not listed above
- Never promise timelines without saying "typically" or "most projects"
```

## Conversational AI Setup (Phase 2)

### Architecture:
1. Replace the rule-based response logic in ChatWidget.tsx with API calls to /api/chat
2. Update /api/chat/route.ts to proxy to an OpenClaw gateway instance
3. The OpenClaw instance should have:
   - The knowledge base above loaded as SOUL.md/workspace content
   - Messaging-only tool profile (no file access, no exec)
   - Rate limiting (max 10 messages per session before requiring email)
   - Session isolation per visitor

### Environment Variables for Phase 2:
```
CHAT_MODE=live
OPENCLAW_CHAT_GATEWAY_URL=https://your-openclaw-instance/api/chat
OPENCLAW_CHAT_AUTH_TOKEN=your-gateway-auth-token
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deploy:
- [ ] npm run build passes with 0 errors
- [ ] All 21 routes render correctly
- [ ] Proposal builder: complete full flow for each service type
- [ ] Contact form: submit with valid data
- [ ] Chat widget: opens on all pages, quick replies work
- [ ] Mobile nav works (hamburger open/close)
- [ ] All internal links navigate correctly
- [ ] All external links open in new tabs
- [ ] No console errors on any page
- [ ] No "lorem ipsum" or placeholder text anywhere
- [ ] All prices match the spec
- [ ] "Gregory" never "Greg" anywhere
- [ ] Copyright 2026 in footer

### Deploy to Netlify:
1. Push to GitHub (create repo if needed)
2. Connect repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add `@netlify/plugin-nextjs` plugin
6. Set environment variables
7. Deploy
8. Configure custom domain (asksaul.ai)
9. Verify SSL
10. Test all forms in production
11. Verify webhook payloads reach GHL

### Post-Deploy:
- [ ] Test every page on mobile (375px)
- [ ] Test every page on desktop (1440px)
- [ ] Share a link on LinkedIn and verify OG image renders
- [ ] Submit sitemap to Google Search Console
- [ ] Verify structured data with Google Rich Results Test
- [ ] Set up GHL pipeline automation based on lead tags
