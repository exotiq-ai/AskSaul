import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Bot, Workflow, Mic } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Accordion from "@/components/ui/Accordion";
import TierCards from "./TierCards";
import SecuritySection from "./SecuritySection";

export const metadata: Metadata = {
  title: "AI & Automation",
  description:
    "Self-hosted AI assistants built on OpenClaw. Security-hardened, custom-tuned, and done for you. Starter from $500. Compare tiers and see what's included.",
};

const TIERS = [
  {
    id: "starter",
    name: "Saul Classic",
    label: "Starter",
    emoji: "Starter",
    forWho: "Solopreneurs and individual professionals",
    price: "$500",
    priceNote: "one-time setup",
    ongoing: "~$20 to $80/mo API costs only",
    popular: false,
    features: [
      "OpenClaw installation on your machine or VPS",
      "One messaging channel (Telegram or WhatsApp)",
      "Custom personality setup (name, tone, style)",
      "Security hardening with zero critical findings",
      "Basic workspace configuration",
      "Quick start guide",
      "1 week email support post-setup",
    ],
  },
  {
    id: "team",
    name: "AskSaul Team",
    label: "Team",
    emoji: "Team",
    forWho: "Small teams, agencies, small offices (2 to 10 people)",
    price: "$1,000",
    priceNote: "one-time setup",
    ongoing: "~$50 to $200/mo API costs only",
    popular: true,
    features: [
      "Everything in Starter",
      "Multi-user access with per-person DM privacy",
      "Group chat with organized topic channels",
      "Mention-gated responses",
      "Access control: only your team can use the bot",
      "Up to 2 messaging channels",
      "Admin guide and emergency procedures",
      "2 weeks of support post-setup",
      "One free config adjustment within 30 days",
    ],
  },
  {
    id: "pro",
    name: "AskSaul Pro",
    label: "Pro",
    emoji: "Pro",
    forWho: "Businesses with customer-facing needs or complex workflows",
    price: "$2,500",
    priceNote: "one-time setup",
    ongoing: "~$100 to $500/mo API costs only",
    popular: false,
    features: [
      "Everything in Team",
      "Separate internal and customer-facing channels",
      "Custom knowledge base integration",
      "Brand voice tuning with detailed personality file",
      "Sandbox mode for safe execution",
      "Up to 3 messaging channels",
      "Custom skill installation",
      "Comprehensive admin documentation",
      "30 days of support post-setup",
      "Two free config adjustments within 60 days",
      "Monthly security audit for first 3 months",
    ],
  },
  {
    id: "developer",
    name: "AskSaul Dev",
    label: "Developer",
    emoji: "Dev",
    forWho: "Developers, technical teams, DevOps",
    price: "$1,200",
    priceNote: "one-time setup",
    ongoing: "~$50 to $300/mo API costs only",
    popular: false,
    features: [
      "Everything in Team",
      "GitHub integration (issues, PRs, CI monitoring)",
      "Coding agent capabilities",
      "Multiple model support with intelligent fallbacks",
      "Developer-focused skills installed",
      "Sandbox mode for code execution",
      "2 weeks of support post-setup",
    ],
  },
];

const ADDONS = [
  { name: "Additional messaging channel", desc: "Add WhatsApp, Discord, Slack, etc.", price: "$150" },
  { name: "Custom skill development", desc: "Build a specialized capability for your bot", price: "$350 / skill" },
  { name: "Monthly managed care", desc: "Updates, security audits, config changes", price: "$200 to $500/mo" },
  { name: "Quarterly security audit + optimization", desc: "Deep audit, personality tuning, optimization", price: "$250 / quarter" },
  { name: "VPS setup and management", desc: "We provision and manage the server", price: "$75/mo + hosting" },
];

const SECURITY_POINTS = [
  {
    title: "Access controls verified",
    desc: "Only the people who should talk to your bot can talk to it. Allowlists configured, tested, and documented.",
  },
  {
    title: "Credential isolation",
    desc: "API keys and tokens stay in secure config files, never in workspace documents or chat logs.",
  },
  {
    title: "Tool safety review",
    desc: "Filesystem access is scoped. Code execution is gated. No elevated privileges unless explicitly needed.",
  },
  {
    title: "Network security",
    desc: "Gateway bound to localhost. No exposed ports. Remote access via Tailscale or secured reverse proxy only.",
  },
  {
    title: "Security audit before handoff",
    desc: "Every deployment must pass `openclaw security audit` with zero critical findings. That is not optional.",
  },
  {
    title: "Honest disclosures",
    desc: "We tell you what AI can and cannot do. Prompt injection is real. We harden against it but will not pretend it is impossible.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is OpenClaw?",
    answer:
      "OpenClaw is an open-source, self-hosted AI gateway. It connects AI models (like Claude or GPT) to your messaging apps (Telegram, WhatsApp, Discord, Slack) and gives them the ability to take actions, use tools, and maintain memory. The key word is self-hosted: your data stays on your infrastructure, not on someone else's servers.",
  },
  {
    question: "How is this different from just signing up for ChatGPT?",
    answer:
      "ChatGPT is a web app. It does not live in your messaging apps, does not remember context across sessions unless you pay for memory features, cannot take actions in your tools, and keeps your conversations on OpenAI's servers. An OpenClaw deployment lives in Telegram or WhatsApp or wherever your team already works, remembers context, can take actions, and runs on your own machine or VPS.",
  },
  {
    question: "What does ongoing API cost mean?",
    answer:
      "OpenClaw connects to AI model providers like Anthropic (Claude) or OpenAI. Those providers charge based on usage, typically $10 to $30 per million tokens. For most small businesses, actual usage runs $20 to $200 per month depending on how heavily the bot is used. You pay the provider directly; AskSaul does not mark this up.",
  },
  {
    question: "What if I need help after setup?",
    answer:
      "Every tier includes post-setup support (1 to 4 weeks depending on tier). After that, managed care add-ons are available for ongoing updates, security audits, and config changes. Emergency support is available at $100 per incident or $75/mo retainer.",
  },
  {
    question: "Can my customers interact with the bot?",
    answer:
      "Yes, with the Pro tier. Customer-facing deployments use strict tool lockdown so customers cannot access internal tools or data. Internal admin channels get full tool access. This separation is a core part of the security model.",
  },
  {
    question: "Do I need a VPS or can this run on my computer?",
    answer:
      "Both work. Local machine is the simplest starting point but goes offline when your computer sleeps. A VPS (around $5 to $15/mo from providers like DigitalOcean or Hetzner) gives better uptime. VPS setup and management is an available add-on if you want it handled.",
  },
];

