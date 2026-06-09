# AskSaul.ai

Next.js site for AskSaul.ai lead capture, proposal intake, chat handoff, and voice-agent inquiry flows.

## Local development

```bash
npm run dev
```

Open http://localhost:3000.

## CRM and SMS routing

AskSaul.ai uses the Ask Saul GoHighLevel / LeadConnector location as the CRM and outbound SMS system of record.

- GHL location: `RxCVQeGoQ3RTJbbLG5gY`
- Primary integration code: `lib/ghl.ts`
- A2P campaign packet: `docs/ghl-a2p-outbound-campaign-plan.md`
- SMS/GHL handoff: `docs/ghl-sms-handoff.md`

Current channel stance:

- GHL/LeadConnector: opted-in outbound SMS, workflow follow-up, STOP/HELP handling, CRM conversation history.
- Sendblue: warm/inbound iMessage only unless Gregory confirms true outbound Sendblue support.
- Twilio: on hold unless Gregory explicitly asks to add it.

Before submitting the GHL A2P campaign, deploy the site so reviewers can see the optional SMS consent checkboxes and public Privacy/Terms pages.

## Quality checks

```bash
npm run lint
npm run build
```
