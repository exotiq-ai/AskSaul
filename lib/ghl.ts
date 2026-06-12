import type {
  ProposalFormData,
  ContactFormData,
  ChatLeadData,
  VoiceAgentLeadData,
} from "./validation";

const ASK_SAUL_LOCATION_ID = "RxCVQeGoQ3RTJbbLG5gY";
const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";
const DEMO_PHONE_DISPLAY = "(970) 401-7285";
const ASK_SAUL_PIPELINE_ID = "QnDY45LoOWXl3VIuBa1w";
const ASK_SAUL_HOT_LEAD_STAGE_ID = "66bf5184-206f-4bfd-9944-e3d0cb0fffe4";
const WEBSITE_EMAIL_SENT_TAG = "ask-saul-website-email-1-sent";
const EMAIL_FOLLOWUP_SENT_TAG = "ask-saul-email-followup-sent";
export const BOOKING_URL =
  "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-3d837e4b-c899-44ff-b612-275f498c2128";

export function getAskSaulBookingUrl(): string {
  return process.env.ASKSAUL_BOOKING_URL || BOOKING_URL;
}

const ASK_SAUL_FIELD_IDS = {
  interestLevel: "koWrZDkgAO9sNC2s2shH",
  businessTypeService: "JgypblSA2JoQr4BEMP7y",
  serviceAreaCity: "NWy9211034cZHQY3pUkR",
  currentCallHandling: "S7tMFFwlfBysZyXzlGI9",
  phoneAgentPainPoint: "UMqZYJNIazZ2cuc0LhVu",
  desiredAgentTasks: "JhuGrgNFnYvbCRDOoHpF",
  preferredCallbackWindow: "aigpBpRx1Zu0olGsel7E",
  saulDemoOffered: "tQCyQmeCAxVuXSX90c1f",
  saulDemoCalled: "pAlvWzrw93eVv1zNqqIT",
  callbackBookingSource: "HdSlYwQDO4pO92XQk2Ox",
  followUpConsent: "IUExvT3HcVpmrCgquSLq",
  qualificationSummary: "DwFgznwilWEYtySydGXz",
  leadProject: "dhbQp5V0ndn3p9vNk3bJ",
  demoPhoneAgentNumber: "2paSojiiB35Rh9O9WnsR",
  payPerCloseTerms: "LD6ph3fa6UkPqnu8aXda",
  aiPhoneAgentOffer: "iLuun6ATAAtvZ8ajPKYz",
} as const;

// ─── Lead Scoring ────────────────────────────────────────────────────────────

export function calculateEstimatedValue(data: ProposalFormData): number {
  let estimate = 0;

  for (const service of data.services) {
    switch (service) {
      case "ai-assistant": {
        if (data.aiUserCount === "just-me") estimate += 500;
        else if (data.aiUserCount === "small-team") estimate += 1000;
        else if (data.aiUserCount === "customers") estimate += 2500;
        else estimate += 1000;
        break;
      }
      case "website": {
        if (data.websiteEcommerce === "yes") {
          estimate += 12000;
        } else if (data.websitePages === "1-5") {
          estimate += 5000;
        } else if (data.websitePages === "5-10") {
          estimate += 8000;
        } else if (data.websitePages === "10-20" || data.websitePages === "20+") {
          estimate += 12000;
        } else {
          estimate += 7000;
        }
        break;
      }
      case "marketing": {
        estimate += 15500; // $3,500 setup + $12K annual
        break;
      }
      case "automation": {
        estimate += 5000;
        break;
      }
      case "voice-agent": {
        estimate += 4000;
        break;
      }
      case "custom-app": {
        estimate += 15000;
        break;
      }
      case "not-sure": {
        estimate += 2000;
        break;
      }
    }
  }

  // Override with budget if higher
  const budgetMap: Record<string, number> = {
    "under-2k": 2000,
    "2k-5k": 5000,
    "5k-10k": 10000,
    "10k-25k": 25000,
    "25k-plus": 25000,
  };

  if (data.budget && budgetMap[data.budget] > estimate) {
    estimate = budgetMap[data.budget];
  }

  // Monthly sales/marketing spend signal: bump high-spend leads up, floor low-spend leads down
  const spendMultiplier: Record<string, number> = {
    "under-1k": 0.85,
    "1k-2.5k": 1,
    "2.5k-5k": 1.1,
    "5k-10k": 1.25,
    "10k-25k": 1.5,
    "25k-plus": 1.75,
    "not-sure": 1,
  };
  if (data.monthlySpend && spendMultiplier[data.monthlySpend]) {
    estimate = Math.round(estimate * spendMultiplier[data.monthlySpend]);
  }

  return estimate;
}

