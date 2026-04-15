import type { ProposalFormData } from "./validation";

// ─── Lead Scoring ────────────────────────────────────────────────────────────
// Pure functions; safe to import from anywhere. The MCP server re-implements
// an equivalent algorithm in its own package, but this is the canonical one.

const SPEND_MULTIPLIER: Record<string, number> = {
  "under-1k": 0.85,
  "1k-2.5k": 1,
  "2.5k-5k": 1.1,
  "5k-10k": 1.25,
  "10k-25k": 1.5,
  "25k-plus": 1.75,
  "not-sure": 1,
};

const BUDGET_FLOOR: Record<string, number> = {
  "under-2k": 2000,
  "2k-5k": 5000,
  "5k-10k": 10000,
  "10k-25k": 25000,
  "25k-plus": 25000,
};

export function calculateEstimatedValue(data: ProposalFormData): number {
  let estimate = 0;

  for (const service of data.services) {
    switch (service) {
      case "ai-assistant": {
        // Tier preference is the strongest signal if present
        if (data.aiTierPreference === "starter") estimate += 500;
        else if (data.aiTierPreference === "team") estimate += 1000;
        else if (data.aiTierPreference === "pro") estimate += 2500;
        else if (data.aiTierPreference === "developer") estimate += 1200;
        else if (data.aiUserCount === "just-me") estimate += 500;
        else if (data.aiUserCount === "small-team") estimate += 1000;
        else if (data.aiUserCount === "customers") estimate += 2500;
        else estimate += 1000;
        // Add-on uplift
        const addonCount = data.aiAddons?.length ?? 0;
        estimate += addonCount * 500;
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
        // Design/content complexity uplift
        if (data.websiteDesignStatus === "needs-design") estimate += 2000;
        if (data.websiteContentStatus === "need-copywriting") estimate += 2000;
        break;
      }
      case "marketing": {
        let base = 15500;
        if (data.marketingListSize === "50k-plus") base += 5000;
        if (data.marketingAutomationComplexity === "multi-stage-nurture")
          base += 3000;
        estimate += base;
        break;
      }
      case "automation":
        estimate += 5000;
        break;
      case "voice-agent":
        estimate += 4000;
        break;
      case "custom-app":
        estimate += data.customAppAuth === "sso-required" ? 20000 : 15000;
        break;
      case "not-sure":
        estimate += 2000;
        break;
    }
  }

  // Budget floor: never estimate below explicit budget
  if (data.budget && BUDGET_FLOOR[data.budget] > estimate) {
    estimate = BUDGET_FLOOR[data.budget];
  }

  // Spend multiplier: high-spend leads are worth more; low-spend capped lower
  if (data.monthlySpend && SPEND_MULTIPLIER[data.monthlySpend]) {
    estimate = Math.round(estimate * SPEND_MULTIPLIER[data.monthlySpend]);
  }

  return estimate;
}

export function getLeadValueTag(estimatedValue: number): string {
  if (estimatedValue >= 25000) return "enterprise";
  if (estimatedValue >= 10000) return "high-value";
  if (estimatedValue >= 3000) return "mid-value";
  return "starter";
}

export function getEstimatedValueRange(
  estimatedValue: number,
): { low: number; high: number } {
  // Show prospects a range, not a single number
  const low = Math.round(estimatedValue * 0.85);
  const high = Math.round(estimatedValue * 1.25);
  return { low, high };
}

export function formatValueRange(estimatedValue: number): string {
  const { low, high } = getEstimatedValueRange(estimatedValue);
  return `$${low.toLocaleString()} to $${high.toLocaleString()}`;
}

export function getServiceTags(services: ProposalFormData["services"]): string[] {
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

export function slugifyIndustry(industry: string | undefined): string {
  if (!industry) return "";
  return industry
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildTags(data: ProposalFormData, valueTag: string): string[] {
  return [
    "proposal-builder",
    "website-lead",
    valueTag,
    ...getServiceTags(data.services),
    ...(data.industry ? [`industry:${slugifyIndustry(data.industry)}`] : []),
    ...(data.monthlySpend ? [`spend:${data.monthlySpend}`] : []),
    ...(data.timeline ? [`timeline:${data.timeline}`] : []),
    ...(data.decisionMaker ? [`decision-maker:${data.decisionMaker}`] : []),
  ];
}
