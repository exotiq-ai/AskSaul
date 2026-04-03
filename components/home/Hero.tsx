import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Dot pattern background */}
      <div className="absolute inset-0 dot-pattern" aria-hidden="true" />

      {/* Subtle radial gradient for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,170,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Horizontal rule accents */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,212,170,0.3), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        {/* Overline label */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
          AI &bull; Automation &bull; Web Development
        </div>

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-cloud leading-[1.05] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your competitors
          <br />
          are automating.
          <br />
          <span className="text-cyan">You are still</span>
          <br />
          doing it manually.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate max-w-2xl mx-auto mb-10 leading-relaxed">
          Done-for-you AI assistants, high-converting websites, and marketing
          automation for businesses that are done wasting time on tools that do
          not talk to each other.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/build-your-proposal">
            <Button variant="primary" size="lg" className="group">
              Build Your Proposal
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" size="lg">
              <MessageSquare className="w-5 h-5" />
              Talk to Saul
            </Button>
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-dim">
          <span>5 live platforms built and running</span>
          <span className="hidden sm:block w-px h-4 bg-wire" />
          <span>Weeks to launch, not months</span>
          <span className="hidden sm:block w-px h-4 bg-wire" />
          <span>Your data, your infrastructure</span>
          <span className="hidden sm:block w-px h-4 bg-wire" />
          <span>Denver, CO</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #0A0A0F)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