export function getLeadValueTag(estimatedValue: number): string {
  if (estimatedValue >= 10000) return "high-value";
  if (estimatedValue >= 3000) return "mid-value";
  return "starter";
}

function getServiceTags(services: ProposalFormData["services"]): string[] {
  const tagMap: Record<string, string> = {
    "ai-assistant": "ai-lead",
    website: "website-lead",
    marketing: "marketing-lead",
    automation: "automation-lead",
    "voice-agent": "voice-agent-lead",
    "custom-app": "custom-app-lead",
    "not-sure": "discovery-lead",
  };
  return services.map((s) => tagMap[s]).filter(Boolean);
}

// ─── Payload Builders ────────────────────────────────────────────────────────

export function buildProposalPayload(data: ProposalFormData) {
  const estimatedValue = calculateEstimatedValue(data);
  const valueTag = getLeadValueTag(estimatedValue);
  const serviceTags = getServiceTags(data.services);

  const nameParts = data.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    source: "asksaul-automation-map",
    timestamp: new Date().toISOString(),
    lead_project: data.services.includes("voice-agent")
      ? "ask_saul_phone_agents"
      : "asksaul_website",
    contact: {
      firstName,
      lastName,
      email: data.email,
      phone: data.phone ?? "",
      preferredContact: data.preferredContact,
    },
    business: {
      name: data.businessName,
      industry: data.industry,
      teamSize: data.teamSize,
      revenueRange: data.revenueRange ?? "",
      monthlySpend: data.monthlySpend ?? "",
    },
    services_requested: data.services,
    service_details: {
      // AI
      aiUserCount: data.aiUserCount,
      aiPlatform: data.aiPlatform,
      aiHelp: data.aiHelp,
      // Website
      websiteExisting: data.websiteExisting,
      websitePages: data.websitePages,
      websiteEcommerce: data.websiteEcommerce,
      // Marketing
      marketingTools: data.marketingTools,
      marketingPain: data.marketingPain,
      // Automation
      automationProcesses: data.automationProcesses,
      automationTools: data.automationTools,
      // Not sure
      notSureHeadache: data.notSureHeadache,
      notSureAutomate: data.notSureAutomate,
      // Common: current stack
      currentTools: data.currentTools,
    },
    timeline: data.timeline,
    budget: data.budget ?? "",
    notes: data.notes ?? "",
    consent: {
      smsConsent: data.smsConsent,
      marketingSmsOptIn: data.marketingSmsOptIn ?? false,
    },
    conversion_context: {
      route: "/build-your-proposal",
      page: "Get Your Automation Map",
      sourceCampaign: "website_automation_map",
      bookingUrl: getAskSaulBookingUrl(),
    },
    tags: [
      "ask-saul",
      "automation-map",
      "proposal-builder",
      "website-lead",
      valueTag,
      ...serviceTags,
      ...(data.services.includes("voice-agent")
        ? ["phone-agent-prospect", "lead-project:ask_saul_phone_agents"]
        : []),
      ...(data.industry ? [`industry:${slugifyIndustry(data.industry)}`] : []),
      ...(data.monthlySpend ? [`spend:${data.monthlySpend}`] : []),
    ],
    estimated_value: estimatedValue,
  };
}

function slugifyIndustry(industry: string): string {
  return industry
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildContactPayload(data: ContactFormData) {
  return {
    source: "asksaul-contact-form",
    timestamp: new Date().toISOString(),
    lead_project: "asksaul_website",
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? "",
      message: data.message,
      referralSource: data.referralSource ?? "",
    },
    consent: {
      smsConsent: data.smsConsent,
      marketingSmsOptIn: data.marketingSmsOptIn ?? false,
    },
    tags: ["ask-saul", "contact-form", "website-lead"],
  };
}

