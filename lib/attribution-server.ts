/** Server side: keep only known, short string fields from a client attribution blob. */
const KEYS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "landing", "referrer", "at"];

function clean(touch: unknown): Record<string, string> | undefined {
  if (!touch || typeof touch !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const k of KEYS) {
    const v = (touch as Record<string, unknown>)[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 200);
  }
  return Object.keys(out).length ? out : undefined;
}

export function readAttribution(body: unknown): { first?: Record<string, string>; last?: Record<string, string> } | undefined {
  const raw = body && typeof body === "object" ? (body as Record<string, unknown>).attribution : undefined;
  if (!raw || typeof raw !== "object") return undefined;
  const first = clean((raw as Record<string, unknown>).first);
  const last = clean((raw as Record<string, unknown>).last);
  return first || last ? { first, last } : undefined;
}
