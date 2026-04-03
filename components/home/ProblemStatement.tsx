import { AlertTriangle, DollarSign, Zap } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const painPoints = [
  {
    icon: AlertTriangle,
    headline: "The demos looked great. The reality did not.",
    body: "You have tried the chatbots. You have watched the AI demos. None of it actually works for your specific business. Generic tools give generic results. Your business is not generic.",
  },
  {
    icon: DollarSign,
    headline: "SaaS charges per seat. Agencies disappear after the invoice.",
    body: "You are paying $50 to $500 a month per user for tools that barely talk to each other. Or you paid an agency $20K and waited 6 months for something that needed three more months of fixes.",
  },
  {
    icon: Zap,
    headline: "Your competitor just automated their entire follow-up sequence.",
    body: "While you are copy-pasting leads into a spreadsheet, they are closing deals with automated follow-up, AI-powered responses, and a CRM that actually works. That gap is not closing on its own.",
  },
];

export default function ProblemStatement() {
  return (
    <section className="relative py-24 bg-carbon">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,212,170,0.03) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
            The Problem
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-cloud"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sound familiar?
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <AnimatedSection
                key={i}
                delay={i * 120}
                className="relative bg-graphite/50 border border-wire rounded-xl p-6 hover:border-wire/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-error/10 border border-error/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-error/80" />
                </div>
                <h3 className="text-base font-semibold text-cloud mb-3 leading-snug">
                  {point.headline}
                </h3>
                <p className="text-sm text-slate leading-relaxed">
                  {point.body}
                </p>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
