import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, Bot, Zap, BarChart3, MessageSquare, Star, Phone, Calendar, Mail, Target, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Accordion from "@/components/ui/Accordion";
import FAQSchema from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Saul Marketing",
  description:
    "Your entire marketing stack in one platform. CRM, email, SMS, funnels, reputation management, and AI-powered follow-up. Replace 5+ tools and stop losing leads.",
  openGraph: {
    title: "Saul Marketing | AskSaul.ai",
    description:
      "Your entire marketing stack in one platform with AI built in. Replace 5+ tools, stop losing leads, and actually follow up.",
    url: "https://asksaul.ai/marketing-engine",
  },
};

const PLATFORM_FEATURES = [
  {
    icon: Users,
    title: "CRM and Pipeline Management",
    desc: "Track every lead from first touch to closed deal. Custom pipelines built for how your business actually works.",
  },
  {
    icon: Mail,
    title: "Email Marketing and Sequences",
    desc: "Automated nurture sequences that follow up for weeks without you lifting a finger. Drip campaigns, newsletters, and transactional emails.",
  },
  {
    icon: MessageSquare,
    title: "SMS and Text Automation",
    desc: "Two-way texting, appointment reminders, follow-up sequences, and review requests. All TCPA compliant.",
  },
  {
    icon: Target,
    title: "Funnels and Landing Pages",
    desc: "Lead capture pages that convert. Connected directly to your pipeline so no lead gets lost between tools.",
  },
  {
    icon: Calendar,
    title: "Scheduling and Calendar Sync",
    desc: "Clients book directly on your calendar. Automatic reminders reduce no-shows. Syncs with Google and Outlook.",
  },
  {
    icon: Star,
    title: "Reputation and Review Management",
    desc: "Automated review requests after every job or appointment. Monitor and respond to reviews from one dashboard.",
  },
  {
    icon: Phone,
    title: "Call Tracking and Recording",
    desc: "Track which campaigns generate calls. Record calls for training and quality. Local and toll-free numbers.",
  },
  {
    icon: BarChart3,
    title: "Reporting Dashboard",
    desc: "See what is working and what is not. Pipeline value, conversion rates, campaign performance, all in one place.",
  },
];

const TOOL_COMPARISON = [
  { tool: "CRM", example: "HubSpot, Salesforce", cost: "$45 to $800" },
  { tool: "Email marketing", example: "Mailchimp, ActiveCampaign", cost: "$50 to $300" },
  { tool: "SMS platform", example: "EZTexting, SlickText", cost: "$100 to $200" },
  { tool: "Funnel builder", example: "ClickFunnels, Leadpages", cost: "$97 to $297" },
  { tool: "Scheduling", example: "Calendly, Acuity", cost: "$12 to $20" },
  { tool: "Review management", example: "Podium, Birdeye", cost: "$249 to $599" },
  { tool: "Call tracking", example: "CallRail, CallTrackingMetrics", cost: "$45 to $145" },
  { tool: "Social management", example: "Hootsuite, Buffer", cost: "$99 to $249" },
];

const SAUL_DIFFERENTIATORS = [
  {
    title: "Saul lives inside your marketing platform",
    desc: "Your AI assistant reads your pipeline, drafts follow-ups, flags stale leads, and suggests next actions. Not a separate tool. Built in.",
  },
  {
    title: "Automated lead scoring that learns your business",
    desc: "Every lead gets scored based on engagement, response time, and behavior patterns. High-value leads get surfaced automatically.",
  },
  {
    title: "Webhook and API integrations via MCP",
    desc: "Connect your marketing platform to any tool in your stack. Inventory systems, project management, accounting software. If it has an API, Saul can talk to it.",
  },
  {
    title: "Sequences that adapt, not just repeat",
    desc: "Most follow-up sequences are static. Yours adjust based on how leads interact. Opened but did not reply? Different message. Clicked the link? Different path.",
  },
];

