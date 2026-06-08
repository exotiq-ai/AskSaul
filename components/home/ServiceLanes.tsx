import Link from "next/link";
import { Bot, Code2, TrendingUp, ArrowRight, Check, PhoneCall } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { SERVICE_LANES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  Code2,
  TrendingUp,
};

export default function ServiceLanes() {
  return (
    <section className="relative py-24 bg-obsidian">
      <div
        className="absolute inset-0 dot-pattern opacity-50"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
            What We Build
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-cloud mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three ways to work with Saul
          </h2>
          <p className="text-slate max-w-xl mx-auto">
            Pick the lane that fits your immediate need. Most clients end up
            using all three.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {SERVICE_LANES.map((lane, i) => {
            const Icon = iconMap[lane.icon];
            return (
              <AnimatedSection
                key={lane.id}
                delay={i * 120}
                className="group relative bg-carbon border border-wire rounded-2xl p-8 hover:border-cyan/30 hover:shadow-[0_0_40px_rgba(0,212,170,0.06)] transition-all duration-300 flex flex-col"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-6 group-hover:bg-cyan/15 group-hover:border-cyan/40 transition-colors">
                  <Icon className="w-6 h-6 text-cyan" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-xs font-semibold tracking-widest uppercase text-cyan/70 mb-2">
                    {lane.tagline}
                  </p>
                  <h3
                    className="text-xl font-bold text-cloud mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {lane.title}
                  </h3>
                  <p className="text-base text-slate leading-relaxed mb-6">
                    {lane.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {lane.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-base text-slate"
                      >
                        <Check className="w-4 h-4 text-cyan/60 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link
                  href={lane.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:gap-3 transition-all duration-200"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
        <AnimatedSection className="mb-16 rounded-3xl border border-cyan/20 bg-cyan/5 p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-cyan" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan/80 mb-2">
                New provider program
              </p>
              <h3 className="text-2xl font-bold text-cloud mb-2" style={{ fontFamily: "var(--font-display)" }}>
                AI phone agents for missed calls and after-hours leads.
              </h3>
              <p className="text-slate leading-relaxed max-w-2xl">
                Saul answers, qualifies, logs context, and routes service leads into your CRM or follow-up workflow.
              </p>
            </div>
          </div>
          <Link
            href="/voice-agents"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:gap-3 transition-all duration-200 shrink-0"
          >
            See Voice Agents
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>

        {/* Industry badges */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-4">
            Built for businesses like yours
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Service Businesses",
              "Real Estate",
              "Legal & Consulting",
              "HVAC & Home Services",
              "Marketing Agencies",
              "Med Spas & Dental",
              "E-Commerce",
              "Restaurants & Hospitality",
              "Tech Startups",
            ].map((industry) => (
              <span
                key={industry}
                className="px-3 py-1.5 rounded-full bg-graphite border border-wire text-sm text-slate hover:border-cyan/30 hover:text-cloud transition-colors duration-200"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
