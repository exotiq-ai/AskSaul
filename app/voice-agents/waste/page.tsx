import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  MapPin,
  PhoneCall,
  Route,
  ShieldAlert,
  Truck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FAQSchema from "@/components/seo/FAQSchema";
import PageSchema from "@/components/seo/PageSchema";
import VoiceAgentLeadForm from "@/components/voice-agents/VoiceAgentLeadForm";

const PROVIDER_DEMO_PHONE_DISPLAY = "(970) 401-7285";
const PROVIDER_DEMO_PHONE_TEL = "tel:" + "+1" + "970" + "401" + "7285";

export const metadata: Metadata = {
  title: "AI Voice Agent for Dumpster Rental & Waste Companies",
  description:
    "Saul answers dumpster rental and waste calls 24/7, captures quote details, checks service area, collects debris and delivery info, and sends qualified leads to your CRM.",
  alternates: { canonical: "https://asksaul.ai/voice-agents/waste" },
  openGraph: {
    title: "AI Voice Agent for Dumpster Rental & Waste Companies | AskSaul",
    description:
      "Built for roll-off dumpster, junk removal, and waste operators that need better missed-call capture and quote intake.",
    url: "https://asksaul.ai/voice-agents/waste",
  },
};

const DEMOS = [
  {
    name: "Pueblo Dumpster Rentals",
    market: "Pueblo, CO",
    url: "https://pueblodumpsterrental.com/",
    notes: "Local quote intake, size guidance, and Pueblo-area service conversation.",
    zip: "81001 or 81003",
    testPrompt: "garage cleanout in Pueblo",
    screenshot: "/images/portfolio/rank-rent/pueblo-desktop.png",
    screenshotAlt: "Pueblo Dumpster Rentals website screenshot",
  },
  {
    name: "Fayetteville Dumpster Rentals",
    market: "Fayetteville, AR",
    url: "https://fayettevillerolloff.com/",
    notes: "Roll-off inquiry handling, ZIP/service-area qualification, and project details.",
    zip: "72701",
    testPrompt: "roofing debris near Fayetteville",
    screenshot: "/images/portfolio/rank-rent/fayetteville-desktop.png",
    screenshotAlt: "Fayetteville Dumpster Rentals website screenshot",
  },
  {
    name: "Lake Charles Dumpster Rentals",
    market: "Lake Charles, LA",
    url: "https://lakecharlesdumpster.com/",
    notes: "Waste lead capture, local service-area logic, and quote-flow handoff.",
    zip: "70601",
    testPrompt: "construction debris in Lake Charles",
    screenshot: "/images/portfolio/rank-rent/lake-charles-desktop.png",
    screenshotAlt: "Lake Charles Dumpster Rentals website screenshot",
  },
];

const FAQS = [
  {
    question: "Can Saul answer calls after hours for my dumpster rental company?",
    answer:
      "Yes. Saul can be configured as an after-hours or overflow voice agent that answers, collects quote details, and routes the lead to your team or CRM for follow-up.",
  },
  {
    question: "Can Saul help customers choose a dumpster size?",
    answer:
      "Saul can ask about the project type, debris, timeline, and estimated volume, then guide callers toward the right size range or collect enough detail for your team to confirm.",
  },
  {
    question: "Can Saul check whether a caller is in our service area?",
    answer:
      "Yes. Saul can ask for ZIP code, city, neighborhood, or address and use your approved service-area logic to qualify the lead or route out-of-area callers appropriately.",
  },
  {
    question: "Can Saul collect debris type and heavy-material details?",
    answer:
      "Yes. The intake flow can ask about household junk, roofing, concrete, dirt, construction debris, yard waste, and other material rules your business wants captured before quoting.",
  },
  {
    question: "Can Saul send leads to GoHighLevel or my CRM?",
    answer:
      "Yes. AskSaul commonly routes structured lead details into GoHighLevel or another approved CRM/workflow, including summary, phone, service area, project type, timing, and callback notes.",
  },
  {
    question: "Can Saul book dumpster deliveries automatically?",
    answer:
      "It can be designed that way, but most operators should start with quote-ready intake and human confirmation before giving the agent direct dispatch authority.",
  },
  {
    question: "What happens if the caller needs a human?",
    answer:
      "Saul can summarize the call, flag urgency, collect contact details, and route the lead to a human callback or escalation path based on your rules.",
  },
  {
    question: "Can I test a live Saul waste demo?",
    answer:
      "Yes. AskSaul lists live Saul-built dumpster rental demo sites on this page. Please test respectfully and avoid requesting a real booking unless you actually need service.",
  },
  {
    question: "Does Saul work for junk removal or waste hauling companies too?",
    answer:
      "Yes. The same intake pattern applies to junk removal, roll-off, hauling, and related waste businesses that need fast phone response and clean job details.",
  },
  {
    question: "How fast can a waste-industry voice agent go live?",
    answer:
      "Timeline depends on phone routing, CRM setup, service rules, and call-flow complexity, but the goal is a practical live workflow in weeks, not months.",
  },
];