const WHO_ITS_FOR = [
  {
    type: "HVAC, Plumbing, Roofing",
    desc: "Lead capture from ads, automated follow-up sequences, review requests after every job, seasonal campaign scheduling.",
  },
  {
    type: "Real Estate",
    desc: "Lead nurture across weeks and months, listing alerts, CRM pipeline by deal stage, automated market updates.",
  },
  {
    type: "Dental and Medical Practices",
    desc: "Appointment reminders, recall sequences, review collection, patient follow-up, no-show re-engagement.",
  },
  {
    type: "Law Firms and Consultants",
    desc: "Intake form automation, case status updates, referral tracking, consultation booking with automated prep emails.",
  },
  {
    type: "Coaches and Course Creators",
    desc: "Sales funnel from lead magnet to discovery call to offer. Fully automated nurture with deadline triggers.",
  },
  {
    type: "Any Service Business",
    desc: "If you are spending $1,500+ per month across multiple tools and leads are still falling through the cracks, this is for you.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What platform is this built on?",
    answer:
      "Saul Marketing is built on enterprise-grade marketing infrastructure used by thousands of agencies and service businesses. We configure, customize, and manage it for you so you get the power of an enterprise platform without the learning curve or the DIY setup. Your AI assistant is integrated directly into the backend.",
  },
  {
    question: "What is included in the setup?",
    answer:
      "Setup includes your branded platform with custom domain, CRM pipeline build, at least 3 automated sequences (lead follow-up, appointment reminder, review request), funnel or landing page build, calendar integration, contact import, and a hands-on walkthrough so your team knows how to use it. This typically takes 20 to 40 hours of work.",
  },
  {
    question: "What does the monthly fee cover?",
    answer:
      "The monthly fee covers your platform, ongoing support, sequence updates, new pages as needed, AI integrations, and technical maintenance. This is not a software license with hidden support fees. It is all-in.",
  },
  {
    question: "Do I own my data?",
    answer:
      "Yes. You own your contact list, your pipeline data, your campaign history, all of it. If you ever decide to move, your data moves with you. No lock-in.",
  },
  {
    question: "How long until it is running?",
    answer:
      "Basic CRM and pipeline setup is typically live in week one. Full automation sequences, funnels, and integrations take 2 to 4 weeks depending on complexity. You start using the platform immediately while we build out the advanced features.",
  },
  {
    question: "How is this different from just buying marketing software myself?",
    answer:
      "Most marketing platforms have a steep learning curve and hundreds of features that take months to configure properly. Most businesses that go the DIY route get overwhelmed and underuse the platform. With Saul Marketing, you get a fully configured system with custom automations, AI integration, and ongoing management. You get the results without the learning tax.",
  },
  {
    question: "What makes Saul Marketing different from other agencies?",
    answer:
      "Two things. First, you get an AI assistant that lives inside your marketing platform and actively works your pipeline, not just passive automation but an AI that drafts follow-ups, scores leads, and flags opportunities. Second, you are working with a founder who built a full SaaS platform solo, not an agency that outsources to contractors. The technical depth is real.",
  },
];

