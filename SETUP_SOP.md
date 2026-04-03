# AskSaul Setup SOP
## Standard Operating Procedure for Customer OpenClaw Deployments

**Version:** 1.0 DRAFT
**Status:** Review with Gregory before client use
**Last Updated:** 2026-03-31

---

## Table of Contents

1. [Pre-Engagement Checklist](#1-pre-engagement-checklist)
2. [Customer Use Cases & Tiers](#2-customer-use-cases--tiers)
3. [Time Estimates](#3-time-estimates)
4. [Standard vs Custom Files](#4-standard-vs-custom-files)
5. [Phase 1: Infrastructure Setup](#5-phase-1-infrastructure-setup)
6. [Phase 2: Core Configuration](#6-phase-2-core-configuration)
7. [Phase 3: Channel Setup](#7-phase-3-channel-setup)
8. [Phase 4: Security Hardening](#8-phase-4-security-hardening)
9. [Phase 5: Personality & Workspace](#9-phase-5-personality--workspace)
10. [Phase 6: Testing & Handoff](#10-phase-6-testing--handoff)
11. [Post-Deployment Support](#11-post-deployment-support)
12. [Security Audit Checklist](#12-security-audit-checklist)
13. [Known Limitations](#13-known-limitations)

---

## 1. Pre-Engagement Checklist

Before starting any customer setup, gather:

- [ ] Customer's primary use case (see Use Cases below)
- [ ] Number of users who will interact with the bot
- [ ] Trust model: single operator? small team? public-facing?
- [ ] Preferred messaging platform(s): Telegram, WhatsApp, Discord, Slack, etc.
- [ ] Customer's technical comfort level (will they self-manage or need ongoing support?)
- [ ] Hosting preference: customer's own hardware, VPS, or managed by you
- [ ] Budget for API costs (model provider: Anthropic, OpenAI, Google)
- [ ] Any compliance requirements (HIPAA, SOC2, data residency)
- [ ] Customer's timezone and preferred support hours

---

## 2. Customer Use Cases & Tiers

### Tier 1: Personal Assistant ("Saul Classic")
**Target:** Individual professional, solopreneur, power user
**Complexity:** Low-Medium
**Setup Time:** 2-4 hours
**Monthly API Cost:** ~$20-80 depending on usage

- Single operator, single trust boundary
- Telegram or WhatsApp DM access
- Personal productivity: scheduling, research, writing, reminders
- File management and note-taking
- Optional: forum-style Telegram group with topic routing

**Config profile:** Hardened single-user, full tool access for the operator

### Tier 2: Team Assistant ("AskSaul Team")
**Target:** Small business team (2-10 people)
**Complexity:** Medium
**Setup Time:** 4-8 hours
**Monthly API Cost:** ~$50-200

- Multiple users, same trust boundary (one company)
- Group chat in Telegram or Discord or Slack
- Shared knowledge base, task management, meeting notes
- Mention-gated responses in group channels
- Per-user DM sessions for private queries
- Topic routing for departments (sales, ops, support)

**Config profile:** Allowlist group policy, per-channel-peer DM scoping, mention required

### Tier 3: Customer-Facing Bot ("AskSaul Pro")
**Target:** Business with customer-facing needs
**Complexity:** High
**Setup Time:** 8-16 hours
**Monthly API Cost:** ~$100-500+

- External users messaging the bot (customers, leads)
- Strict tool lockdown: messaging profile only for external channels
- Internal admin channel with full tools
- Custom personality tuned to brand voice
- FAQ/knowledge base integration
- Pairing or allowlist DM policy for customer onboarding

**Config profile:** Messaging-only tools for customer-facing, full tools for admin channel, sandbox mode enabled

### Tier 4: Developer/Power User ("AskSaul Dev")
**Target:** Developer or technical team
**Complexity:** Medium-High
**Setup Time:** 4-8 hours
**Monthly API Cost:** ~$50-300

- Coding agent capabilities (spawn sub-agents, GitHub integration)
- PR review, issue triage, CI/CD monitoring
- Multiple model support with fallbacks
- Skills: GitHub, coding-agent, health checks
- Sandbox mode for untrusted code execution

**Config profile:** Full developer tools, sandbox enabled, GitHub skills installed

---

## 3. Time Estimates

| Phase | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|-------|--------|--------|--------|--------|
| Infrastructure | 30min | 30min-1hr | 1hr | 30min-1hr |
| Core config | 30min | 1hr | 2hr | 1hr |
| Channel setup | 30min | 1hr | 2hr | 1hr |
| Security hardening | 30min | 1-2hr | 2-3hr | 1-2hr |
| Personality & workspace | 30min | 1hr | 2-3hr | 1hr |
| Testing & handoff | 30min | 1hr | 2-3hr | 1hr |
| Documentation | 15min | 30min | 1hr | 30min |
| **Total** | **2-4hr** | **4-8hr** | **8-16hr** | **4-8hr** |

**Buffer rule:** Add 25% for first-time setups of each tier. Reduce by 25% after 3+ deployments of same tier.

---

## 4. Standard vs Custom Files

### Standard Files (Template, Same for Every Customer)

These files have a consistent structure. You maintain master templates and customize specific sections:

| File | Purpose | Customization Level |
|------|---------|-------------------|
| `AGENTS.md` | Approval gates, communication rules | **Low** - Standard approval gates work for most customers. May adjust what requires approval vs. auto-proceed |
| `SECURITY-BEST-PRACTICES.md` | Security policies | **Low** - Standard security doc, rarely needs changes |
| `HEARTBEAT.md` | Periodic health check tasks | **Low** - Enable/configure based on tier |
| `BOOTSTRAP.md` | First-run onboarding script | **None** - Delete after initial setup |

### Custom Files (Unique Per Customer)

| File | Purpose | Customization Level |
|------|---------|-------------------|
| `IDENTITY.md` | Bot name, character, emoji, personality notes | **High** - Unique per customer |
| `SOUL.md` | Tone, communication style, boundaries, humor | **High** - Must match customer's brand/preferences |
| `USER.md` | Operator details, preferences, context | **High** - Unique per operator |
| `TOOLS.md` | Channel config, topic routing, platform details | **Medium** - Structure is standard, IDs/routing are unique |
| `openclaw.json` | Core gateway configuration | **Medium-High** - Security and channel settings are unique |

### Config File: `openclaw.json`

This is the heart of every deployment. Structure:

```json5
{
  // STANDARD SECTIONS (template)
  gateway: { mode, bind, auth },
  tools: { profile, deny, fs, exec, elevated },
  session: { dmScope, reset },
  
  // CUSTOM SECTIONS (per customer)
  agents: { defaults: { model, workspace, sandbox } },
  channels: { telegram|whatsapp|discord: { tokens, policies, groups } },
}
```

---

## 5. Phase 1: Infrastructure Setup

### Option A: Local Machine (Mac/Linux)
```bash
# Install OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash

# Run onboarding
openclaw onboard --install-daemon

# Verify
openclaw gateway status
openclaw dashboard
```

### Option B: VPS (Ubuntu/Debian)
```bash
# Install Node 24 (or 22.14+)
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo bash -
sudo apt install -y nodejs

# Install OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash

# Run onboarding
openclaw onboard --install-daemon

# Set up as systemd service
# (onboard --install-daemon handles this)
```

### Option C: Remote Access via Tailscale
```bash
# If VPS or remote machine needs phone access
# Install Tailscale on the host
# Configure gateway for Tailscale access
# See: https://docs.openclaw.ai/gateway/tailscale
```

### Post-Infrastructure Checklist
- [ ] Node.js 22.14+ or 24 installed
- [ ] OpenClaw installed and updated to latest
- [ ] Gateway starts and runs as a daemon/service
- [ ] Dashboard accessible at http://127.0.0.1:18789
- [ ] API key configured for primary model provider

---

## 6. Phase 2: Core Configuration

### Model Selection Guide

| Use Case | Recommended Primary | Fallback | Notes |
|----------|-------------------|----------|-------|
| Personal assistant | claude-opus-4 | claude-sonnet-4 | Best quality, higher cost |
| Team assistant | claude-sonnet-4 | gpt-5 | Good balance of quality/cost |
| Customer-facing | claude-sonnet-4 | claude-sonnet-4 | Consistent, reliable |
| Developer | claude-opus-4 | claude-sonnet-4 | Opus for complex reasoning |

**Critical rule:** Never use models below Claude Sonnet 4 / GPT-5 tier for any bot with tool access or untrusted inboxes. Smaller models are more susceptible to prompt injection.

### Hardened Baseline Config

Start every customer with this baseline, then selectively open up:

```json5
{
  gateway: {
    mode: "local",
    bind: "loopback",
    auth: { mode: "token", token: "GENERATE-64-CHAR-RANDOM-TOKEN" },
  },
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: ["anthropic/claude-sonnet-4-6"],
      },
      workspace: "~/.openclaw/workspace",
      sandbox: {
        mode: "non-main",  // or "all" for Tier 3
        scope: "agent",
      },
    },
  },
  session: {
    dmScope: "per-channel-peer",
  },
  tools: {
    profile: "messaging",
    deny: ["group:automation", "group:runtime", "group:fs", "sessions_spawn", "sessions_send"],
    fs: { workspaceOnly: true },
    exec: { security: "deny", ask: "always" },
    elevated: { enabled: false },
  },
}
```

Then add back capabilities per tier:
- **Tier 1:** Enable runtime tools, exec with ask:always, elevated:false
- **Tier 2:** Keep messaging profile for groups, enable tools for admin DM
- **Tier 3:** Keep messaging-only for customer channels, full tools for admin
- **Tier 4:** Enable runtime, fs, exec with sandbox mode "all"

---

## 7. Phase 3: Channel Setup

### Telegram (Recommended Starting Channel)

1. **Create bot via @BotFather**
   - `/newbot` and follow prompts
   - Save the bot token securely
   - `/setprivacy` to disable (so bot sees all group messages) OR make bot admin
   - `/setjoingroups` to allow group adds
   - Set bot name and description

2. **Configure in openclaw.json**
```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "TOKEN_HERE",
      dmPolicy: "allowlist",           // NOT "open" unless intentional
      allowFrom: ["OWNER_TELEGRAM_ID"], // Numeric user IDs only
      groupPolicy: "allowlist",         // NOT "open"
      groupAllowFrom: ["OWNER_TELEGRAM_ID"],
      groups: {
        "-100XXXXXXXXXX": {
          requireMention: true,
          allowFrom: ["USER_ID_1", "USER_ID_2"],
        },
      },
    },
  },
}
```

3. **Finding Telegram user IDs**
   - DM the bot, run `openclaw logs --follow`, read `from.id`
   - Or: `curl "https://api.telegram.org/bot<token>/getUpdates"`

4. **Forum/Topic Setup (for organized routing)**
   - Create a Telegram group, enable Topics in group settings
   - Create topics: General, Updates, Alerts, Logs, etc.
   - Map topic IDs in TOOLS.md

### WhatsApp
- Uses QR pairing via `openclaw channels login whatsapp`
- Good for personal/1:1 use cases
- Group support works but more limited than Telegram

### Discord
- Create bot in Discord Developer Portal
- Good for team/community use cases
- Thread support, slash commands

### Slack
- App creation via Slack API
- Best for enterprise/team deployments

---

## 8. Phase 4: Security Hardening

### Mandatory Security Steps (Every Deployment)

1. **Run security audit**
```bash
openclaw security audit
openclaw security audit --deep
```

2. **Fix all CRITICAL findings before handoff**
   - No open groupPolicy with elevated tools
   - No open groupPolicy with runtime/fs tools
   - Telegram groupPolicy must be "allowlist"

3. **Verify access controls**
   - [ ] dmPolicy is "pairing" or "allowlist" (never "open" without explicit reason)
   - [ ] groupPolicy is "allowlist"
   - [ ] allowFrom contains only intended user IDs
   - [ ] requireMention is true for all groups
   - [ ] workspaceOnly is true
   - [ ] exec security is "deny" or ask is "always"
   - [ ] elevated is disabled unless specifically needed
   - [ ] sandbox mode is appropriate for tier

4. **Credential hygiene**
   - API keys in auth-profiles.json only, never in workspace files
   - Bot tokens in openclaw.json only
   - Generate unique gateway auth token (64+ chars)
   - Never share tokens in chat, logs, or workspace files

5. **Network security**
   - Gateway bound to loopback unless remote access needed
   - If remote: Tailscale or reverse proxy with trustedProxies configured
   - No direct internet exposure of gateway port

### Security Audit Passing Criteria

Before handoff, `openclaw security audit` must show:
- **0 CRITICAL** findings
- **0 WARN** findings related to access control
- Only acceptable remaining WARN: reverse proxy headers (if not using proxy)

---

## 9. Phase 5: Personality & Workspace

### IDENTITY.md Template
```markdown
# Identity

## Name
[Customer's chosen bot name]

## Creature
[AI assistant description matching customer's vibe]

## Emoji
[Signature emoji]

## Character Notes
- [3-5 personality traits]
- [Communication style notes]
```

### SOUL.md Approach

This is the most important custom file. Interview the customer:

1. **Tone:** Formal? Casual? Technical? Friendly?
2. **Boundaries:** What should the bot never do?
3. **Humor:** Yes/no? What kind?
4. **Domain expertise:** What should it be great at?
5. **Style rules:** Any specific communication preferences?

Build SOUL.md from their answers. Use specific examples (like the tone table in our SOUL.md).

### TOOLS.md Setup
```markdown
# Messaging Configuration

## Platform
- **Primary:** [Platform]
- **Bot Name:** [Name]

## Topic Routing (if using forum groups)
| Topic | Thread ID | Notes |
|-------|-----------|-------|
| General | X | Main chat |
| [Custom] | Y | [Purpose] |

## Communication Rules
- Max messages per task: 2
- File delivery: inline
- Cron notifications: failures only
```

### AGENTS.md (Standard Template)

Use the standard approval gates template. Adjust only if customer has specific requirements:
- Financial services: stricter approval on data access
- Developer use: may relax file operation approvals within workspace
- Customer-facing: stricter on all external actions

---

## 10. Phase 6: Testing & Handoff

### Pre-Handoff Testing Checklist

- [ ] Send DM to bot, verify response
- [ ] Send group message with mention, verify response
- [ ] Send group message without mention, verify NO response (if requireMention:true)
- [ ] Test from an unauthorized user ID, verify rejection
- [ ] Run `openclaw security audit`, verify 0 CRITICAL
- [ ] Test heartbeat is working (if configured)
- [ ] Verify session isolation (DM content doesn't leak to groups)
- [ ] Test bot personality matches SOUL.md
- [ ] Verify topic routing (if using forum groups)
- [ ] Test file/image handling
- [ ] Confirm gateway restarts cleanly after reboot

### Customer Handoff Package

Deliver to the customer:
1. **Quick Start Guide** (1-pager): how to talk to the bot, key commands
2. **Admin Guide**: how to restart, check status, view logs
3. **Emergency Procedures**: what to do if bot misbehaves, how to stop it
4. **Contact info**: your support availability

### Key Commands for Customer

```bash
openclaw gateway status      # Check if running
openclaw gateway restart     # Restart the bot
openclaw gateway stop        # Emergency stop
openclaw logs --follow       # Watch live activity
openclaw security audit      # Check security posture
openclaw status              # Full system overview
```

---

## 11. Post-Deployment Support

### Recommended Support Tiers

| Level | Includes | Suggested Price |
|-------|----------|----------------|
| Setup Only | One-time setup, 1 week email support | [Pricing TBD] |
| Basic | Setup + monthly check-in, security audit | [Pricing TBD] |
| Standard | Basic + config changes, skill installs, troubleshooting | [Pricing TBD] |
| Premium | Standard + personality tuning, custom skills, priority response | [Pricing TBD] |

### Recurring Maintenance Tasks

- Monthly: Run `openclaw security audit --deep`
- Monthly: Check for OpenClaw updates (`openclaw update`)
- Monthly: Review API costs and usage
- Quarterly: Review and update SOUL.md/IDENTITY.md if needed
- As needed: Adjust access controls when team members change

---

## 12. Security Audit Checklist

Run this for every deployment:

### Access Control
- [ ] dmPolicy is NOT "open" (unless explicitly justified)
- [ ] groupPolicy is "allowlist"
- [ ] All allowFrom entries are verified numeric user IDs
- [ ] requireMention is true for group chats
- [ ] No wildcard ("*") in allowFrom unless intentional

### Tool Safety
- [ ] tools.fs.workspaceOnly is true
- [ ] tools.exec.security is "deny" or exec.ask is "always"
- [ ] tools.elevated.enabled is false (unless needed and documented)
- [ ] tools.profile is "messaging" for any untrusted/external channels
- [ ] sandbox.mode is appropriate for the use case

### Network
- [ ] Gateway bound to loopback (or secured via Tailscale/proxy)
- [ ] Gateway auth token is 64+ characters
- [ ] No direct internet exposure of gateway port
- [ ] If using reverse proxy: trustedProxies configured

### Credentials
- [ ] No API keys in workspace files
- [ ] No bot tokens in workspace files
- [ ] auth-profiles.json permissions are restricted
- [ ] Gateway auth token is unique per deployment

### Model
- [ ] Primary model is Claude Sonnet 4+ or GPT-5+ tier
- [ ] No weak models (Haiku, older GPT) in fallback chain for tool-enabled bots

---

## 13. Known Limitations & Honest Disclosures

**Tell every customer:**

1. **Not multi-tenant secure.** OpenClaw's security model is personal-assistant (one trust boundary per gateway). If multiple untrusted users share one bot, they share the same tool authority. For adversarial users, need separate gateways.

2. **Prompt injection is a real risk.** No AI system is immune. Hardening reduces surface area but doesn't eliminate it. This is why tool lockdown matters.

3. **API costs are variable.** Heavy usage, long conversations, and complex tasks increase costs. Set up provider billing alerts.

4. **Model providers can change.** Anthropic/OpenAI can update models, change pricing, or deprecate endpoints. Stay current with OpenClaw updates.

5. **Not a replacement for professional security.** For regulated industries (healthcare, finance), OpenClaw is a tool, not a compliance solution. May need additional controls.

6. **Uptime depends on infrastructure.** Local machine = down when machine sleeps. VPS = better uptime but more setup. Neither is enterprise HA without additional work.

---

*This SOP is a living document. Update after each deployment with lessons learned.*
