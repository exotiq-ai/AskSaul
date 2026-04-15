import { X, Check } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const PLAN_A = [
  "Apollo for prospecting",
  "Instantly for outbound email",
  "LinkedIn automation tool #3",
  "A part-time SDR or agency retainer",
  "Spreadsheets stitching it all together",
  "No single view of pipeline or reply rate",
  "Three logins, three dashboards, three bills",
];

const PLAN_B = [
  "One closed-loop system built on your stack",
  "Multi-channel outreach from one engine",
  "Reply capture and scoring in the same place",
  "Pipeline visibility end to end",
  "Your data stays yours",
  "Analytics that feed back into the next campaign",
  "One system. One login. One quote.",
];

export default function PlanComparison() {
  return (
    <section className="py-20 px-4 bg-carbon/40">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-2">
            Plan A vs Plan B
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-cloud mb-3">
            The duct-taped stack, or the closed-loop system.
          </h2>
          <p className="text-slate">
            Most sales orgs are running Plan A without realizing there is a Plan B. Here is the difference.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Plan A */}
          <AnimatedSection className="bg-graphite border border-wire rounded-2xl p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-dim">
                Plan A
              </span>
              <span className="text-sm font-semibold text-cloud">The fragmented stack</span>
            </div>
            <ul className="flex flex-col gap-3">
              {PLAN_A.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate leading-relaxed">
                  <X className="w-4 h-4 text-dim shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Plan B */}
          <AnimatedSection
            delay={80}
            className="bg-cyan/5 border border-cyan/40 rounded-2xl p-6 sm:p-7 shadow-[0_0_30px_rgba(0,212,170,0.08)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan">
                Plan B
              </span>
              <span className="text-sm font-semibold text-cloud">The Saul closed-loop system</span>
            </div>
            <ul className="flex flex-col gap-3">
              {PLAN_B.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-cloud leading-relaxed">
                  <Check className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
