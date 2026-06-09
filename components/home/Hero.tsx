import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, Radar } from "lucide-react";
import Button from "@/components/ui/Button";

const bottlenecks = [
  "Missed calls",
  "Slow follow-up",
  "Manual CRM work",
  "Websites that don't convert",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-obsidian">
      <div className="absolute inset-0 dot-pattern" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 0%, rgba(0,212,170,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/25 text-cyan text-xs font-semibold tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
              The Saul Automation Map
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-cloud leading-[0.98] mb-7"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Practical AI systems for the work your business keeps doing by hand.
            </h1>

            <p className="text-lg sm:text-xl text-slate max-w-2xl mb-8 leading-relaxed">
              AskSaul maps the bottlenecks in your business — missed calls, slow follow-up, repetitive admin, weak website flows — then builds AI assistants, automations, voice agents, websites, and apps that help your team move faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-5">
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg" className="group w-full sm:w-auto">
                  Get Your Automation Map
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5" />
                  See What Saul Can Build
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate max-w-xl">
              3 minutes · real proposal in 24 hours · no sales call unless you ask.
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
              {bottlenecks.map((item) => (
                <div key={item} className="rounded-2xl border border-wire bg-carbon/70 px-4 py-3 text-sm text-cloud flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan shrink-0" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan/25 bg-carbon/85 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,212,170,0.10)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-cyan text-obsidian flex items-center justify-center">
                <Radar className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan">Free diagnostic</p>
                <h2 className="text-2xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>
                  Get Your Automation Map
                </h2>
              </div>
            </div>
            <p className="text-slate leading-relaxed mb-6">
              The 1–3 highest-leverage workflows Saul can automate for your business — ranked by time saved, revenue impact, and launch difficulty.
            </p>
            <div className="space-y-3 mb-7">
              {[
                "Spot the leaks in calls, forms, follow-up, and admin",
                "Rank what should be automated first",
                "Get a scoped proposal without a bloated AI strategy deck",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3 text-sm text-slate">
                  <CheckCircle2 className="w-5 h-5 text-cyan shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
            <Link href="/build-your-proposal">
              <Button variant="primary" size="lg" className="w-full">
                Map My Automation Opportunity
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate">
              <span className="rounded-xl border border-wire bg-obsidian/60 px-2 py-2">No pitch</span>
              <span className="rounded-xl border border-wire bg-obsidian/60 px-2 py-2">24 hr reply</span>
              <span className="rounded-xl border border-wire bg-obsidian/60 px-2 py-2">Practical plan</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, #0A0A0F)" }}
        aria-hidden="true"
      />
    </section>
  );
}
