# AskSaul.ai GHL A2P Outbound Campaign Plan

Last updated: 2026-06-09
Owner: Gregory Ringler / AskSaul.ai
Primary system: GoHighLevel / LeadConnector SMS
Decision: Hold Twilio for now. Use GHL/LeadConnector for outbound SMS so conversations, contact records, workflows, opt-outs, and pipeline context stay inside the Ask Saul GHL location.

## Why this plan

Sendblue is being treated as a warm/inbound iMessage channel only unless Sendblue explicitly enables true Enterprise/Blue Ocean outbound. For proactive SMS, use GHL/LeadConnector because it is already the CRM for AskSaul.ai lead capture and can handle SMS opt-outs, workflow routing, conversation history, and pipeline attribution in one place.

## Sources checked

- HighLevel support: A2P 10DLC Campaign Approval Best Practices, modified 2026-05-28.
- HighLevel support: What is A2P 10 DLC: Brand and Campaign Registration, modified 2026-02-24.
- Twilio docs: A2P 10DLC campaign review currently takes about 10–15 days. Twilio is not needed for this first GHL path.

## Fast-approval strategy

Submit a conservative campaign that matches the live AskSaul.ai website and visible opt-in language.

Recommended campaign type:
- Mixed / Customer Care + Marketing only if GHL requires one campaign for both categories.
- Prefer separate consent language on the website for:
  - Non-marketing / transactional project follow-up.
  - Marketing tips, service updates, and occasional offers.

Avoid claiming broad cold outbound in the campaign if the approval flow is intended for website leads. The fastest approval path is a website opt-in campaign where reviewers can verify the opt-in directly on asksaul.ai.

## Brand / business fields to confirm before submission

Use the exact legal details that match the EIN / CP575 / IRS letter if registering a Standard Brand.

- Legal business name: Ask Saul Inc. (verify exact IRS spelling)
- DBA / brand: AskSaul.ai
- EIN: TODO Gregory to provide in GHL Trust Center
- Business address: 1001 S Main St #6709, Kalispell, MT 59901 (verify exact IRS address)
- Website: https://asksaul.ai
- Support email: saul3000bot@gmail.com, or preferably a branded domain email if available
- Support phone: TODO choose GHL/LC outbound number shown in Trust Center
- GHL location: RxCVQeGoQ3RTJbbLG5gY

## Website compliance changes already made

The AskSaul.ai forms were updated to satisfy HighLevel A2P guidance:

- SMS opt-in checkboxes are optional, not required to submit.
- Non-marketing SMS consent is separate from marketing SMS consent.
- Consent boxes are not pre-selected.
- Consent copy includes:
  - Brand identity: AskSaul
  - Program description
  - Message frequency varies
  - Message and data rates may apply
  - HELP instructions
  - STOP opt-out instructions
  - Privacy Policy and Terms links
- Privacy Policy now includes carrier-required “no third-party sharing of text messaging originator opt-in data and consent” language.
- Terms state SMS consent is not a purchase condition.

Relevant files:
- `components/proposal-builder/ContactPreferences.tsx`
- `components/contact/ContactForm.tsx`
- `components/voice-agents/VoiceAgentLeadForm.tsx`
- `lib/validation.ts`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`

## Public opt-in locations for A2P submission

Use these URLs as the CTA/opt-in proof:

1. `https://asksaul.ai/build-your-proposal`
   - Step 4 contains optional SMS checkboxes with Privacy/Terms links.

2. `https://asksaul.ai/voice-agents`
   - Voice-agent lead form contains optional SMS checkboxes with Privacy/Terms links.

3. `https://asksaul.ai/contact`
   - Contact form contains optional SMS checkboxes with Privacy/Terms links.

If the live site has not deployed these changes yet, deploy first or upload screenshots to GHL media storage and use those public image URLs in the campaign submission.

## Exact answer: How do end users consent to receive messages?

Use this as the GHL “Message Flow / Call to Action / How do end-users consent” field, adjusting the sending number once known:

