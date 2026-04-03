import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Code2, TrendingUp, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI assistants, custom websites, and marketing automation built for businesses that are done duct-taping their tech together.",
};

const LANES = [
  {
    icon: Bot,
    title: "AI & Automation",
    tagline: "Make Saul work for your business",
    description:
      "Self-hosted AI assistants that live in your messaging apps. Chatbots for your website. Workflow automation that kills the copy-paste. CRM intelligence that actually updates itself. Your data stays on your infrastructure, your AI works the way you do.",
    href: "/ai-automation",
    features: [
      "OpenClaw AI assistant deployments",
      "AI chatbots for websites",
      "Workflow and back-office automation",
      "CRM data enrichment",
      "Voice agents (coming soon)",
    ],
    pricing: "From $500 setup",
    accentClass: "text-cyan",
    borderClass: "hover:border-cyan/30",
    glowClass: "hover:shadow-[0_0_40px_rgba(0,212,170,0.06)]",
  },
  {
    icon: Code2,
    title: "Websites & Apps",
    tagline: "A site that actually converts",
    description:
      "Custom websites and web apps built mobile-first. Not a template. Not a page builder. Code written to spec, SEO-optimized from day one, designed to turn visitors into leads and leads into customers.",
    href: "/web-development",
    features: [
      "Custom business websites",
      "Web application development",
      "SEO optimization",
      "E-commerce builds",
      "Maintenance and retainer plans",
    ],
    pricing: "From $5,000",
    accentClass: "text-ice",
    borderClass: "hover:border-ice/30",
    glowClass: "hover:shadow-[0_0_40px_rgba(74,198,232,0.06)]",
  },
  {
    icon: TrendingUp,
    title: "Marketing Engine",
    tagline: "Your entire marketing stack, handled",
    description:
      "Full GoHighLevel white-label setup. Replace the 5 tools you are paying for separately with one system that captures leads, follows up automatically, manages your pipeline, and sends review requests without you thinking about it.",
    href: "/marketing-engine",
    features: [
      "GoHighLevel white-label setup",
      "Email and SMS sequences",
      "Lead capture funnels",
      "Pipeline and CRM management",
      "Reputation management",
    ],
    pricing: "$3,500 setup + $1,000/mo",
    accentClass: "text-cyan",
    borderClass: "hover:border-cyan/30",
    glowClass: "hover:shadow-[0_0_40px_rgba(0,212,170,0.06)]",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan mb-3">
                Services
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Three ways to grow your business.
                <br />
                <span className="text-slate font-normal">Pick what fits.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                Each service is built, not bought. No templates, no offshore teams, no mystery. Gregory builds it, Saul helps run it.
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

        {/* Service lanes */}
        <section className="pb-24 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {LANES.map((lane, i) => {
              const Icon = lane.icon;
              return (
                <AnimatedSection key={lane.href} delay={i * 100}>
                  <div
                    className={`
                      h-full flex flex-col bg-carbon/80 backdrop-blur-sm border border-wire rounded-2xl p-6
                      transition-all duration-300 ${lane.borderClass} ${lane.glowClass}
                    `}
                  >
                    <div className="mb-5">
                      <div className={`w-10 h-10 rounded-lg bg-graphite flex items-center justify-center mb-4 ${lane.accentClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-1">
                        {lane.tagline}
                      </p>
                      <h2 className="font-display text-xl font-bold text-cloud mb-3">
                        {lane.title}
                      </h2>
                      <p className="text-slate text-sm leading-relaxed">
                        {lane.description}
                      </p>
                    </div>

                    <ul className="flex flex-col gap-2 mb-6 flex-1">
                      {lane.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${lane.accentClass === "text-cyan" ? "bg-cyan" : "bg-ice"}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-wire pt-4 flex items-center justify-between">
                      <span className="text-sm text-slate">{lane.pricing}</span>
                      <Link
                        href={lane.href}
                        className={`text-sm font-semibold flex items-center gap-1 transition-colors ${lane.accentClass} hover:opacity-80`}
                      >
                        Learn more
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center bg-graphite border border-wire rounded-2xl p-10">
              <h2 className="font-display text-2xl font-bold text-cloud mb-3">
                Not sure which service fits?
              </h2>
              <p className="text-slate mb-6">
                The proposal builder has a "not sure yet" option. Answer a few questions and Saul will figure it out with you.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="md">
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
