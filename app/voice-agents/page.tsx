import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, PhoneCall, Plus, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQSchema from "@/components/seo/FAQSchema";
import VoiceAgentLeadForm from "@/components/voice-agents/VoiceAgentLeadForm";
import CallStory from "@/components/voice-agents/CallStory";
import Waveform from "@/components/site/Waveform";
import MobileActionBar from "@/components/site/MobileActionBar";
import { DEMO_PHONE_DISPLAY, DEMO_PHONE_HREF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "AI Receptionist for Front Range Roofing & HVAC",
  description:
    "We make your phone ring. Saul makes sure it gets answered. An AI receptionist plus Google visibility for Front Range roofing and HVAC shops. Founding Client Program: 10 shops, closes Dec 31.",
  openGraph: {
    title: "We make your phone ring. Saul makes sure it gets answered.",
    description:
      "AI receptionist + local visibility for Front Range roofing and HVAC shops. 10 founding spots, closes Dec 31.",
    url: "https://asksaul.ai/voice-agents",
  },
};

const FAQS = [
  {
    question: "Will callers know they are talking to an AI?",
    answer:
      "Yes. Saul says so at the start of every call. The goal is to get the homeowner help fast, not to trick anyone.",
  },
  {
    question: "What does Saul actually do on a call?",
    answer:
      "Answers, asks your intake questions (service, address, urgency, timing), and then books or routes the job by your rules. You get a clean summary every time.",
  },
  {
    question: "Does it work with my CRM?",
    answer:
      "Saul writes leads straight into GoHighLevel with tags, notes, and next steps. Other tools depend on access, and we check that on the first call.",
  },
  {
    question: "How much of my time does setup take?",
    answer:
      "About 30 minutes of owner time. We build it, tune it, and report on it. You approve the intake rules before anything goes live.",
  },
  {
    question: "Does it replace my office staff?",
    answer:
      "No. Saul covers after-hours, overflow, and the calls nobody can grab while they are on a roof or in an attic. Your team keeps every call they can take.",
  },
];

const FOUNDING_TERMS = [
  { title: "Setup and build on us.", body: "No setup fee for founding clients." },
  { title: "Rate locked for 12 months.", body: "Full price for the package you choose, held for a year." },
  {
    title: "Month 2 free if Saul misses.",
    body: "Miss your qualified-lead target in the first 30 days and month 2 is on us. Most shops start at 10; we set yours together before go-live, based on your real call volume.",
  },
  {
    title: "Your city is yours.",
    body: "On our marketing + Saul packages, we work with one roofer and one HVAC company per city while you are a client.",
  },
  { title: "90 days, then month-to-month.", body: "No long contract after the initial term." },
];

const CITIES = ["Denver metro", "Boulder", "Fort Collins", "Colorado Springs", "Loveland", "Longmont", "Greeley"];

const COMPARE = [
  { name: "Voicemail", points: ["Caller does the work", "Most hang up and call the next shop", "You find out tomorrow"], good: false },
  { name: "Answering service", points: ["Takes a message", "Quality varies by who picks up", "You still re-key it into the CRM"], good: false },
  { name: "Saul", points: ["Answers every call, 24/7", "Asks your intake questions", "Books or routes, logs it in your CRM"], good: true },
];

