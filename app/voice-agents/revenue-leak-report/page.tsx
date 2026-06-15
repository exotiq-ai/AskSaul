import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Revenue Leak Report for Voice Agents",
  description:
    "A printable AskSaul sales briefing on missed-call revenue leaks, voice-agent coverage, ROI math, packages, onboarding, and next steps.",
  alternates: { canonical: "https://asksaul.ai/voice-agents/revenue-leak-report" },
  robots: { index: false, follow: false },
};

const sections = [
  {
    no: "01",
    tag: "The Problem",
    title: "Every missed call is a leak your competitor can capture.",
    body:
      "After-hours calls, overflow, lunch breaks, and voicemail all create the same problem: a buyer with intent is forced to wait. Saul keeps the conversation alive while the lead is hottest.",
    bullets: ["Emergency service requests", "Quote calls after business hours", "Repeat customers who need routing", "New patient or consultation inquiries"],
  },
  {
    no: "02",
    tag: "The Fix",
    title: "Saul answers, qualifies, routes, and documents the call.",
    body:
      "The point is not novelty AI. The point is practical phone coverage: answer fast, ask the right questions, capture the useful context, and get the lead into the workflow your team already uses.",
    bullets: ["Missed-call recovery", "After-hours intake", "Overflow answering", "GHL notes and lead routing"],
  },
  {
    no: "03",
    tag: "The Math",
    title: "The ROI is hiding in calls you already paid to generate.",
    body:
      "The calculator uses monthly call volume, missed-call percentage, qualified rate, close rate, average ticket, labor coverage, and package cost to show recovered revenue plus staffing leverage.",
    bullets: ["Recovered revenue", "Paid phone hours returned", "FTE coverage replaced", "Monthly and annual net gain"],
  },
  {
    no: "04",
    tag: "Packages",
    title: "Start with the coverage layer that matches call volume.",
    body:
      "Operator handles smaller call flows, Night Manager is the flagship missed/after-hours layer, and Chief Comms Officer is custom for multi-site or high-volume operations.",
    bullets: ["Operator — $1,750/mo", "Night Manager — $2,500/mo", "Chief Comms Officer — custom from $9,500/mo"],
  },
  {
    no: "05",
    tag: "Onboarding",
    title: "Launch around the business, not around generic scripts.",
    body:
      "Setup maps the call flow, qualification rules, escalation paths, CRM routing, and follow-up expectations so Saul behaves like a practical extension of the front desk.",
    bullets: ["Call-flow map", "Voice and script tuning", "Routing and CRM handoff", "Test calls before go-live"],
  },
  {
    no: "06",
    tag: "Urgency",
    title: "The leak keeps running whether you measure it or not.",
    body:
      "If calls are already going unanswered, the cost is already real. The calculator gives owners a fast way to see whether one captured job, case, patient, or project can pay for coverage.",
    bullets: ["Night/weekend coverage", "Sick days and vacations", "Two callers at once", "Instant follow-up while intent is fresh"],
  },
];