export function buildChatPayload(data: ChatLeadData) {
  const handoffIntent = data.handoffIntent ?? data.initialIntent ?? "send-context";
  const isWasteLead = handoffIntent === "waste-demo";

  return {
    source: "asksaul-chat-assistant",
    timestamp: new Date().toISOString(),
    lead_project: isWasteLead ? "ask_saul_phone_agents" : "asksaul_chat",
    contact: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
    },
    business: {
      name: data.businessName ?? "",
    },
    chatTranscript: data.chatTranscript,
    initialIntent: data.initialIntent ?? handoffIntent,
    handoffIntent,
    conversion_context: {
      route: data.sourcePath ?? "site-chat",
      page: "AskSaul chat widget",
      sourceCampaign: "website_chat",
      bookingUrl: getAskSaulBookingUrl(),
    },
    tags: [
      "ask-saul",
      "chat-assistant",
      "chat-widget",
      "website-lead",
      "chat-handoff",
      ...(handoffIntent === "book-demo" ? ["booking-requested"] : []),
      ...(handoffIntent === "automation-map" ? ["automation-map-interest"] : []),
      ...(isWasteLead
        ? [
            "voice-agent-lead",
            "phone-agent-prospect",
            "waste-voice-agent-interest",
            "lead-project:ask_saul_phone_agents",
          ]
        : []),
    ],
  };
}

export function buildVoiceAgentLeadPayload(data: VoiceAgentLeadData) {
  const nameParts = data.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    source: "asksaul-voice-agent-page",
    timestamp: new Date().toISOString(),
    lead_project: "ask_saul_phone_agents",
    contact: {
      firstName,
      lastName,
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
    business: {
      name: data.businessName,
      serviceArea: data.serviceArea,
    },
    voice_agent: {
      serviceType: data.serviceType,
      currentCallHandling: data.currentCallHandling,
      desiredAgentTasks: data.desiredAgentTasks,
      missedCallPain: data.missedCallPain,
      preferredCallbackWindow: data.preferredCallbackWindow,
    },
    consent: {
      smsConsent: data.smsConsent,
      marketingSmsOptIn: data.marketingSmsOptIn ?? false,
    },
    tags: [
      "ask-saul",
      "website-lead",
      "voice-agent-lead",
      "phone-agent-prospect",
      "lead-project:ask_saul_phone_agents",
    ],
  };
}

// ─── GHL Delivery ────────────────────────────────────────────────────────────

export type GhlLeadCaptureResult = {
  contactId?: string;
  opportunity?: GhlOutboundResult & { opportunityId?: string };
  email?: GhlOutboundResult;
};

export type GhlOutboundResult =
  | { ok: true; skipped?: false; conversationId?: string; messageId?: string }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string; status?: number };

export async function sendToGHL(payload: unknown): Promise<GhlLeadCaptureResult> {
  const apiKey = process.env.GHL_API_KEY ?? process.env.GHL_LOCAL_SERVICES_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID ?? process.env.GHL_LOCAL_SERVICES_LOCATION_ID;

  if (apiKey || locationId) {
    if (!apiKey || !locationId) {
      throw new Error("[GHL] Direct API requires both GHL_API_KEY and GHL_LOCATION_ID");
    }
    if (locationId !== ASK_SAUL_LOCATION_ID) {
      throw new Error(
        `[GHL] Refusing to send AskSaul.ai lead to non-Ask-Saul location ${locationId}`
      );
    }
    const cfg = { apiKey, locationId };
    const contactId = await upsertAskSaulContact(payload, cfg);
    const opportunity = await ensureAskSaulOpportunity(payload, contactId, cfg);
    const email = await sendAskSaulLeadEmail(payload, contactId, cfg);
    return { contactId, opportunity, email };
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    const message =
      "[GHL] No GHL_API_KEY/GHL_LOCATION_ID or GHL_WEBHOOK_URL set — lead capture unavailable";
    if (process.env.NODE_ENV === "production") {
      throw new Error(message);
    }
    console.warn(message);
    return {};
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GHL webhook failed: ${res.status} ${body}`);
  }

  return {};
}

type GhlConfig = {
  apiKey: string;
  locationId: string;
};

type GhlContactPayload = {
  locationId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source: string;
  tags: string[];
  customFields: Array<{ id: string; value: string }>;
};

async function upsertAskSaulContact(payload: unknown, cfg: GhlConfig): Promise<string | undefined> {
  const normalized = normalizeForGhl(payload, cfg.locationId);
  const res = await fetch(`${GHL_BASE_URL}/contacts/upsert`, {
    method: "POST",
    headers: ghlHeaders(cfg.apiKey),
    body: JSON.stringify(normalized.contact),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GHL contact upsert failed: ${res.status} ${text.slice(0, 500)}`);
  }

  let contactId: string | undefined;
  try {
    const data = JSON.parse(text || "{}") as { contact?: { id?: string }; id?: string };
    contactId = data.contact?.id ?? data.id;
  } catch {
    // The upsert succeeded, but the body was not JSON. Do not fail the submission.
  }

  if (contactId && normalized.note) {
    await addGhlNote(contactId, normalized.note, cfg);
  }

  return contactId;
}