const schemaGraph = [
  {
    "@type": "BreadcrumbList",
    "@id": "https://asksaul.ai/voice-agents/waste#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://asksaul.ai/" },
      { "@type": "ListItem", position: 2, name: "Voice Agents", item: "https://asksaul.ai/voice-agents" },
      { "@type": "ListItem", position: 3, name: "Waste Voice Agents", item: "https://asksaul.ai/voice-agents/waste" },
    ],
  },
  {
    "@type": "Service",
    "@id": "https://asksaul.ai/voice-agents/waste#service",
    name: "AI Voice Agent for Dumpster Rental and Waste Companies",
    provider: { "@type": "Organization", "@id": "https://asksaul.ai/#org", name: "AskSaul.ai" },
    serviceType: "AI phone answering and quote intake automation",
    areaServed: "United States",
    audience: "Dumpster rental companies, roll-off operators, junk removal companies, and waste businesses",
    description:
      "Saul answers waste-industry calls, captures quote details, checks service area, and sends qualified leads to the operator's CRM or team.",
  },
  {
    "@type": "ItemList",
    "@id": "https://asksaul.ai/voice-agents/waste#demo-sites",
    name: "Live Saul-built waste demo sites",
    itemListElement: DEMOS.map((demo, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: demo.name,
      url: demo.url,
    })),
  },
];

const callDetails = [
  {
    icon: ClipboardList,
    title: "Quote details",
    items: ["Dumpster size requested", "Project type", "Debris/material type", "Heavy material flags", "Estimated timeline"],
  },
  {
    icon: MapPin,
    title: "Location & service area",
    items: ["ZIP code", "City or neighborhood", "Delivery address", "Out-of-area handling"],
  },
  {
    icon: CalendarClock,
    title: "Scheduling",
    items: ["Desired delivery date", "Pickup timing", "Rental duration", "Urgency or same-day request"],
  },
  {
    icon: Route,
    title: "Handoff",
    items: ["CRM/GHL lead creation", "Call summary", "Callback task", "Booking-ready notes"],
  },
];

