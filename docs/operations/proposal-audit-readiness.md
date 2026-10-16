# Proposal and audit readiness

Updated October 16, 2026. Released in [PR #8](https://github.com/exotiq-ai/AskSaul/pull/8), production commit `d8e8b68`.

## Scope

The Automation Map remains a general-services intake. Its phone-agent guidance and CRM offer terms now match the current Founding Client Program for qualified Front Range roofing and HVAC shops. Confirmation copy describes a request being received, followed by Gregory's review and delivery, without suggesting that a report has already been generated.

- Automation Map: a scoped proposal identifying 1–3 workflows, emailed within the site's existing 24-hour promise.
- Audit: a one-page findings report with the top 3 fixes. Timing is confirmed by follow-up rather than inventing an immediate or 24-hour audit promise.
- Booking: 15 minutes, verified against the live calendar configuration on October 16.
- After-hours audit calls and SMS consent remain optional and unchecked by default.
- Separate email-sent tags let one contact receive both a map acknowledgment and an audit acknowledgment. Repeated requests of the same type retain duplicate-email protection. Legacy chat confirmation protection is preserved.

## Verification

- `npm test`: 9 regression tests passed, including cross-flow confirmations, same-flow retries, current CRM terms, failed-email retries, consent, unrelated tag preservation, both submission orders, and legacy chat suppression.
- Changed files pass ESLint and `tsc --noEmit`.
- `npm run build`: passed (Next.js 16.2.7, 61 generated pages).
- Independent review: no blocking security or logic issues.
- Gregory separately reported a successful live voice-chat → lead → GHL → Telegram notification test before this change.
- Deploy preview passed. Proposal and audit layouts were checked at 390px with no horizontal overflow. The audit form correctly rejects an empty submission. Production integration keys remain unavailable in deploy previews.
- Production deployment `6ad240658e15768d865b6894` was verified ready at commit `d8e8b68` before testing.
- **Live API submissions passed at 15:39 UTC (09:39 MDT), October 16:** one Automation Map and one audit request, using Gregory's explicitly authorized customer identity. Both returned HTTP 200 with `success: true`, reused the existing CRM test contact and opportunity, accepted distinct acknowledgment emails, and returned `alert.ok: true` for the internal Telegram notification path. No duplicate contact/opportunity was created. SMS was skipped and after-hours test-call consent was false.
- CRM readback verified both outbound email records and the replacement of retired pay-per-close/no-contract terms with the scoped Founding Client Program terms. It also exposed a pre-existing integration issue: contact upserts replace all tags when tags are included, erasing earlier confirmation markers. Follow-up changes append route tags separately, preserving email delivery markers and unrelated CRM tags. Live retry verification is pending the follow-up release.
- Delivery boundary: GHL accepted both emails and assigned message IDs; receipt in the customer's Gmail inbox was not independently verified because the connected Gmail account is a different address. The live submissions exercised the deployed API handlers; browser checks covered form progression, review, copy, validation, and mobile layout without submitting extra duplicates.
- Private test receipts and screenshots are saved outside the repo in the local Codex task output folder. Personal customer contact details are omitted from this handoff.

## Fulfillment boundary

These endpoints capture requests, send acknowledgment emails, and alert the operator. They do not generate or deliver the completed proposal/audit report. A working acknowledgment is not evidence of fulfillment. Delivery of the actual scoped proposal and checked audit report remains an operational responsibility.

## Workspace

The implementation is based on GitHub `main` at `f927589`. It uses a separate worktree at `/Users/gbot/Projects/asksaul-proposal-audit-copy`. The older `feat/voice-roi-lead-capture` checkout and its unfinished changes were not modified.