export async function sendGhlSmsMessage({
  contactId,
  message,
}: {
  contactId?: string;
  message: string;
}): Promise<GhlOutboundResult> {
  if (!contactId) {
    return { ok: true, skipped: true, reason: "No GHL contact ID returned from lead capture" };
  }

  const apiKey = process.env.GHL_API_KEY ?? process.env.GHL_LOCAL_SERVICES_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID ?? process.env.GHL_LOCAL_SERVICES_LOCATION_ID;
  if (!apiKey || !locationId) {
    return { ok: true, skipped: true, reason: "GHL outbound skipped because direct GHL env is missing" };
  }
  if (locationId !== ASK_SAUL_LOCATION_ID) {
    return { ok: false, error: `[GHL] Refusing outbound from non-Ask-Saul location ${locationId}` };
  }

  if (process.env.GHL_OUTBOUND_SMS_ENABLED !== "1") {
    return { ok: true, skipped: true, reason: "GHL_OUTBOUND_SMS_ENABLED is not enabled" };
  }

  if (process.env.GHL_OUTBOUND_DRY_RUN === "1" || process.env.GHL_OUTBOUND_DRY_RUN === "true") {
    console.info("[GHL][sms-dry-run]", { contactId, message });
    return { ok: true, skipped: true, reason: "GHL_OUTBOUND_DRY_RUN enabled" };
  }

  const res = await fetch(`${GHL_BASE_URL}/conversations/messages`, {
    method: "POST",
    headers: ghlHeaders(apiKey),
    body: JSON.stringify({ type: "SMS", contactId, message }),
  });

  const body = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, error: body.slice(0, 500) || "GHL outbound SMS failed" };
  }

  try {
    const parsed = JSON.parse(body || "{}") as {
      conversationId?: string;
      messageId?: string;
      message?: { id?: string; conversationId?: string };
    };
    return {
      ok: true,
      conversationId: parsed.conversationId ?? parsed.message?.conversationId,
      messageId: parsed.messageId ?? parsed.message?.id,
    };
  } catch {
    return { ok: true };
  }
}

async function ensureAskSaulOpportunity(
  payload: unknown,
  contactId: string | undefined,
  cfg: GhlConfig
): Promise<GhlOutboundResult & { opportunityId?: string }> {
  if (!contactId) return { ok: true, skipped: true, reason: "No GHL contact ID returned from lead capture" };

  const pipelineId = process.env.GHL_ASKSAUL_PIPELINE_ID || ASK_SAUL_PIPELINE_ID;
  const pipelineStageId = process.env.GHL_ASKSAUL_HOT_LEAD_STAGE_ID || ASK_SAUL_HOT_LEAD_STAGE_ID;
  if (!pipelineId || !pipelineStageId) {
    return { ok: true, skipped: true, reason: "AskSaul pipeline/stage IDs are not configured" };
  }

  try {
    const existing = await fetch(
      `${GHL_BASE_URL}/opportunities/search?location_id=${encodeURIComponent(cfg.locationId)}&contact_id=${encodeURIComponent(contactId)}`,
      { method: "GET", headers: ghlHeaders(cfg.apiKey) }
    );
    if (existing.ok) {
      const found = (await existing.json().catch(() => ({}))) as { opportunities?: Array<{ id?: string }> };
      const firstId = found.opportunities?.[0]?.id;
      if (firstId) return { ok: true, skipped: true, reason: "Opportunity already exists", opportunityId: firstId };
    }

    const record = isRecord(payload) ? payload : {};
    const contact = isRecord(record.contact) ? record.contact : {};
    const business = isRecord(record.business) ? record.business : {};
    const companyOrName =
      text(business.name) ||
      text(contact.name) ||
      [text(contact.firstName), text(contact.lastName)].filter(Boolean).join(" ") ||
      "AskSaul.ai lead";
    const name = `${companyOrName} - ${sourceToBookingSource(text(record.source) || "website")}`;
    const monetaryValue = typeof record.estimated_value === "number" ? record.estimated_value : 0;

    const res = await fetch(`${GHL_BASE_URL}/opportunities/`, {
      method: "POST",
      headers: ghlHeaders(cfg.apiKey),
      body: JSON.stringify({
        locationId: cfg.locationId,
        pipelineId,
        pipelineStageId,
        name,
        status: "open",
        contactId,
        monetaryValue,
        source: text(record.source) || "asksaul.ai website",
      }),
    });
    const body = await res.text();
    if (!res.ok) return { ok: false, status: res.status, error: body.slice(0, 500) || "GHL opportunity create failed" };
    const data = safeJson(body);
    const opportunityId = text((data?.opportunity as Record<string, unknown> | undefined)?.id) || text(data?.id);
    return { ok: true, opportunityId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "GHL opportunity create threw" };
  }
}

