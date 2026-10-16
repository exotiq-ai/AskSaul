import Link from "next/link";
import { ArrowUpRight, Check, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQSchema from "@/components/seo/FAQSchema";
import CallStory from "@/components/voice-agents/CallStory";
import MobileActionBar from "@/components/site/MobileActionBar";
import {
  AuditBand,
  FaqList,
  FinalCta,
  FounderNote,
  FoundingSection,
  ProofStrip,
  TryToBreakIt,
  VoiceHero,
} from "@/components/voice-agents/blocks";
import { pageMetadata } from "@/lib/seo";
import PageSeoSchema from "@/components/seo/PageSeoSchema";
import { serviceSchema } from "@/components/seo/schema";

export const metadata = pageMetadata("/voice-agents");

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

const COMPARE = [
  { name: "Voicemail", points: ["Caller does the work", "Most hang up and call the next shop", "You find out tomorrow"], good: false },
  { name: "Answering service", points: ["Takes a message", "Quality varies by who picks up", "You still re-key it into the CRM"], good: false },
  { name: "Saul", points: ["Answers every call, 24/7", "Asks your intake questions", "Books or routes, logs it in your CRM"], good: true },
];

const TRADES = [
  { href: "/voice-agents/roofing", title: "For roofers", body: "Storm calls, active leaks, insurance vs retail." },
  { href: "/voice-agents/hvac", title: "For HVAC", body: "No-heat nights, gas-smell safety, on-call routing." },
];

export default function VoiceAgentsPage() {
  return (
    <>
      <FAQSchema questions={FAQS} />
      <PageSeoSchema path="/voice-agents" extra={[serviceSchema({ path: "/voice-agents", name: "AI receptionist and local visibility for roofing and HVAC", serviceType: "AI receptionist", description: "Saul answers after-hours and overflow calls, takes the job details, and books or routes by the owner's rules, plus Google Business Profile, local SEO, and AI search work.", audience: "Roofing and HVAC contractors" })]} />
      <Navbar />
      <main id="main-content" className="overflow-x-clip">
        <VoiceHero
          eyebrow="Front Range roofing + HVAC"
          line1="We make your phone ring."
          line2="Saul makes sure it gets answered."
          sub="An AI receptionist that picks up when your crew can't, plus the Google work that brings the calls in."
        />

        <ProofStrip
          items={[
            { n: "+300%", l: "website visits for Lou's Heating & Cooling since the rebuild" },
            { n: "2x", l: "contact form submissions for Lou's, same period" },
            { n: "24/7", l: "after-hours and overflow calls answered by Saul" },
          ]}
        />

        <section className="bg-obsidian pt-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            {TRADES.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="reveal group flex items-center justify-between gap-6 rounded-3xl border border-wire bg-carbon/50 p-8 transition-colors hover:border-cyan/40"
              >
                <div>
                  <p className="font-display text-2xl font-bold text-cloud">{t.title}</p>
                  <p className="mt-1 text-slate">{t.body}</p>
                </div>
                <ArrowUpRight className="h-6 w-6 shrink-0 text-cyan transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        <CallStory />

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

        <FounderNote />
        <FoundingSection />
        <TryToBreakIt />
        <AuditBand />
        <FaqList
          faqs={FAQS}
          footer={
            <>
              Run a dumpster or hauling business?{" "}
              <Link href="/voice-agents/waste" className="font-semibold text-cyan hover:underline">
                See the waste-industry flow
              </Link>
              .
            </>
          }
        />
        <FinalCta line1="Your phone is already ringing." line2="Answer every call." />
        <div className="h-20 md:hidden" aria-hidden="true" />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
