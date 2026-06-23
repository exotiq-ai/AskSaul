# AskSaul Voice Agent Email Outreach Plan

Created: 2026-06-13
Owner: Gregory / Avi
GHL location: `RxCVQeGoQ3RTJbbLG5gY`
Primary CTA: Saul provider voice demo line `+1 (970) 401-7285`

## Current live posture discovered

DNS checks from Avi on 2026-06-13:

- `asksaul.ai` MX: `smtp.google.com`
- Root SPF TXT: missing
- Root DMARC TXT: missing
- Google DKIM: present at `google._domainkey.asksaul.ai`
- Resend DKIM: missing at `resend._domainkey.asksaul.ai`
- `go.asksaul.ai`: no CNAME/TXT detected yet
- `_dmarc.go.asksaul.ai`: missing

Local GHL credentials exist for the AskSaul/local-services location, but the current key returned `403` for broad admin reads like locations/tags/workflows/custom-fields. Existing project code has working patterns for contact upsert and conversation email sends, so workflow/admin setup may need a broader LeadConnector OAuth token, GHL UI access, or manual UI setup with API-backed testing.

## Recommended architecture

### 1. Protect the root domain

Do not cold-send from `asksaul.ai` root addresses until SPF and DMARC are fixed. Keep Google Workspace MX intact.

Preferred outbound identities:

- Best cold-outbound domain: `getasksaul.com` or similar separate domain.
- Acceptable subdomain: `go.asksaul.ai`, `mail.asksaul.ai`, or `hello.asksaul.ai`.
- From name: `Gregory at AskSaul`.
- Reply-to: a monitored inbox Gregory/Avi can inspect.
- Demo CTA: `+1 (970) 401-7285`, not the SendBlue text-only number.

### 2. Choose sending rail

Use this decision tree:

1. If GHL LC Email dedicated sending domain is available and verified, use it for native workflow sending, unsubscribes, conversations, and reply detection.
2. If GHL domain/IP upsells or shared-pool risk are a blocker, use GHL custom SMTP through Resend as the next best path.
3. If GHL custom SMTP limits idempotency/logging, use GHL workflow webhook -> Worker -> Resend API, then log the send/note back into GHL.

For this outbound campaign, GHL-native is operationally best if deliverability is clean because exits on reply/book/unsubscribe are easier.

### 3. DNS/authentication requirements

For the chosen outbound domain/subdomain:

- SPF: authorize only the active sender rail. For root Google Workspace plus Resend later, likely shape is `v=spf1 include:_spf.google.com include:amazonses.com ~all`, but use exact vendor records from the dashboard.
- DKIM: add the records GHL/Resend provides.
- DMARC: start with monitoring:
  - `v=DMARC1; p=none; rua=mailto:dmarc@asksaul.ai; adkim=r; aspf=r; pct=100`
  - If the `rua` mailbox is not real, create/forward it or omit `rua` temporarily.
- Tracking CNAME: only after core auth is green. Early cold email should avoid links anyway.
- Google Postmaster Tools: set up after DMARC is live.

### 4. Warmup and volume controls

- Start at 20-40 prospects/day per new sending identity.
- Ramp over 2-4 weeks only if bounces, complaints, and replies stay healthy.
- Keep bounces below 2-3%.
- Keep spam complaints below 0.3%, preferably near zero.
- Enroll in daily batches with versioned tags, not one large import.
- Send only during business hours in the prospect's local timezone when possible.

### 5. List hygiene and tagging

Before import:

- Verify emails with ZeroBounce, NeverBounce, or equivalent.
- Drop invalids.
- Put catch-alls/unverifiable addresses into a slower, lower-volume track, not the main ramp.
- Require either email or phone for GHL upsert.
- Keep prior imported leads unless Gregory asks for cleanup.

Mandatory tags:

- `ask-saul`
- `saul-outbound-prospect`
- `source:<provider>`
- `batch:asksaul-outbound-YYYYMMDD-vN`
- `industry:<vertical>`
- `business_type:<specific-type>`
- `vertical:local-services`
- `region:<market>`
- `email_status:verified` or `email_status:catchall_slow_track`

