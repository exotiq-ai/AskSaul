# Proposal and audit readiness

Updated October 16, 2026. Work branch: `codex/asksaul-proposal-audit-copy`.

## Scope

The Automation Map remains a general-services intake. Its phone-agent guidance and CRM offer terms now match the current Founding Client Program for qualified Front Range roofing and HVAC shops. Confirmation copy describes a request being received, followed by Gregory's review and delivery, without suggesting that a report has already been generated.

- Automation Map: a scoped proposal identifying 1–3 workflows, emailed within the site's existing 24-hour promise.
- Audit: a one-page findings report with the top 3 fixes. Timing is confirmed by follow-up rather than inventing an immediate or 24-hour audit promise.
- Booking: 15 minutes, verified against the live calendar configuration on October 16.
- After-hours audit calls and SMS consent remain optional and unchecked by default.
- Separate email-sent tags let one contact receive both a map acknowledgment and an audit acknowledgment. Repeated requests of the same type retain duplicate-email protection. Legacy chat confirmation protection is preserved.

## Verification

- `npm test`: 7 regression tests passed, including cross-flow confirmations, same-flow retries, current CRM terms, failed-email retries, consent, and legacy chat suppression.
- Changed files pass ESLint and `tsc --noEmit`.
- `npm run build`: passed (Next.js 16.2.7, 61 generated pages).
- Independent review: no blocking security or logic issues.
- Gregory separately reported a successful live voice-chat → lead → GHL → Telegram notification test before this change.
- Live proposal and audit preview submissions: pending verification. Gregory authorized using his name and `gregory.ringler@gmail.com` as the customer. Keep test submissions clearly labeled; leave SMS and after-hours test-call consent off.

## Fulfillment boundary

These endpoints capture requests, send acknowledgment emails, and alert the operator. They do not generate or deliver the completed proposal/audit report. A working acknowledgment is not evidence of fulfillment. Delivery of the actual scoped proposal and checked audit report remains an operational responsibility.

## Workspace

The implementation is based on GitHub `main` at `f927589`. It uses a separate worktree at `/Users/gbot/Projects/asksaul-proposal-audit-copy`. The older `feat/voice-roi-lead-capture` checkout and its unfinished changes were not modified.
