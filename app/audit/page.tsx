import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuditRequestForm from "@/components/audit/AuditRequestForm";
import { FounderNote } from "@/components/voice-agents/blocks";

export const metadata: Metadata = {
  title: "Free Missed-Call & Visibility Audit for Roofing & HVAC",
  description:
    "A free one-page report for Front Range roofing and HVAC shops: your Google profile, reviews vs the top 3 in your city, AI search presence, website on a phone, and the top 3 fixes. You keep it either way.",
  alternates: { canonical: "https://asksaul.ai/audit" },
  openGraph: {
    title: "See where your calls are leaking.",
    description: "Free Missed-Call & Visibility Audit for Front Range roofing and HVAC shops.",
    url: "https://asksaul.ai/audit",
  },
};

const CHECKS = [
  { title: "Google Business Profile", body: "Scored item by item: categories, service areas, hours, photos, posts, review replies." },
  { title: "Reviews vs your top 3", body: "Count, rating, recent reviews, and reply rate against the top 3 shops in your city." },
  { title: "AI search", body: "Whether ChatGPT, Gemini, and Google's AI answers recommend you, or your competitors." },
  { title: "Your website on a phone", body: "Speed, click-to-call, contact form, and city pages, checked like a homeowner would." },
  { title: "After-hours call", body: "With your OK, one test call so you hear what a homeowner hears at 9 p.m." },
  { title: "The top 3 fixes", body: "Ranked by impact. Do them yourself, or have us do them." },
];

const SAMPLE = [
  { k: "Google profile", v: "Fix", c: "bg-warning/15 text-warning" },
  { k: "Reviews", v: "Good", c: "bg-success/15 text-success" },
  { k: "AI search", v: "Not listed", c: "bg-error/15 text-error" },
  { k: "Website", v: "Fix", c: "bg-warning/15 text-warning" },
  { k: "After-hours", v: "Voicemail", c: "bg-error/15 text-error" },
];

export default function AuditPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="overflow-x-clip">
        <section className="grain relative overflow-hidden bg-obsidian pb-24 pt-36 sm:pt-40">
          <div className="pointer-events-none absolute -top-40 left-1/4 h-[680px] w-[680px] rounded-full bg-cyan/10 blur-[140px]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-8">
            <div className="lg:pt-8">
              <p className="rise mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Free for Front Range roofing + HVAC</p>
              <h1 className="font-display text-[2.6rem] font-bold leading-[1] tracking-tight text-cloud sm:text-6xl lg:text-[4.1rem]">
                <span className="rise-text block">See where your</span>
                <span className="rise-text text-shimmer block" style={{ ["--d" as string]: "120ms" }}>
                  calls are leaking.
                </span>
              </h1>
              <p className="rise-text mt-7 max-w-xl text-lg leading-relaxed text-slate sm:text-xl" style={{ ["--d" as string]: "240ms" }}>
                A one-page report on how your shop shows up when a homeowner goes looking, and where calls slip away. You keep it either way. No pitch attached.
              </p>

              <div className="rise mt-12 max-w-md rounded-3xl border border-wire bg-carbon/60 p-6" style={{ ["--d" as string]: "360ms" }} aria-hidden="true">
                <div className="mb-4 flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-[0.2em] text-slate">Sample scorecard</span>
                  <span className="text-dim">Illustration</span>
                </div>
                <ul className="space-y-2.5">
                  {SAMPLE.map((s) => (
                    <li key={s.k} className="flex items-center justify-between rounded-xl bg-obsidian/70 px-4 py-3 text-sm">
                      <span className="text-cloud">{s.k}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.c}`}>{s.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rise" style={{ ["--d" as string]: "200ms" }} id="audit-form">
              <AuditRequestForm />
            </div>
          </div>
        </section>

        <section className="bg-carbon/30 py-32 sm:py-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="reveal mb-20 max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">What we check</p>
              <h2 className="font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">Real checks. No guesses.</h2>
              <p className="mt-6 max-w-xl text-lg text-slate">
                Every line comes from a check we actually ran, with the date. If we couldn&apos;t verify something, the report says so.
              </p>
            </div>
            <ol className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {CHECKS.map((c, i) => (
                <li key={c.title} className="reveal border-t border-wire pt-8">
                  <p className="mb-5 font-mono text-sm text-cyan">0{i + 1}</p>
                  <h3 className="font-display text-2xl font-bold text-cloud">{c.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate">{c.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <FounderNote />

        <section className="bg-obsidian pb-40 pt-16">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <h2 className="reveal font-display text-5xl font-bold leading-[0.98] text-cloud sm:text-7xl">
              Know what&apos;s leaking.
              <span className="text-gradient block">Then decide.</span>
            </h2>
            <div className="reveal mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="#audit-form"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-4 text-lg font-semibold text-obsidian shadow-[0_0_40px_rgba(0,212,170,0.35)]"
              >
                Get my free audit
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/voice-agents#founding"
                className="inline-flex items-center justify-center rounded-xl border border-wire px-8 py-4 text-lg font-semibold text-cloud hover:border-cyan/50 hover:text-cyan"
              >
                See the founding program
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