### 6. GHL workflow design

Workflow name: `AskSaul Voice Agent Founder Outreach v1`

Entry trigger:

- Contact tag added: `saul-outbound-prospect`

Entry filters:

- Has email
- Not DND
- Not unsubscribed
- Not bounced
- Not already customer/opportunity won
- Not tagged `asksaul-outbound-suppressed`
- Not tagged `asksaul-outbound-active` unless resuming intentionally

Exit goals/suppression:

- Replied
- Unsubscribed
- Booked appointment
- Opportunity created or moved to interested/booked
- Called demo line and matched to contact
- Manual suppression tag added

Per-email idempotency tags:

- `asksaul-outbound-email-1-sent`
- `asksaul-outbound-email-2-sent`
- `asksaul-outbound-email-3-sent`
- `asksaul-outbound-email-4-sent`
- `asksaul-outbound-email-5-sent`

After every successful send, add a note with subject, template version, sending rail, and message id if available.

### 7. Copy improvements to Claude's draft

Keep the five-email sequence, but make these changes:

- Segment by vertical. Roofing, HVAC, medspa, plumbing, dental, and legal should not all get identical pain examples.
- Add one optional personalization sentence from website/city/service category. Keep it truthful and short.
- Do not rely on opens as a primary branch. Apple Mail Privacy Protection and bot opens make opens noisy. Use replies, calls, bookings, bounces, unsubscribes, and positive/negative sentiment as primary signals.
- No links in emails 1-3 other than mandatory unsubscribe footer. The phone number CTA is the feature.
- Use different subject families by vertical and rotate cautiously.
- Add a P.S. in Email 2: `P.S. It is a real line. Call it like you are a customer and try to book something.`
- Make Email 5 a true stop unless they reply or call. Do not recycle them immediately.

### 8. Attribution for demo-line calls

Because the CTA is a phone number, we need attribution beyond email opens:

- Match inbound demo calls by caller phone to existing GHL contacts when phone exists.
- If email-only prospect calls and does not identify themselves, Saul should ask for company/name/email naturally during the provider demo/debrief.
- Add tags on matched callers: `called-saul-demo-line`, `asksaul-outbound-engaged`.
- Create or advance opportunity after a qualified demo-line call.

### 9. Testing plan

1. DNS verified green for sender domain/subdomain.
2. Send one internal test through the exact sending rail to `saul@asksaul.ai` and at least one Gmail/Outlook/iCloud seed if available.
3. Inspect full headers for SPF, DKIM, DMARC pass and alignment.
4. Confirm GHL conversation/message record exists.
5. Confirm unsubscribe footer is present and functional.
6. Confirm reply handling exits the workflow.
7. Confirm booking/opportunity/called-demo tags exit the workflow.
8. Run mail-tester and aim for 8+/10 before first live batch.
9. Start with a tiny batch, then daily ramp.

## Immediate blockers / access needed

- Broader GHL API/OAuth scope or logged-in GHL UI access for workflow/domain configuration. Current local key received `403` for admin endpoints.
- Access to `saul@asksaul.ai` mailbox or forwarded test headers so Avi can verify inbox/spam placement and authentication results.
- Exact outbound domain decision: separate domain (`getasksaul.com`) vs subdomain (`go.asksaul.ai`).
- Physical mailing address to use in CAN-SPAM footer.

## What Avi can automate next

- Build/import verified prospect CSV batches with durable tags and rollback IDs.
- Create/test email templates and plain-text variants.
- Wire a Worker/Resend fallback with idempotency if GHL-native sending is not clean.
- Run DNS/postmaster/mail-tester checks and produce a go/no-go report.
- Add a daily deliverability monitor for DNS drift, bounce/complaint stats, and send-volume ramp.
- Build GHL exit/suppression QA tests using disposable contacts before any live prospecting.
