import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Accordion from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "Marketing Engine",
  description:
    "Full GoHighLevel white-label setup for service businesses. Replace 5 tools with one system. $3,500 setup + $1,000/mo. CRM, email, SMS, funnels, and reputation management.",
};

const GHL_FEATURES = [
  "Branded CRM with your logo and domain",
  "Email and SMS marketing sequences",
  "Automated lead capture funnels",
  "Pipeline management and deal tracking",
  "Appointment scheduling and calendar sync",
  "Review management and reputation monitoring",
  "Social media posting and scheduling",
  "Reporting and analytics dashboard",
  "Website chat widget",
  "Call tracking and recording",
];

const TOOL_COMPARISON = [
  { tool: "CRM (HubSpot / Salesforce)", cost: "$800/mo" },
  { tool: "Email marketing (Mailchimp / ActiveCampaign)", cost: "$150/mo" },
  { tool: "SMS marketing (Twilio / EZTexting)", cost: "$200/mo" },
  { tool: "Appointment scheduling (Calendly / Acuity)", cost: "$50/mo" },
  { tool: "Review management (Birdeye / Podium)", cost: "$300/mo" },
];

const TOOL_COMPARISON_TOTAL = "$1,500+/mo";

const WHO_ITS_FOR = [
  {
    type: "HVAC, Plumbing, Roofing",
    desc: "Lead capture from website and ads, automated follow-up sequences, review requests after every job.",
  },
  {
    type: "Real Estate",
    desc: "Lead nurture across weeks and months, listing alerts, CRM pipeline by deal stage.",
  },
  {
    type: "Dental and Medical Practices",
    desc: "Appointment reminders, recall sequences, review collection, patient follow-up.",
  },
  {
    type: "Marketing Agencies",
    desc: "Resell the platform to clients under your brand. We set up the sub-accounts.",
  },
  {
    type: "Coaches and Consultants",
    desc: "Sales funnel from lead magnet to discovery call to offer. Fully automated nurture.",
  },
  {
    type: "Service Businesses Generally",
    desc: "Any business spending $1,500+/mo across multiple tools with leads falling through the cracks.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is GoHighLevel?",
    answer:
      "GoHighLevel (GHL) is an all-in-one marketing platform built for agencies and service businesses. It replaces your CRM, email marketing tool, SMS platform, scheduling software, and review management system. AskSaul white-labels it under your brand so it looks like your own platform.",
  },
  {
    question: "Why $3,500 for setup? What is included?",
    answer:
      "Setup includes account provisioning, custom domain configuration, CRM pipeline build, at least 3 automated sequences (lead follow-up, appointment reminder, review request), funnel build (1 to 2 pages), calendar integration, and a walkthrough so you know how to use it. This typically takes 20 to 40 hours of work.",
  },
  {
    question: "What does the $1,000/mo cover?",
    answer:
      "The monthly fee covers your white-labeled GHL sub-account, ongoing support, sequence updates, new funnel pages as needed, and technical maintenance. This is not a software license plus a hidden support fee: it is all-in.",
  },
  {
    question: "Do I own the platform or are you the middleman?",
    answer:
      "You own your data and your contact list, always. The platform runs under your brand on your domain. If you ever want to move to your own GHL account, your contacts and pipelines move with you.",
  },
  {
    question: "How long until it is running?",
    answer:
      "Basic setup typically takes 1 to 2 weeks. Full automation sequences and funnel builds take 2 to 4 weeks depending on how much content and copy needs to be created. You can start using the CRM immediately while sequences are being built.",
  },
  {
    question: "Is this better than just signing up for GHL myself?",
    answer:
      "GHL has a learning curve and a lot of configuration. Most businesses that sign up directly get overwhelmed and underuse it. AskSaul handles the setup, builds the automations, and keeps it running. You get the platform without the learning tax.",
  },
];

