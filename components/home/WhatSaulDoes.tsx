import Link from "next/link";
import { Moon, FileText, HelpCircle, Search, Inbox, Settings, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const CARDS = [
  {
    icon: Moon,
    headline: "Answers your customers while you sleep",
    body: "Saul responds to WhatsApp and Telegram messages 24/7 with answers trained on your business. No more missed leads at 11pm.",
  },
  {
    icon: FileText,
    headline: "Drafts follow-ups from your meeting notes",
    body: "Drop your notes into the chat. Saul writes the follow-up emails, action items, and client summaries. You review and send.",
  },
  {
    icon: HelpCircle,
    headline: "Handles the questions your team answers 50 times a week",
    body: "Pricing, hours, availability, do you serve my area? Saul handles the FAQ so your team handles the work that matters.",
  },
  {
    icon: Search,
    headline: "Researches leads before your sales calls",
    body: "Tell Saul who you are meeting with. Get a brief on their company, recent news, and talking points before you dial.",
  },
  {
    icon: Inbox,
    headline: "Manages your inbox and flags what matters",
    body: "Saul triages your messages, surfaces urgent items, and drafts responses to the routine ones. You decide what gets sent.",
  },
  {
    icon: Settings,
    headline: "Runs your back-office tasks on autopilot",
    body: "Data entry, CRM updates, invoice reminders, appointment confirmations. The stuff that eats 2 hours a day and produces zero revenue.",
  },
];

export default function WhatSaulDoes() {
  return (
    <section className="relative py-24 bg-obsidian">
      <div
        className="absolute inset-0 dot-pattern opacity-30"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
            Real Work
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-cloud"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What Saul does on a Tuesday morning
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <AnimatedSection
                key={i}
                delay={i * 80}
                className="bg-carbon border border-wire rounded-2xl p-6 hover:border-cyan/30 hover:shadow-[0_0_30px_rgba(0,212,170,0.05)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan" />
                </div>
                <h3
                  className="text-base font-semibold text-cloud mb-2 leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {card.headline}
                </h3>
                <p className="text-base text-slate leading-relaxed">{card.body}</p>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection className="text-center">
          <p className="text-sm text-slate mb-6">
            These are real workflows running on AskSaul deployments today. Not demos. Not mockups.
          </p>
          <Link
            href="/ai-automation"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:gap-3 transition-all duration-200"
          >
            See how it works for your industry
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
