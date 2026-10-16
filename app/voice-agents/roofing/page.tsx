import type { Metadata } from "next";
import VerticalLanding, { type VerticalContent } from "@/components/voice-agents/VerticalLanding";
import { ROOFING_STORY } from "@/components/voice-agents/stories";

export const metadata: Metadata = {
  title: "AI Receptionist for Roofing Companies on the Front Range",
  description:
    "Every storm call answered, even when you're on a roof. Saul, an AI receptionist for Front Range roofers, plus Google and AI search visibility. Founding Client Program: one roofer per city, closes Dec 31.",
  alternates: { canonical: "https://asksaul.ai/voice-agents/roofing" },
  openGraph: {
    title: "More homeowners find you. Every call gets answered, even when you're on a roof.",
    description: "AI receptionist + local visibility for Front Range roofers. One roofer per city.",
    url: "https://asksaul.ai/voice-agents/roofing",
  },
};

const content: VerticalContent = {
  trade: "roofing",
  eyebrow: "Front Range roofing",
  line1: "More homeowners find you.",
  line2: "Every call answered, even on a roof.",
  sub: "After a hail run, that's dozens of calls in two days. The homeowner with water coming through the ceiling doesn't leave a voicemail. They call the next name on Google.",
  rings:
    "Google Business Profile cleanup (categories, service areas across your cities, photos, posts, review responses), local SEO for the cities you work, and AI search so ChatGPT, Gemini, and Google's AI answers recommend you.",
  answered:
    "Saul answers after hours, on weekends, and when your line is busy. It gets the address, damage type, roof age, whether a claim is filed and an adjuster scheduled, and retail vs insurance. It texts you a clean lead, books inspections only by your rules, and never quotes a price unless you tell it to.",
  story: ROOFING_STORY,
  proofNote:
    "Honest note: we don't have a roofing case study yet. You'd be one of the first. That's why the guarantee exists: if Saul misses your lead target in the first 30 days, month 2 is free.",
  faqs: [
    {
      question: "Can it tell insurance jobs from retail?",
      answer: "Yes. Saul asks whether a claim is filed and an adjuster is scheduled, and tags the lead retail or insurance before it reaches you.",
    },
    {
      question: "Will it quote prices?",
      answer: "Never, unless you write that rule. Saul captures the job and books inspections by your rules.",
    },
    {
      question: "Will callers know they are talking to an AI?",
      answer: "Yes. Saul says so at the start of every call. A homeowner with a leak cares more about getting a callback than who answered.",
    },
    {
      question: "How much of my time does setup take?",
      answer: "About 30 minutes on a kickoff call. We build, tune, and report. You approve the intake rules before anything goes live.",
    },
  ],
  closing: ["The next storm is coming.", "Be the roofer who picks up."],
};

export default function RoofingPage() {
  return <VerticalLanding c={content} />;
}
