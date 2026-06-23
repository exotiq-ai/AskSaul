# AskSaul Voice Agent Email Outreach — GHL/API Handoff Plan

Created: 2026-06-13  
Owner/operator: Gregory  
Backend/orchestration: Avi  
System: AskSaul Voice Agent outbound email campaigns in GoHighLevel / LeadConnector  
Primary GHL location: `RxCVQeGoQ3RTJbbLG5gY`  
Primary demo CTA: Saul provider voice line `+1 (970) 401-7285`  
Primary test inbox: `saul@asksaul.ai`

## Objective

Set up a deliverability-safe founder-led outbound email campaign for AskSaul voice agents using GHL, with API-backed setup/testing where possible, strict suppression logic, warmup controls, and inbox/spam verification before live prospecting.

The campaign goal is to drive local-service business owners to either:

1. Reply to Gregory.
2. Call Saul's demo line at `+1 (970) 401-7285`.
3. Book or request a pilot/demo.

Avi should automate setup, QA, imports, and monitoring wherever API access allows, while flagging items that require Gregory or logged-in UI access.

---

## Current known environment

### AskSaul/GHL

- GHL location ID: `RxCVQeGoQ3RTJbbLG5gY`
- Existing local env file with AskSaul GHL credentials:
  - `/Users/gbot/Projects/lead-gen-saul/.env.local`
- Known env var names:
  - `GHL_LOCAL_SERVICES_API_KEY`
  - `GHL_LOCAL_SERVICES_LOCATION_ID`
  - `GHL_API_VERSION`
  - `ASKSAUL_DEMO_PHONE`
- Existing AskSaul/GHL code references:
  - `/Users/gbot/Projects/lead-gen-saul/voice-agent/src/ghl.ts`
  - `/Users/gbot/Projects/lead-gen-saul/voice-agent/src/emailFollowup.ts`
  - `/Users/gbot/Projects/AskSaul/lib/ghl.ts`

### Important constraint

The current local GHL key exists but returned `403` on broad admin-style reads such as:

- location details
- tags
- workflows
- custom fields

Existing project code has working patterns for contact upsert and conversation message sends, but full workflow/domain setup may require one of:

- broader GHL OAuth/API scopes,
- logged-in GHL UI access,
- manual UI setup by Gregory while Avi provides exact values,
- or a GHL private integration/token with the correct scopes.

Avi must not assume the existing key can create workflows or configure email domains until tested.

---

## API key / credential handling

Avi should use local secrets from env files or runtime secret prompts. Do not paste raw keys into notes, commits, Telegram, or markdown.

### Required credentials

#### GHL / LeadConnector

Needed for API-backed contact/template/send/workflow setup.

Expected values:

```bash
GHL_LOCAL_SERVICES_API_KEY=<secret>
GHL_LOCAL_SERVICES_LOCATION_ID=RxCVQeGoQ3RTJbbLG5gY
GHL_API_VERSION=2021-07-28
```

Potentially needed if current key lacks scopes:

```bash
GHL_OUTBOUND_ADMIN_API_KEY=<secret with workflow/email/tags/custom fields permissions>
GHL_OAUTH_ACCESS_TOKEN=<secret>
GHL_OAUTH_REFRESH_TOKEN=<secret if using OAuth app>
```

#### Resend fallback

Needed only if using GHL custom SMTP through Resend or Worker -> Resend API.

```bash
RESEND_API_KEY=<secret>
RESEND_FROM_EMAIL=gregory@<outbound-domain-or-subdomain>
RESEND_FROM_NAME=Gregory at AskSaul
```

#### DNS provider

Needed only if Avi will add DNS records directly instead of Gregory doing it manually.

Possible providers/keys, depending on where `asksaul.ai` and/or the outbound domain are hosted:

```bash
CLOUDFLARE_API_TOKEN=<secret with DNS edit permissions>
CLOUDFLARE_ZONE_ID=<zone id>
```

or registrar-specific credentials if not on Cloudflare.

#### Mailbox testing

Needed to verify inbox/spam and headers for `saul@asksaul.ai`.

Options:

1. Gregory grants Avi mailbox access.
2. Gregory forwards raw original test messages with full headers.
3. Gregory sets forwarding from `saul@asksaul.ai` to an inbox Avi can read.
4. Avi tests using Gmail/Outlook/iCloud seed accounts plus mail-tester, then Gregory manually confirms `saul@asksaul.ai` placement.

