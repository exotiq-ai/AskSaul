/**
 * Client-side analytics: GA4, Google Ads conversions, Plausible, and
 * first/last-touch attribution (gclid + UTMs) that travels with every lead.
 *
 * IDs are public (they appear in page source). Set them here or override with
 * NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GOOGLE_ADS_ID / NEXT_PUBLIC_GOOGLE_ADS_*_LABEL.
 * Everything is a safe no-op until an ID is present.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
const ADS_LABELS = {
  lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "",
  call: process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL || "",
};

export type LeadType = "founding" | "waste_demo" | "audit" | "automation_map" | "contact" | "chat_lead" | "chat_audit";

/** Rough value per lead for value-based bidding later. Adjust as close rates come in. */
const LEAD_VALUE: Record<LeadType, number> = {
  founding: 150,
  waste_demo: 75,
  chat_lead: 100,
  audit: 75,
  chat_audit: 75,
  automation_map: 50,
  contact: 40,
};

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | undefined => (typeof window === "undefined" ? undefined : (window as unknown as { gtag?: Gtag }).gtag);
const plausible = () =>
  typeof window === "undefined"
    ? undefined
    : (window as unknown as { plausible?: (e: string, o?: { props?: Record<string, unknown> }) => void }).plausible;

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  try {
    gtag()?.("event", name, params);
    plausible()?.(name, { props: params });
  } catch {
    /* analytics must never break the page */
  }
}

/** A real lead (the API confirmed it saved). Fires GA4 generate_lead and the Google Ads lead conversion. */
export function trackLead(type: LeadType, extra: Record<string, unknown> = {}) {
  const value = LEAD_VALUE[type];
  trackEvent("generate_lead", { lead_type: type, value, currency: "USD", ...extra });
  if (ADS_ID && ADS_LABELS.lead) {
    try {
      gtag()?.("event", "conversion", { send_to: `${ADS_ID}/${ADS_LABELS.lead}`, value, currency: "USD" });
    } catch {}
  }
}

export function trackPhoneClick(number: string) {
  trackEvent("phone_click", { phone_number: number });
  if (ADS_ID && ADS_LABELS.call) {
    try {
      gtag()?.("event", "conversion", { send_to: `${ADS_ID}/${ADS_LABELS.call}` });
    } catch {}
  }
}

// ---------------------------------------------------------------------------
// Attribution
// ---------------------------------------------------------------------------

const ATTR_KEY = "asksaul-attribution";
const PARAMS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

type Touch = Partial<Record<(typeof PARAMS)[number], string>> & { landing?: string; referrer?: string; at?: string };
export type Attribution = { first?: Touch; last?: Touch };

function read(): Attribution {
  try {
    const raw = localStorage.getItem(ATTR_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Attribution & { savedAt?: number };
    if (parsed.savedAt && Date.now() - parsed.savedAt > TTL_MS) return {};
    return parsed;
  } catch {
    return {};
  }
}

/** Call once per page load. Records first touch and any new campaign touch. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const touch: Touch = {};
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) touch[p] = v.slice(0, 200);
  }
  const external = document.referrer && !document.referrer.startsWith(window.location.origin);
  const current = read();
  const isCampaign = Object.keys(touch).length > 0;
  if (!isCampaign && current.first && !external) return;
  const stamped: Touch = { ...touch, landing: url.pathname, referrer: external ? document.referrer.slice(0, 200) : undefined, at: new Date().toISOString() };
  const next: Attribution & { savedAt: number } = {
    first: current.first ?? stamped,
    last: isCampaign || external ? stamped : current.last ?? stamped,
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify(next));
  } catch {}
}

export function getAttribution(): Attribution {
  const { first, last } = read();
  return { first, last };
}
