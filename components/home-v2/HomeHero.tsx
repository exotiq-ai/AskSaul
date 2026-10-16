import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ActivityFeed from "./ActivityFeed";
import { FOUNDING_HREF } from "@/components/site/FounderBar";

export default function HomeHero() {
  return (
    <section className="grain relative flex min-h-svh items-center overflow-hidden bg-obsidian pb-20 pt-36 sm:pt-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/4 h-[700px] w-[700px] rounded-full bg-cyan/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[440px] w-[440px] rounded-full bg-ice/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:px-8">
        <div>
          <Link
            href={FOUNDING_HREF}
            className="rise group mb-8 inline-flex items-center gap-3 rounded-full border border-cyan/30 bg-cyan/10 py-1.5 pl-1.5 pr-4 text-sm text-cloud transition-colors hover:border-cyan/60"
          >
            <span className="rounded-full bg-cyan px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-obsidian">New</span>
            Roofing or HVAC? 10 founding spots
            <ArrowRight className="h-4 w-4 text-cyan transition-transform group-hover:translate-x-1" />
          </Link>

          <h1 className="font-display text-[2.6rem] font-bold leading-[1] tracking-tight text-cloud sm:text-6xl lg:text-[3.6rem] xl:text-[4.1rem]">
            <span className="rise-text block lg:whitespace-nowrap" style={{ ["--d" as string]: "80ms" }}>AI that does the work</span>
            <span className="rise-text text-shimmer block" style={{ ["--d" as string]: "200ms" }}>
              your team keeps doing by hand.
            </span>
          </h1>

          <p className="rise-text mt-7 max-w-xl text-lg leading-relaxed text-slate sm:text-xl" style={{ ["--d" as string]: "320ms" }}>
            Voice agents, follow-up, websites, and automations. Mapped to your business, built for you, supported after launch.
          </p>

          <div className="rise mt-9 flex flex-col gap-4 sm:flex-row sm:items-center" style={{ ["--d" as string]: "440ms" }}>
            <Link
              href="/build-your-proposal"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan px-8 py-4 text-lg font-semibold text-obsidian shadow-[0_0_40px_rgba(0,212,170,0.35)] transition-all hover:shadow-[0_0_60px_rgba(0,212,170,0.5)]"
            >
              Get your Automation Map
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-sm text-dim sm:max-w-[13rem]">3 minutes. A real proposal in 24 hours. No sales call unless you ask.</p>
          </div>
        </div>

        <div className="rise" style={{ ["--d" as string]: "360ms" }}>
          <ActivityFeed />
        </div>
      </div>
    </section>
  );
}