```text
End users opt in on AskSaul.ai by submitting the Automation Map form at https://asksaul.ai/build-your-proposal, the Voice Agents inquiry form at https://asksaul.ai/voice-agents, or the Contact form at https://asksaul.ai/contact.

These forms ask for the user's phone number and include two separate, optional SMS consent checkboxes. The user can submit the form without checking either SMS box. The checkboxes are not pre-selected.

Non-marketing checkbox language: “I consent to receive non-marketing text messages from AskSaul about this inquiry, including follow-up questions, callback coordination, project updates, and booking reminders. Message frequency varies. Message and data rates may apply. Text HELP for help, reply STOP to opt out.”

Marketing checkbox language: “I consent to receive marketing text messages from AskSaul about automation tips, service updates, and occasional offers. Message frequency varies. Message and data rates may apply. Text HELP for help, reply STOP to opt out.”

The form links to the Privacy Policy at https://asksaul.ai/privacy and Terms of Service at https://asksaul.ai/terms. The Privacy Policy states that text messaging originator opt-in data and consent will not be shared with third parties. AskSaul sends messages from [INSERT GHL/LC PHONE NUMBER].
```

## Campaign description

Use this as the GHL campaign description:

```text
AskSaul.ai sends SMS messages to prospective clients who submit forms on asksaul.ai and optionally consent to SMS. Messages are sent by AskSaul to business owners and operators who requested help with AI voice agents, missed-call recovery, automation mapping, or related technology services.

After opting in, recipients may receive non-marketing follow-up messages about their inquiry, callback coordination, booking reminders, and project updates. Recipients who separately opt into marketing may receive occasional automation tips, service updates, and offers from AskSaul. Message frequency varies. Recipients can reply STOP to opt out or HELP for help.
```

## Opt-in confirmation message

HighLevel recommends the opt-in confirmation be under 160 characters. Use:

```text
AskSaul: You’re opted in for SMS about your inquiry. Msg freq varies. Msg&data rates may apply. Reply HELP for help, STOP to opt out.
```

Character count: ~139 depending on punctuation.

## Sample message #1 — Promotional / Marketing

Use for Sample Message #1 if the registration flow separates content type:

```text
AskSaul: Quick idea for [Business Name] — Saul can answer missed calls, qualify leads, and route notes into GHL. Want the 2-min demo link? Reply STOP to opt out.
```

## Sample message #2 — Transactional / Informational

Use for Sample Message #2:

```text
AskSaul: Thanks [First Name], we received your request for [Business Name]. Gregory will review it and follow up during [Preferred Callback Window]. Reply HELP for help, STOP to opt out.
```

## Opt-in keywords

Use the standard set:

```text
START, YES, UNSTOP, OPTIN
```

## Opt-out keywords

Use the standard set:

```text
STOP, UNSUBSCRIBE, END, QUIT, CANCEL, STOPALL
```

## Opt-out confirmation message

```text
AskSaul: You have been unsubscribed and will no longer receive SMS messages from this number. Reply START to resubscribe.
```

## HELP keywords

```text
HELP, INFO, SUPPORT
```

## HELP message

```text
AskSaul: For help, email saul3000bot@gmail.com or visit https://asksaul.ai/contact. Reply STOP to opt out.
```

## Content boundaries for approval and deliverability

Allowed under this campaign:
- Follow-up to AskSaul.ai form submissions.
- Callback coordination.
- Booking reminders.
- Project updates.
- Occasional AskSaul tips/offers only when marketing SMS was separately selected.

Do not use this campaign for:
- Purchased cold lists.
- Unconsented first-touch cold SMS.
- Affiliate/third-party marketing blasts.
- Loan, debt, cannabis/CBD, gambling, adult, hate, SHAFT, or other prohibited categories.
- Anything where opt-in proof cannot be shown to a reviewer.

## GHL submission checklist

Before pressing submit in GHL Trust Center:

- [ ] Brand name, EIN, address, website, and email match business records.
- [ ] The live website is deployed with optional SMS consent checkboxes.
- [ ] Privacy Policy is publicly accessible and includes no-sharing language for SMS consent.
- [ ] Terms are publicly accessible and state SMS consent is not a purchase condition.
- [ ] The GHL/LC phone number is selected and inserted in the message-flow field.
- [ ] Sample messages include AskSaul brand name and bracketed variables.
- [ ] At least one sample message includes STOP opt-out language.
- [ ] HELP/STOP keywords and response messages are configured.
- [ ] Campaign use case matches the samples. Do not mix OTP/auth language into a marketing/customer-care campaign.

## Post-approval operating plan

1. Keep Sendblue as inbound/warm iMessage only.
2. Use GHL/LC for opted-in website lead follow-up and booking coordination.
3. Keep cold/prospecting outside this campaign until a separate compliant opt-in route or call-first workflow exists.
4. Do not flip automated outbound until approval is complete and Gregory signs off on first live templates.
5. Log every outbound SMS path in GHL so STOP/HELP and consent state remain canonical.
