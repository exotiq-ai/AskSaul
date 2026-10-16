import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { buildAuditRequestPayload, buildProposalPayload, sendToGHL } from "../lib/ghl.ts";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv };
});

function fakeGhl(initialTags = []) {
  process.env.GHL_API_KEY = "test-only-no-network";
  process.env.GHL_LOCATION_ID = "RxCVQeGoQ3RTJbbLG5gY";
  const tags = new Set(initialTags);
  const emails = [];
  const contacts = [];
  globalThis.fetch = async (url, options = {}) => {
    const path = new URL(url).pathname;
    const body = options.body ? JSON.parse(options.body) : {};
    if (path === "/contacts/upsert") {
      contacts.push(body);
      return Response.json({ contact: { id: "same-customer" } });
    }
    if (path === "/contacts/same-customer" && !options.method?.includes("POST")) {
      return Response.json({ contact: { tags: [...tags] } });
    }
    if (path === "/contacts/same-customer/tags") {
      body.tags.forEach((tag) => tags.add(tag));
      return Response.json({});
    }
    if (path.endsWith("/notes")) return Response.json({});
    if (path === "/opportunities/search") return Response.json({ opportunities: [{ id: "existing-opportunity" }] });
    if (path === "/conversations/messages") {
      assert.equal(body.type, "Email", "These flows must not send an unsolicited SMS");
      emails.push(body);
      return Response.json({ messageId: `email-${emails.length}` });
    }
    throw new Error(`Unexpected test request: ${path}`);
  };
  return { tags, emails, contacts };
}

const customer = { name: "Test Customer", businessName: "Example HVAC", email: "qa@example.com", phone: "2025550143" };
const proposal = () => buildProposalPayload({
  ...customer, services: ["voice-agent"], industry: "Home Services (HVAC, Plumbing, Pool, Roofing)",
  teamSize: "2-5", preferredContact: "email", timeline: "1-2-months", smsConsent: false,
});
const audit = () => buildAuditRequestPayload({ ...customer, trade: "HVAC", city: "Denver metro", afterHoursTestOk: false, smsConsent: false });

test("one customer receives a distinct confirmation for a map and an audit, while retries do not resend", async () => {
  const ghl = fakeGhl();
  await sendToGHL(proposal());
  await sendToGHL(audit());
  await sendToGHL(proposal());
  await sendToGHL(audit());
  assert.equal(ghl.emails.length, 2);
  assert.match(ghl.emails[0].subject, /Automation Map/);
  assert.match(ghl.emails[1].subject, /Audit/);
});

test("an older generic confirmation tag does not swallow the first audit acknowledgment", async () => {
  const ghl = fakeGhl(["ask-saul-website-email-1-sent", "ask-saul-email-followup-sent"]);
  await sendToGHL(audit());
  assert.equal(ghl.emails.length, 1);
});

test("map acknowledgment explains the deliverable and timing without leaking system fields or quoting a price", async () => {
  const ghl = fakeGhl();
  await sendToGHL(proposal());
  const email = ghl.emails[0].message;
  assert.match(email, /24 hours/);
  assert.match(email, /1.?3 workflows/);
  assert.match(email, /15-minute/);
  assert.doesNotMatch(email, /website_automation_map|voice-agent\b|GHL|\$4,?000|pay.per.close|no contract/i);
});

test("voice interest carries the current scoped founding terms into the CRM", async () => {
  const ghl = fakeGhl();
  await sendToGHL(proposal());
  const terms = ghl.contacts[0].customFields.find((field) => field.id === "LD6ph3fa6UkPqnu8aXda").value;
  assert.match(terms, /Front Range.*roofing.*HVAC/i);
  assert.match(terms, /90 days/);
  assert.match(terms, /12 months/);
  assert.doesNotMatch(terms, /no contract|pay.per.close|pilot/i);
});

test("audit acknowledgment preserves consent and separates the requested report from its receipt", async () => {
  const ghl = fakeGhl();
  await sendToGHL(audit());
  const email = ghl.emails[0].message;
  assert.match(email, /request/);
  assert.match(email, /one-page report/);
  assert.match(email, /only.*permission|without.*permission/i);
  assert.doesNotMatch(email, /report is ready|audit is complete|One after-hours test call, so/i);
});

test("legacy chat confirmations remain suppressed for a contact who already received one", async () => {
  const ghl = fakeGhl(["ask-saul-website-email-1-sent"]);
  await sendToGHL({ source: "asksaul-chat-assistant", contact: { ...customer }, tags: ["chat-widget"] });
  assert.equal(ghl.emails.length, 0);
});

test("a rejected confirmation email is not marked sent and can be retried", async () => {
  const ghl = fakeGhl();
  const successfulFetch = globalThis.fetch;
  globalThis.fetch = (url, options) => new URL(url).pathname === "/conversations/messages"
    ? Promise.resolve(Response.json({ error: "provider temporarily unavailable" }, { status: 503 }))
    : successfulFetch(url, options);
  const failed = await sendToGHL(audit());
  assert.equal(failed.email.ok, false);
  assert.equal(ghl.tags.has("ask-saul-audit-confirmation-sent"), false);
  globalThis.fetch = successfulFetch;
  await sendToGHL(audit());
  assert.equal(ghl.emails.length, 1);
});