async function sendAskSaulLeadEmail(
  payload: unknown,
  contactId: string | undefined,
  cfg: GhlConfig
): Promise<GhlOutboundResult> {
  if (!contactId) return { ok: true, skipped: true, reason: "No GHL contact ID returned from lead capture" };

  const record = isRecord(payload) ? payload : {};
  const contact = isRecord(record.contact) ? record.contact : {};
  const emailTo = text(contact.email);
  if (!emailTo) return { ok: true, skipped: true, reason: "No lead email provided" };

  const existingTags = await getGhlContactTags(contactId, cfg);
  if (existingTags.includes(WEBSITE_EMAIL_SENT_TAG) || existingTags.includes(EMAIL_FOLLOWUP_SENT_TAG)) {
    return { ok: true, skipped: true, reason: "Lead email already sent" };
  }

  const fromEmail = process.env.ASKSAUL_GHL_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "saul3000bot@gmail.com";
  const fromName = process.env.ASKSAUL_GHL_FROM_NAME || process.env.RESEND_FROM_NAME || "Saul from AskSaul.ai";
  const copy = buildLeadEmailCopy(record);

  try {
    const res = await fetch(`${GHL_BASE_URL}/conversations/messages`, {
      method: "POST",
      headers: ghlHeaders(cfg.apiKey),
      body: JSON.stringify({
        type: "Email",
        contactId,
        subject: copy.subject,
        html: copy.html,
        message: copy.text,
        emailFrom: fromEmail,
        emailTo,
        fromEmail,
        fromName,
      }),
    });
    const body = await res.text();
    if (!res.ok) return { ok: false, status: res.status, error: body.slice(0, 500) || "GHL lead email failed" };
    await addGhlContactTags(contactId, [WEBSITE_EMAIL_SENT_TAG, EMAIL_FOLLOWUP_SENT_TAG], cfg);
    await addGhlNote(contactId, `Automated AskSaul lead email queued.\nSubject: ${copy.subject}`, cfg);
    const data = safeJson(body);
    const messageId = text(data?.messageId) || text(data?.id) || text((data?.message as Record<string, unknown> | undefined)?.id);
    return { ok: true, messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "GHL lead email threw" };
  }
}

async function getGhlContactTags(contactId: string, cfg: GhlConfig): Promise<string[]> {
  try {
    const res = await fetch(`${GHL_BASE_URL}/contacts/${encodeURIComponent(contactId)}`, {
      method: "GET",
      headers: ghlHeaders(cfg.apiKey),
    });
    if (!res.ok) return [];
    const data = (await res.json().catch(() => ({}))) as { contact?: { tags?: unknown }; tags?: unknown };
    return arrayOfStrings(data.contact?.tags ?? data.tags).map((tag) => tag.toLowerCase());
  } catch {
    return [];
  }
}

