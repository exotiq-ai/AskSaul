# AskSaul.ai Handoff: GHL SMS Replaces Sendblue for Outbound

Last updated: 2026-06-09

## Decision

AskSaul.ai should treat GoHighLevel / LeadConnector as the outbound SMS system of record.

Sendblue is not the primary outbound path. Keep Sendblue only for warm/inbound iMessage use cases unless Sendblue explicitly enables full proactive outbound on the account.

Twilio is on hold for now. Do not build Twilio unless Gregory later decides GHL/LeadConnector cannot support the required sending volume, workflow control, or compliance needs.

## Current routing model

### Website lead capture

AskSaul.ai forms submit to the Ask Saul GHL location:

- GHL location ID: `RxCVQeGoQ3RTJbbLG5gY`
- Direct API base URL: `https://services.leadconnectorhq.com`
- Main code path: `lib/ghl.ts`
- Voice-agent route: `app/api/voice-agent/route.ts`
- Proposal route: `app/api/proposal/route.ts`
- Contact route: `app/api/contact/route.ts`

`sendToGHL()` uses direct GHL/LeadConnector API credentials when present:

- `GHL_API_KEY` or `GHL_LOCAL_SERVICES_API_KEY`
- `GHL_LOCATION_ID` or `GHL_LOCAL_SERVICES_LOCATION_ID`

It refuses to send AskSaul.ai leads to any location other than `RxCVQeGoQ3RTJbbLG5gY`.

If no direct GHL API env is available, it can fall back to `GHL_WEBHOOK_URL`, but production should prefer direct GHL API so contact upsert, notes, fields, tags, and SMS workflow routing are consistent.

### SMS outbound

Outbound SMS should happen through GHL/LeadConnector workflows or manual GHL conversations after A2P approval.

Rules:

1. GHL is canonical for consent state, contact history, STOP/HELP handling, and conversation tracking.
2. Website submissions record `smsConsent` and `marketingSmsOptIn` in the payload and GHL custom field `followUpConsent`.
3. The website does not send SMS directly from Sendblue anymore for first-touch outbound.
4. Automated SMS should only target contacts whose relevant consent value is true.
5. Marketing SMS must require `marketingSmsOptIn=true`; non-marketing inquiry follow-up requires `smsConsent=true`.

## Website opt-in behavior

The live forms now use A2P-friendly consent:

- SMS consent checkboxes are optional.
- Consent boxes are not pre-checked.
- Non-marketing and marketing consent are separated.
- The user can submit the form without SMS consent.
- Consent copy contains AskSaul brand identity, message frequency disclosure, msg/data rates disclosure, HELP, STOP, and Privacy/Terms links.

Files:

- `components/contact/ContactForm.tsx`
- `components/proposal-builder/ContactPreferences.tsx`
- `components/voice-agents/VoiceAgentLeadForm.tsx`
- `lib/validation.ts`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`

## A2P campaign packet

Use this document to submit the GHL A2P campaign:

- `docs/ghl-a2p-outbound-campaign-plan.md`

It includes:

- Message flow / CTA answer
- Campaign description
- Opt-in confirmation message
- Sample marketing and transactional messages
- HELP / STOP keywords and replies
- Submission checklist
- Boundaries for what this campaign can and cannot be used for

## Sendblue deprecation note

Sendblue may still be configured in some older docs/env examples. Do not use Sendblue as the primary outbound engine unless Gregory explicitly re-enables it after Sendblue confirms true outbound support.

Known current stance:

- Sendblue: warm/inbound iMessage, demos, possible manual high-intent conversations.
- GHL/LeadConnector: opted-in outbound SMS and CRM-native follow-up.
- Twilio: hold / future fallback.

## GHL workflow recommendations after A2P approval

Create or update GHL workflows in the Ask Saul location:

1. New AskSaul website lead
   - Trigger: contact created/updated with tags `ask-saul` + `website-lead`.
   - If `followUpConsent` contains `sms_consent=true`, send non-marketing confirmation / callback coordination SMS.
   - If no SMS consent, use email/task only.

2. Voice-agent inquiry
   - Trigger: tag `voice-agent-lead`.
   - If `sms_consent=true`, send the transactional confirmation/callback message.
   - Create task for Gregory to review.
   - Do not send marketing content unless `marketingSmsOptIn=true` is present.

3. Marketing nurture
   - Trigger: explicit `marketingSmsOptIn=true` custom field/tag only.
   - Low frequency.
   - Always include STOP in initial marketing sample/template.

4. STOP / HELP handling
   - Leave GHL default opt-out handling on unless there is a deliberate advanced opt-out config.
   - Ensure HELP returns AskSaul support info.

## Deployment reminder

A2P reviewers need to see the live opt-in flow. Deploy the AskSaul.ai code changes before submitting the final GHL campaign, or upload screenshots of the updated forms to GHL media storage and include public screenshot URLs in the campaign message-flow field.

## Things not to do

- Do not register the campaign as if it is for unconsented cold outreach.
- Do not make SMS consent required for form submission.
- Do not pre-check consent boxes.
- Do not share SMS opt-in data with third parties/affiliates for marketing.
- Do not route AskSaul.ai leads to the Exotiq GHL location.
- Do not introduce Twilio into this flow until Gregory explicitly asks.
