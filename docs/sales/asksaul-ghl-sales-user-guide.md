# AskSaul GHL Sales User Guide

Created: 2026-06-13  
Audience: AskSaul sales rep / appointment setter  
Owner: Gregory  
System owner: Avi  
GHL location: AskSaul / `RxCVQeGoQ3RTJbbLG5gY`

## What this system does

AskSaul uses separate GHL workflows for email and text so prospects get the right follow-up without being over-contacted.

There are two main workflows:

1. **AskSaul Founder Email Outreach**
   - Channel: email only
   - Purpose: founder-led cold/warm outreach to prospects
   - Trigger: adding the tag `saul-outbound-prospect`
   - Main CTA: call Saul's demo line at `+1 (970) 401-7285`

2. **Ask Saul Text Booking**
   - Channel: SMS replies only
   - Purpose: handle interested replies, ask a few qualification questions, and move the prospect toward a 15-minute call with Gregory
   - Trigger: inbound SMS reply from an AskSaul/local-service prospect

Do not merge these workflows. Email outreach and SMS booking stay separate.

## Key rule

Do not manually send prospects into outreach unless they are clean, relevant, and tagged correctly.

If in doubt, ask Gregory before enrolling.

---

## Main tags you need to know

### Start email outreach

Add this tag to start the email sequence:

- `saul-outbound-prospect`

Only add it when the prospect is approved for email outreach.

### Active / status tags

- `asksaul-outbound-active` — prospect is currently in the email outreach sequence
- `asksaul-outbound-engaged` — prospect replied, called, booked, or otherwise engaged
- `asksaul-outbound-completed-no-response` — prospect finished the sequence without response
- `asksaul-outbound-suppressed` — do not contact this prospect

### Email step tags

These show which email has been sent:

- `asksaul-outbound-email-1-sent`
- `asksaul-outbound-email-2-sent`
- `asksaul-outbound-email-3-sent`
- `asksaul-outbound-email-4-sent`
- `asksaul-outbound-email-5-sent`

### Engagement tags

- `called-saul-demo-line` — prospect called the Saul demo line
- `appointment-offered` — prospect was offered a booking link or callback
- `appointment-booked` — prospect booked
- `interested` — prospect showed interest

### Email hygiene tags

- `email_status:verified` — okay for normal email outreach
- `email_status:catchall_slow_track` — use caution, slower/manual track only
- `email_status:invalid_do_not_send` — never email

---

## How to enroll a prospect in email outreach

1. Open the contact in GHL.
2. Confirm the contact has:
   - Valid email
   - Company name
   - Correct industry/business type if known
   - No DND/unsubscribe/bounced status
   - No `asksaul-outbound-suppressed` tag
   - No `email_status:invalid_do_not_send` tag
3. Confirm the prospect is relevant for AskSaul voice agents.
4. Add these tags if not already present:
   - `ask-saul`
   - `vertical:local-services`
   - `email_status:verified`
   - relevant industry tag, like `industry:roofing`, `industry:hvac`, `industry:plumbing`, etc.
5. Add the start tag:
   - `saul-outbound-prospect`

That start tag is what enrolls them into email outreach once the workflow is active.

## Do not enroll if

Do not add `saul-outbound-prospect` if any of these are true:

- They unsubscribed
- They are DND
- They bounced
- They are marked wrong number
- They are not a local service / provider prospect
- Their email is invalid
- They are already booked or in an active deal
- They have `asksaul-outbound-suppressed`
- You are unsure whether the lead is approved

---

## What the email sequence says

The email workflow sends five plain-text founder-style emails over about 14 days.

### Email 1

Subject: `quick question about {{company}}'s missed calls`

Theme: asks what happens when calls are missed.

### Email 2

Subject: `hear Saul take a call in 60 seconds`

Theme: asks them to call Saul's demo line:

`+1 (970) 401-7285`

### Email 3

Subject: `what one missed call costs you`

Theme: explains the revenue loss from missed calls.

### Email 4

Subject: `how Saul actually works`

Theme: explains Saul answers, qualifies, books/captures callback, and lands the context in CRM.

### Email 5

Subject: `should I close this out?`

Theme: polite breakup email.

---

## What to do when a prospect replies

### If they reply positively

Examples:

- yes
- interested
- tell me more
- how does it work
- can it work with GHL
- call me
- cost?
- send info
- book
- demo

Do this:

