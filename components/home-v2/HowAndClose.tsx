import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  { n: "01", t: "Map", b: "Find where time and leads slip through calls, forms, follow-up, and admin." },
  { n: "02", t: "Rank", b: "Pick what pays back first, by impact and speed." },
  { n: "03", t: "Build", b: "Ship the first system: voice agent, workflow, site, or app." },
  { n: "04", t: "Improve", b: "Tune it from real usage after launch." },
];

export default function HowAndClose() {
  return (
    <>
      <section className="bg-carbon/30 py-32 sm:py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-20 max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">How it works</p>
            <h2 className="font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">Map it before we build it.</h2>
          </div>
          <ol className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((s) => (
              <li key={s.n} className="reveal border-t border-wire pt-8">
                <p className="mb-6 font-mono text-sm text-cyan">{s.n}</p>
                <h3 className="font-display text-3xl font-bold text-cloud">{s.t}</h3>
                <p className="mt-3 leading-relaxed text-slate">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grain relative overflow-hidden bg-obsidian py-40 sm:py-48">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-[160px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="reveal font-display text-5xl font-bold leading-[0.98] text-cloud sm:text-7xl">
            Start with what&apos;s
            <span className="text-gradient block">slowing you down.</span>
          </h2>
          <p className="reveal mx-auto mt-8 max-w-xl text-lg text-slate">A few questions. A clear starting point. No AI buzzword maze.</p>
          <div className="reveal mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/build-your-proposal"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-4 text-lg font-semibold text-obsidian shadow-[0_0_40px_rgba(0,212,170,0.35)]"
            >
              Get your Automation Map
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-wire px-8 py-4 text-lg font-semibold text-cloud hover:border-cyan/50 hover:text-cyan"
            >
              Talk through your workflow
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
