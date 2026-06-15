"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_ROI_STATE,
  HOURS_PER_FTE,
  ICPS,
  LOAD_DEFAULT,
  PACKAGES,
  RoiState,
  computeRoi,
  fmtDollar,
  fmtNumber,
  recommend,
  type IcpId,
  type PackageId,
  type TermId,
} from "@/lib/voiceRoi";
import styles from "./RoiCalculator.module.css";

const STORAGE_KEY = "asksaul-roi-calc-v2";

function loadState(): RoiState {
  if (typeof window === "undefined") return DEFAULT_ROI_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_ROI_STATE, ...JSON.parse(raw) } : DEFAULT_ROI_STATE;
  } catch {
    return DEFAULT_ROI_STATE;
  }
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  hint,
  format = String,
  parse,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  hint?: string;
  format?: (value: number) => string;
  parse?: (value: number) => number;
  onChange: (value: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const commit = () => {
    const cleaned = Number.parseFloat(String(draft).replace(/[^0-9.-]/g, ""));
    if (!Number.isNaN(cleaned)) onChange(Math.max(min, parse ? parse(cleaned) : cleaned));
    setEditing(false);
  };

  return (
    <div className={styles.sliderBlock}>
      <div className={styles.sliderHead}>
        <label>{label}</label>
        {editing ? (
          <input
            className={styles.valueInput}
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") commit();
              if (event.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <button type="button" className={styles.valueButton} onClick={() => { setDraft(String(value)); setEditing(true); }}>
            {format(value)}{suffix}
          </button>
        )}
      </div>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.segmented}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={value === option.id ? styles.segmentOn : undefined}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ReceiptRow({ label, value, tone, strong = false }: { label: string; value: string; tone?: "cyan" | "leak"; strong?: boolean }) {
  return (
    <div className={`${styles.receiptRow} ${strong ? styles.strongRow : ""}`}>
      <span>{label}</span>
      <b className={tone ? styles[tone] : undefined}>{value}</b>
    </div>
  );
}

export default function RoiCalculator({ internalEnabled = false }: { internalEnabled?: boolean }) {
  const [state, setState] = useState<RoiState>(loadState);
  const [internal, setInternal] = useState(internalEnabled);
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const m = useMemo(() => computeRoi(state), [state]);
  const icp = ICPS.find((item) => item.id === state.icp) ?? ICPS[0];
  const set = <K extends keyof RoiState>(key: K) => (value: RoiState[K]) => setState((prev) => ({ ...prev, [key]: value }));

  const pickIcp = (id: IcpId) => {
    const preset = ICPS.find((item) => item.id === id) ?? ICPS[0];
    setState((prev) => ({
      ...prev,
      icp: id,
      calls: preset.calls,
      missedPct: preset.missedPct,
      qualPct: preset.qualPct,
      closePct: preset.closePct,
      ticket: preset.ticket,
      minPerCall: preset.minPerCall,
      saulShare: preset.saulShare,
      rate: preset.rate,
      roles: preset.roles,
    }));
  };

  const exportPdf = () => {
    document.title = internal ? "Ask Saul — Internal ROI Briefing" : "Ask Saul — ROI Briefing";
    window.print();
  };

  return (
    <div className={`${styles.shell} ${internal ? styles.internalShell : ""}`}>
      <header className={`${styles.topbar} ${styles.noPrint}`}>
        <Link href="/voice-agents" className={styles.lockup}>
          <span className={styles.logoMark}>S</span>
          <span className={styles.logoName}>SAUL</span>
          <span className={styles.toolTag}>ROI & PRICING CALCULATOR</span>
        </Link>
        <div className={styles.topActions}>
          {internalEnabled ? (
            <button type="button" className={styles.modeToggle} onClick={() => setInternal((value) => !value)}>
              {internal ? "Internal view on" : "Customer view"}
            </button>
          ) : null}
          <button type="button" className={styles.primaryButton} onClick={exportPdf}>Export branded PDF →</button>
        </div>
      </header>

      {internal ? <div className={`${styles.internalBanner} ${styles.noPrint}`}>● INTERNAL VIEW — deal levers and year-1 AskSaul economics visible. This route is intentionally unlinked and noindexed.</div> : null}

      <main className={`${styles.layout} ${styles.noPrint}`}>
        <section className={styles.controls} aria-label="ROI calculator controls">
          <div className={styles.card}>
            <div className={styles.cardTitle}>§ 01 / Ideal Customer Profile</div>
            <Segmented<IcpId> value={state.icp} onChange={pickIcp} options={ICPS.map((item) => ({ id: item.id, label: item.label }))} />
            <p className={styles.note}>{state.icp === "custom" ? "Not on the list? Saul works anywhere phones ring. Set every number below." : <>Avg ticket benchmark: <b>{icp.note}</b> — every preset stays adjustable.</>}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>§ 02 / Call Profile</div>
            <Slider label="Monthly inbound calls" value={state.calls} min={25} max={20000} step={25} onChange={set("calls")} format={(v) => fmtNumber(v)} />
            <Slider label="Missed / after-hours" value={state.missedPct} min={5} max={60} suffix="%" onChange={set("missedPct")} hint={`${fmtNumber(m.missedCalls)} calls/mo currently hit voicemail`} />
            <Slider label="Qualified rate (of missed)" value={state.qualPct} min={10} max={80} suffix="%" onChange={set("qualPct")} hint={`${fmtNumber(m.qualMissed)} missed qualified calls/mo`} />
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>§ 03 / Revenue Economics</div>
            <Slider label="Close rate on qualified calls" value={state.closePct} min={5} max={60} suffix="%" onChange={set("closePct")} />
            <Slider label="Average ticket value" value={state.ticket} min={50} max={50000} step={25} onChange={set("ticket")} format={fmtDollar} hint="Click the value to type any amount — no ceiling." />
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>§ 04 / Labor & Coverage</div>
            <Slider label="People on phones today" value={state.roles} min={0.5} max={50} step={0.5} suffix=" FTE" onChange={set("roles")} format={(v) => fmtNumber(v, 1)} />
            <Slider label="Share of phone workload Saul absorbs" value={state.saulShare} min={10} max={90} suffix="%" onChange={set("saulShare")} hint={`${fmtNumber(m.saulCalls)} calls/mo answered, captured & routed by Saul`} />
            <Slider label="Minutes per call" value={state.minPerCall} min={3} max={20} step={0.5} suffix=" min" onChange={set("minPerCall")} format={(v) => fmtNumber(v, 1)} />
            <Slider label="Staff hourly rate" value={state.rate} min={10} max={120} suffix="/hr" onChange={set("rate")} format={fmtDollar} hint={`Fully loaded: ${fmtDollar(m.fteMonthlyCost)}/mo per phone hire`} />
          </div>

          <div className={`${styles.card} ${styles.collapsible}`}>
            <button type="button" className={styles.collapseHead} onClick={() => setAdvanced((value) => !value)}>
              <span>§ 05 / Advanced Assumptions</span>
              <b>{advanced ? "− hide" : "+ show"}</b>
            </button>
            {advanced ? (
              <div className={styles.advancedBody}>
                <Slider label="Phone-staff utilization" value={state.utilization} min={0.2} max={0.7} step={0.05} onChange={set("utilization")} format={(v) => `${fmtNumber(v * 100)}%`} parse={(v) => (v > 1 ? v / 100 : v)} />
                <Slider label="Fully-loaded payroll multiplier" value={state.loadMult} min={1} max={1.8} step={0.05} onChange={set("loadMult")} format={(v) => `${fmtNumber(v, 2)}×`} />
                <Slider label="Paid hours per FTE / month" value={state.hoursPerFte} min={120} max={220} step={0.1} suffix=" hrs" onChange={set("hoursPerFte")} format={(v) => fmtNumber(v, 1)} />
                <button type="button" className={styles.secondaryButton} onClick={() => setState((prev) => ({ ...prev, utilization: 0.4, loadMult: LOAD_DEFAULT, hoursPerFte: HOURS_PER_FTE }))}>↺ Reset assumptions</button>
              </div>
            ) : null}
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>§ 06 / Package</div>
            <Segmented<PackageId> value={state.pkg} onChange={set("pkg")} options={[{ id: "auto", label: "Auto" }, { id: "operator", label: "Operator" }, { id: "night", label: "Night Mgr" }, { id: "cco", label: "CCO" }]} />
            <p className={styles.note}>{state.pkg === "auto" ? `Auto-recommends from call volume → ${PACKAGES[recommend(state.calls)].name}` : `${m.pkg.fit} · live in ${m.pkg.deploy}`}</p>
            {m.pkgId === "cco" ? <Slider label="CCO scope price" value={state.ccoPrice} min={9500} max={27000} step={500} suffix="/mo" onChange={set("ccoPrice")} format={fmtDollar} /> : null}
          </div>

          {internal ? (
            <div className={`${styles.card} ${styles.internalCard}`}>
              <div className={styles.internalTitle}>§ 07 / Deal Levers — Internal</div>
              <Segmented<TermId> value={state.term} onChange={set("term")} options={[{ id: "m2m", label: "Month-to-month" }, { id: "12mo", label: "12-month" }, { id: "24mo", label: "24-month" }]} />
              <p className={styles.note}>{state.term === "m2m" ? `Onboarding charged: ${fmtDollar(m.onboardingFee)}` : "Onboarding waived · rate protected"}</p>
              {m.pkgId === "cco" ? <Slider label="CCO onboarding" value={state.ccoOnboarding} min={5000} max={15000} step={500} onChange={set("ccoOnboarding")} format={fmtDollar} /> : null}
              <label className={styles.checkbox}><input type="checkbox" checked={state.audit} onChange={(event) => set("audit")(event.target.checked)} /> Include AI Operations Audit — $3,500 half-day</label>
            </div>
          ) : null}
        </section>

        <section className={styles.results} aria-label="ROI calculator results">
          <div className={styles.heroStats}>
            <div className={`${styles.bigStat} ${styles.leakBox}`}><span>Revenue leaking now</span><b>{fmtDollar(m.recovered)}/mo</b><small>{fmtNumber(m.qualMissed)} missed qualified × {state.closePct}% × {fmtDollar(state.ticket)}</small></div>
            <div className={`${styles.bigStat} ${styles.cyanBox}`}><span>Total monthly benefit</span><b>{fmtDollar(m.benefit)}</b><small>recovered revenue + {fmtDollar(m.laborSavings)} labor</small></div>
            <div className={styles.bigStat}><span>ROI multiple</span><b>{fmtNumber(m.roiX, 1)}×</b><small>pays for itself in ~{m.payback} days</small></div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>§ Roles & Man-Hours Replaced</div>
            <div className={styles.rolesGrid}>
              <div><strong>{fmtNumber(m.fteReplaced, 1)}<span> FTE</span></strong><p>{fmtNumber(m.hoursSaved)} paid hrs/mo{m.capped ? " · capped at your headcount" : ""}</p></div>
              <div className={styles.compareBars}>
                <div><span>One phone hire ({fmtDollar(state.rate)}/hr)</span><i><em style={{ width: `${Math.min(100, (m.fteMonthlyCost / Math.max(m.fteMonthlyCost, m.price)) * 100)}%` }} /></i><b>{fmtDollar(m.fteMonthlyCost)}/mo</b></div>
                <div><span>Saul · {m.pkg.name}</span><i><em className={styles.saulBar} style={{ width: `${Math.min(100, (m.price / Math.max(m.fteMonthlyCost, m.price)) * 100)}%` }} /></i><b>{fmtDollar(m.price)}/mo</b></div>
                <p>One human still cannot cover nights, weekends, sick days, or two calls at once. Saul can.</p>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>§ The Receipt — Every Number on the Record</div>
            <div className={styles.receipt}>
              <ReceiptRow label="Missed qualified calls/mo" value={fmtNumber(m.qualMissed)} />
              <ReceiptRow label={`Recovered revenue (× ${state.closePct}% × ${fmtDollar(state.ticket)})`} value={fmtDollar(m.recovered)} tone="leak" />
              <ReceiptRow label="Calls Saul absorbs/mo" value={fmtNumber(m.saulCalls)} />
              <ReceiptRow label={`Hands-on phone work (× ${fmtNumber(state.minPerCall, 1)} min)`} value={`${fmtNumber(m.workHours)} hrs`} />
              <ReceiptRow label={`Paid staffing avoided (÷ ${fmtNumber(state.utilization * 100)}% utilization)`} value={`${fmtNumber(m.hoursSaved)} hrs`} />
              <ReceiptRow label={`Labor savings (× ${fmtDollar(m.loadedHourly)}/hr loaded)`} value={fmtDollar(m.laborSavings)} tone="leak" />
              <ReceiptRow label="Total monthly benefit" value={fmtDollar(m.benefit)} strong />
              <ReceiptRow label={`Saul · ${m.pkg.name}`} value={`− ${fmtDollar(m.price)}/mo`} />
              <ReceiptRow label="Net gain/month" value={fmtDollar(m.net)} tone="cyan" strong />
              <ReceiptRow label="Net gain/year" value={fmtDollar(m.net * 12)} tone="cyan" strong />
            </div>
          </div>

          {internal ? (
            <div className={`${styles.card} ${styles.internalCard}`}>
              <div className={styles.internalTitle}>§ Deal Economics — Internal Only</div>
              <div className={styles.receipt}>
                <ReceiptRow label={`${m.pkg.name} × 12 months`} value={fmtDollar(m.price * 12)} />
                <ReceiptRow label={`Onboarding (${state.term === "m2m" ? "charged · M2M" : "waived with term"})`} value={m.feeDue ? fmtDollar(m.feeDue) : "$0"} />
                {state.audit ? <ReceiptRow label="AI Operations Audit" value={fmtDollar(3500)} /> : null}
                <ReceiptRow label="Year-1 deal value to AskSaul" value={fmtDollar(m.year1Deal)} tone="cyan" strong />
                <ReceiptRow label="Customer's year-1 net benefit" value={fmtDollar(m.year1Net)} strong />
              </div>
            </div>
          ) : null}

          <div className={styles.exportStrip}>
            <div><b>Ready to put it in front of them?</b><span>{internal ? "Exports an internal two-page briefing. Toggle customer view before sending." : "Exports a branded, customer-safe ROI briefing."}</span></div>
            <button type="button" className={styles.primaryButton} onClick={exportPdf}>Export branded PDF →</button>
          </div>
        </section>
      </main>

      <PrintSheet state={state} internal={internal} />
    </div>
  );
}

function PrintSheet({ state, internal }: { state: RoiState; internal: boolean }) {
  const m = computeRoi(state);
  const icp = ICPS.find((item) => item.id === state.icp) ?? ICPS[0];
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className={styles.printSheet}>
      <section className={styles.printPage}>
        <div className={styles.printMeta}><span>● ASK SAUL · VOICE AGENTS</span><span>§ ROI BRIEFING · {today.toUpperCase()}</span></div>
        <div className={styles.printBody}>
          <div className={styles.printClass}>PREPARED FOR A {icp.label.toUpperCase()} OPERATOR</div>
          <h1>What the missed calls are worth — <em>and what Saul costs.</em></h1>
          <p>Based on your numbers: {fmtNumber(state.calls)} inbound calls a month, {state.missedPct}% missed or after-hours, a {state.closePct}% close rate, and a {fmtDollar(state.ticket)} average ticket.</p>
          <div className={styles.printStats}>
            <div><span>LEAKING TODAY</span><b>{fmtDollar(m.recovered)}/mo</b></div>
            <div><span>PAID HOURS RETURNED</span><b>{fmtNumber(m.hoursSaved)} hrs/mo</b></div>
            <div><span>ROLES REPLACED</span><b>{fmtNumber(m.fteReplaced, 1)} FTE</b></div>
            <div><span>NET GAIN</span><b>{fmtDollar(m.net)}/mo</b></div>
          </div>
          <div className={styles.printReceipt}>
            <ReceiptRow label="Missed qualified calls / month" value={fmtNumber(m.qualMissed)} />
            <ReceiptRow label={`Recovered revenue (${fmtNumber(m.qualMissed)} × ${state.closePct}% × ${fmtDollar(state.ticket)})`} value={fmtDollar(m.recovered)} tone="leak" />
            <ReceiptRow label="Calls Saul answers, captures & routes" value={`${fmtNumber(m.saulCalls)} /mo`} />
            <ReceiptRow label={`Paid phone staffing avoided (${fmtNumber(m.workHours)} hrs hands-on ÷ ${fmtNumber(state.utilization * 100)}% utilization)`} value={`${fmtNumber(m.hoursSaved)} hrs · ${fmtNumber(m.fteReplaced, 1)} FTE`} />
            <ReceiptRow label={`Saul · ${m.pkg.name} (${m.pkg.fit} · live in ${m.pkg.deploy})`} value={`− ${fmtDollar(m.price)} /mo`} />
            <ReceiptRow label="Your net gain" value={`${fmtDollar(m.net)} /mo · ${fmtDollar(m.net * 12)} /yr · ${fmtNumber(m.roiX, 1)}× return`} tone="cyan" strong />
          </div>
          <div className={styles.printCta}><b>Hear Saul before you decide.</b><span>Book a demo — we will map your call flow and show you exactly where the leak is.</span><small>TEXT SAUL: (720) 292-7554 · EMAIL: Saul@asksaul.ai · GREGORY: (970) 343-9634 · WEB: AskSaul.ai</small></div>
        </div>
        <div className={styles.printMeta}><span>SAUL SOLVES. YOU WIN.</span><span>ASKSAUL.AI{internal ? " · PAGE 01 / 02" : ""}</span></div>
      </section>
      {internal ? (
        <section className={styles.printPage}>
          <div className={styles.printMeta}><span>INTERNAL — DO NOT SEND TO CUSTOMER</span><span>§ DEAL SHEET · {today.toUpperCase()}</span></div>
          <div className={styles.printBody}>
            <h1>Deal economics — <em>internal only.</em></h1>
            <div className={styles.printReceipt}>
              <ReceiptRow label={`${m.pkg.name} × 12 months`} value={fmtDollar(m.price * 12)} />
              <ReceiptRow label="Onboarding" value={m.feeDue ? fmtDollar(m.feeDue) : "$0"} />
              {state.audit ? <ReceiptRow label="AI Operations Audit" value={fmtDollar(3500)} /> : null}
              <ReceiptRow label="Year-1 deal value to AskSaul" value={fmtDollar(m.year1Deal)} tone="cyan" strong />
              <ReceiptRow label="Customer year-1 net benefit" value={`${fmtDollar(m.year1Net)} (${fmtNumber((m.benefit * 12) / m.year1Deal, 1)}× their spend)`} strong />
            </div>
          </div>
          <div className={styles.printMeta}><span>ASK SAUL · INTERNAL</span><span>PAGE 02 / 02</span></div>
        </section>
      ) : null}
    </div>
  );
}