export default function MarketingEnginePage() {
  return (
    <>
      <FAQSchema questions={FAQ_ITEMS} />
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">Saul Marketing</Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Your entire marketing stack.
                <br className="hidden sm:block" />
                <span className="text-cyan">One platform. AI built in.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                You are paying for 5+ disconnected tools and leads are still falling through the cracks. Saul Marketing replaces all of them, follows up automatically, and has an AI assistant working your pipeline around the clock.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="lg">
                    See What Saul Marketing Does for Your Business
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <p className="text-dim text-sm mt-4">
                Get a custom proposal with your true ROI. Takes 3 minutes. No commitment.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Cost comparison */}
        <section className="py-16 px-4 bg-carbon/40">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-2">
                What you are probably paying right now
              </h2>
              <p className="text-slate mb-8">
                Eight disconnected tools. Eight bills. And they still do not talk to each other.
              </p>

              <div className="flex flex-col divide-y divide-wire mb-4">
                {TOOL_COMPARISON.map((row) => (
                  <div key={row.tool} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <X className="w-4 h-4 text-error shrink-0" />
                      <span className="text-base text-slate truncate">{row.tool}</span>
                      <span className="text-xs text-dim hidden sm:inline">({row.example})</span>
                    </div>
                    <span className="text-sm font-semibold text-error shrink-0 ml-4">{row.cost}/mo</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-4">
                  <span className="text-sm font-bold text-cloud">Total if you piece it together</span>
                  <span className="text-sm font-bold text-error">$697 to $2,610/mo</span>
                </div>
              </div>

              <div className="bg-graphite border border-cyan/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-cloud">Saul Marketing</p>
                    <p className="text-sm text-slate mt-0.5">All of the above in one platform, configured and managed for you, with AI built in</p>
                  </div>
                </div>
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="sm">
                    See What Saul Marketing Does for Your Business
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <p className="text-xs text-dim mt-3">Custom pricing based on your business needs and growth goals.</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* What is included */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
                Everything in one place
              </p>
              <h2 className="font-display text-2xl font-bold text-cloud mb-2">
                What you get with Saul Marketing
              </h2>
              <p className="text-slate mb-10 max-w-2xl">
                Not a list of software features. A configured, running marketing system built for your business.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PLATFORM_FEATURES.map((feature, i) => (
                <AnimatedSection key={feature.title} delay={i * 60}>
                  <Card className="p-5 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                        <feature.icon className="w-4 h-4 text-cyan" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-cloud text-base mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* AI Differentiator */}
        <section className="py-20 px-4 bg-carbon/40">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan" />
                </div>
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan">
                  The Saul Difference
                </p>
              </div>
              <h2 className="font-display text-2xl font-bold text-cloud mb-2">
                You do not just get software. You get software with a brain.
              </h2>
              <p className="text-slate mb-10 max-w-2xl">
                Most marketing platforms are passive. They wait for you to set things up and push buttons. Saul Marketing has an AI assistant on the backend that actively works your pipeline.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SAUL_DIFFERENTIATORS.map((item, i) => (
                <AnimatedSection key={item.title} delay={i * 80}>
                  <Card glow className="p-6 h-full">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-cloud text-base mb-2">{item.title}</h3>
                        <p className="text-sm text-slate leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Who it is for */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-2">Who Saul Marketing is for</h2>
              <p className="text-slate mb-8">
                Service businesses that are tired of duct-taping their marketing stack together.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHO_ITS_FOR.map((item, i) => (
                <AnimatedSection key={item.type} delay={i * 70}>
                  <Card className="p-5 h-full">
                    <h3 className="font-semibold text-cloud mb-2 text-base">{item.type}</h3>
                    <p className="text-sm text-slate leading-relaxed">{item.desc}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-4 bg-carbon/40">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-6">What a real setup looks like</h2>
              <div className="flex flex-col gap-4">
                {[
                  {
                    week: "1",
                    title: "Foundation",
                    desc: "Platform setup, your branding applied, CRM pipeline built, calendar integration, and contact import. You start using the CRM immediately.",
                  },
                  {
                    week: "2",
                    title: "Automations",
                    desc: "Lead follow-up sequence (10+ touchpoints over 30 days), appointment reminders, and review request triggers built and tested.",
                  },
                  {
                    week: "3",
                    title: "Funnels and Integrations",
                    desc: "Lead capture pages connected to your pipeline. AI assistant configured and integrated. Webhook connections to your existing tools.",
                  },
                  {
                    week: "4",
                    title: "Launch",
                    desc: "Team training, final testing, go live. First leads start flowing through the system. Saul starts working your pipeline.",
                  },
                ].map((phase) => (
                  <div key={phase.week} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center shrink-0">
                      <span className="text-cyan text-xs font-bold">{phase.week}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-cloud text-sm mb-1">Week {phase.week}: {phase.title}</p>
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
                See what Saul Marketing would do for your business
              </h2>
              <p className="text-slate mb-6">
                Get a custom proposal with your true ROI, based on your current tools, team size, and where you want to be in 6 months. Takes 3 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="lg">
                    Build Your Proposal
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" size="lg">
                    Talk to Gregory
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
    </>
  );
}
