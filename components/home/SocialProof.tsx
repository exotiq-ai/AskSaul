import AnimatedSection from "@/components/ui/AnimatedSection";
import { METRICS } from "@/lib/constants";

export default function SocialProof() {
  return (
    <section className="py-16 bg-carbon border-y border-wire">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {METRICS.map((metric, i) => (
              <div
                key={i}
                className="text-center group"
              >
                <p
                  className="text-3xl sm:text-4xl font-bold text-cyan mb-1 tabular-nums"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {metric.value}
                </p>
                <p className="text-sm text-slate leading-snug">{metric.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
