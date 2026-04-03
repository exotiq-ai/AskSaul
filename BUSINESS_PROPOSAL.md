# AskSaul Business Proposal
## Custom AI Assistant Setup for SMBs

**Version:** 1.0 DRAFT
**Status:** Review with Gregory
**Date:** 2026-03-31

---

## Executive Summary

AskSaul is a done-for-you AI assistant service built on OpenClaw, the open-source self-hosted AI gateway. We set up, secure, and customize intelligent AI assistants that live in your existing messaging apps (Telegram, WhatsApp, Discord, Slack) and work the way you do.

Unlike hosted AI chatbots, your AskSaul assistant runs on your own infrastructure, keeps your data private, and is tuned to your business personality and workflows.

---

## The Problem

Small and medium businesses want AI assistants but face real barriers:

- **SaaS chatbots** are generic, expensive, and your data lives on someone else's servers
- **ChatGPT/Claude web apps** aren't integrated into workflows, can't take actions, and don't remember context
- **Custom development** costs $10K-$50K+ and takes months
- **Security** is an afterthought: most setups expose data, lack access controls, and are vulnerable to misuse

---

## The AskSaul Solution

| Feature | Generic Chatbot | ChatGPT/Claude | AskSaul |
|---------|----------------|----------------|------------|
| Self-hosted (your data stays yours) | ❌ | ❌ | ✅ |
| Lives in your messaging app | ❌ | ❌ | ✅ |
| Custom personality & brand voice | ❌ | Partial | ✅ |
| Security hardened | ❌ | N/A | ✅ |
| Action capable (files, search, tools) | Limited | Limited | ✅ |
| Persistent memory across sessions | ❌ | Limited | ✅ |
| Multi-user with access controls | ❌ | ❌ | ✅ |
| Setup time | Minutes | Minutes | Hours (done for you) |
| Ongoing cost | $50-500/mo | $20/user/mo | API costs only ($20-200/mo) |

---

## Service Tiers

### 🥉 Starter — "Your Personal AI"
**For:** Solopreneurs, freelancers, individual professionals

**Includes:**
- OpenClaw installation on your machine or VPS
- One messaging channel (Telegram or WhatsApp)
- Custom personality setup (name, tone, style)
- Security hardening and audit (0 critical findings)
- Basic workspace configuration
- 1-page quick start guide
- 1 week of email support post-setup

**Setup Time:** 2-4 hours
**Customer's Ongoing Cost:** ~$20-80/mo (API only, no AskSaul subscription)

---

### 🥈 Team — "Your Team's AI"
**For:** Small teams (2-10 people), agencies, small offices

**Includes everything in Starter, plus:**
- Multi-user access with per-person DM privacy
- Group chat with organized topic channels
- Mention-gated responses (bot only responds when asked)
- Access control: only your team can use the bot
- Up to 2 messaging channels
- Admin guide and emergency procedures
- 2 weeks of support post-setup
- One free config adjustment within 30 days

**Setup Time:** 4-8 hours
**Customer's Ongoing Cost:** ~$50-200/mo (API only)

---

### 🥇 Pro — "Your Business AI"
**For:** Businesses with customer-facing needs or complex workflows

**Includes everything in Team, plus:**
- Separate internal (full tools) and external (locked down) channels
- Custom knowledge base integration
- Brand voice tuning with detailed SOUL.md
- Sandbox mode for safe execution
- Up to 3 messaging channels
- Custom skill installation
- Comprehensive admin documentation
- 30 days of support post-setup
- Two free config adjustments within 60 days
- Monthly security audit for first 3 months

**Setup Time:** 8-16 hours
**Customer's Ongoing Cost:** ~$100-500/mo (API only)

---

### 🔧 Developer — "Your Coding Partner"
**For:** Developers, technical teams, DevOps

**Includes everything in Team, plus:**
- GitHub integration (issues, PRs, CI monitoring)
- Coding agent capabilities (sub-agent spawning)
- Multiple model support with intelligent fallbacks
- Developer-focused skills installed
- Sandbox mode for code execution
- 2 weeks of support post-setup

**Setup Time:** 4-8 hours
**Customer's Ongoing Cost:** ~$50-300/mo (API only)

---

## Pricing Framework

| Tier | One-Time Setup Fee | Suggested Range |
|------|-------------------|-----------------|
| Starter | [TBD] | $250-500 |
| Team | [TBD] | $500-1,000 |
| Pro | [TBD] | $1,000-2,500 |
| Developer | [TBD] | $500-1,500 |

### Optional Add-Ons

| Add-On | Description | Suggested Range |
|--------|-------------|-----------------|
| Additional channel | Add WhatsApp, Discord, Slack, etc. | $100-200 |
| Custom skill development | Build a specialized capability | $200-500 per skill |
| Monthly maintenance | Updates, security audits, config changes | $50-150/mo |
| Quarterly review | Deep audit, personality tuning, optimization | $150-300/quarter |
| Emergency support | Priority response for issues | $100/incident or $75/mo retainer |
| VPS setup & management | We provision and manage the server | $50-100/mo + hosting costs |

