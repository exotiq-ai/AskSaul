// Mirror of lib/ghl.ts::calculateEstimatedValue, adapted to read from the
// stored proposal row (service_details jsonb + columns) instead of the form DTO.
// Keep this in sync when the Next.js app's scoring changes.

export interface ScorableProposal {
  services: string[];
  budget?: string | null;
  monthly_spend?: string | null;
  service_details: Record<string, unknown>;
}

function sd<T = string>(
  details: Record<string, unknown>,
  key: string
): T | undefined {
  const v = details[key];
  return v === undefined || v === null ? undefined : (v as T);
}

export function calculateEstimatedValue(p: ScorableProposal): number {
  let estimate = 0;
  const d = p.service_details ?? {};

  for (const service of p.services) {
    switch (service) {
      case "ai-assistant": {
        const ct = sd<string>(d, "aiUserCount");
        if (ct === "just-me") estimate += 500;
        else if (ct === "small-team") estimate += 1000;
        else if (ct === "customers") estimate += 2500;
        else estimate += 1000;
        break;
      }
      case "website": {
        const ecom = sd<string>(d, "websiteEcommerce");
        const pages = sd<string>(d, "websitePages");
        if (ecom === "yes") estimate += 12000;
        else if (pages === "1-5") estimate += 5000;
        else if (pages === "5-10") estimate += 8000;
        else if (pages === "10-20" || pages === "20+") estimate += 12000;
        else estimate += 7000;
        break;
      }
      case "marketing":
        estimate += 15500;
        break;
      case "automation":
        estimate += 5000;
        break;
      case "voice-agent":
        estimate += 4000;
        break;
      case "custom-app":
        estimate += 15000;
        break;
      case "not-sure":
        estimate += 2000;
        break;
    }
  }

  const budgetMap: Record<string, number> = {
    "under-2k": 2000,
    "2k-5k": 5000,
    "5k-10k": 10000,
    "10k-25k": 25000,
    "25k-plus": 25000,
  };
  if (p.budget && budgetMap[p.budget] > estimate) {
    estimate = budgetMap[p.budget];
  }

  const spendMultiplier: Record<string, number> = {
    "under-1k": 0.85,
    "1k-2.5k": 1,
    "2.5k-5k": 1.1,
    "5k-10k": 1.25,
    "10k-25k": 1.5,
    "25k-plus": 1.75,
    "not-sure": 1,
  };
  if (p.monthly_spend && spendMultiplier[p.monthly_spend]) {
    estimate = Math.round(estimate * spendMultiplier[p.monthly_spend]);
  }

  return estimate;
}

export function getLeadValueTag(estimatedValue: number): string {
  if (estimatedValue >= 10000) return "high-value";
  if (estimatedValue >= 3000) return "mid-value";
  return "starter";
}