export default function MarketingEnginePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">Marketing Engine</Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Your entire marketing department.
                <br className="hidden sm:block" />
                <span className="text-cyan">In one system.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                You are paying for 5 different tools and still have leads falling through the cracks. The marketing engine replaces all of them and actually follows up.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="lg">
                    Build Your Proposal
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="mailto:1.gregory.ringler@gmail.com">
                  <Button variant="ghost" size="lg">
                    Book a Strategy Call
                  </Button>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Pricing box */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <Card glow className="p-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-4">GoHighLevel White-Label</p>
                <div className="flex items-end justify-center gap-3 mb-2">
                  <div>
                    <span className="font-display text-4xl font-bold text-cloud">$3,500</span>
                    <span className="text-slate ml-1">setup</span>
                  </div>
                  <span className="text-slate text-2xl mb-1">+</span>
                  <div>
                    <span className="font-display text-4xl font-bold text-cloud">$1,000</span>
                    <span className="text-slate ml-1">/mo</span>
                  </div>
                </div>
                <p className="text-slate text-base mb-8">All-in. No hidden software license. No support add-ons.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {GHL_FEATURES.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-base text-slate">
                      <Check className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Tool cost comparison */}
        <section className="py-16 px-4 bg-carbon/40">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-2">
                What you are probably already paying
              </h2>
              <p className="text-slate mb-8">
                Five disconnected tools, five bills, and they still do not talk to each other.
              </p>

              <div className="flex flex-col divide-y divide-wire mb-4">
                {TOOL_COMPARISON.map((row) => (
                  <div key={row.tool} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-error shrink-0" />
                      <span className="text-base text-slate">{row.tool}</span>
                    </div>
                    <span className="text-sm font-semibold text-error">{row.cost}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-semibold text-cloud">Total monthly cost</span>
                  <span className="text-sm font-bold text-error">{TOOL_COMPARISON_TOTAL}</span>
                </div>
              </div>

              <div className="bg-graphite border border-cyan/20 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-cloud">AskSaul Marketing Engine</p>
                  <p className="text-sm text-slate mt-0.5">All of the above, in one system, set up and managed for you</p>
                </div>
                <span className="text-sm font-bold text-cyan shrink-0">$1,000/mo</span>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Who it is for */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-2">Who this is for</h2>
              <p className="text-slate mb-8">
                Service businesses spending $1,500+ per month across multiple tools and still losing leads.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHO_ITS_FOR.map((item, i) => (
                <AnimatedSection key={item.type} delay={i * 70}>
                  <Card glow className="p-5">
                    <h3 className="font-semibold text-cloud mb-2 text-base">{item.type}</h3>
                    <p className="text-sm text-slate leading-relaxed">{item.desc}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* What good setup looks like */}
        <section className="py-16 px-4 bg-carbon/40">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-6">What a real setup looks like</h2>
              <div className="flex flex-col gap-4">
                {[
                  {
                    title: "Week 1: Foundation",
                    desc: "Account setup, domain configuration, CRM pipeline build, calendar integration, and contact import.",
                  },
                  {
                    title: "Week 2: Automations",
                    desc: "Lead follow-up sequence (10 touchpoints over 30 days), appointment reminder sequence, and review request trigger built and tested.",
                  },
                  {
                    title: "Week 3: Funnels",
                    desc: "Lead capture landing page and thank-you page built. Connected to CRM pipeline. Ads integration set up if applicable.",
                  },
                  {
                    title: "Week 4: Training and launch",
                    desc: "Walkthrough of the dashboard. Team access configured. Go live. First leads start flowing.",
                  },
                ].map((phase) => (
                  <div key={phase.title} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center shrink-0">
                      <span className="text-cyan text-xs font-bold">
                        {phase.title[5]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-cloud text-sm mb-1">{phase.title}</p>
                      <p className="text-base text-slate leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
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
                Stop losing leads to a broken follow-up process.
              </h2>
              <p className="text-slate mb-6">
                Build a proposal and tell us about your current setup. We will show you exactly what the marketing engine would look like for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="lg">
                    Build Your Proposal
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="mailto:1.gregory.ringler@gmail.com">
                  <Button variant="ghost" size="lg">
                    Book a Strategy Call
                  </Button>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
    </>
  );
}