1. Make sure they are tagged `interested`.
2. Make sure they are tagged `asksaul-outbound-engaged`.
3. Move/create opportunity in **Marketing Pipeline** stage **Hot Lead**.
4. Reply quickly and conversationally.
5. Push them toward one of two options:
   - Call Saul directly: `+1 (970) 401-7285`
   - Book / schedule a 15-minute call with Gregory

Suggested reply:

```text
Great. Two easy options.

You can call Saul directly and hear the agent live: (970) 401-7285.

Or I can ask a couple quick questions here and get a good callback window over to Gregory.

What kind of calls would you want the agent to handle: new leads, after-hours, quotes, scheduling, emergencies, or something else?
```

### If they ask for price

Suggested reply:

```text
It depends on the workflow and call volume, but the way Gregory usually looks at it is simple: what is one missed booked job worth?

If Saul can catch even a few calls that currently go to voicemail or competitors, the ROI usually makes sense fast.

Want to call the demo line and hear how it works? (970) 401-7285
```

### If they want to book

Send the booking link if available in GHL, or ask for a window.

Suggested reply:

```text
Perfect. Grab a 15-minute phone slot here and Gregory will call you with the context already in front of him:

https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-3d837e4b-c899-44ff-b612-275f498c2128
```

If they do not want to use the link:

```text
No problem. What is a good window for Gregory to call you and walk through the setup?
```

Then add:

- `needs-manual-scheduling`
- note with the callback window
- notify Gregory

### If they say stop / unsubscribe / wrong number

Do not argue.

Do this:

1. Add `asksaul-outbound-suppressed`.
2. Add `opted-out` or `wrong-number` if appropriate.
3. Set DND if possible.
4. Do not send more messages.

Suggested reply only if appropriate:

```text
Understood. I will make sure you are not contacted again.
```

---

## How to use Saul's demo line

The demo line is:

`+1 (970) 401-7285`

Use it when a prospect wants to understand the product quickly.

Tell them:

```text
Call this line like you are a customer trying to book something: (970) 401-7285.

You will hear how fast Saul answers, qualifies, and moves toward a booking.
```

If they call the demo line and we can match them in GHL, the contact should get:

- `called-saul-demo-line`
- `asksaul-outbound-engaged`

Then the email outreach should stop.

---

## Opportunity stages

Use the **Marketing Pipeline**.

Typical movement:

1. New/imported prospect: no opportunity yet or early lead stage
2. Positive reply: move/create opportunity to **Hot Lead**
3. Appointment booked: move to **New Booking**
4. Closed customer: move to won/closed stage as Gregory defines

Always add a short note when moving a deal.

Good note format:

```text
AskSaul outreach reply.
Interest: warm
Pain/context: missed after-hours calls / front desk overload / wants GHL integration
Next step: sent Saul demo line and booking link
Owner: Gregory
```

---

## Daily sales rep routine

### Morning

1. Check GHL Conversations for replies.
2. Check Hot Lead opportunities.
3. Check any `needs-manual-scheduling` contacts.
4. Check contacts that called Saul's demo line.
5. Reply to all warm responses first.

### Midday

1. Review new replies.
2. Move interested prospects to Hot Lead.
3. Offer demo line or booking link.
4. Make sure opt-outs are suppressed.

### End of day

1. Confirm no replied prospect is still being actively emailed.
2. Confirm booked prospects have `appointment-booked`.
3. Confirm manual scheduling windows were sent to Gregory.
4. Add notes to any messy conversations.

---

## Quality rules

- Keep replies short and human.
- Do not oversell AI.
- Do not promise exact results.
- Do not use unsupported claims like guaranteed booked jobs.
- Do not keep emailing/texting after a stop/unsubscribe.
- Do not enroll bad emails.
- Do not send bulk live batches unless Gregory approves.
- Use Saul's provider demo line for this campaign, not the SendBlue text-only number.

---

## When to ask Gregory

Ask Gregory before proceeding if:

- The prospect asks for custom pricing
- The prospect is a larger account / multi-location operator
- The prospect asks technical integration questions you cannot answer
- The prospect wants an immediate call
- The prospect is angry or confused
- You are unsure whether a contact should be suppressed

---

## Admin checklist before going live

The workflows should remain draft until Gregory/Avi confirms:

- `send.asksaul.ai` sender is verified and inboxing cleanly
- Email workflow has no validation warnings
- Text workflow has no validation warnings
- Email sends use business-hour pacing
- Unsubscribe footer appears in emails
- Reply/unsubscribe/book/demo-call exits are verified
- Test contact completes the flow correctly
- First live batch is only 10-20 approved prospects

Do not publish workflows until the admin checklist is complete.
