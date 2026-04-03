import type { ProposalFormData, ContactFormData, ChatLeadData } from "./validation";

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
    source: "asksaul-proposal-builder",
    timestamp: new Date().toISOString(),
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
    },
    timeline: data.timeline,
    budget: data.budget ?? "",
    notes: data.notes ?? "",
    tags: ["proposal-builder", "website-lead", valueTag, ...serviceTags],
    estimated_value: estimatedValue,
  };
}

export function buildContactPayload(data: ContactFormData) {
  return {
    source: "asksaul-contact-form",
    timestamp: new Date().toISOString(),
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? "",
      message: data.message,
      referralSource: data.referralSource ?? "",
    },
    tags: ["contact-form", "website-lead"],
  };
}

export function buildChatPayload(data: ChatLeadData) {
  return {
    source: "asksaul-chat-widget",
    timestamp: new Date().toISOString(),
    contact: {
      name: data.name,
      email: data.email,
    },
    chatTranscript: data.chatTranscript,
    initialIntent: data.initialIntent ?? "browsing",
    tags: ["chat-widget", "website-lead"],
  };
}

// ─── Webhook POST ────────────────────────────────────────────────────────────

export async function sendToGHL(payload: unknown): Promise<void> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[GHL] GHL_WEBHOOK_URL not set — skipping webhook");
    return;
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
}
