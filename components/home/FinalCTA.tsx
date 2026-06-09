import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="relative py-32 bg-obsidian overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,212,170,0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 dot-pattern opacity-40" aria-hidden="true" />

      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,212,170,0.4), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-4">
            Ready When You Are
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start with the part of your business
            <br />
            <span className="text-cyan">slowing everything else down.</span>
          </h2>
          <p className="text-lg text-slate max-w-xl mx-auto mb-10 leading-relaxed">
            Get your Saul Automation Map and see where AI, automation, voice, web,
            or marketing systems can create the most practical lift.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/build-your-proposal">
              <Button variant="primary" size="lg" className="group">
                Get Your Automation Map
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="lg">
                <Calendar className="w-5 h-5" />
                Talk Through Your Workflow
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-xs text-dim">
            A few questions. A clearer starting point. No AI buzzword maze.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
