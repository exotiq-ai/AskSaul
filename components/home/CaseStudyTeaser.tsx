import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";

export default function CaseStudyTeaser() {
  return (
    <section className="relative py-24 bg-obsidian">
      <div className="absolute inset-0 dot-pattern opacity-30" aria-hidden="true" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="bg-graphite border border-cyan/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_40px_rgba(0,212,170,0.08)]">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="cyan">Case Study</Badge>
              <Badge variant="muted">Exotiq</Badge>
            </div>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-cloud mb-4 leading-snug"
            >
              AI-powered GTM, live in 48 hours.
            </h2>
            <p className="text-base text-slate leading-relaxed mb-8 max-w-2xl">
              Founder-led sales, no outreach system, no pipeline visibility. Saul shipped a full CRM, multi-channel outreach engine, and closed-loop feedback layer before the end of the week.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-carbon border border-wire rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-cyan" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-dim">
                    24 hours
                  </p>
                </div>
                <p className="text-sm text-cloud font-semibold leading-snug">
                  4 demos booked after deployment
                </p>
              </div>
              <div className="bg-carbon border border-wire rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-cyan" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-dim">
                    48 hours
                  </p>
                </div>
                <p className="text-sm text-cloud font-semibold leading-snug">
                  Full CRM and pipeline live
                </p>
              </div>
              <div className="bg-carbon border border-wire rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-cyan" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-dim">
                    1 week
                  </p>
                </div>
                <p className="text-sm text-cloud font-semibold leading-snug">
                  Daily lead management operational
                </p>
              </div>
            </div>

            <Link
              href="/case-studies/exotiq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:gap-3 transition-all duration-200"
            >
              Read the full Exotiq case study
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={120}>
          <div className="mt-8 bg-graphite border border-wire rounded-3xl p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="cyan">Case Study</Badge>
              <Badge variant="muted">Lou&apos;s Heating &amp; Cooling</Badge>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-cloud mb-4 leading-snug">
              Front Range HVAC shop. Website visits up 300%.
            </h2>
            <p className="text-base text-slate leading-relaxed mb-8 max-w-2xl">
              We rebuilt the website for Lou&apos;s Heating &amp; Cooling, cleaned up their Google Business Profile, and set them up to show in AI search. Since the rebuild, website visits are up 300% and contact form submissions doubled.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <Link
                href="/case-studies/lous-hvac"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:gap-3 transition-all duration-200"
              >
                Read the Lou&apos;s case study
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/voice-agents"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate hover:text-cloud hover:gap-3 transition-all duration-200"
              >
                Run a roofing or HVAC shop? See the Founding Client Program
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
