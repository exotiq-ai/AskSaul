# AskSaul.ai — Autonomous Website Build Prompt
## Complete Specification for Production Deployment

**Version:** 1.0
**Date:** April 2, 2026
**Owner:** Gregory Ringler
**Agent:** Saul (OpenClaw)
**Target:** AskSaul.ai — fully autonomous build, test, and deploy

---

## MISSION

Build AskSaul.ai from zero to production. This is a lead-generation machine for Gregory Ringler's AI services, web development, and automation consultancy. The site must convert visitors into qualified leads, demonstrate immediate authority, and serve as both an inbound magnet (SEO/AI search optimized) and an outbound credibility checkpoint (landing page for cold outreach).

You are building this autonomously. Make decisions confidently when this spec gives you room. When it doesn't, follow it exactly. The two final passes (UI/UX and E2E testing) are non-negotiable.

---

## TABLE OF CONTENTS

1. Brand Identity & Design System
2. Technical Architecture
3. Site Structure & Pages
4. The Proposal Builder (Lead Capture Engine)
5. Chatbot Integration
6. SEO & AI Search Optimization
7. Content Strategy & Copy Direction
8. GHL Integration (Webhook Architecture)
9. Performance & Accessibility Requirements
10. Deployment Pipeline
11. Final Pass 1: UI/UX Design Audit
12. Final Pass 2: End-to-End Testing
13. Reference Documents & Assets

---

## 1. BRAND IDENTITY & DESIGN SYSTEM

### Brand Name
**AskSaul.ai**

### Brand Personality
Saul is the AI that powers everything we build. Confident, direct, slightly irreverent but never cheesy. Think: the advisor who has seen every business problem and knows how to fix it. The tone of someone who respects your time too much to bullshit you.

Cultural reference: "Better Call Saul" energy. The guy who solves problems others can't. Lean into it subtly, never explicitly.

### Color Palette

**DO NOT USE PURPLE.** No purple gradients, no violet accents, no lavender tints. This site must not look like a 2025 vibe-coded AI template.

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Background Primary | Obsidian | #0A0A0F | Main page background |
| Background Secondary | Carbon | #12121A | Cards, sections, elevated surfaces |
| Background Tertiary | Graphite | #1A1A24 | Input fields, code blocks, subtle depth |
| Accent Primary | Signal Cyan | #00D4AA | CTAs, links, active states, key highlights |
| Accent Secondary | Ice Blue | #4AC6E8 | Secondary buttons, hover states, data points |
| Accent Glow | Cyan Glow | rgba(0, 212, 170, 0.15) | Subtle glow effects behind accent elements |
| Text Primary | Cloud | #E8E8ED | Body text, primary content |
| Text Secondary | Slate | #8888A0 | Captions, metadata, secondary info |
| Text Muted | Dim | #555566 | Placeholder text, disabled states |
| Border | Wire | #2A2A38 | Card borders, dividers, input borders |
| Success | Green | #22C55E | Success states, positive indicators |
| Warning | Amber | #F59E0B | Caution, attention needed |
| Error | Red | #EF4444 | Error states, critical alerts |

### Typography

Choose distinctive, high-quality typefaces. Do NOT use Inter, Roboto, Arial, Space Grotesk, or system defaults.

**Recommendations (Saul, choose what renders best):**
- Display / Headings: Consider **Clash Display**, **Satoshi**, **General Sans**, **Cabinet Grotesk**, or **Switzer**. Something geometric with personality.
- Body: Consider **Plus Jakarta Sans**, **DM Sans**, **Outfit**, or **Manrope**. Clean, modern, excellent readability at small sizes on dark backgrounds.
- Monospace (for code/technical elements): **JetBrains Mono** or **Fira Code**

**Type Scale:**
| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| Hero headline | 56-72px (clamp responsive) | Bold/Black | -0.02em |
| Section headline | 36-48px | Bold | -0.015em |
| Subsection headline | 24-32px | Semibold | -0.01em |
| Body large | 18-20px | Regular | 0 |
| Body | 16px | Regular | 0 |
| Small / Caption | 14px | Regular/Medium | 0.01em |
| Overline / Label | 12-13px | Semibold | 0.08em (tracked out, uppercase) |

### Design Language

**Aesthetic direction:** Precision engineering meets midnight command center. Not flashy, not minimal. Controlled density with intentional negative space. The site should feel like the cockpit of something powerful.

**Key design elements:**
- Subtle grid/dot patterns or noise textures on backgrounds for depth (very low opacity, 2-5%)
- Glass-morphism cards with subtle backdrop-blur and translucent borders
- Accent glow effects on hover (not neon, not overdone, think subtle luminescence)
- Smooth scroll-triggered animations (fade up, stagger reveals). Use Framer Motion or CSS animations. Be purposeful, not decorative.
- Border-radius: 8-12px on cards, 6-8px on buttons, 4px on small elements
- Consistent 8px spacing grid

**What to avoid:**
- Generic hero sections with centered text and a gradient blob
- Purple anything
- Floating 3D objects or abstract mesh gradients (this is not a crypto site)
- Overly animated page transitions that slow navigation
- Stock illustrations or generic SVG decorations
- Any pattern that screams "AI startup template 2025"

### Logo

