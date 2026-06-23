# AskSaul GHL Workflow Build Status

Updated: 2026-06-13

## Current workflow architecture

The AskSaul outreach system is intentionally split into separate workflows:

1. `Ask Saul Text Booking`
   - Workflow ID: `9b92e838-8bc5-4e15-a487-560a6e3743aa`
   - Channel: SMS reply/booking flow
   - Status: Draft
   - Purpose: handle interested inbound SMS replies and move prospects toward Saul demo call, booking link, or manual callback.

2. `AskSaul Founder Email Outreach`
   - Workflow ID: `d79baefe-f0f8-4f4f-be92-db81e78eb67d`
   - Channel: Email-only founder outreach
   - Status: Draft
   - Purpose: five-email outreach sequence using `send.asksaul.ai` and Saul's provider demo line `+1 (970) 401-7285`.

These workflows should remain separate. They coordinate through shared tags and fields.

## Completed

- Created/confirmed GHL tags and custom fields needed for AskSaul outbound.
- Tightened and saved the existing `Ask Saul Text Booking` draft.
- Created the separate `AskSaul Founder Email Outreach` draft workflow in GHL UI using the workflow builder AI.
- Verified via API that both workflows exist and are draft.
- Wrote sales rep guide: `/Users/gbot/Projects/AskSaul/docs/sales/asksaul-ghl-sales-user-guide.md`

## Current known issue

The new `AskSaul Founder Email Outreach` workflow is not ready to publish yet.

GHL's workflow builder AI created the main email sequence, but left a validation item in the UI:

- `Update 'AskSaul Last Outreach Step' Custom Field to 'email_1'`
- Error: `At least one field is required`

Avi prompted GHL AI to delete/fix the invalid custom-field update actions. GHL AI reported that it deleted five invalid actions, but the UI still shows the validation warning/todo. The workflow must remain draft until this is cleared.

## Email workflow still needs QA/final manual cleanup

Before publishing, verify and fix inside GHL UI:

1. Remove any invalid `Update AskSaul Last Outreach Step` action that has no field selected.
2. Add valid per-email tag actions instead:
   - after Email 1: `asksaul-outbound-email-1-sent`
   - after Email 2: `asksaul-outbound-email-2-sent`
   - after Email 3: `asksaul-outbound-email-3-sent`
   - after Email 4: `asksaul-outbound-email-4-sent`
   - after Email 5: `asksaul-outbound-email-5-sent`
3. Confirm the ending actions:
   - remove `asksaul-outbound-active`
   - add `asksaul-outbound-completed-no-response`
4. Confirm all email copy, subjects, waits, and sender identity.
5. Confirm no SMS actions exist in the email workflow.
6. Run `Test workflow` with a disposable contact.
7. Confirm no `Complete these steps before executing your workflow` warnings remain.
8. Keep draft until inbox placement and unsubscribe footer are verified.

## Do not publish yet

Neither workflow should be published until Gregory/Avi confirms:

- email workflow validation warning cleared
- text workflow test passes
- test contact receives expected email via `send.asksaul.ai`
- `saul@asksaul.ai` or seed inbox verifies SPF/DKIM/DMARC and inbox placement
- unsubscribe footer is present
- reply/book/unsubscribe/demo-call exits are tested

## Human guide

Sales-user guide is ready here:

`/Users/gbot/Projects/AskSaul/docs/sales/asksaul-ghl-sales-user-guide.md`
