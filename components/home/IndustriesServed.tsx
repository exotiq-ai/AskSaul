import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { INDUSTRIES } from "@/lib/industries";

export default function IndustriesServed() {
  return (
    <section className="relative py-24 bg-obsidian border-t border-wire/40">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
            Industries
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-cloud mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Industries we serve
          </h2>
          <p className="text-base text-slate leading-relaxed">
            Saul is built for businesses that sell, schedule, and serve. Here are the industries where we deliver the most impact.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INDUSTRIES.map((industry, i) => (
            <AnimatedSection
              key={industry.slug}
              delay={i * 60}
              className="group bg-carbon border border-wire rounded-2xl p-5 hover:border-cyan/30 hover:shadow-[0_0_30px_rgba(0,212,170,0.05)] transition-all duration-300 flex flex-col"
            >
              <h3
                className="text-base font-semibold text-cloud mb-3 leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {industry.name}
              </h3>
              <p className="text-sm text-slate leading-relaxed mb-5 flex-1">
                {industry.shortDescription}
              </p>
              <Link
                href={`/build-your-proposal?industry=${industry.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan group-hover:gap-2 transition-all duration-200 mt-auto"
              >
                Build your proposal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-12">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:gap-3 transition-all duration-200"
          >
            See all industries in detail
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