---

## Security as the Differentiator

This is what separates AskSaul from "I installed a chatbot":

### Every Deployment Gets:
1. **Hardened baseline config** — start locked down, selectively open
2. **Access control audit** — verified allowlists, no open policies
3. **Tool safety review** — filesystem restricted, exec gated, no elevated access by default
4. **Network security** — loopback binding, auth tokens, no exposed ports
5. **Credential isolation** — no secrets in workspace, proper auth-profiles
6. **Model safety** — top-tier models only (no cheap models vulnerable to injection)
7. **Zero CRITICAL findings** — `openclaw security audit` must pass before handoff
8. **Documentation** — customer knows how to check and maintain security

### What We Tell Every Customer (Transparency Builds Trust):
- "Your data stays on your infrastructure. We never have ongoing access unless you grant it."
- "AI assistants can be manipulated (prompt injection). We harden against this but can't guarantee immunity."
- "This is a tool, not a compliance solution. For regulated industries, additional controls may be needed."

---

## Sales Process

### Discovery Call (15-30 min)
- What do they use AI for today?
- What messaging apps does their team use?
- How many people need access?
- Any compliance or security requirements?
- What's their technical comfort level?

### Proposal (Same Day)
- Recommend a tier based on discovery
- Clear scope, timeline, and pricing
- Transparent about ongoing API costs

### Setup (Scheduled)
- Follow the AskSaul Setup SOP
- Customer provides: hardware/VPS access, API key, messaging platform credentials
- We provide: everything else

### Handoff (End of Setup Day)
- Live demo of the working bot
- Walk through admin guide
- Verify customer can restart, check status, and stop the bot
- Security audit results shared

### Follow-Up (Support Period)
- Available for questions and adjustments
- Monthly/quarterly maintenance if purchased

---

## Competitive Positioning

### vs. "My nephew set up ChatGPT"
- Self-hosted (data privacy)
- Security hardened
- Custom personality
- Integrated into existing tools
- Persistent, always available

### vs. Enterprise AI Solutions (Intercom AI, Zendesk AI, etc.)
- No per-seat licensing ($50-100/user/mo savings)
- Full control over data and behavior
- No vendor lock-in (open source)
- Custom, not template-based
- Lower ongoing cost

### vs. Hiring a Developer
- Fraction of the cost ($500-2,500 vs. $10,000-50,000+)
- Days, not months
- Battle-tested framework (OpenClaw), not custom code
- Ongoing community and updates

---

## Ideal Customer Profiles

### Real Estate Agent / Brokerage
- Bot handles property info, scheduling, client follow-ups
- WhatsApp or Telegram for client communication
- Team tier with topic routing per property/client

### Law Firm / Consultancy
- Research assistant, document review, meeting prep
- Strict data privacy (self-hosted is the selling point)
- Pro tier with security hardening emphasis

### Marketing Agency
- Content ideation, social media drafting, client reporting
- Multi-channel (Slack for internal, Telegram for clients)
- Team or Pro tier

### E-Commerce / Small Retail
- Customer support, order tracking, FAQ
- WhatsApp or Telegram for customer-facing
- Pro tier with locked-down customer channel

### Tech Startup / Dev Team
- Code review, issue triage, documentation
- Discord or Slack
- Developer tier with GitHub integration

### Executive / Solopreneur
- Personal productivity, research, writing
- WhatsApp or Telegram
- Starter tier, minimal setup

---

## Revenue Projections (Conservative)

Assuming you start with 2-3 setups per month and grow:

| Month | Setups | Avg. Revenue | Maintenance Clients | Monthly Revenue |
|-------|--------|-------------|---------------------|-----------------|
| 1-3 | 2/mo | $750 | 0 | $1,500 |
| 4-6 | 3/mo | $850 | 4 | $2,950 |
| 7-12 | 4/mo | $1,000 | 10 | $5,000 |
| 13-18 | 5/mo | $1,200 | 20 | $8,000 |

Maintenance revenue compounds. By month 18, recurring maintenance could be $2,000+/mo even without new setups.

---

## Next Steps

1. **Gregory reviews this proposal and SOP** — flag anything that feels off
2. **Nail down pricing** — test with 1-2 friendly clients at Starter/Team tier
3. **Build template library** — standardize SOUL.md, AGENTS.md, TOOLS.md templates per tier
4. **Create customer-facing materials** — landing page, 1-pager, demo video
5. **Fix our own security findings** — practice what we preach (our audit has 3 CRITICALs)
6. **First pilot deployment** — do one for free or discounted to refine the process

---

## Open Questions

- [ ] Pricing: what feels right for your market? The ranges above are starting points
- [ ] Hosting: do we offer managed VPS as a standard option or keep it BYO?
- [ ] Legal: do we need a service agreement template? Liability for AI outputs?
- [ ] Branding: AskSaul is a working name. Keep it?
- [ ] Ryan's input: he built the original setup, his perspective on scalability would be valuable
- [ ] Support model: are you handling support solo or building a small team?

---

*This is a working draft. The SOP (secureclaw-setup-sop.md) is the companion operational document.*
