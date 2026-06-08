import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock3,
  Headphones,
  PhoneCall,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FAQSchema from "@/components/seo/FAQSchema";
import VoiceAgentFlow from "@/components/voice-agents/VoiceAgentFlow";
import VoiceAgentLeadForm from "@/components/voice-agents/VoiceAgentLeadForm";

const DEMO_PHONE_DISPLAY = "(970) 401-7285";
const DEMO_PHONE_HREF = "tel:" + "+1" + "970" + "401" + "7285";
const BOOKING_URL =
  "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-3d837e4b-c899-44ff-b612-275f498c2128";

export const metadata: Metadata = {
  title: "AI Voice Agents for Local Service Businesses",
  description:
    "Saul answers missed and after-hours calls, qualifies callers, captures job details, and routes lead information into your CRM. Built for local service businesses that cannot afford to miss the phone.",
  openGraph: {
    title: "Stop missing calls. Let Saul answer.",
    description:
      "A practical AI voice agent for local service businesses. Saul answers calls, qualifies leads, captures job context, and sends the details where your team already works.",
    url: "https://asksaul.ai/voice-agents",
  },
};

const FAQS = [
  {
    question: "What does Saul do on a phone call?",
    answer:
      "Saul answers the call, asks intake questions, captures job context, and sends the lead details where your team can act on them. For a local service business, that usually means service needed, location, urgency, contact info, timing, and a summary of what the caller said.",
  },
  {
    question: "Can I try it before booking a call?",
    answer: `Yes. Service providers can call the live demo at ${DEMO_PHONE_DISPLAY} to hear Saul's voice, ask how the system works, and request a personalized demo with Gregory.`,
  },
  {
    question: "Will callers know they are speaking with AI?",
    answer:
      "They should. Saul should be transparent. The goal is not to trick callers. The goal is to answer quickly, collect the right information, and help your team follow up.",
  },
  {
    question: "Can Saul answer after-hours calls?",
    answer:
      "Yes, if your phone routing is configured to send after-hours calls to Saul. This is one of the strongest use cases for local service businesses.",
  },
  {
    question: "Can Saul book appointments?",
    answer:
      "Possibly. It depends on your scheduling system, availability rules, and how much control you want to give the agent. Many businesses should start with qualified intake and human confirmation before enabling direct booking.",
  },
  {
    question: "Does Saul integrate with GoHighLevel?",
    answer:
      "Yes, the intended workflow includes routing lead details into GHL. The exact setup depends on your current GHL account, pipeline, custom fields, and webhook or API access.",
  },
];

const PAIN_POINTS = [
  {
    title: "After-hours calls disappear",
    body: "A homeowner has a problem at 8:43 PM. If nobody answers, they are not waiting patiently until morning. They are calling the next company.",
  },
  {
    title: "Missed calls turn into missed jobs",
    body: "A voicemail still puts work back on the caller. Saul keeps the conversation moving while the intent is fresh.",
  },
  {
    title: "Lead details get scattered",
    body: "One call becomes a note, a text, a voicemail, and a memory. Saul turns it into a clean record.",
  },
];

const USE_CASES = [
  "Missed-call recovery",
  "After-hours intake",
  "Overflow answering",
  "Emergency triage rules",
  "Quote request qualification",
  "GHL notes and lead routing",
];

const PROVIDER_DEMO_PROMPTS = [
  "I run an HVAC company. How would this work for missed calls?",
  "Can you send call summaries into GoHighLevel?",
  "What would setup look like for my service area?",
  "Can you book me a demo with Gregory?",
];

const CUSTOMER_CALL_EXAMPLES = [
  "My furnace stopped working.",
  "I need a quote for a water heater.",
  "Do you service my area?",
  "Can someone come out tomorrow?",
];

const INDUSTRIES = [
  "HVAC",
  "Plumbing",
  "Roofing",
  "Electrical",
  "Garage Doors",
  "Landscaping",
  "Cleaning",
  "Med Spas",
];