export default function VoiceAgentsPage() {
  return (
    <>
      <FAQSchema questions={FAQS} />
      <Navbar />
      <main id="main-content" className="overflow-x-clip">
        {/* HERO */}
        <section className="grain relative flex min-h-svh items-center overflow-hidden bg-obsidian pb-20 pt-36 sm:pt-40">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-40 left-1/3 h-[680px] w-[680px] rounded-full bg-cyan/10 blur-[140px]" />
            <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-ice/10 blur-[120px]" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-8">
            <div>
              <div className="rise mb-8 inline-flex items-center gap-3 rounded-full border border-wire bg-carbon/60 py-1.5 pl-3 pr-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate backdrop-blur">
                <Waveform bars={7} className="h-3.5" />
                Front Range roofing + HVAC
              </div>

              <h1 className="font-display text-[2.6rem] font-bold leading-[1] tracking-tight text-cloud sm:text-6xl lg:text-[4.1rem] xl:text-[4.6rem]">
                <span className="rise-text block" style={{ ["--d" as string]: "80ms" }}>We make your phone ring.</span>
                <span className="rise-text text-shimmer block" style={{ ["--d" as string]: "200ms" }}>
                  Saul makes sure it gets answered.
                </span>
              </h1>

              <p className="rise-text mt-7 max-w-xl text-lg leading-relaxed text-slate sm:text-xl" style={{ ["--d" as string]: "320ms" }}>
                An AI receptionist that picks up when your crew can&apos;t, plus the Google work that brings the calls in.
              </p>

              <div className="rise mt-9 flex flex-col gap-4 sm:flex-row" style={{ ["--d" as string]: "440ms" }}>
                <Link
                  href="#founding"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-4 text-lg font-semibold text-obsidian shadow-[0_0_40px_rgba(0,212,170,0.35)] transition-all hover:shadow-[0_0_60px_rgba(0,212,170,0.5)]"
                >
                  Claim a founding spot
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={DEMO_PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-wire px-8 py-4 text-lg font-semibold text-cloud transition-colors hover:border-cyan/50 hover:text-cyan"
                >
                  <PhoneCall className="h-5 w-5" />
                  Call Saul: {DEMO_PHONE_DISPLAY}
                </a>
              </div>
              <p className="rise mt-5 text-sm text-dim" style={{ ["--d" as string]: "520ms" }}>
                Call the demo line and try to break it.
              </p>
            </div>

            {/* Founder offer card */}
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
                  {["Setup and build on us", "Rate locked for 12 months", "Month 2 free if Saul misses", "One roofer + one HVAC shop per city*"].map(
                    (t) => (
                      <li key={t} className="flex items-center gap-3 text-[17px] text-slate">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan/15">
                          <Check className="h-3.5 w-3.5 text-cyan" />
                        </span>
                        {t}
                      </li>
                    )
                  )}
                </ul>
                <Link
                  href="#founding"
                  className="group mt-9 flex items-center justify-between rounded-xl border border-cyan/40 bg-cyan/10 px-5 py-4 font-semibold text-cyan transition-colors hover:bg-cyan/20"
                >
                  Claim your city
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="mt-4 text-xs text-dim">*On marketing + Saul packages. Full terms below.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROOF */}
        <section className="border-y border-wire/60 bg-carbon/40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-wire/60 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
            {[
              { n: "+300%", l: "website visits for Lou's Heating & Cooling since the rebuild" },
              { n: "2x", l: "contact form submissions for Lou's, same period" },
              { n: "24/7", l: "after-hours and overflow calls answered by Saul" },
            ].map((s) => (
              <div key={s.n} className="reveal px-2 py-10 sm:px-10">
                <p className="text-gradient font-display text-5xl font-bold sm:text-6xl">{s.n}</p>
                <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-slate">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <CallStory />

        {/* COMPARE */}
        <section className="bg-carbon/30 py-32 sm:py-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="reveal mb-20 max-w-3xl font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">
              Voicemail is not a plan.
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {COMPARE.map((c) => (
                <div
                  key={c.name}
                  className={`reveal rounded-3xl p-8 sm:p-10 ${
                    c.good ? "bg-cyan text-obsidian shadow-[0_30px_100px_rgba(0,212,170,0.25)]" : "border border-wire bg-obsidian"
                  }`}
                >
                  <p className={`mb-8 font-display text-2xl font-bold ${c.good ? "text-obsidian" : "text-cloud"}`}>{c.name}</p>
                  <ul className="space-y-4">
                    {c.points.map((p) => (
                      <li key={p} className={`flex gap-3 ${c.good ? "font-medium text-obsidian" : "text-slate"}`}>
                        {c.good ? <Check className="mt-1 h-4 w-4 shrink-0" /> : <X className="mt-1 h-4 w-4 shrink-0 text-dim" />}
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOUNDING + FORM */}
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
                {FOUNDING_TERMS.map((t) => (
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
              <VoiceAgentLeadForm />
            </div>
          </div>
        </section>

        {/* TRY TO BREAK IT */}
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

        {/* FAQ */}
        <section className="bg-obsidian py-32 sm:py-40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
            <h2 className="reveal font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-5xl">Fair questions.</h2>
            <div className="divide-y divide-wire border-y border-wire">
              {FAQS.map((f) => (
                <details key={f.question} className="group py-2">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-lg font-semibold text-cloud transition-colors hover:text-cyan">
                    {f.question}
                    <Plus className="faq-icon h-5 w-5 shrink-0 text-cyan transition-transform duration-300" />
                  </summary>
                  <p className="max-w-2xl pb-6 leading-relaxed text-slate">{f.answer}</p>
                </details>
              ))}
              <p className="py-6 text-sm text-dim">
                Run a dumpster or hauling business?{" "}
                <Link href="/voice-agents/waste" className="font-semibold text-cyan hover:underline">
                  See the waste-industry flow
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-obsidian pb-40 pt-16">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <h2 className="reveal font-display text-5xl font-bold leading-[0.98] text-cloud sm:text-7xl">
              Your phone is already ringing.
              <span className="text-gradient block">Answer every call.</span>
            </h2>
            <div className="reveal mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="#founding"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-4 text-lg font-semibold text-obsidian shadow-[0_0_40px_rgba(0,212,170,0.35)]"
              >
                Claim a founding spot
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={DEMO_PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-wire px-8 py-4 text-lg font-semibold text-cloud hover:border-cyan/50 hover:text-cyan"
              >
                <PhoneCall className="h-5 w-5" />
                Call the demo line
              </a>
            </div>
          </div>
        </section>
        <div className="h-20 md:hidden" aria-hidden="true" />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