async function addGhlContactTags(contactId: string, tags: string[], cfg: GhlConfig): Promise<void> {
  const cleanTags = uniqueStrings(tags.map((tag) => tag.trim()).filter(Boolean));
  if (!cleanTags.length) return;
  const res = await fetch(`${GHL_BASE_URL}/contacts/${encodeURIComponent(contactId)}/tags`, {
    method: "POST",
    headers: ghlHeaders(cfg.apiKey),
    body: JSON.stringify({ tags: cleanTags }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn(`[GHL] Email sent but tag add failed: ${res.status} ${body.slice(0, 300)}`);
  }
}

function buildLeadEmailCopy(record: Record<string, unknown>): { subject: string; html: string; text: string } {
  const contact = isRecord(record.contact) ? record.contact : {};
  const business = isRecord(record.business) ? record.business : {};
  const voiceAgent = isRecord(record.voice_agent) ? record.voice_agent : {};
  const name = text(contact.firstName) || splitName(text(contact.name)).first || "there";
  const businessName = text(business.name);
  const source = text(record.source) || "asksaul.ai";
  const routeLabel = sourceToBookingSource(source).replace(/_/g, " ");
  const contextLines = [
    businessName ? `Business: ${businessName}` : undefined,
    text(business.industry) ? `Industry: ${text(business.industry)}` : undefined,
    text(voiceAgent.serviceType) ? `Service type: ${text(voiceAgent.serviceType)}` : undefined,
    text(business.serviceArea) ? `Service area: ${text(business.serviceArea)}` : undefined,
    Array.isArray(record.services_requested) ? `Services requested: ${record.services_requested.join(", ")}` : undefined,
    text(record.timeline) ? `Timeline: ${text(record.timeline)}` : undefined,
    text(record.budget) ? `Budget: ${text(record.budget)}` : undefined,
    text(voiceAgent.missedCallPain) ? `Pain point: ${text(voiceAgent.missedCallPain)}` : undefined,
    text(record.notes) ? `Notes: ${text(record.notes)}` : undefined,
  ].filter(Boolean) as string[];

  const subject = source.includes("voice-agent") ? "Got your AskSaul voice-agent request" : "Got your AskSaul assessment";
  const textBody = [
    `Hi ${name},`,
    "",
    `Thanks for filling out the ${routeLabel} form. Gregory has the context now and can review where AskSaul may be useful before following up.`,
    "",
    contextLines.length
      ? `What came through:\n${contextLines.map((line) => `- ${line}`).join("\n")}`
      : "What came through: you are exploring whether an AI workflow or phone agent can help capture more intent and reduce follow-up gaps.",
    "",
    `If texting is easier, text us at (720) 292-7554. If you want to hear the provider voice demo, call Saul at ${DEMO_PHONE_DISPLAY}.`,
    "",
    "Talk soon,",
    "Saul from AskSaul.ai",
  ].join("\n");

  const html = textBody
    .split("\n\n")
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
    .join("\n");

  return { subject, text: textBody, html };
}

function normalizeForGhl(payload: unknown, locationId: string): {
  contact: GhlContactPayload;
  note: string;
} {
  const record = isRecord(payload) ? payload : {};
  const contact = isRecord(record.contact) ? record.contact : {};
  const business = isRecord(record.business) ? record.business : {};
  const voiceAgent = isRecord(record.voice_agent) ? record.voice_agent : {};
  const consent = isRecord(record.consent) ? record.consent : {};

  const source = text(record.source) || "asksaul.ai website";
  const firstName = text(contact.firstName) || splitName(text(contact.name)).first || "AskSaul";
  const lastName = text(contact.lastName) || splitName(text(contact.name)).last || "Lead";
  const email = text(contact.email);
  const phone = text(contact.phone);
  const companyName = text(business.name);
  const tags = uniqueStrings([
    "ask-saul",
    "website-lead",
    ...arrayOfStrings(record.tags),
    sourceToTag(source),
  ]);
  const leadProject =
    text(record.lead_project) ||
    (tags.includes("voice-agent-lead") ? "ask_saul_phone_agents" : "asksaul_website");

  const summary = buildQualificationSummary(record);
  const fields = compactFields([
    [ASK_SAUL_FIELD_IDS.leadProject, leadProject],
    [ASK_SAUL_FIELD_IDS.businessTypeService, text(voiceAgent.serviceType) || text(business.industry)],
    [ASK_SAUL_FIELD_IDS.serviceAreaCity, text(business.serviceArea)],
    [ASK_SAUL_FIELD_IDS.currentCallHandling, text(voiceAgent.currentCallHandling)],
    [ASK_SAUL_FIELD_IDS.phoneAgentPainPoint, text(voiceAgent.missedCallPain)],
    [ASK_SAUL_FIELD_IDS.desiredAgentTasks, text(voiceAgent.desiredAgentTasks)],
    [ASK_SAUL_FIELD_IDS.preferredCallbackWindow, text(voiceAgent.preferredCallbackWindow)],
    [ASK_SAUL_FIELD_IDS.interestLevel, inferInterestLevel(record)],
    [ASK_SAUL_FIELD_IDS.saulDemoOffered, tags.includes("voice-agent-lead") ? "yes_website" : undefined],
    [ASK_SAUL_FIELD_IDS.saulDemoCalled, "unknown"],
    [ASK_SAUL_FIELD_IDS.callbackBookingSource, sourceToBookingSource(source)],
    [
      ASK_SAUL_FIELD_IDS.followUpConsent,
      booleanText(consent.smsConsent) ? `sms_consent=${booleanText(consent.smsConsent)}` : undefined,
    ],
    [ASK_SAUL_FIELD_IDS.qualificationSummary, summary],
    [ASK_SAUL_FIELD_IDS.demoPhoneAgentNumber, DEMO_PHONE_DISPLAY],
    [
      ASK_SAUL_FIELD_IDS.payPerCloseTerms,
      tags.includes("voice-agent-lead")
        ? "Free setup/no contract/pay-per-close framing to be confirmed by Gregory"
        : undefined,
    ],
    [
      ASK_SAUL_FIELD_IDS.aiPhoneAgentOffer,
      tags.includes("voice-agent-lead")
        ? "AI phone agent for missed-call recovery, after-hours intake, qualification, and GHL lead routing"
        : undefined,
    ],
  ]);

  return {
    contact: {
      locationId,
      firstName,
      lastName,
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
      ...(companyName ? { companyName } : {}),
      source,
      tags,
      customFields: fields,
    },
    note: buildInternalNote(record, summary),
  };
}

async function addGhlNote(contactId: string, body: string, cfg: GhlConfig): Promise<void> {
  const res = await fetch(`${GHL_BASE_URL}/contacts/${encodeURIComponent(contactId)}/notes`, {
    method: "POST",
    headers: ghlHeaders(cfg.apiKey),
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    const textBody = await res.text().catch(() => "");
    console.warn(`[GHL] Contact upsert succeeded but note failed: ${res.status} ${textBody.slice(0, 300)}`);
  }
}

function ghlHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    Version: process.env.GHL_API_VERSION ?? GHL_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    Origin: "https://app.gohighlevel.com",
    Referer: "https://app.gohighlevel.com/",
  };
}

function buildQualificationSummary(record: Record<string, unknown>): string {
  const business = isRecord(record.business) ? record.business : {};
  const voiceAgent = isRecord(record.voice_agent) ? record.voice_agent : {};
  const contact = isRecord(record.contact) ? record.contact : {};
  const serviceDetails = isRecord(record.service_details) ? record.service_details : {};
  const conversionContext = isRecord(record.conversion_context) ? record.conversion_context : {};

  const lines = [
    `Source: ${text(record.source) || "asksaul.ai"}`,
    text(record.timestamp) ? `Submitted: ${text(record.timestamp)}` : undefined,
    text(record.lead_project) ? `Lead project: ${text(record.lead_project)}` : undefined,
    text(business.name) ? `Business: ${text(business.name)}` : undefined,
    text(business.industry) ? `Industry: ${text(business.industry)}` : undefined,
    text(business.teamSize) ? `Team size: ${text(business.teamSize)}` : undefined,
    text(business.revenueRange) ? `Revenue range: ${text(business.revenueRange)}` : undefined,
    text(business.monthlySpend) ? `Monthly spend: ${text(business.monthlySpend)}` : undefined,
    text(voiceAgent.serviceType) || text(business.industry)
      ? `Service type: ${text(voiceAgent.serviceType) || text(business.industry)}`
      : undefined,
    text(business.serviceArea) ? `Service area: ${text(business.serviceArea)}` : undefined,
    text(voiceAgent.currentCallHandling)
      ? `Current call handling: ${text(voiceAgent.currentCallHandling)}`
      : undefined,
    text(voiceAgent.desiredAgentTasks)
      ? `Desired agent tasks: ${text(voiceAgent.desiredAgentTasks)}`
      : undefined,
    text(voiceAgent.missedCallPain)
      ? `Missed-call pain: ${text(voiceAgent.missedCallPain)}`
      : undefined,
    text(voiceAgent.preferredCallbackWindow)
      ? `Preferred callback: ${text(voiceAgent.preferredCallbackWindow)}`
      : undefined,
    text(contact.message) ? `Message: ${text(contact.message)}` : undefined,
    text(record.initialIntent) ? `Chat intent: ${text(record.initialIntent)}` : undefined,
    text(record.handoffIntent) ? `Chat handoff intent: ${text(record.handoffIntent)}` : undefined,
    Array.isArray(record.services_requested)
      ? `Services requested: ${record.services_requested.join(", ")}`
      : undefined,
    text(record.timeline) ? `Timeline: ${text(record.timeline)}` : undefined,
    text(record.budget) ? `Budget: ${text(record.budget)}` : undefined,
    text(record.notes) ? `Notes: ${text(record.notes)}` : undefined,
    text(serviceDetails.currentTools) ? `Current tools: ${text(serviceDetails.currentTools)}` : undefined,
    text(serviceDetails.automationProcesses)
      ? `Automation processes: ${text(serviceDetails.automationProcesses)}`
      : undefined,
    text(serviceDetails.automationTools) ? `Automation tools: ${text(serviceDetails.automationTools)}` : undefined,
    text(serviceDetails.marketingPain) ? `Marketing pain: ${text(serviceDetails.marketingPain)}` : undefined,
    text(serviceDetails.notSureHeadache) ? `Biggest headache: ${text(serviceDetails.notSureHeadache)}` : undefined,
    text(serviceDetails.notSureAutomate) ? `Would automate: ${text(serviceDetails.notSureAutomate)}` : undefined,
    text(conversionContext.route) ? `Conversion route: ${text(conversionContext.route)}` : undefined,
    text(conversionContext.sourceCampaign) ? `Source campaign: ${text(conversionContext.sourceCampaign)}` : undefined,
    typeof record.estimated_value === "number"
      ? `Estimated value: $${record.estimated_value.toLocaleString()}`
      : undefined,
    Array.isArray(record.chatTranscript)
      ? `Chat transcript: ${record.chatTranscript
          .map((turn) => (isRecord(turn) ? `${text(turn.role)}: ${text(turn.content)}` : ""))
          .filter(Boolean)
          .join(" | ")}`
      : undefined,
    `Booking link: ${getAskSaulBookingUrl()}`,
  ].filter(Boolean);

  return lines.join("\n").slice(0, 2800);
}

function buildInternalNote(record: Record<string, unknown>, summary: string): string {
  const tags = arrayOfStrings(record.tags).join(", ");
  return [
    "AskSaul.ai website lead captured and mapped into the Ask Saul GHL location.",
    tags ? `Tags: ${tags}` : undefined,
    summary,
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 5000);
}

function compactFields(entries: Array<[string, string | undefined]>): Array<{ id: string; value: string }> {
  return entries
    .filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()))
    .map(([id, value]) => ({ id, value }));
}