---

## Human-required decisions / actions

These require Gregory unless Avi is explicitly given the needed access.

### 1. Choose outbound identity

Pick one:

- Recommended for scale: separate domain, e.g. `getasksaul.com`
- Faster/simple: subdomain, e.g. `go.asksaul.ai`, `mail.asksaul.ai`, or `hello.asksaul.ai`

Avi recommendation:

- If we expect real cold-volume scaling, use a separate domain.
- If we want fast controlled testing, use `go.asksaul.ai`.

### 2. Provide physical mailing address

Needed for CAN-SPAM footer and GHL unsubscribe compliance.

### 3. Grant GHL UI or admin-scoped API access

Current local key may not be sufficient for workflow/domain setup.

Human path:

- Gregory logs into GHL on the iMac/browser when needed.
- Avi guides the exact clicks and values.

API path:

- Gregory provides/creates a LeadConnector API/OAuth token with needed scopes for contacts, conversations, tags, workflows, email services, custom fields, opportunities, calendars, and locations.

### 4. Grant mailbox/header access

Avi needs to verify whether test sends hit inbox or spam and inspect SPF/DKIM/DMARC alignment.

### 5. Add DNS records if Avi lacks DNS access

Avi can generate exact DNS records, but Gregory may need to add them at the registrar/DNS host.

---

## DNS and deliverability setup

### Current DNS posture discovered by Avi on 2026-06-13

- `asksaul.ai` MX: `smtp.google.com`
- Google DKIM at `google._domainkey.asksaul.ai`: present
- Root SPF TXT: missing
- Root DMARC TXT: missing
- `resend._domainkey.asksaul.ai`: missing
- `go.asksaul.ai`: no records detected
- `_dmarc.go.asksaul.ai`: missing

### Minimum root-domain fix

Even if cold outbound uses a separate domain/subdomain, fix root `asksaul.ai`:

SPF shape, after verifying exact senders:

```txt
v=spf1 include:_spf.google.com ~all
```

If Resend also sends from root later:

```txt
v=spf1 include:_spf.google.com include:amazonses.com ~all
```

DMARC monitoring:

```txt
v=DMARC1; p=none; rua=mailto:dmarc@asksaul.ai; adkim=r; aspf=r; pct=100
```

If `dmarc@asksaul.ai` does not exist, either create/forward it or omit `rua` temporarily.

### Outbound domain/subdomain records

Exact records depend on whether GHL LC Email, GHL custom SMTP, or Resend is used.

Avi should obtain records from the selected provider dashboard and then verify with:

```bash
dig +short MX asksaul.ai
dig +short TXT asksaul.ai
dig +short TXT _dmarc.asksaul.ai
dig +short TXT google._domainkey.asksaul.ai

dig +short TXT <outbound-domain-or-subdomain>
dig +short TXT _dmarc.<outbound-domain-or-subdomain>
dig +short CNAME <tracking-host>
dig +short TXT <dkim-selector>._domainkey.<outbound-domain-or-subdomain>
```

### Google Postmaster Tools

Human/API note:

- Gregory may need to verify the domain in Google Postmaster Tools.
- Avi can guide verification and monitor once access exists.

---

## Sending architecture decision tree

### Preferred: GHL native / LC Email dedicated sending domain

Use if:

- Dedicated sending domain verifies green.
- GHL sends test messages that pass SPF/DKIM/DMARC alignment.
- Messages land in inbox or acceptable promotions, not spam.
- GHL reply/unsubscribe/workflow exit behavior works.

Benefits:

- Native workflows
- Native unsubscribes
- Replies in GHL Conversations
- Easier exit goals
- Easier opportunity movement

### Fallback 1: GHL custom SMTP through Resend

Use if:

- GHL native sending is poor or upsell-limited.
- Resend domain can be verified cleanly.
- GHL can send via SMTP while preserving enough conversation/reply behavior.

Settings if Resend is used:

```txt
SMTP host: smtp.resend.com
SMTP port: 587
Security: STARTTLS
Username: resend
Password: RESEND_API_KEY
From name: Gregory at AskSaul
From email: gregory@<outbound-domain-or-subdomain>
```

### Fallback 2: GHL workflow webhook -> Worker -> Resend API

Use if:

- Need stronger idempotency.
- Need better API logs/webhooks.
- Need custom headers such as `Resend-Idempotency-Key`.
- GHL native/custom SMTP is too limited.

Tradeoff:

- Emails may not appear as native GHL conversation messages unless separately logged back.

---

## GHL setup plan

### Core tags

Create/verify these tags:

```txt
ask-saul
saul-outbound-prospect
asksaul-outbound-active
asksaul-outbound-suppressed
asksaul-outbound-engaged
called-saul-demo-line

asksaul-outbound-email-1-sent
asksaul-outbound-email-2-sent
asksaul-outbound-email-3-sent
asksaul-outbound-email-4-sent
asksaul-outbound-email-5-sent

email_status:verified
email_status:catchall_slow_track
email_status:invalid_do_not_send
vertical:local-services
```

Batch/source/industry tags should be created dynamically per list:

```txt
batch:asksaul-outbound-YYYYMMDD-vN
source:<source>
industry:<industry>
business_type:<business-type>
region:<market>
```

### Recommended custom fields

Create/verify if useful for reporting/personalization:

```txt
AskSaul Outbound Batch
AskSaul Source
AskSaul Industry
AskSaul Business Type
AskSaul Region
AskSaul Email Verification Status
AskSaul Founder/Owner Name
AskSaul Personalization Line
AskSaul Last Outreach Step
AskSaul Demo Line Called
AskSaul Suppression Reason
```

### Workflow

Workflow name:

```txt
AskSaul Voice Agent Founder Outreach v1
```

Entry trigger:

```txt
Contact tag added: saul-outbound-prospect
```

Entry filters:

- Email exists
- Email verification status is `verified` for main track
- Contact is not DND
- Contact is not unsubscribed
- Contact is not bounced
- Contact does not have `asksaul-outbound-suppressed`
- Contact does not have `asksaul-outbound-active`
- Contact is not already in an open/won AskSaul opportunity

Immediate actions:

- Add `asksaul-outbound-active`
- Add workflow start note

Exit goals:

- Customer replied
- Customer unsubscribed
- Appointment booked
- Opportunity stage moved to interested/booked/won
- Tag added: `called-saul-demo-line`
- Tag added: `asksaul-outbound-suppressed`

Timing:

- Email 1: Day 0
- Wait 3 days
- Email 2: Day 3
- Wait 3 days
- Email 3: Day 6
- Wait 4 days
- Email 4: Day 10
- Wait 4 days
- Email 5: Day 14
- End, remove `asksaul-outbound-active`, optionally add `asksaul-outbound-completed-no-response`

Send window:

- Business hours only
- Prefer recipient local timezone when available
- Otherwise default to US business hours

---

## Email copy v1

Use plain text. Avoid images. Avoid links except required unsubscribe/footer. Phone CTA is the product demo.

### Email 1 — leak question

Subject:

```txt
quick question about {{contact.company_name}}'s missed calls
```

Body:

```txt
Hi {{contact.first_name}},

Quick question. When {{contact.company_name}} is slammed, after hours, or already on another call, what happens to the people who call and do not get through?

Most owners I talk to do not know the number, and it is usually booked jobs going to whoever picked up first.

I build AI voice agents. The agent is named Saul. He answers every call, qualifies the lead, and books it into your CRM. No new hires, no missed calls.

Worth a quick look for {{contact.company_name}}?

Gregory
```

### Email 2 — hear it yourself

Subject:

```txt
hear Saul take a call in 60 seconds
```

Body:

```txt
{{contact.first_name}}, easier to hear it than read about it.

Call this line and talk to Saul like you are a customer: +1 (970) 401-7285.

Notice how fast he answers, how he qualifies, and how he drives toward a booking. Then tell me where you would want him sharper.

P.S. It is a real line. Call it like you are a customer and try to book something.

Gregory
```

### Email 3 — the math

Subject:

```txt
what one missed call costs you
```

Body:

```txt
{{contact.first_name}}, simple math.

If an average job is worth a few hundred to a few thousand dollars, even a handful of missed calls a month is real money walking out the door.

Saul answers 24/7, captures the lead, and follows up so those calls stop turning into lost revenue. You are already paying to make the phone ring. This makes sure more of it lands.

Want me to map it to {{contact.company_name}}'s numbers?

Gregory
```

### Email 4 — how it works

Subject:

```txt
how Saul actually works
```

Body:

