# AskSaul.ai 9.5+ Automation Push Notes

## Implemented in this push

- All user-facing booking CTAs should route to the Ask Saul GHL calendar, not the old Calendly link.
- API responses for contact/proposal/voice/chat expose the Ask Saul GHL booking URL where relevant.
- Internal lead alerts are now wired as a non-blocking post-GHL step. Configure either:
  - `ASKSAUL_INTERNAL_ALERT_WEBHOOK_URL`, or
  - `ASKSAUL_TELEGRAM_BOT_TOKEN` + `ASKSAUL_TELEGRAM_CHAT_ID` + optional `ASKSAUL_TELEGRAM_THREAD_ID`.
- Alerts are intentionally sent only after GHL capture succeeds; alert failures warn but do not drop the lead.
- Chat leads now include both `chat-assistant` and `chat-widget` tags so existing/new GHL workflow filters can catch either naming convention.

## GHL workflow status

LeadConnector API verified:

- Custom fields endpoint works for Ask Saul location `RxCVQeGoQ3RTJbbLG5gY`.
- Calendar endpoint works and confirms:
  - `Gregory - Ask Saul Phone Agent Intro`
  - calendar ID `tbvii3aqFCtT85hdV0Gu`
  - 15-minute slots
  - active
  - autoConfirm true
- Workflow list endpoint works and shows existing draft:
  - `Ask Saul Text Booking`
  - workflow ID `9b92e838-8bc5-4e15-a487-560a6e3743aa`
  - status `draft`

Known API limitation:

- Workflow detail/publish endpoints still return 404 through the current public LeadConnector token.
- Direct workflow creation/edit/publish should stay as a follow-up TODO unless Gregory provides a higher-scope workflow/automation token or we use the authenticated GHL UI session.

## Follow-up TODO after this push

1. Publish/validate the `Ask Saul Text Booking` workflow in GHL UI, or get a scoped token/API route that can edit/publish workflows.
2. If Gregory wants true Saul-owned appointment booking, scope direct GHL appointment creation:
   - available slots lookup
   - conversation-driven time selection
   - appointment creation
   - confirmation/reminder flow
   - cancellation/reschedule handling
3. Keep all proactive outbound on GHL. Current production safety posture is `GHL_OUTBOUND_SMS_ENABLED=0` and `GHL_OUTBOUND_DRY_RUN=1`, so the site captures the lead in GHL, shows the booking link, and leaves personal/manual text follow-up available until the GHL SMS/email workflow is explicitly enabled.
4. Use email as the safe backup channel if GHL SMS is too much lift or not approved yet; do not re-enable SendBlue for proactive outbound unless SendBlue confirms the number/account is outbound-enabled.
5. Configure internal alert env vars in Netlify once Gregory chooses webhook vs Telegram bot.
6. Run production route-by-route GHL readback QA and delete disposable contacts.
