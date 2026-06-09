import Link from "next/link";
import { ArrowRight, Map, Search, SlidersHorizontal, Rocket, RefreshCw } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

const steps = [
  { icon: Search, title: "Spot the leaks", body: "Find where time, leads, and customer experience are slipping through calls, forms, follow-up, and admin." },
  { icon: SlidersHorizontal, title: "Rank the opportunities", body: "Prioritize what is worth automating first based on impact, complexity, and speed to value." },
  { icon: Rocket, title: "Build the first system", body: "Ship the assistant, voice agent, workflow, website flow, app, or marketing automation that pays back fastest." },
  { icon: RefreshCw, title: "Improve from real usage", body: "Use real customer and team behavior to refine the system after launch." },
];

export default function AutomationMap() {
  return (
    <section className="relative py-24 bg-obsidian overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 items-start">
          <AnimatedSection className="lg:sticky lg:top-24">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan text-obsidian mb-6">
              <Map className="w-7 h-7" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">The Saul Automation Map</p>
            <h2 className="text-3xl sm:text-5xl font-bold text-cloud leading-tight mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Start with the map before you build the machine.
            </h2>
            <p className="text-lg text-slate leading-relaxed mb-7">
              Most businesses do not need a giant AI overhaul. They need to find the daily friction that slows the team down and lets good leads slip away.
            </p>
            <Link href="/build-your-proposal">
              <Button variant="primary" size="lg">
                Get Your Automation Map
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <AnimatedSection key={step.title} delay={index * 100} className="rounded-3xl border border-wire bg-carbon/80 p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-sm text-dim">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>{step.title}</h3>
                  <p className="text-slate leading-relaxed">{step.body}</p>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