export default function WasteVoiceAgentsPage() {
  return (
    <>
      <FAQSchema questions={FAQS} />
      <PageSchema graph={schemaGraph} />
      <Navbar />
      <main id="main-content">
        <section className="relative min-h-screen flex items-center pt-28 pb-20 bg-obsidian overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-50" aria-hidden="true" />
          <div className="absolute top-20 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_430px] gap-12 items-center">
              <AnimatedSection>
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-5">
                  AI Voice Agents · Dumpster Rental · Waste Operators
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] text-cloud mb-7" style={{ fontFamily: "var(--font-display)" }}>
                  AI Voice Agents for Dumpster Rental & Waste Companies
                </h1>
                <p className="text-lg sm:text-xl text-slate leading-relaxed max-w-2xl mb-8">
                  Saul answers calls 24/7, asks the right dumpster-rental questions, captures project details, checks service area, and sends qualified leads straight to your team or CRM.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="#waste-form">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Book a Waste Agent Demo
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="#live-demos">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                      <PhoneCall className="w-5 h-5" />
                      Call a Live Saul Demo
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  {["After-hours call capture", "Dumpster quote intake", "ZIP-code qualification", "CRM / GHL handoff"].map((item) => (
                    <div key={item} className="rounded-2xl border border-wire bg-carbon/70 px-4 py-3 text-sm text-cloud flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan" aria-hidden="true" />
                      {item}
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={120}>
                <div className="rounded-3xl border border-cyan/25 bg-carbon/85 p-6 shadow-[0_0_80px_rgba(0,212,170,0.10)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-cyan text-obsidian flex items-center justify-center">
                      <Truck className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-cyan">Waste call flow</p>
                      <h2 className="text-2xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>Generic answering services take a message. Saul runs the intake.</h2>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {["How much is a 20 yard dumpster?", "Do you deliver to my ZIP code?", "Can I put shingles, concrete, dirt, or tile in it?", "Can you drop it tomorrow?", "What size do I need for a roof, remodel, or cleanout?"].map((line) => (
                      <div key={line} className="rounded-2xl border border-wire bg-obsidian/60 p-3 text-slate">
                        “{line}”
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-24 bg-carbon">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">What Saul captures</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Built around the details that make or break dumpster jobs.
              </h2>
              <p className="text-lg text-slate leading-relaxed">
                Missed calls are expensive, but bad intake is expensive too. Saul collects the details your team needs before pricing, dispatch, or callback.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {callDetails.map((card, index) => {
                const Icon = card.icon;
                return (
                  <AnimatedSection key={card.title} delay={index * 80} className="rounded-3xl border border-wire bg-graphite p-6">
                    <Icon className="w-8 h-8 text-cyan mb-5" aria-hidden="true" />
                    <h3 className="text-xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>{card.title}</h3>
                    <ul className="space-y-2">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate">
                          <CheckCircle2 className="w-4 h-4 text-cyan shrink-0 mt-0.5" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        <section id="live-demos" className="py-24 bg-obsidian">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">Saul built this</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                You can test live waste-industry Saul agents.
              </h2>
              <p className="text-lg text-slate leading-relaxed">
                These are live Saul-built dumpster rental lead-gen sites. Call Saul at {PROVIDER_DEMO_PHONE_DISPLAY}, test the quote intake, then come back here to build one for your market.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {DEMOS.map((demo, index) => (
                <AnimatedSection key={demo.name} delay={index * 100} className="rounded-3xl border border-wire bg-carbon p-6 flex flex-col">
                  <div className="relative h-40 rounded-2xl border border-cyan/20 bg-graphite overflow-hidden mb-6 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
                    <Image
                      src={demo.screenshot}
                      alt={demo.screenshotAlt}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/55 via-transparent to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-obsidian/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cloud backdrop-blur-sm">
                      Live site + Saul voice
                    </div>
                  </div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-2">{demo.market}</p>
                  <h3 className="text-2xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>{demo.name}</h3>
                  <p className="text-slate leading-relaxed mb-4 flex-1">{demo.notes}</p>
                  <div className="mb-5 rounded-2xl border border-cyan/20 bg-cyan/5 p-4 text-sm text-slate">
                    <p className="mb-2 font-semibold text-cloud">Test script</p>
                    <p>“I’m evaluating Saul from AskSaul. I need pricing for: {demo.testPrompt}.”</p>
                    <p className="mt-3">Suggested in-area ZIP: <span className="text-cloud font-semibold">{demo.zip}</span></p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a href={PROVIDER_DEMO_PHONE_TEL} data-analytics-label={`Call waste demo: ${demo.name}`}>
                      <Button variant="primary" className="w-full">
                        <PhoneCall className="w-4 h-4" />
                        Call Saul: {PROVIDER_DEMO_PHONE_DISPLAY}
                      </Button>
                    </a>
                    <a href={demo.url} target="_blank" rel="noopener noreferrer" data-analytics-label={`View waste demo site: ${demo.name}`} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-cyan hover:text-cloud transition-colors">
                      View live site <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="rounded-3xl border border-warning/25 bg-warning/10 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <ShieldAlert className="w-10 h-10 text-warning shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-2xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>Try a live Saul demo respectfully.</h3>
                  <p className="text-slate leading-relaxed mb-4">
                    These are live Saul-powered dumpster rental demo/customer-style sites. Use them to evaluate the voice agent, not to create a real dumpster order unless you actually need service in that market.
                  </p>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate list-decimal list-inside">
                    <li>Say: “I’m evaluating Saul from AskSaul and want to test a dumpster rental quote flow.”</li>
                    <li>Use a sample project: garage cleanout, remodel, roofing, or construction debris.</li>
                    <li>If asked for a ZIP, use 81001, 72701, or 70601 for in-area tests.</li>
                    <li>For out-of-area handling, use 72701 when calling Lake Charles.</li>
                    <li>Do not request dispatch unless you actually need service.</li>
                    <li>If Saul offers a callback, say: “This is just a demo test; no callback needed.”</li>
                  </ol>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-24 bg-carbon">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <AnimatedSection>
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">How the call flow works</p>
                <h2 className="text-3xl sm:text-5xl font-bold text-cloud mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  From phone ring to quote-ready lead.
                </h2>
                <div className="space-y-4">
                  {["Answers instantly", "Identifies the project", "Guides size questions", "Checks location and ZIP", "Flags restrictions", "Captures schedule", "Hands off to CRM or human"].map((step, index) => (
                    <div key={step} className="flex items-center gap-4 rounded-2xl border border-wire bg-graphite p-4">
                      <span className="font-mono text-cyan">0{index + 1}</span>
                      <span className="text-cloud font-semibold">{step}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
              <AnimatedSection delay={120} className="rounded-3xl border border-cyan/20 bg-cyan/5 p-6 sm:p-8">
                <BadgeCheck className="w-10 h-10 text-cyan mb-5" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>Built for your stack.</h3>
                <ul className="space-y-3 text-slate">
                  {["Works with phone forwarding or approved call routing", "Routes summaries to GoHighLevel or your CRM", "Sends SMS/email notifications", "Supports transcripts and structured notes", "Escalates urgent or complex calls to a human", "Can start with quote-ready intake before direct booking"].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan shrink-0 mt-1" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-24 bg-obsidian">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">Waste voice agent FAQs</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>Questions waste operators ask first.</h2>
            </AnimatedSection>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <AnimatedSection key={faq.question} className="rounded-2xl border border-wire bg-carbon p-5">
                  <h3 className="text-lg font-semibold text-cloud mb-2">{faq.question}</h3>
                  <p className="text-slate leading-relaxed">{faq.answer}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section id="waste-form" className="py-24 bg-carbon">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">Ready to stop missing dumpster rental calls?</p>
              <h2 className="text-3xl sm:text-5xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Book a Waste Agent Demo.
              </h2>
              <p className="text-lg text-slate leading-relaxed">
                Saul can answer your waste calls 24/7, collect the details your team needs, and send clean quote-ready leads into your workflow.
              </p>
            </AnimatedSection>
            <VoiceAgentLeadForm vertical="waste" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
