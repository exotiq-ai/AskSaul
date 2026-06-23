# AskSaul Outbound GHL Implementation Status

Updated: 2026-06-13
Executor: Avi
GHL location: `RxCVQeGoQ3RTJbbLG5gY`
Outbound domain/subdomain configured by Gregory: `send.asksaul.ai`

## Summary

Gregory configured `send.asksaul.ai` in GHL and Netlify DNS. Avi verified API access and completed the first non-destructive GHL configuration pass for AskSaul outbound email campaigns.

Avi has broad GHL API access for the AskSaul location when using browser-like LeadConnector headers. Earlier `403` responses were Cloudflare/browser-signature related, not necessarily missing permissions.

## DNS verification from Avi

Live DNS checks showed:

- `send.asksaul.ai` TXT SPF: `v=spf1 include:spf.leadconnectorhq.com include:mailgun.org ~all`
- `_dmarc.send.asksaul.ai` TXT: `v=DMARC1;p=none;`
- `email.send.asksaul.ai` CNAME: `mailgun.org.`
- `send.asksaul.ai` MX: `mxa.mailgun.org`, `mxb.mailgun.org`
- `asksaul.ai` root SPF: still not detected
- `_dmarc.asksaul.ai`: still not detected

GHL showing green for `send.asksaul.ai` is the main operational signal for the sending subdomain. Root `asksaul.ai` should still get SPF/DMARC fixed separately because it protects Google Workspace and brand mail.

## API access verified

Using the AskSaul/local-services token from:

- `/Users/gbot/Projects/lead-gen-saul/.env.local`
- env var: `GHL_LOCAL_SERVICES_API_KEY`

Avi verified access to:

- Location read: yes
- Tags read/create/delete: yes
- Custom fields read/create: yes
- Pipelines read: yes
- Workflows read: yes
- Calendars read: yes
- Users read: yes
- Contact search: yes
- Contact upsert: yes
- Contact note create: yes
- Contact delete: yes
- Email schedule read: yes

A disposable contact smoke test was created, noted, and deleted successfully:

- Contact upsert: HTTP 201
- Note create: HTTP 201
- Contact delete: HTTP 200

## Workflow API limitation found

The public LeadConnector workflow endpoint appears readable but not creatable via the tested public API path:

- `GET /workflows/?locationId=...`: HTTP 200
- `POST /workflows/`: HTTP 404 `Cannot POST /workflows/`

Current conclusion:

- Avi can read existing workflows through API.
- Avi can create the tags/custom fields/workflow ingredients through API.
- Actual workflow construction may still require GHL UI access unless another internal/private workflow endpoint is available.

Browser UI check showed the GHL app is currently at the login screen. Human login is required for Avi to use browser automation in the UI.

## Existing GHL assets observed

Relevant existing tags included:

- `ask-saul`
- `ask-saul-booked-email-sent`
- `ask-saul-email-1-sent`
- `ask-saul-email-followup-sent`
- `ask-saul-website-email-1-sent`
- `vertical:local-services`
- `industry:roofing`
- `industry:construction-trades`
- `industry:home-services-hvac-plumbing-pool-roofing`

Relevant existing custom fields included:

- `contact.demo_phone_agent_number`
- `contact.local_services_vertical`
- `contact.ask_saul_qualification_summary`
- `contact.phone_agent_pain_point`
- `contact.ai_phone_agent_offer`
- `contact.ask_saul_interest_level`
- `contact.sendblue_eligibility`
- `contact.lead_source_run_id`
- `contact.outscraper_source_query`

Relevant existing workflows included:

- `1. New Lead Nurture (Fast 5) - Claim Offer` — draft
- `5. Long-Term Nurture` — draft
- `6. Stale Leads` — draft
- `Ask Saul Text Booking` — draft

## Assets Avi created in GHL

### Tags created

