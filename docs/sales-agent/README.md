# Saul website sales agent

The chat widget on asksaul.ai is an ElevenLabs Conversational AI agent
("Saul Website Sales Agent (asksaul.ai)", running Claude Sonnet 5.5). It is
separate from the phone agents; editing it never touches the demo line.

## Where the prompt and knowledge base live
They are private sales material, so they are **not** in this public repo. The
source of truth is a folder outside the repo (on Gregory's Mac:
`~/Documents/ASK SAUL/sales-agent/`) containing:
- `system-prompt.md`: who Saul is, the conversation playbook, hard rules, tools, action buttons.
- `kb/*.md`: the knowledge base. Every file is appended to the prompt in full (about 10k tokens), so nothing depends on search.
- `agent-config.json`: model, voice, allowed hosts, daily limit, and the two client tools.

The agent id is in `lib/sales-agent/agent-id.ts` (public; access is limited by the host allowlist).

## Change what Saul knows or says
1. Edit the files in the private folder.
2. Push them to ElevenLabs:
   ```
   SALES_AGENT_DIR="$HOME/Documents/ASK SAUL/sales-agent" npm run agent:provision
   ```
   Changes are live for new chats immediately. No site deploy is needed.
3. Check nothing regressed:
   ```
   npm run agent:eval
   ```
   This runs 17 scripted conversations (pricing, honesty traps, safety, prompt injection, the lead and audit flows) with mocked tools, so no real leads are created.

To let a Netlify deploy preview talk to the agent, add its host with
`-- --allow-host deploy-preview-7--asksaul.netlify.app`.

## How it works on the site
- `components/chat/ChatWidget.tsx` (UI) and `components/chat/useSalesAgent.ts` (connection).
- It connects only when the visitor sends their first message (text over websocket). The **Talk** button switches to an in-browser voice call with the same agent.
- The visitor's page, today's date, and the earlier chat (after a reload) are passed as dynamic variables.
- Buttons: the agent ends a message with `[[actions: free_audit, call_demo]]`; the widget turns that into buttons (`lib/sales-agent/actions.ts`).
- Tools run in the browser:
  - `capture_lead` posts to `/api/chat` (GHL contact + opportunity + internal alert, with the transcript).
  - `request_audit` posts to `/api/audit`.
- If ElevenLabs can't be reached, the widget falls back to the canned replies in `/api/chat/respond`.
- Guardrails: the focus and prompt-injection guardrails are on. A blocked attempt ends that session, and the widget shows a short redirect.

## Review conversations
ElevenLabs dashboard → Agents → "Saul Website Sales Agent (asksaul.ai)" → Conversations.