export default function VoiceAgentsPage() {
  return (
    <>
      <FAQSchema questions={FAQS} />
      <Navbar />
      <main id="main-content">
        <section className="relative min-h-screen flex items-center pt-28 pb-20 bg-obsidian overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-50" aria-hidden="true" />
          <div
            className="absolute top-20 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 items-center">
              <AnimatedSection>
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-5">
                  AI Voice Agents for Local Service Businesses
                </p>
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] text-cloud mb-7"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Stop losing jobs because nobody picked up the phone.
                </h1>
                <p className="text-lg sm:text-xl text-slate leading-relaxed max-w-2xl mb-8">
                  This demo line is for service providers. Call Saul to hear the voice, ask how missed-call handling works, and get routed to a personalized human demo with Gregory.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a href={DEMO_PHONE_HREF}>
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      <PhoneCall className="w-5 h-5" />
                      Call Saul: {DEMO_PHONE_DISPLAY}
                    </Button>
                  </a>
                  <Link href="#provider-form">
                    <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                      Map My Call Flow
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-dim max-w-xl">
                  This is not a replacement for your team. It is a safety net for the calls you are already missing.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={160}>
                <div className="relative rounded-3xl border border-cyan/30 bg-carbon/80 p-6 shadow-[0_0_80px_rgba(0,212,170,0.10)] overflow-hidden">
                  <div className="absolute inset-0 dot-pattern opacity-40" aria-hidden="true" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-cyan text-obsidian flex items-center justify-center font-display text-xl font-bold">
                          S
                        </div>
                        <div>
                          <p className="text-cloud font-semibold">Saul Provider Agent</p>
                          <p className="text-sm text-cyan">Provider demo line</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-success">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        Online
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl rounded-tl-sm bg-graphite border border-wire p-4">
                        <p className="text-sm text-slate leading-relaxed">
                          Thanks for calling. Are you a service provider wanting to hear how Saul handles missed calls?
                        </p>
                      </div>
                      <div className="ml-8 rounded-2xl rounded-tr-sm bg-cyan/10 border border-cyan/30 p-4">
                        <p className="text-sm text-cloud leading-relaxed">
                          I run a plumbing company. How would you handle a missed emergency call?
                        </p>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-graphite border border-wire p-4">
                        <p className="text-sm text-slate leading-relaxed">
                          I can explain the flow, ask about your current call handling, and help book a personalized demo with Gregory.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-2">
                      {[
                        "Voice preview",
                        "Use-case fit",
                        "Book Gregory",
                      ].map((label) => (
                        <div key={label} className="rounded-xl border border-wire bg-obsidian/70 px-3 py-2 text-center text-xs text-slate">
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-24 bg-carbon/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
                The missed-call problem
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Your next job probably starts with a phone call. That is the problem.
              </h2>
              <p className="text-lg text-slate leading-relaxed">
                Local service businesses do not lose leads because they are bad at the work. They lose leads because the phone rings while someone is on a job, driving, asleep, or already talking to another customer.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAIN_POINTS.map((point, index) => (
                <AnimatedSection key={point.title} delay={index * 100} className="rounded-2xl border border-wire bg-graphite p-6">
                  <h3 className="text-xl font-semibold text-cloud mb-3">{point.title}</h3>
                  <p className="text-slate leading-relaxed">{point.body}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <VoiceAgentFlow />

        <section className="py-24 bg-carbon/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
                  Try it yourself
                </p>
                <h2 className="text-3xl sm:text-5xl font-bold text-cloud leading-tight mb-5" style={{ fontFamily: "var(--font-display)" }}>
                  Call Saul to hear the provider demo before you book.
                </h2>
                <p className="text-lg text-slate leading-relaxed mb-8">
                  The 970-401 number is for business owners, not your customers. Ask Saul how the phone agent would handle missed calls, GHL notes, after-hours intake, and then have it route you to a personalized demo with Gregory.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={DEMO_PHONE_HREF}>
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      <PhoneCall className="w-5 h-5" />
                      Call {DEMO_PHONE_DISPLAY}
                    </Button>
                  </a>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      <CalendarCheck className="w-5 h-5" />
                      Book a 15-minute intro
                    </Button>
                  </a>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={120} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-cyan/30 bg-cyan/10 p-5 sm:col-span-2">
                  <p className="text-xs font-semibold tracking-widest uppercase text-cyan/80 mb-3">
                    What you ask the demo line
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PROVIDER_DEMO_PROMPTS.map((prompt) => (
                      <p key={prompt} className="rounded-xl border border-cyan/20 bg-obsidian/60 p-3 text-sm text-cloud leading-relaxed">
                        “{prompt}”
                      </p>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-wire bg-obsidian/70 p-5 sm:col-span-2">
                  <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
                    What your customers might ask your deployed agent later
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CUSTOMER_CALL_EXAMPLES.map((prompt) => (
                      <p key={prompt} className="rounded-xl border border-wire bg-graphite/70 p-3 text-sm text-slate leading-relaxed">
                        “{prompt}”
                      </p>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-24 bg-obsidian">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
                Built for businesses that live by the phone
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Use Saul where your current phone process breaks.
              </h2>
              <p className="text-lg text-slate leading-relaxed">
                Voice agents make the most sense when calls are tied directly to revenue.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-3xl border border-wire bg-carbon p-6 sm:p-8">
                <Headphones className="w-8 h-8 text-cyan mb-5" />
                <h3 className="text-2xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                  Common use cases
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {USE_CASES.map((useCase) => (
                    <div key={useCase} className="flex items-center gap-2 text-sm text-slate">
                      <BadgeCheck className="w-4 h-4 text-cyan shrink-0" />
                      {useCase}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-wire bg-carbon p-6 sm:p-8">
                <Workflow className="w-8 h-8 text-cyan mb-5" />
                <h3 className="text-2xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                  Strong-fit industries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((industry) => (
                    <span key={industry} className="rounded-full border border-wire bg-graphite px-4 py-2 text-sm text-slate">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-carbon/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock3,
                  title: "Voicemail",
                  points: ["Caller does the work", "Incomplete context", "Follow-up happens later"],
                },
                {
                  icon: Headphones,
                  title: "Answering service",
                  points: ["Better than voicemail", "Quality varies", "CRM routing may still be manual"],
                },
                {
                  icon: ShieldCheck,
                  title: "Saul voice agent",
                  points: ["Asks your intake questions", "Captures structured context", "Routes details into your workflow"],
                },
              ].map((card, index) => {
                const Icon = card.icon;
                return (
                  <AnimatedSection key={card.title} delay={index * 100} className="rounded-3xl border border-wire bg-obsidian/80 p-6">
                    <Icon className="w-8 h-8 text-cyan mb-5" />
                    <h3 className="text-2xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                      {card.title}
                    </h3>
                    <ul className="space-y-3">
                      {card.points.map((point) => (
                        <li key={point} className="text-slate leading-relaxed">{point}</li>
                      ))}
                    </ul>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        <section id="provider-form" className="py-24 bg-obsidian">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
              <AnimatedSection>
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
                  Current provider pilot
                </p>
                <h2 className="text-3xl sm:text-5xl font-bold text-cloud leading-tight mb-5" style={{ fontFamily: "var(--font-display)" }}>
                  Start with one phone workflow. Prove it works. Then expand.
                </h2>
                <p className="text-lg text-slate leading-relaxed mb-6">
                  For qualified local service businesses, Gregory is testing a provider program around free setup, no contract, and pay-on-close terms when attribution is clean.
                </p>
                <p className="text-sm text-dim leading-relaxed">
                  Offer terms depend on business type, call volume, service area, and whether closed jobs can be tracked back to Saul-handled calls.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={120}>
                <VoiceAgentLeadForm />
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-24 bg-carbon/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
                Fair questions
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>
                No, this does not mean handing your phone to a random bot.
              </h2>
            </AnimatedSection>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <AnimatedSection key={faq.question} className="rounded-2xl border border-wire bg-obsidian/70 p-6">
                  <h3 className="text-lg font-semibold text-cloud mb-3">{faq.question}</h3>
                  <p className="text-slate leading-relaxed">{faq.answer}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-28 bg-obsidian overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-40" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <h2 className="text-4xl sm:text-5xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Your phone is already ringing. Saul just makes sure someone answers.
              </h2>
              <p className="text-lg text-slate leading-relaxed max-w-2xl mx-auto mb-8">
                Call the provider demo, then map your call flow. If it is a fit, Gregory will show you exactly where Saul plugs into your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={DEMO_PHONE_HREF}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    <PhoneCall className="w-5 h-5" />
                    Call the Provider Demo
                  </Button>
                </a>
                <Link href="#provider-form">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    Map My Call Flow
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