- `saul-outbound-prospect`
- `asksaul-outbound-active`
- `asksaul-outbound-suppressed`
- `asksaul-outbound-engaged`
- `called-saul-demo-line`
- `asksaul-outbound-email-1-sent`
- `asksaul-outbound-email-2-sent`
- `asksaul-outbound-email-3-sent`
- `asksaul-outbound-email-4-sent`
- `asksaul-outbound-email-5-sent`
- `asksaul-outbound-completed-no-response`
- `email_status:verified`
- `email_status:catchall_slow_track`
- `email_status:invalid_do_not_send`
- `source:ghl-outbound`
- `batch:asksaul-outbound-test`
- `business_type:local-service-business`
- `region:colorado`
- `industry:hvac`
- `industry:plumbing`
- `industry:medspa`
- `industry:dental`
- `industry:legal`

### Custom fields created

- `AskSaul Outbound Batch` — `contact.asksaul_outbound_batch`
- `AskSaul Outbound Source` — `contact.asksaul_outbound_source`
- `AskSaul Outbound Industry` — `contact.asksaul_outbound_industry`
- `AskSaul Business Type` — `contact.asksaul_business_type`
- `AskSaul Outbound Region` — `contact.asksaul_outbound_region`
- `AskSaul Email Verification Status` — `contact.asksaul_email_verification_status`
- `AskSaul Founder Owner Name` — `contact.asksaul_founder_owner_name`
- `AskSaul Personalization Line` — `contact.asksaul_personalization_line`
- `AskSaul Last Outreach Step` — `contact.asksaul_last_outreach_step`
- `AskSaul Demo Line Called` — `contact.asksaul_demo_line_called`
- `AskSaul Suppression Reason` — `contact.asksaul_suppression_reason`
- `AskSaul Sending Rail` — `contact.asksaul_sending_rail`

## Recommended workflow to build in GHL UI

Name:

`AskSaul Voice Agent Founder Outreach v1`

Trigger:

- Contact tag added: `saul-outbound-prospect`

Entry filters:

- Email exists
- Email verification status is `verified`
- Not DND
- Not unsubscribed
- Not bounced
- Does not have `asksaul-outbound-suppressed`
- Does not have `asksaul-outbound-active`

Immediate actions:

- Add tag `asksaul-outbound-active`
- Add contact note with campaign start, batch, source, and sending rail

Email sequence:

1. Email 1 immediately, then add `asksaul-outbound-email-1-sent`, set `AskSaul Last Outreach Step` to `email_1`
2. Wait 3 days
3. Email 2, then add `asksaul-outbound-email-2-sent`, set step to `email_2`
4. Wait 3 days
5. Email 3, then add `asksaul-outbound-email-3-sent`, set step to `email_3`
6. Wait 4 days
7. Email 4, then add `asksaul-outbound-email-4-sent`, set step to `email_4`
8. Wait 4 days
9. Email 5, then add `asksaul-outbound-email-5-sent`, set step to `email_5`
10. Remove `asksaul-outbound-active`
11. Add `asksaul-outbound-completed-no-response`

Exit goals / suppressions:

- Customer replied
- Customer unsubscribed
- Appointment booked
- Opportunity moved to interested/booked/won
- Tag added: `called-saul-demo-line`
- Tag added: `asksaul-outbound-suppressed`

Required workflow settings:

- Business-hours sending only
- Respect DND/unsubscribe
- No SMS in this workflow
- Do not re-enter while `asksaul-outbound-active` exists

## Next actions

1. Gregory logs into GHL in the browser if he wants Avi to build the workflow visually.
2. Avi should send one controlled GHL test email to `saul@asksaul.ai` only after Gregory confirms the desired From address/name inside GHL.
3. Gregory or Avi should inspect full headers of the test email for SPF/DKIM/DMARC pass and alignment.
4. Root `asksaul.ai` SPF and DMARC should still be added separately.
5. Once inbox placement is proven, import a 10-20 prospect test batch with `email_status:verified` and `saul-outbound-prospect`.

## Human-required items still open

- GHL UI login if visual workflow creation is desired.
- Confirm final From identity, likely `Gregory at AskSaul <gregory@send.asksaul.ai>` or the GHL-configured equivalent.
- Confirm physical mailing address in the GHL email footer.
- Provide access to `saul@asksaul.ai` inbox or forward raw test headers.
- Approve first live target vertical and batch size.