Generate a clean text-based wordmark: "AskSaul" in the display typeface. Consider a subtle design treatment on the "S" (a slight glow, a different weight, or the accent color). Keep it simple enough to work at 24px height in the nav. If you can create a compelling logomark (icon), do it. Otherwise, the wordmark alone is fine. Do not block the build on logo design.

---

## 2. TECHNICAL ARCHITECTURE

### Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS 4+
- **Language:** TypeScript
- **Deployment:** Netlify
- **Animations:** Framer Motion (or CSS-only if simpler for the use case)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Font Loading:** next/font or self-hosted WOFF2

If you identify a technical reason to deviate from this stack (e.g., a library conflict, a better animation approach), make the call and document why.

### Project Structure
```
asksaul-site/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Homepage
│   ├── services/
│   │   └── page.tsx            # Services overview
│   ├── ai-automation/
│   │   └── page.tsx            # AI & OpenClaw services deep dive
│   ├── web-development/
│   │   └── page.tsx            # Web dev services deep dive
│   ├── marketing-engine/
│   │   └── page.tsx            # GHL marketing engine services
│   ├── portfolio/
│   │   └── page.tsx            # Portfolio & case studies
│   ├── about/
│   │   └── page.tsx            # About Gregory + Saul
│   ├── blog/
│   │   ├── page.tsx            # Blog index
│   │   └── [slug]/
│   │       └── page.tsx        # Individual blog posts
│   ├── build-your-proposal/
│   │   └── page.tsx            # Interactive proposal builder
│   ├── contact/
│   │   └── page.tsx            # Contact + booking
│   └── api/
│       ├── proposal/
│       │   └── route.ts        # Proposal builder submission handler
│       ├── contact/
│       │   └── route.ts        # Contact form handler
│       └── chat/
│           └── route.ts        # Chat widget handler (future)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── ProblemStatement.tsx
│   │   ├── ServiceLanes.tsx
│   │   ├── SaulDemo.tsx
│   │   ├── PortfolioPreview.tsx
│   │   ├── SocialProof.tsx
│   │   └── FinalCTA.tsx
│   ├── proposal-builder/
│   │   ├── StepIndicator.tsx
│   │   ├── ServiceSelector.tsx
│   │   ├── QuestionFlow.tsx
│   │   ├── SummaryReview.tsx
│   │   └── SubmissionConfirmation.tsx
│   ├── chat/
│   │   └── ChatWidget.tsx      # Persistent chat widget
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Accordion.tsx
│   │   └── AnimatedSection.tsx
│   └── seo/
│       ├── StructuredData.tsx
│       └── FAQSchema.tsx
├── lib/
│   ├── constants.ts            # Brand colors, pricing data, service catalog
│   ├── ghl.ts                  # GHL webhook utilities
│   ├── validation.ts           # Zod schemas
│   └── analytics.ts            # Event tracking utilities
├── content/
│   └── blog/                   # MDX blog posts (or CMS integration)
├── public/
│   ├── images/
│   │   └── portfolio/          # Portfolio screenshots
│   ├── fonts/                  # Self-hosted fonts if needed
│   └── og/                     # Open Graph images
├── tailwind.config.ts
├── next.config.ts
├── netlify.toml
└── package.json
```

### Netlify Configuration
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

---

## 3. SITE STRUCTURE & PAGES

### 3.1 Homepage

The homepage is the highest-stakes page. It must accomplish five things in order:

**1. Immediate hook (above the fold, 0-3 seconds)**
Hero section. Headline that speaks to the pain, not the solution. Something in the territory of: "Your competitors are automating. You're still doing it manually." or "The AI your business actually needs." Subheadline clarifies what AskSaul does. Two CTAs: "Build Your Proposal" (primary) and "Talk to Saul" (secondary, opens chat).

Do NOT write generic copy like "Empowering businesses with AI solutions." Write like you're talking to a business owner who is skeptical but curious.

**2. Problem statement (the scroll trigger)**
Short, punchy section. Three pain points SMB owners feel:
- "You've seen the AI demos. You've tried the chatbots. Nothing actually works for YOUR business."
- "SaaS tools charge per seat. Freelancers disappear. Agencies charge $20K and take 6 months."
- "Meanwhile your competitor just automated their entire follow-up sequence and you're still copy-pasting."

**3. Service lanes (the Path C routing)**
Three clear lanes with visual cards that route visitors to what they need:

**Lane 1: AI & Automation**
OpenClaw setups, AI chatbots, voice agents, workflow automation, CRM intelligence
"Make Saul work for your business"
CTA: Learn More -> /ai-automation

**Lane 2: Websites & Apps**
Custom websites, mobile-first apps, SEO optimization, redesigns
"A site that actually converts"
CTA: Learn More -> /web-development

**Lane 3: Marketing Engine**
Full GHL white-label, lead gen, email/SMS sequences, CRM, pipeline automation
"Your entire marketing stack, handled"
CTA: Learn More -> /marketing-engine

