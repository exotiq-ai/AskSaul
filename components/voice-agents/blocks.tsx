import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, PhoneCall, Plus } from "lucide-react";
import Waveform from "@/components/site/Waveform";
import VoiceAgentLeadForm from "@/components/voice-agents/VoiceAgentLeadForm";
import { BRAND, DEMO_PHONE_DISPLAY, DEMO_PHONE_HREF } from "@/lib/constants";

export type Trade = "roofing" | "hvac";

export const CITIES = ["Denver metro", "Boulder", "Fort Collins", "Colorado Springs", "Loveland", "Longmont", "Greeley"];

const EXCLUSIVITY: Record<Trade | "both", string> = {
  both: "One roofer + one HVAC shop per city*",
  roofing: "One roofer per city*",
  hvac: "One HVAC company per city*",
};

function exclusivityBody(trade?: Trade) {
  const who =
    trade === "roofing" ? "one roofer" : trade === "hvac" ? "one HVAC company" : "one roofer and one HVAC company";
  return `On our marketing + Saul packages, we work with ${who} per city while you are a client. If you're in, your competitor across town can't get it.`;
}

export function PrimaryCta({ href = "#founding", children = "Claim a founding spot" }: { href?: string; children?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-4 text-lg font-semibold text-obsidian shadow-[0_0_40px_rgba(0,212,170,0.35)] transition-all hover:shadow-[0_0_60px_rgba(0,212,170,0.5)]"
    >
      {children}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function CallCta({ label = `Call Saul: ${DEMO_PHONE_DISPLAY}` }: { label?: string }) {
  return (
    <a
      href={DEMO_PHONE_HREF}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-wire px-8 py-4 text-lg font-semibold text-cloud transition-colors hover:border-cyan/50 hover:text-cyan"
    >
      <PhoneCall className="h-5 w-5" />
      {label}
    </a>
  );
}

export function FounderOfferCard({ trade }: { trade?: Trade }) {
  return (
    <div className="rise relative" style={{ ["--d" as string]: "360ms" }}>
      <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-cyan/60 via-ice/20 to-transparent" aria-hidden="true" />
      <div className="relative rounded-[2rem] bg-carbon/95 p-8 backdrop-blur sm:p-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Founding Client Program</span>
          <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">Closes Dec 31</span>
        </div>
        <p className="font-display text-3xl font-bold leading-tight text-cloud">
          The first 10 Front Range shops Gregory builds himself.
        </p>
        <ul className="mt-8 space-y-4">
          {["Setup and build on us", "Rate locked for 12 months", "Month 2 free if Saul misses", EXCLUSIVITY[trade ?? "both"]].map((t) => (
            <li key={t} className="flex items-center gap-3 text-[17px] text-slate">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan/15">
                <Check className="h-3.5 w-3.5 text-cyan" />
              </span>
              {t}
            </li>
          ))}
        </ul>
        <Link
          href="#founding"
          className="group mt-9 flex items-center justify-between rounded-xl border border-cyan/40 bg-cyan/10 px-5 py-4 font-semibold text-cyan transition-colors hover:bg-cyan/20"
        >
          Claim your city
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="mt-4 text-xs text-dim">
          *On marketing + Saul packages.{" "}
          <Link href="/audit" className="text-slate underline-offset-2 hover:text-cyan hover:underline">
            Not ready? Get the free audit.
          </Link>
        </p>
      </div>
    </div>
  );
}

export function VoiceHero({
  eyebrow,
  line1,
  line2,
  sub,
  trade,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  sub: string;
  trade?: Trade;
}) {
  return (
    <section className="grain relative flex min-h-svh items-center overflow-hidden bg-obsidian pb-20 pt-36 sm:pt-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/3 h-[680px] w-[680px] rounded-full bg-cyan/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-ice/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-8">
        <div>
          <div className="rise mb-8 inline-flex items-center gap-3 rounded-full border border-wire bg-carbon/60 py-1.5 pl-3 pr-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate backdrop-blur">
            <Waveform bars={7} className="h-3.5" />
            {eyebrow}
          </div>

          <h1
            className={`font-display font-bold leading-[1] tracking-tight text-cloud ${
              (line1 + line2).length > 56
                ? "text-[2.35rem] sm:text-[3.4rem] lg:text-[3.6rem] xl:text-[4rem]"
                : "text-[2.6rem] sm:text-6xl lg:text-[4.1rem] xl:text-[4.6rem]"
            }`}
          >
            <span className="rise-text block" style={{ ["--d" as string]: "80ms" }}>{line1}</span>
            <span className="rise-text text-shimmer block" style={{ ["--d" as string]: "200ms" }}>
              {line2}
            </span>
          </h1>

          <p className="rise-text mt-7 max-w-xl text-lg leading-relaxed text-slate sm:text-xl" style={{ ["--d" as string]: "320ms" }}>
            {sub}
          </p>

          <div className="rise mt-9 flex flex-col gap-4 sm:flex-row" style={{ ["--d" as string]: "440ms" }}>
            <PrimaryCta />
            <CallCta />
          </div>
          <p className="rise mt-5 text-sm text-dim" style={{ ["--d" as string]: "520ms" }}>
            Call the demo line and try to break it.
          </p>
        </div>

        <FounderOfferCard trade={trade} />
      </div>
    </section>
  );
}

export function ProofStrip({ items }: { items: { n: string; l: string }[] }) {
  return (
    <section className="border-y border-wire/60 bg-carbon/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-wire/60 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
        {items.map((s) => (
          <div key={s.n} className="reveal px-2 py-10 sm:px-10">
            <p className="text-gradient font-display text-5xl font-bold sm:text-6xl">{s.n}</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-slate">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FounderNote() {
  return (
    <section className="bg-carbon/30 py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-[0.75fr_1.25fr] md:gap-20 lg:px-8">
        <div className="reveal relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan/10 blur-2xl" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src="/images/gregory-ringler.jpg"
              alt="Gregory Ringler, founder of AskSaul"
              fill
              sizes="(min-width: 768px) 360px, 90vw"
              className="object-cover object-[72%_45%]"
            />
          </div>
        </div>
        <figure className="reveal">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Built by the founder</p>
          <blockquote className="font-display text-3xl font-bold leading-snug text-cloud sm:text-4xl">
            &ldquo;I build every founding shop&apos;s Saul myself: the intake rules, the call routing, the Google work. If it
            doesn&apos;t hit your lead target in 30 days, month 2 is on me.&rdquo;
          </blockquote>
          <figcaption className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="font-semibold text-cloud">Gregory Ringler, founder · Denver</span>
            <a href={`tel:+1${BRAND.phone.replace(/\D/g, "")}`} className="text-cyan hover:underline">
              Call me directly: {BRAND.phone}
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

const FOUNDING_TERMS = (trade?: Trade) => [
  { title: "Setup and build on us.", body: "No setup fee for founding clients." },
  { title: "Rate locked for 12 months.", body: "Full price for the package you choose, held for a year." },
  {
    title: "Month 2 free if Saul misses.",
    body: "Miss your qualified-lead target in the first 30 days and month 2 is on us. Most shops start at 10; we set yours together before go-live, based on your real call volume.",
  },
  { title: "Your city is yours.", body: exclusivityBody(trade) },
  { title: "Free Missed-Call & Visibility Audit first.", body: "See where your calls leak before you decide." },
  { title: "90 days, then month-to-month.", body: "No long contract after the initial term." },
];

export function FoundingSection({ trade }: { trade?: Trade }) {
  return (
    <section id="founding" className="relative bg-obsidian py-32 sm:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Founding Client Program</p>
          <h2 className="font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">
            Claim your city before a competitor does.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate">
            Not a pilot. The tech works. Founding clients pay full price and get bonuses no one gets after Dec 31.
          </p>

          <ul className="mt-12 space-y-7">
            {FOUNDING_TERMS(trade).map((t) => (
              <li key={t.title} className="reveal flex gap-4">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan/15">
                  <Check className="h-3.5 w-3.5 text-cyan" />
                </span>
                <div>
                  <p className="font-semibold text-cloud">{t.title}</p>
                  <p className="mt-1 leading-relaxed text-slate">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <span key={c} className="rounded-full border border-wire px-3 py-1.5 text-sm text-slate">
                {c}
              </span>
            ))}
          </div>

          <p className="mt-10 max-w-lg text-sm leading-relaxed text-dim">
            In return: a case study, permission to use call recordings (Saul tells every caller up front), and one referral intro at day 60. Closes at 10 shops or December 31, 2026, whichever comes first.
          </p>
        </div>

        <div className="reveal">
          <VoiceAgentLeadForm defaultServiceType={trade === "roofing" ? "Roofing" : trade === "hvac" ? "HVAC" : undefined} />
        </div>
      </div>
    </section>
  );
}

export function TryToBreakIt() {
  return (
    <section className="grain relative overflow-hidden bg-carbon py-32 sm:py-40">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25" aria-hidden="true">
        <Waveform bars={40} barClassName="w-1.5 sm:w-2.5" className="parallax h-72 w-full max-w-6xl justify-between px-4" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="reveal mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Hear it for yourself</p>
        <h2 className="reveal font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">Try to break it.</h2>
        <p className="reveal mx-auto mt-6 max-w-xl text-lg text-slate">
          Ask what a homeowner would ask. Then ask it to book you a call with Gregory.
        </p>
        <a
          href={DEMO_PHONE_HREF}
          className="reveal mt-12 inline-block font-display text-5xl font-bold tracking-tight text-cloud transition-colors hover:text-cyan sm:text-7xl"
        >
          {DEMO_PHONE_DISPLAY}
        </a>
      </div>
    </section>
  );
}

export function AuditBand() {
  return (
    <section className="bg-obsidian py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/audit"
          className="reveal group flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-wire bg-carbon/60 p-8 transition-colors hover:border-cyan/40 sm:p-12 md:flex-row md:items-center"
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Not ready to talk?</p>
            <p className="font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">Get the free Missed-Call & Visibility Audit.</p>
            <p className="mt-3 max-w-xl text-slate">Your Google profile, reviews, AI search, and website, checked against the top shops in your city. You keep it either way.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-cyan/40 px-6 py-3.5 font-semibold text-cyan transition-all group-hover:gap-3 group-hover:bg-cyan/10">
            Get my free audit <ArrowRight className="h-5 w-5" />
          </span>
        </Link>
      </div>
    </section>
  );
}

export function FaqList({ faqs, footer }: { faqs: { question: string; answer: string }[]; footer?: React.ReactNode }) {
  return (
    <section className="bg-obsidian py-32 sm:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <h2 className="reveal font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-5xl">Fair questions.</h2>
        <div className="divide-y divide-wire border-y border-wire">
          {faqs.map((f) => (
            <details key={f.question} className="group py-2">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-lg font-semibold text-cloud transition-colors hover:text-cyan">
                {f.question}
                <Plus className="faq-icon h-5 w-5 shrink-0 text-cyan transition-transform duration-300" />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-slate">{f.answer}</p>
            </details>
          ))}
          {footer && <div className="py-6 text-sm text-dim">{footer}</div>}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <section className="relative overflow-hidden bg-obsidian pb-40 pt-16">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h2 className="reveal font-display text-5xl font-bold leading-[0.98] text-cloud sm:text-7xl">
          {line1}
          <span className="text-gradient block">{line2}</span>
        </h2>
        <div className="reveal mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <PrimaryCta />
          <CallCta label="Call the demo line" />
        </div>
      </div>
    </section>
  );
}