function inferInterestLevel(record: Record<string, unknown>): string {
  const tags = arrayOfStrings(record.tags);
  if (tags.includes("high-value") || tags.includes("voice-agent-lead")) return "warm";
  if (tags.includes("chat-widget")) return "curious";
  return "cold";
}

function sourceToBookingSource(source: string): string {
  if (source.includes("voice-agent")) return "website_voice_agent_form";
  if (source.includes("chat")) return "website_chat";
  if (source.includes("automation-map")) return "website_automation_map";
  if (source.includes("proposal")) return "website_proposal_builder";
  if (source.includes("contact")) return "website_contact_form";
  return "website";
}

function sourceToTag(source: string): string {
  return source
    .toLowerCase()
    .replace(/^asksaul-/, "source-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitName(value: string | undefined): { first?: string; last?: string } {
  if (!value) return {};
  const parts = value.trim().split(/\s+/);
  return { first: parts[0], last: parts.slice(1).join(" ") || undefined };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeJson(value: string): Record<string, unknown> | undefined {
  try {
    const parsed = JSON.parse(value || "{}");
    return isRecord(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function booleanText(value: unknown): string | undefined {
  if (typeof value === "boolean") return value ? "true" : "false";
  return undefined;
}

function arrayOfStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.trim()))];
}