**4. Social proof / Authority**
Portfolio preview (3-4 best projects with screenshots: Exotiq.ai, DriveExotiq.com, Polaris Estate, Lou's Heating & Cooling). Each with a brief description of what was built and a link to the live site.

Metrics bar: "1,120+ commits shipped" / "5 production platforms built" / "Solo founder, zero outsourced dev" / "8 months: idea to full platform"

If testimonials exist, include them. If not, the portfolio speaks for itself. Do not fabricate testimonials.

**5. Final CTA section**
"Ready to stop duct-taping your tech together?" with "Build Your Proposal" button and a "Book a Call" link.

### 3.2 AI & Automation Page (/ai-automation)

Deep dive into AI services. Structure:

**OpenClaw Setup Service (AskSaul Deployments)**
Explain what OpenClaw is in plain language for a non-technical business owner. Position AskSaul as the done-for-you service.

Service tiers displayed as cards:
| Tier | Name | For | Setup Fee | Ongoing |
|------|------|-----|-----------|---------|
| Starter | Saul Classic | Solopreneurs, individual professionals | $500 | API costs only |
| Team | AskSaul Team | Small teams (2-10 people) | $1,000 | API costs only |
| Pro | AskSaul Pro | Businesses with customer-facing needs | $2,500 | API costs only |
| Developer | AskSaul Dev | Developers, technical teams | $1,200 | API costs only |

Each card lists what's included (pulled from the business proposal tiers). Add a "Compare tiers" expandable section.

**Add-ons displayed below tiers:**
- Additional messaging channel: $150
- Custom skill development: $350/skill
- Monthly managed care: $200-$500/mo
- Quarterly security audit + optimization: $250/quarter
- VPS setup & management: $75/mo + hosting costs

**Security differentiator section.** This is the key selling point. Headline: "Security isn't an add-on. It's the baseline." Explain in plain language:
- Every deployment passes a security audit with zero critical findings before handoff
- Access controls, credential isolation, tool safety, network security all configured
- Honest disclosures: "We'll tell you what AI can and can't do. No hype."
- Brief comparison: "$50 Fiverr install vs. AskSaul deployment" showing what the cheap option skips

**AI Chatbot & Voice Agent section:**
- AI chatbots embedded on websites (not OpenClaw, standalone): $3,500 setup + $500/mo
- Conversational voice agents (ElevenLabs): Phase 2, "Coming Soon" with email capture
- Custom AI model training for business use cases

**Workflow Automation section:**
- CRM automation, data enrichment, lead routing
- Back-office process automation
- $2,500-$7,500 per project

CTA: "Build Your Proposal" button at the bottom of every section.

### 3.3 Web Development Page (/web-development)

**Services:**
- Custom business websites (mobile-first, SEO-optimized): $5,000-$15,000
- Web application development: scoped per project
- E-commerce builds: scoped per project
- Website maintenance & SEO retainer: $500-$1,500/mo
- Redesigns and migrations

**Portfolio showcase:** Full portfolio display. For each project:
- Screenshot (high quality, multiple views: desktop + mobile)
- What was built (scope)
- Technologies used
- Link to live site
- Brief results or notable features

**Projects to showcase:**
1. **Exotiq.ai** — Marketing site and brand hub. Gulf livery aesthetic, FleetCopilot demo, blog with AI-optimized content.
2. **DriveExotiq.com** — Consumer rental marketplace. Conversion-optimized, AI-powered pricing, search + booking flow.
3. **Exotiq.rent** — Operator portal and fleet management dashboard. Complex UX, vehicle detail pages, booking system.
4. **Polaris Estate** — AI-powered luxury real estate platform. Premium design for ultra-high-net-worth clients.
5. **Lou's Heating & Cooling** — Full business website. SEO-optimized, service pages, review integration, bilingual support, FAQ, service area mapping.

**Tech stack showcase:** Visual display of technologies Gregory works with: React, Next.js, Tailwind, Node.js, Supabase, Figma, Vercel, Netlify, WordPress, Shopify, and others from his skills profile.

CTA: "Build Your Proposal"

### 3.4 Marketing Engine Page (/marketing-engine)

Position this as "Your entire marketing department in a box."

**What's included in the GHL white-label setup ($3,500 setup + $1,000/mo):**
- Branded CRM (your logo, your domain)
- Email + SMS marketing sequences
- Automated lead capture funnels
- Pipeline management
- Appointment scheduling
- Review management and reputation monitoring
- Social media posting
- Reporting dashboard
- Website chat widget
- Call tracking

**Who this is for:** Service businesses that are spending $2K-$5K/mo across 4-5 different tools and still have leads falling through the cracks. Consolidate everything.

**Comparison section:** "What you're paying for 5 tools vs. what you could pay for one" (visual comparison showing typical SaaS stack costs vs. AskSaul marketing engine pricing)

CTA: "Build Your Proposal" + "Book a Strategy Call"

### 3.5 About Page (/about)

Two stories: Gregory and Saul.

**Gregory's story.** Written in first person, operator voice (from the Exotiq content SOP). Hit these narrative beats:
- Non-technical founder who taught himself to code with AI tools
- Built a full fleet management platform solo (1,120+ commits, 63 active dev days)
- Previous experience in hospitality, customer experience, brand development
- Deep understanding of SMB pain because he lived it (the Turo experience)
- Based in Denver, Colorado

Do NOT make this a generic "passionate about technology" bio. Make it specific, honest, and memorable. Reference actual accomplishments with real numbers.

**Saul's story.** Brief, personality-forward section introducing Saul as the AI that powers AskSaul. "Saul started as Gregory's personal AI assistant built on OpenClaw. He got so good at it that now he works for other businesses too." Keep it light, keep it real.

**Skills & capabilities.** Pull from Gregory's technical skills profile. Display as a visual grid, not a boring list.

**Contact info & availability.** Currently accepting clients. Link to proposal builder and booking.

### 3.6 Blog (/blog)

Blog index with card layout. Each card shows: title, category tag, read time, date, excerpt.

**Launch with 3-5 seed articles (write the full content):**

1. "What Is OpenClaw and Why Should Your Business Care?" — Explainer for non-technical readers. What it does, why self-hosted matters, what a deployment looks like.

2. "The $50 AI Setup vs. The $2,500 AI Setup: What You're Actually Getting" — Direct comparison of Fiverr-tier installs vs. AskSaul deployments. Security, documentation, personality tuning, ongoing support. This is a high-intent SEO play.

3. "5 AI Automations That Pay for Themselves in 30 Days" — Practical, ROI-focused. Lead follow-up automation, review request sequences, appointment reminders, FAQ chatbots, data enrichment. Each with estimated time savings and cost.

4. "Why Your Website Isn't Getting Leads (And What to Do About It)" — SEO, mobile optimization, conversion architecture, clear CTAs. Positions Gregory as the expert.

5. "AI Search Optimization: How to Make Your Business Visible to ChatGPT and Claude" — Forward-looking content about structured data, FAQ schemas, and conversational content patterns. Positions AskSaul as ahead of the curve.

**Blog technical implementation:**
- MDX files in /content/blog/ with frontmatter (title, date, category, excerpt, readTime, author)
- Or: headless CMS integration if Saul prefers (Contentlayer, Sanity, etc.)
- RSS feed generation
- Open Graph images auto-generated per post
- Table of contents for long posts
- "Related posts" at the bottom

### 3.7 Build Your Proposal Page (/build-your-proposal)

**This is the most important conversion page. See Section 4 for full specification.**

### 3.8 Contact Page (/contact)

Simple, clean. Two paths:
1. **Quick contact form:** Name, email, phone (optional), message, "How did you hear about us?" dropdown. Submits to GHL webhook.
2. **Book a call:** Embedded Calendly or GHL calendar widget. If calendar integration isn't ready at launch, use a "Book a Call" button that opens an email with a pre-filled subject line.

Include: Gregory's email (1.gregory.ringler@gmail.com), phone (970.343.9634), Denver CO location, and availability hours.

---

## 4. THE PROPOSAL BUILDER (Lead Capture Engine)

This is the crown jewel of the conversion architecture. It must feel effortless to use, smart, and personalized.

### User Flow

**Step 1: What do you need?**
Multi-select cards (user can pick more than one):
- AI Assistant / Chatbot
- Website Build or Redesign
- Marketing Automation / CRM
- Workflow Automation
- Voice Agent
- Custom App / Platform
- Not sure yet, help me figure it out

Each card has an icon, a short description, and a subtle animation on select.

**Step 2: Tell us about your business**
- Business name (text input)
- Industry (dropdown with common options + "Other" with text field)
- Team size (1 / 2-5 / 6-20 / 20+)
- Current monthly revenue range (optional, helps with scoping): Under $10K / $10K-$50K / $50K-$250K / $250K+

**Step 3: Dynamic questions based on Step 1 selections**

If "AI Assistant / Chatbot" selected:
- How many people will use the AI? (Just me / Small team / Customers)
- What messaging platform does your team use? (Telegram / WhatsApp / Discord / Slack / Website chat / Not sure)
- What should the AI help with? (Customer support / Sales / Internal productivity / Research / All of the above)

If "Website Build or Redesign" selected:
- Do you have an existing website? (Yes, needs a redesign / Yes, but starting fresh / No, building from scratch)
- How many pages do you need? (1-5 / 5-10 / 10-20 / 20+)
- Do you need e-commerce? (Yes / No / Maybe later)

If "Marketing Automation / CRM" selected:
- What tools are you currently using? (Multi-select: Mailchimp, HubSpot, ActiveCampaign, GoHighLevel, Spreadsheets, Nothing, Other)
- What's your biggest marketing pain? (Lead capture / Follow-up / Email sequences / Review management / All of the above)

If "Workflow Automation" selected:
- What processes take the most time? (Open text, 2-3 sentences)
- What tools does your team use daily? (Open text)

If "Not sure yet" selected:
- What's the biggest headache in your business right now? (Open text)
- What would you automate if you could? (Open text)

**Step 4: Contact & Preferences**
- Your name (required)
- Email (required)
- Phone (optional)
- Preferred contact method (Email / Phone / Text)
- How soon do you need this? (ASAP / 1-2 weeks / 1-2 months / Just exploring)
- Budget range (optional): Under $2K / $2K-$5K / $5K-$10K / $10K-$25K / $25K+
- Anything else Saul should know? (Open text)

**Step 5: Confirmation**
Headline: "Saul is reviewing your project."
Body: "We'll have a custom proposal in your inbox within 24 hours. Can't wait? Book a call now."
Two CTAs: "Book a Call Now" (primary) and "Back to Home" (secondary)

### Technical Requirements
- Multi-step form with animated transitions between steps
- Progress indicator (step dots or progress bar) at the top
- Form state persists if user navigates away and returns (sessionStorage)
- Validation on each step before advancing (Zod schemas)
- "Back" button on every step except Step 1
- Mobile-optimized: full-width steps, large touch targets, no tiny dropdowns
- Submit sends full payload to GHL webhook endpoint (see Section 8)
- Also sends a formatted email notification to Gregory as backup
- Analytics event on each step completion and final submission

### Design
This page should feel premium and intelligent. Not a generic form. Consider:
- Large, tappable cards for multi-select options (not checkboxes)
- Smooth step transitions (slide or fade)
- A subtle Saul "presence" indicator (small avatar or icon) that persists through the flow, as if Saul is guiding you
- Summary of selections visible on the review step before submission
- Confetti or subtle celebration animation on submission (tasteful, not childish)

---

## 5. CHATBOT INTEGRATION

### Phase 1 (Launch)
Build a persistent chat widget that appears on every page. Bottom-right corner, collapsible.

**For launch, implement as a smart lead capture chat:**
- Opens with a Saul-branded greeting: "Hey, I'm Saul. What can I help you figure out?" (or similar, keep it natural)
- Offers quick-reply buttons: "I need a website" / "Tell me about AI setups" / "What do you charge?" / "Just browsing"
- Based on selection, provides a brief pre-written response and routes to the appropriate page or the proposal builder
- Captures name + email before responding to detailed questions
- All conversations submit to GHL webhook as leads with chat transcript attached

This is a rule-based chat, not an LLM-powered bot. It demonstrates the concept and captures leads. The LLM-powered version is Phase 2.

**Design:**
- Bubble icon: Saul-branded, uses accent color, subtle pulse animation when closed
- Chat window: dark theme matching site, glass-morphism card
- Messages: clean bubbles, Saul messages on left, user on right
- Quick-reply buttons: styled as pills with accent border
- Input field at bottom with send button
- "Powered by AskSaul" watermark at bottom of chat window

### Phase 2 (Post-Launch)
Replace the rule-based chat with a live OpenClaw-powered Saul instance (via Voiceflow, Botpress, or direct OpenClaw gateway connection). The UI stays the same, only the backend changes.

**Prepare for Phase 2 by:**
- Building the chat UI as a standalone component with a clean interface contract
- Abstracting the response logic into a service layer that can be swapped
- Including a `CHAT_MODE` environment variable: "static" (Phase 1) or "live" (Phase 2)
- Documenting the API contract the live chat backend will need to implement

### Phase 3 (Future)
Conversational voice agent (ElevenLabs). Display a "Voice Agent Coming Soon" teaser on the AI services page with an email capture for early access.

---

## 6. SEO & AI SEARCH OPTIMIZATION

### Technical SEO
- Semantic HTML throughout (proper heading hierarchy, landmark elements)
- All pages have unique, descriptive `<title>` tags and `<meta name="description">` tags
- Open Graph and Twitter Card meta tags on every page
- Canonical URLs set
- XML sitemap generated automatically (next-sitemap or built-in)
- robots.txt configured correctly
- Image alt text on every image (descriptive, keyword-relevant)
- Lazy loading on below-fold images
- Core Web Vitals optimized: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Structured Data (JSON-LD)
Implement on every relevant page:
- **Organization schema** (AskSaul.ai, Gregory Ringler as founder, Denver CO)
- **LocalBusiness schema** (service area, contact info)
- **Service schema** on each service page (name, description, price range)
- **FAQ schema** on pages with FAQ sections (this is critical for AI search visibility)
- **BlogPosting schema** on all blog posts
- **BreadcrumbList schema** on all pages
- **Person schema** on the about page (Gregory Ringler)

### AI Search Optimization
This is a forward-looking advantage. Structure content so it gets picked up by ChatGPT, Claude, Perplexity, and other AI search engines:

- Write FAQ sections in natural conversational Q&A format on every service page
- Use clear, declarative sentences that answer common questions directly (AI models extract these)
- Include "What is [service]?" and "How much does [service] cost?" patterns
- Blog posts should answer specific questions in the first paragraph (featured snippet pattern)
- Use schema markup aggressively (FAQ, HowTo, Service, Product)
- Include a comprehensive FAQ page that covers the 20+ most common questions about each service

### Target Keywords (seed list for content and on-page optimization)
- openclaw setup service
- openclaw deployment managed
- ai chatbot for small business
- ai assistant setup
- business workflow automation
- custom website development denver
- seo optimized website build
- gohighlevel setup service
- gohighlevel white label agency
- ai voice agent for business
- openclaw security hardening
- smb ai automation

---

## 7. CONTENT STRATEGY & COPY DIRECTION

### Voice Rules (adapted from Exotiq Newsletter SOP)

**Primary voice for the site: Founder-direct.**
First person when Gregory is speaking (about page, blog posts). Third person for service descriptions and general site copy. Always confident, specific, honest. Never vague. Never hype-y.

**Punctuation:**
- No em dashes. Use commas, periods, or restructure the sentence.
- Contractions are fine (this is conversational, not corporate).
- No fabricated statistics. Use real numbers from Gregory's work or directional language.

**Gregory is always Gregory.** Never "Greg." In all copy, all pages, all metadata.

**Words/phrases to AVOID:**
- "Empower" / "Leverage" / "Synergy" / "Cutting-edge"
- "We're passionate about..."
- "One-stop shop"
- "Best-in-class" (unless proving it)
- "Seamless" (unless describing a specific technical integration)
- "Your trusted partner"
- Any AI buzzword without substance behind it

**Words/phrases that FIT the brand:**
- "Built, not bought"
- "Your data stays yours"
- "Done for you"
- "Designed to convert"
- "Security-hardened"
- "We ship, you grow"

### Content for Service Pages
Each service page follows this structure:
1. Pain-aware headline (what's broken)
2. Solution summary (what we do about it, 2-3 sentences)
3. Service details (what's included, pricing)
4. Differentiator (why AskSaul, not the alternative)
5. FAQ section (3-5 natural language Q&As)
6. CTA (Build Your Proposal)

---

## 8. GHL INTEGRATION (Webhook Architecture)

### Architecture
The site sends lead data to GHL via webhook POST requests. GHL processes leads, applies tags, and drops them into the appropriate pipeline.

### Webhook Endpoints
Create a `/api/proposal/route.ts` and `/api/contact/route.ts` that:
1. Validate the incoming form data (Zod)
2. Format the payload for GHL
3. POST to the GHL webhook URL (stored in environment variable `GHL_WEBHOOK_URL`)
4. Send a backup email notification to Gregory (via a secondary webhook or simple email API)
5. Return success/error response to the frontend

### GHL Payload Structure

**For proposal builder submissions:**
```json
{
  "source": "asksaul-proposal-builder",
  "timestamp": "ISO-8601",
  "contact": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "preferredContact": "email|phone|text"
  },
  "business": {
    "name": "",
    "industry": "",
    "teamSize": "",
    "revenueRange": ""
  },
  "services_requested": ["ai-assistant", "website", "marketing", "automation", "voice-agent", "custom-app"],
  "service_details": {
    // Dynamic fields based on which services were selected
  },
  "timeline": "asap|1-2-weeks|1-2-months|exploring",
  "budget": "under-2k|2k-5k|5k-10k|10k-25k|25k-plus",
  "notes": "",
  "tags": ["proposal-builder", "website-lead"],
  "estimated_value": 0  // Calculated based on services + budget selection
}
```

**For contact form submissions:**
```json
{
  "source": "asksaul-contact-form",
  "timestamp": "ISO-8601",
  "contact": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "message": "",
    "referralSource": ""
  },
  "tags": ["contact-form", "website-lead"]
}
```

**For chat widget captures:**
```json
{
  "source": "asksaul-chat-widget",
  "timestamp": "ISO-8601",
  "contact": {
    "name": "",
    "email": ""
  },
  "chatTranscript": [],
  "initialIntent": "website|ai-setup|pricing|browsing",
  "tags": ["chat-widget", "website-lead"]
}
```

### Environment Variables
```env
GHL_WEBHOOK_URL=           # Primary GHL inbound webhook URL
GHL_WEBHOOK_SECRET=        # Webhook signing secret (if applicable)
NOTIFICATION_EMAIL=1.gregory.ringler@gmail.com
SITE_URL=https://asksaul.ai
```

### Lead Scoring Logic (for estimated_value calculation)
Built into the API route, not visible to the user:
- AI Assistant Starter signals: solopreneur + just me + 1 platform = ~$500
- AI Assistant Team signals: small team + multiple users = ~$1,000
- AI Assistant Pro signals: customer-facing + multiple channels = ~$2,500
- Website: 1-5 pages no ecommerce = ~$5,000 / 5-10 pages = ~$8,000 / 10+ or ecommerce = ~$12,000
- Marketing Engine = ~$3,500 setup + estimated $12K annual
- Workflow Automation = ~$5,000
- Multiple services: sum individual estimates
- Budget selection overrides if it's higher than the calculated estimate

Tag leads in GHL based on estimated value: "high-value" ($10K+), "mid-value" ($3K-$10K), "starter" (under $3K)

---

## 9. PERFORMANCE & ACCESSIBILITY REQUIREMENTS

### Performance Targets
- Lighthouse Performance score: 90+
- Lighthouse Accessibility score: 95+
- Lighthouse SEO score: 100
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total bundle size: minimize. Code-split aggressively.

### Accessibility
- All interactive elements keyboard-navigable
- Focus indicators visible and styled (not browser default, but clearly visible)
- Color contrast ratios meet WCAG 2.1 AA on all text (check accent colors on dark backgrounds)
- Form inputs have associated labels
- Error messages are descriptive and associated with inputs via aria-describedby
- Skip navigation link on every page
- Alt text on all images
- Reduced motion media query respected (disable animations for users who prefer reduced motion)
- Chat widget accessible via keyboard

### Mobile Responsiveness
- Fully responsive from 320px to 2560px+
- Mobile navigation (hamburger menu with smooth slide-in/out)
- Touch targets minimum 44x44px
- No horizontal scrolling on any viewport
- Proposal builder steps are full-width on mobile
- Chat widget sized appropriately for mobile (nearly full-screen when open)

---

## 10. DEPLOYMENT PIPELINE

### Build & Deploy
1. Initialize the Next.js project with TypeScript and Tailwind
2. Set up the Netlify configuration (netlify.toml)
3. Configure environment variables in Netlify dashboard (or .env.local for dev)
4. Build all pages and components
5. Test locally with `npm run build && npm run start`
6. Deploy to Netlify
7. Configure custom domain: asksaul.ai
8. Verify SSL certificate
9. Test all forms and webhooks in production
10. Verify all pages render correctly on mobile and desktop

### Pre-Deploy Checklist
- [ ] All TypeScript compiles without errors
- [ ] All pages render without console errors
- [ ] All forms submit successfully (test with webhook.site if GHL not ready)
- [ ] All internal links work (no 404s)
- [ ] All external links open in new tabs
- [ ] Sitemap generates correctly
- [ ] robots.txt is correct
- [ ] Open Graph images render on social share preview
- [ ] Favicon and app icons set
- [ ] Analytics tracking working (if configured)
- [ ] Chat widget appears and functions on all pages
- [ ] Mobile navigation works on all pages
- [ ] Dark theme renders correctly (no white flash on load)

---

## 11. FINAL PASS 1: UI/UX DESIGN AUDIT

After the complete build is functional, do a full UI/UX audit pass. Go through every single page and component with fresh eyes. This is not optional.

### Desktop Audit (1440px viewport)
For every page, check:
- [ ] Typography hierarchy is clear and consistent
- [ ] Spacing between sections feels intentional (not cramped, not wasteful)
- [ ] Color usage is consistent (accent color isn't overused or underused)
- [ ] Cards and containers have consistent border-radius and padding
- [ ] Hover states on all interactive elements (buttons, links, cards)
- [ ] Animations are smooth and don't cause layout shifts
- [ ] Images are crisp (no blurry upscales)
- [ ] CTA buttons are visually prominent and clearly actionable
- [ ] No orphaned text (single words on their own line in headings)
- [ ] Footer is complete and links work
- [ ] Overall page "feel" matches the brand: precision, confidence, dark luxury

### Mobile Audit (375px viewport)
For every page, check:
- [ ] Content reads naturally without horizontal scrolling
- [ ] Font sizes are readable without zooming
- [ ] Buttons are tappable (44px minimum touch target)
- [ ] Navigation menu opens/closes smoothly
- [ ] Images scale correctly
- [ ] Proposal builder steps are usable on small screens
- [ ] Chat widget doesn't obscure critical content
- [ ] Cards stack vertically with appropriate spacing
- [ ] No elements overflow their containers

### Tablet Audit (768px viewport)
- [ ] Layout adapts gracefully (not just a squished desktop or blown-up mobile)
- [ ] Grid layouts adjust column counts appropriately
- [ ] Navigation still works well

### Cross-Component Consistency Check
- [ ] All buttons use the same styles (primary, secondary, ghost variants)
- [ ] All section headings use the same size/weight/spacing pattern
- [ ] All cards use the same elevation/border/padding treatment
- [ ] Accent color usage is consistent (same shade everywhere)
- [ ] Loading states are consistent (if any async operations)

### Fix Everything You Find
This is not a "note it for later" pass. Fix issues as you find them. If something looks off, redesign it. If the spacing is wrong, fix it. If a component looks generic, make it distinctive. The bar is: would Gregory be proud to send this link to an investor or a potential $25K client?

---

## 12. FINAL PASS 2: END-TO-END TESTING

After the UI/UX pass is complete and all fixes are applied, run a complete E2E test of every interactive element on the site.

### Navigation Testing
- [ ] Click every link in the navbar (desktop and mobile)
- [ ] Click every link in the footer
- [ ] Verify all internal links navigate to correct pages
- [ ] Verify all external links open in new tabs
- [ ] Test browser back/forward navigation
- [ ] Test direct URL access for every page (no broken routes)
- [ ] Verify 404 page exists and looks styled

### Form Testing

**Proposal Builder:**
- [ ] Complete the entire flow selecting only "AI Assistant"
- [ ] Complete the entire flow selecting only "Website"
- [ ] Complete the entire flow selecting only "Marketing Engine"
- [ ] Complete the entire flow selecting all services
- [ ] Complete the entire flow selecting "Not sure yet"
- [ ] Try to advance a step without filling required fields (verify validation)
- [ ] Use the back button on every step
- [ ] Verify the review/summary step shows all entered data correctly
- [ ] Submit the form and verify the confirmation page displays
- [ ] Verify the webhook payload is correctly formatted (log to console or test endpoint)
- [ ] Test on mobile: complete the full flow on a 375px viewport
- [ ] Test with keyboard only: tab through every field and button

**Contact Form:**
- [ ] Submit with valid data
- [ ] Submit with missing required fields (verify validation)
- [ ] Submit with invalid email format (verify validation)
- [ ] Verify webhook payload
- [ ] Test on mobile

**Chat Widget:**
- [ ] Open chat widget on homepage
- [ ] Click each quick-reply option and verify response
- [ ] Enter name and email when prompted
- [ ] Verify lead data submits to webhook
- [ ] Close and reopen the widget (verify state persists or resets intentionally)
- [ ] Open chat widget on every other page (verify it works everywhere)
- [ ] Test on mobile: open, interact, close
- [ ] Test with keyboard: open, navigate, close

### Responsive Testing
- [ ] Test every page at: 320px, 375px, 414px, 768px, 1024px, 1280px, 1440px, 1920px
- [ ] No horizontal scrolling at any viewport
- [ ] No overlapping text or elements
- [ ] No images breaking their containers

### Performance Testing
- [ ] Run Lighthouse on homepage (target: 90+ performance, 95+ accessibility, 100 SEO)
- [ ] Run Lighthouse on proposal builder page
- [ ] Run Lighthouse on a blog post page
- [ ] Fix any issues that bring scores below targets

### SEO Verification
- [ ] View page source on every page, verify meta tags are populated
- [ ] Verify structured data with Google's Rich Results Test (or Schema.org validator)
- [ ] Verify sitemap.xml is accessible and lists all pages
- [ ] Verify robots.txt is correct
- [ ] Check that no pages have duplicate title or description tags

### Edge Cases
- [ ] Submit proposal builder with special characters in text fields
- [ ] Submit with extremely long text in open-ended fields
- [ ] Rapid-click the submit button (verify no double submissions)
- [ ] Navigate away mid-form and return (verify state persistence)
- [ ] Test with JavaScript disabled (verify graceful degradation or appropriate message)
- [ ] Test with slow network (3G throttle in devtools)

### Final Verification
- [ ] Every page loads without console errors
- [ ] No broken images
- [ ] No placeholder text or "Lorem ipsum" anywhere
- [ ] All prices match the spec in this document
- [ ] Gregory's name is spelled correctly everywhere (Gregory, never Greg)
- [ ] AskSaul.ai branding is consistent
- [ ] Copyright year in footer is correct (2026)
- [ ] The site feels fast, polished, and authoritative

---

## 13. REFERENCE DOCUMENTS & ASSETS

### Source Documents (in Gregory's workspace)
- **Gregory_Ringler_Technical_Skills_Overview.pdf** — Full skills profile, work history, portfolio screenshots
- **asksaul-business-proposal.md** — Service tiers, pricing framework, competitive positioning, ideal customer profiles
- **asksaul-setup-sop.md** — Technical SOP for OpenClaw deployments (reference for AI service page content)
- **Exotiq_Newsletter_Engagement_SOP_v2_FINAL.docx** — Content strategy framework (adapt three-audience model for AskSaul)

### Portfolio Assets Needed
Screenshots of live sites. Capture high-quality screenshots at 1440px desktop and 375px mobile for:
- exotiq.ai
- driveexotiq.com
- exotiq.rent (multiple pages: homepage, vehicle detail, explore page)
- polaris.estate
- Lou's Heating & Cooling site

If you cannot capture live screenshots, use placeholder containers styled to match the site design with descriptive text explaining what will go there. Flag these for Gregory to replace.

### Environment Setup
```bash
# Initialize project
npx create-next-app@latest asksaul-site --typescript --tailwind --eslint --app --src-dir=false

# Install dependencies
npm install framer-motion react-hook-form @hookform/resolvers zod lucide-react next-sitemap

# Development
npm run dev

# Build & test
npm run build
npm run start

# Deploy
# Push to GitHub, Netlify auto-deploys from main branch
```

---

## EXECUTION NOTES

### Priority Order
1. Set up project scaffolding and design system (colors, fonts, components)
2. Build layout (navbar, footer, mobile nav)
3. Build homepage (this is the first impression, get it right)
4. Build proposal builder (this is the conversion engine)
5. Build service pages (AI, Web Dev, Marketing Engine)
6. Build about page
7. Build contact page
8. Build blog infrastructure + seed articles
9. Build chat widget
10. Wire up all API routes and webhook handlers
11. SEO: structured data, sitemap, meta tags
12. Final Pass 1: UI/UX audit
13. Final Pass 2: E2E testing
14. Deploy to production

### Decision Authority
Saul, you have full authority to:
- Choose specific font pairings from the recommendations (or pick your own if you find something better)
- Adjust spacing, sizing, and layout details for visual quality
- Add micro-interactions and animations that enhance the experience
- Restructure components if the architecture in this spec doesn't work technically
- Add pages or sections if they serve the conversion goal
- Write copy that's better than what's suggested here (the copy direction is a guide, not a script)

You do NOT have authority to:
- Skip the two final passes
- Use purple in the color palette
- Use generic fonts (Inter, Roboto, Arial, Space Grotesk, system fonts)
- Fabricate testimonials, metrics, or claims
- Remove the proposal builder or simplify it to a basic contact form
- Deploy without testing all forms
- Abbreviate Gregory's name to "Greg"

### Quality Bar
The site should be good enough that if a funded startup founder lands on it, they think "this person clearly knows what they're doing." It should be good enough that if a local HVAC company owner lands on it, they feel comfortable reaching out without worrying the services are over their head. It serves both audiences through clear routing, not by being generic.

Ship it.

---

*This prompt was developed collaboratively between Gregory Ringler and Claude, workshopping brand positioning, pricing strategy, technical architecture, and conversion optimization over multiple rounds of strategic discussion. Every element in this spec exists for a reason.*