export default function RevenueLeakReportPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#14181F] print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      <main id="main-content" className="pt-24 pb-20 print:pt-0 print:pb-0">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
          <article className="rounded-[28px] border border-[#D2CBBC] bg-[#FBF9F4] shadow-2xl shadow-black/10 overflow-hidden print:rounded-none print:border-0 print:shadow-none">
            <div className="flex items-center justify-between gap-6 border-b border-[#E3DED2] px-8 py-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#5A6473] print:px-14">
              <span><span className="text-[#007A63]">●</span> Ask Saul · Voice Agents</span>
              <span>Revenue Leak Report · 2026</span>
            </div>

            <div className="grid gap-10 px-8 py-12 lg:grid-cols-[1fr_320px] print:grid-cols-[1fr_300px] print:px-14">
              <div>
                <div className="mb-7 inline-flex rounded-full border border-[#D2CBBC] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#5A6473]">
                  Prepared for the owner · confidential briefing
                </div>
                <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[#0F1A2E] sm:text-7xl">
                  Stop losing customers because <span className="text-[#B8512E]">nobody picked up the phone.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-xl font-semibold leading-snug text-[#14181F]">
                  Saul answers, captures, and routes the calls your team misses.
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A6473]">
                  AskSaul Voice Agents give your business an always-available phone layer for after-hours calls, overflow, missed calls, intake, qualification, routing, and clean follow-up.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4 print:hidden">
                  <Link href="/voice-agents/roi" className="rounded-xl bg-[#00D4AA] px-6 py-3 text-sm font-bold text-[#052017] transition hover:bg-[#00A888]">
                    Open ROI calculator →
                  </Link>
                  <a href="mailto:Saul@asksaul.ai?subject=Book a Saul Voice Agent Demo" className="font-mono text-sm font-semibold text-[#007A63]">
                    Book a demo by email
                  </a>
                </div>
              </div>

              <aside className="rounded-2xl border border-[#D2CBBC] bg-white shadow-xl shadow-black/10">
                <div className="flex items-center justify-between border-b border-dashed border-[#D2CBBC] bg-[#F0ECE2] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.13em] text-[#5A6473]">
                  <span>Missed-call ledger</span><span className="text-[#B8512E]">Last night</span>
                </div>
                {[['Emergency service call', '−$1,500'], ['New patient inquiry', '−$3,000'], ['Quote request', '−$850'], ['Repeat customer', '−$1,250']].map(([label, amount]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-[#E3DED2] px-4 py-3 font-mono text-xs">
                    <span>{label}<small className="block uppercase tracking-widest text-[#9AA1AC]">→ voicemail</small></span>
                    <b className="text-[#B8512E]">{amount}</b>
                  </div>
                ))}
                <div className="flex items-end justify-between px-4 py-4">
                  <span className="max-w-[140px] font-mono text-[10px] uppercase tracking-widest text-[#5A6473]">4 calls your competitor may answer</span>
                  <b className="font-display text-3xl text-[#B8512E]">−$6,600</b>
                </div>
                <div className="mx-4 mb-4 rounded-xl border border-[#00D4AA]/50 bg-[#00D4AA]/10 px-3 py-3 font-mono text-xs text-[#007A63]">● Saul would have answered all four.</div>
              </aside>
            </div>
          </article>

          <div className="mt-8 grid gap-8 print:mt-0">
            {sections.map((section) => (
              <section key={section.no} className="rounded-[28px] border border-[#D2CBBC] bg-[#FBF9F4] p-8 print:min-h-[10in] print:rounded-none print:border-0 print:p-14">
                <div className="grid gap-6 sm:grid-cols-[92px_1fr]">
                  <div className="font-display text-7xl font-bold leading-none text-[#F0ECE2] [-webkit-text-stroke:1.5px_#D2CBBC]">{section.no}</div>
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#007A63]">§ {section.tag}</span>
                    <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#0F1A2E]">{section.title}</h2>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-[#5A6473]">{section.body}</p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <div key={bullet} className="flex gap-3 border-b border-[#E3DED2] pb-3 text-sm text-[#14181F]"><span className="font-mono font-bold text-[#007A63]">✓</span>{bullet}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            <section className="rounded-[28px] bg-[#0F1A2E] p-8 text-white print:min-h-[10in] print:rounded-none print:p-14">
              <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-[-0.04em]">Hear Saul before you decide.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">Book a demo. We will map your call flow, estimate the revenue leak, and show where the ROI is hiding.</p>
              <div className="mt-8 grid gap-4 border-t border-white/15 pt-6 font-mono text-sm sm:grid-cols-4">
                <div><span className="block text-[10px] uppercase tracking-widest text-white/45">Text Saul</span>(720) 292-7554</div>
                <div><span className="block text-[10px] uppercase tracking-widest text-white/45">Email</span><a className="text-[#00D4AA]" href="mailto:Saul@asksaul.ai">Saul@asksaul.ai</a></div>
                <div><span className="block text-[10px] uppercase tracking-widest text-white/45">Gregory</span>(970) 343-9634</div>
                <div><span className="block text-[10px] uppercase tracking-widest text-white/45">Web</span>AskSaul.ai</div>
              </div>
            </section>
          </div>
        </section>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