```txt
{{contact.first_name}}, three steps:

1. Saul answers every call, day or night.
2. He qualifies the caller and books the appointment or captures a callback.
3. It lands in your CRM with follow-up already moving.

No app for your customers, no new hire, no missed calls.

If you want, I will set him up on a short pilot using your real numbers so you can see the booked jobs yourself.

Open to it?

Gregory
```

### Email 5 — breakup

Subject:

```txt
should I close this out?
```

Body:

```txt
{{contact.first_name}}, I do not want to keep landing in your inbox.

If now is not the time, no problem, I will stop here.

If you are a little curious, the fastest yes is 60 seconds on the demo line: +1 (970) 401-7285.

Either way, appreciate you.

Gregory
```

---

## Vertical personalization layer

Avi should generate variants by industry before live scale.

Examples:

### Roofing

Pain examples:

- storm calls
- leak emergencies
- estimate requests
- after-hours calls

### HVAC

Pain examples:

- no-heat/no-cool calls
- seasonal surges
- weekend emergencies
- quote requests

### Plumbing

Pain examples:

- emergency leaks
- drain backups
- after-hours service calls
- missed appointment requests

### Medspa

Pain examples:

- consult requests
- front desk overload
- after-hours appointment questions
- lead follow-up delays

Avi should keep personalization factual and conservative. Do not hallucinate services, ownership, revenue, or call volume.

---

## Prospect import plan

### Required CSV fields

```txt
company_name
first_name
last_name
email
phone
website
city
state
region
industry
business_type
source
source_url
email_verification_status
owner_founder_name
personalization_line
notes
```

### Pre-import filters

- Must have valid email for email campaign.
- Drop invalid emails.
- Catch-alls go to slow track.
- Remove obvious wrong-category records.
- Require source and batch tags.
- Preserve prior imported leads unless Gregory explicitly asks for cleanup.

### Import tags

Every imported prospect should have:

```txt
ask-saul
saul-outbound-prospect
industry:<industry>
business_type:<business-type>
vertical:local-services
region:<market>
source:<source>
batch:asksaul-outbound-YYYYMMDD-vN
email_status:<verified|catchall_slow_track>
```

### Verification after import

Avi should:

1. Upsert contacts.
2. Store returned GHL contact IDs in the batch CSV.
3. Read/search back by batch tag.
4. Spot-check representative contacts.
5. Keep rollback file with contact IDs.

---

## Demo-line attribution

Because the main CTA is the phone number, outbound success must not depend only on email metrics.

Avi should wire or verify:

- Saul demo line: `+1 (970) 401-7285`
- Inbound caller phone matching to GHL contacts when phone exists
- Tags on matched calls:
  - `called-saul-demo-line`
  - `asksaul-outbound-engaged`
- Opportunity creation/advancement after qualified demo-line calls
- Internal Telegram/GHL notification to Gregory

If an email-only prospect calls, Saul should naturally capture company/name/email during the provider demo/debrief.

---

## Testing and QA plan

### DNS/auth QA

Run before sending:

```bash
dig +short TXT asksaul.ai
dig +short TXT _dmarc.asksaul.ai
dig +short TXT google._domainkey.asksaul.ai
```

Then run equivalent checks for selected outbound identity.

### GHL email QA

Using a disposable/test contact:

1. Upsert contact in GHL.
2. Add test campaign tags.
3. Send Email 1 through exact planned sending rail.
4. Confirm GHL returns queued/sent message ID.
5. Confirm message appears in GHL Conversations if using GHL-native path.
6. Confirm unsubscribe footer exists and works.
7. Confirm reply exits workflow.
8. Confirm unsubscribe exits workflow.
9. Confirm booked/called-demo-line tags exit workflow.
10. Delete or suppress the test contact.

### Inbox placement QA

Send to:

- `saul@asksaul.ai`
- Gmail seed
- Outlook seed if available
- iCloud seed if available
- mail-tester.com generated address

Inspect:

- inbox vs spam/promotions
- SPF pass
- DKIM pass
- DMARC pass
- From alignment
- List-Unsubscribe header if available
- unsubscribe footer
- spam score

Target:

- mail-tester score 8+/10 before live send
- no spam folder placement on core seeds before first batch

---

## Warmup plan

Do not dump the full list.

Suggested ramp:

```txt
Days 1-3: 20/day
Days 4-7: 30-40/day
Week 2: 50-75/day if clean
Week 3+: 100+/day only if bounce/complaint/reply posture is healthy
```

Slow or pause if:

- Bounce rate exceeds 2-3%
- Spam complaints approach 0.3%
- Seed tests land in spam
- Replies are negative or confused
- DNS/auth changes break alignment

---

## Monitoring plan

Avi can create a lightweight recurring monitor after setup.

Daily checks:

- DNS records still present
- DMARC exists
- SPF exists
- DKIM selector resolves
- GHL workflow active
- Prior-day send count
- Bounce/unsubscribe/reply counts if accessible
- Any stuck active contacts
- Any contacts that replied but are still in workflow

Weekly checks:

- Google Postmaster reputation if access available
- Top-performing verticals
- Reply sentiment
- Demo-line calls attributed to campaign
- Booked opportunities
- Unsubscribe/complaint posture

---

## Implementation sequence for Avi

### Phase 1 — Access and DNS readiness

1. Confirm outbound identity decision with Gregory.
2. Verify registrar/DNS host.
3. Add or generate DNS records for root SPF/DMARC.
4. Add provider-specific DNS for outbound identity.
5. Verify with `dig`.
6. Set up Google Postmaster Tools if possible.

Human may be required for DNS/provider login.

### Phase 2 — GHL setup

1. Test current API key scopes safely.
2. If insufficient, request broader token or GHL UI session.
3. Create/verify tags.
4. Create/verify custom fields.
5. Add email templates.
6. Build workflow with filters, waits, exits, and idempotency tags.
7. Ensure unsubscribe footer and physical address are present.

Human may be required for GHL UI workflow/domain setup.

### Phase 3 — Sending rail test

1. Send internal tests through GHL-native LC Email.
2. If poor/unavailable, test GHL custom SMTP through Resend.
3. If still poor/limited, implement Worker -> Resend API fallback.
4. Verify headers and inbox placement.

Human required for mailbox/header access unless forwarding exists.

### Phase 4 — Prospect import

1. Build/clean/enrich first small batch.
2. Verify emails.
3. Import/upsert with tags.
4. Read back by batch tag.
5. Spot-check contacts.

### Phase 5 — Tiny live launch

1. Enroll 10-20 verified prospects.
2. Watch sends, replies, unsubscribes, bounces, and demo-line calls.
3. Confirm exits work.
4. Increase only if clean.

### Phase 6 — Monitoring and iteration

1. Add daily monitor.
2. Generate weekly performance summary.
3. Add vertical-specific variants.
4. Suppress poor-fit segments.
5. Scale winning verticals.

---

## Explicit human-needed checklist

Gregory needs to provide or do these before Avi can complete everything end-to-end:

- [ ] Choose outbound domain/subdomain.
- [ ] Provide physical mailing address for footer.
- [ ] Grant DNS edit access or manually add DNS records Avi provides.
- [ ] Grant GHL UI access or create broader API/OAuth credentials.
- [ ] Grant `saul@asksaul.ai` access, forwarding, or full original headers from test sends.
- [ ] Approve first live batch size and vertical.
- [ ] Confirm final From identity, likely `Gregory at AskSaul`.

---

## Safety rules

- Do not send cold live batches until DNS/authentication is verified.
- Do not send from root `asksaul.ai` until SPF and DMARC are fixed.
- Do not send to unverified/invalid emails.
- Do not rely on open tracking as the main success signal.
- Do not continue emailing after reply, unsubscribe, booking, or manual suppression.
- Do not expose API keys in files, commits, logs, or Telegram.
- Do not delete prior imported leads unless Gregory explicitly requests cleanup.
- Do not use the SendBlue text-only number for this provider-facing demo CTA. Use `+1 (970) 401-7285`.

---

## Done criteria

This setup is complete when:

- DNS SPF/DKIM/DMARC passes for the selected outbound identity.
- Test emails to `saul@asksaul.ai` and seed inboxes do not land in spam.
- Full headers show SPF/DKIM/DMARC pass and alignment.
- GHL workflow sends all five templates in test mode.
- Reply, unsubscribe, booking, suppression, and called-demo-line exits are verified.
- First tiny batch is imported with correct tags and read back from GHL.
- First live batch is sent within warmup limits.
- Avi can produce a daily status report covering sends, bounces, replies, demo calls, and booked opportunities.
