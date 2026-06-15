export const HOURS_PER_FTE = 173.3;
export const LOAD_DEFAULT = 1.25;

export type IcpId = "home" | "dental" | "legal" | "waste" | "custom";
export type PackageId = "auto" | "operator" | "night" | "cco";
export type TermId = "m2m" | "12mo" | "24mo";

export type RoiState = {
  icp: IcpId;
  calls: number;
  missedPct: number;
  qualPct: number;
  closePct: number;
  ticket: number;
  minPerCall: number;
  saulShare: number;
  rate: number;
  roles: number;
  utilization: number;
  loadMult: number;
  hoursPerFte: number;
  pkg: PackageId;
  ccoPrice: number;
  ccoOnboarding: number;
  term: TermId;
  audit: boolean;
};

export const ICPS = [
  { id: "home", label: "Home services", ticket: 875, calls: 300, missedPct: 25, qualPct: 35, closePct: 25, minPerCall: 9, saulShare: 40, rate: 22, roles: 1.5, note: "$250–$1,500 / job" },
  { id: "dental", label: "Dental / med spa", ticket: 1650, calls: 550, missedPct: 22, qualPct: 30, closePct: 25, minPerCall: 6, saulShare: 45, rate: 24, roles: 2, note: "$300–$3,000 / visit" },
  { id: "legal", label: "Legal / consulting", ticket: 5500, calls: 160, missedPct: 30, qualPct: 40, closePct: 25, minPerCall: 12, saulShare: 50, rate: 26, roles: 1, note: "$1,000–$10,000 / matter" },
  { id: "waste", label: "Dumpster / waste", ticket: 1175, calls: 420, missedPct: 28, qualPct: 35, closePct: 25, minPerCall: 6, saulShare: 45, rate: 20, roles: 1.5, note: "$350–$2,000 / haul" },
  { id: "custom", label: "Custom — any industry", ticket: 1000, calls: 400, missedPct: 25, qualPct: 35, closePct: 25, minPerCall: 8, saulShare: 45, rate: 22, roles: 2, note: "your numbers, your industry" },
] as const;

export const PACKAGES = {
  operator: { id: "operator", name: "Operator", price: 1750, fit: "50–200 calls/mo", deploy: "~1 week", onboarding: 1500 },
  night: { id: "night", name: "Night Manager", price: 2500, fit: "up to ~400 calls/mo", deploy: "~2 weeks", onboarding: 3500 },
  cco: { id: "cco", name: "Chief Comms Officer", price: 9500, fit: "500+ calls · multi-site", deploy: "custom scope", onboarding: 10000 },
} as const;

export const DEFAULT_ROI_STATE: RoiState = {
  icp: "home",
  calls: 300,
  missedPct: 25,
  qualPct: 35,
  closePct: 25,
  ticket: 875,
  minPerCall: 9,
  saulShare: 40,
  rate: 22,
  roles: 1.5,
  utilization: 0.4,
  loadMult: LOAD_DEFAULT,
  hoursPerFte: HOURS_PER_FTE,
  pkg: "auto",
  ccoPrice: 9500,
  ccoOnboarding: 10000,
  term: "12mo",
  audit: false,
};

export function recommend(calls: number): Exclude<PackageId, "auto"> {
  return calls <= 200 ? "operator" : calls <= 420 ? "night" : "cco";
}

export function computeRoi(s: RoiState) {
  const hpf = s.hoursPerFte || HOURS_PER_FTE;
  const missedCalls = (s.calls * s.missedPct) / 100;
  const qualMissed = (missedCalls * s.qualPct) / 100;
  const recovered = qualMissed * (s.closePct / 100) * s.ticket;

  const saulCalls = (s.calls * s.saulShare) / 100;
  const workHours = (saulCalls * s.minPerCall) / 60;
  const staffedRaw = workHours / s.utilization;
  const headcountCap = s.roles * hpf;
  const hoursSaved = Math.min(staffedRaw, headcountCap);
  const capped = staffedRaw > headcountCap;
  const fteReplaced = hoursSaved / hpf;
  const loadedHourly = s.rate * s.loadMult;
  const laborSavings = hoursSaved * loadedHourly;
  const fteMonthlyCost = s.rate * hpf * s.loadMult;

  const pkgId = s.pkg === "auto" ? recommend(s.calls) : s.pkg;
  const pkg = PACKAGES[pkgId];
  const price = pkgId === "cco" ? s.ccoPrice : pkg.price;

  const benefit = recovered + laborSavings;
  const net = benefit - price;
  const roiX = price > 0 ? benefit / price : 0;
  const payback = benefit > 0 ? Math.max(1, Math.round((30 * price) / benefit)) : 0;

  const onboardingFee = pkgId === "cco" ? s.ccoOnboarding : pkg.onboarding;
  const feeDue = s.term === "m2m" ? onboardingFee : 0;
  const auditFee = s.audit ? 3500 : 0;
  const year1Deal = price * 12 + feeDue + auditFee;
  const year1Net = benefit * 12 - year1Deal;

  return {
    missedCalls,
    qualMissed,
    recovered,
    saulCalls,
    workHours,
    hoursSaved,
    capped,
    fteReplaced,
    loadedHourly,
    laborSavings,
    fteMonthlyCost,
    pkgId,
    pkg,
    price,
    benefit,
    net,
    roiX,
    payback,
    onboardingFee,
    feeDue,
    auditFee,
    year1Deal,
    year1Net,
  };
}

export const fmtDollar = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const fmtNumber = (n: number, d = 0) =>
  Number(n).toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d });