export default function AIAutomationPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">AI & Automation</Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Your AI assistant. <br className="hidden sm:block" />
                <span className="text-cyan">Your data. Your infrastructure.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                Generic chatbots are cheap for a reason. AskSaul deployments are security-hardened, custom-tuned to your business, and done for you. The difference is measurable.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* OpenClaw tiers */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-2">OpenClaw Deployments</p>
                <h2 className="font-display text-3xl font-bold text-cloud mb-3">Pick your tier</h2>
                <p className="text-slate max-w-xl mx-auto">
                  One-time setup fee. No monthly subscription to AskSaul. You pay API costs directly to the model provider.
                </p>
              </div>
            </AnimatedSection>

            <TierCards tiers={TIERS} />
          </div>
        </section>

        {/* Add-ons */}
        <section className="py-16 px-4 bg-carbon/40">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-8 text-center">Add-ons</h2>
              <div className="flex flex-col divide-y divide-wire">
                {ADDONS.map((addon) => (
                  <div key={addon.name} className="py-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-cloud mb-0.5">{addon.name}</p>
                      <p className="text-sm text-slate">{addon.desc}</p>
                    </div>
                    <p className="text-sm font-semibold text-cyan shrink-0">{addon.price}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Security section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-cyan" />
                <h2 className="font-display text-2xl font-bold text-cloud">
                  Security is not an add-on. It is the baseline.
                </h2>
              </div>
              <p className="text-slate mb-10 max-w-2xl">
                A $50 Fiverr install gets you a bot that is running. An AskSaul deployment gets you a bot that is running securely, documented, and audited. Here is what that means in practice.
              </p>
            </AnimatedSection>

            <SecuritySection points={SECURITY_POINTS} />

            <AnimatedSection delay={400}>
              <div className="mt-8 p-5 rounded-xl border border-wire bg-graphite">
                <p className="text-base text-slate">
                  <span className="text-cloud font-semibold">What the $50 version skips:</span> Access control configuration. Security audit. Credential hygiene. Tool safety review. Network hardening. Documentation. Ongoing support. Everything that makes the difference between a bot that runs and a bot you can trust.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Chatbot + Voice */}
        <section className="py-16 px-4 bg-carbon/40">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-2">More AI services</h2>
              <p className="text-slate mb-10">Beyond OpenClaw deployments, we build standalone AI products for specific business needs.</p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <AnimatedSection delay={0}>
                <Card glow className="p-5">
                  <Bot className="w-6 h-6 text-cyan mb-3" />
                  <h3 className="font-semibold text-cloud mb-2">Website AI Chatbot</h3>
                  <p className="text-base text-slate mb-4 leading-relaxed">
                    A standalone AI chatbot embedded on your website. Qualifies leads, answers FAQs, books appointments. Not OpenClaw, but purpose-built for customer-facing use.
                  </p>
                  <p className="text-sm font-semibold text-cyan">$3,500 setup + $500/mo</p>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={80}>
                <Card glow className="p-5">
                  <Workflow className="w-6 h-6 text-cyan mb-3" />
                  <h3 className="font-semibold text-cloud mb-2">Workflow Automation</h3>
                  <p className="text-base text-slate mb-4 leading-relaxed">
                    CRM automation, data enrichment, lead routing, and back-office process automation. Every project is scoped to your specific workflows.
                  </p>
                  <p className="text-sm font-semibold text-cyan">$2,500 to $7,500 / project</p>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={160}>
                <Card className="p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-graphite/60" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Mic className="w-6 h-6 text-slate" />
                      <Badge variant="muted">Coming Soon</Badge>
                    </div>
                    <h3 className="font-semibold text-cloud mb-2">Voice Agent</h3>
                    <p className="text-base text-slate mb-4 leading-relaxed">
                      AI that answers your business calls, qualifies leads, and books appointments. Powered by ElevenLabs. Currently in development.
                    </p>
                    <p className="text-xs text-dim">Email capture for early access coming soon.</p>
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-8">Frequently asked</h2>
              <Accordion items={FAQ_ITEMS} />
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center bg-graphite border border-wire rounded-2xl p-10">
              <h2 className="font-display text-2xl font-bold text-cloud mb-3">
                Ready to stop doing it manually?
              </h2>
              <p className="text-slate mb-6">
                Build a proposal. Get a scoped quote in your inbox within 24 hours.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
    </>
  );
}
