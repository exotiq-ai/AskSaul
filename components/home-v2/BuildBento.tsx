import Link from "next/link";
import { ArrowUpRight, Bot, LayoutTemplate, Megaphone } from "lucide-react";
import Waveform from "@/components/site/Waveform";

const LANES = [
  {
    href: "/ai-automation",
    icon: Bot,
    title: "AI & Automation",
    body: "Assistants and workflows that run on your own infrastructure.",
  },
  {
    href: "/web-development",
    icon: LayoutTemplate,
    title: "Websites & Apps",
    body: "Fast, mobile-first sites built to turn visitors into leads.",
  },
  {
    href: "/marketing-engine",
    icon: Megaphone,
    title: "Saul Marketing",
    body: "CRM, email, SMS, and reviews in one system with AI built in.",
  },
];

export default function BuildBento() {
  return (
    <section className="bg-carbon/30 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-20 max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">What we build</p>
          <h2 className="font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">Four ways Saul takes work off your plate.</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-3">
          <Link
            href="/voice-agents"
            className="reveal group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan/20 via-carbon to-carbon p-8 ring-1 ring-cyan/30 transition-shadow hover:shadow-[0_30px_120px_rgba(0,212,170,0.18)] sm:p-12 lg:col-span-2 lg:row-span-3"
          >
            <Waveform bars={32} barClassName="w-1.5 sm:w-2" className="parallax absolute inset-x-8 top-1/3 h-40 justify-between opacity-30" />
            <div className="relative flex items-center justify-between">
              <span className="rounded-full bg-cyan px-3 py-1 text-xs font-bold uppercase tracking-wider text-obsidian">
                Founding spots open
              </span>
              <ArrowUpRight className="h-7 w-7 text-cyan transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            <div className="relative">
              <h3 className="font-display text-4xl font-bold leading-tight text-cloud sm:text-5xl">Voice Agents</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-slate">
                Saul answers the calls your crew can&apos;t, takes the job details, and books or routes it by your rules.
              </p>
            </div>
          </Link>

          {LANES.map((lane) => {
            const Icon = lane.icon;
            return (
              <Link
                key={lane.href}
                href={lane.href}
                className="reveal group flex flex-col justify-between gap-8 rounded-[2rem] border border-wire bg-obsidian p-7 transition-colors hover:border-cyan/40"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-7 w-7 text-cyan" />
                  <ArrowUpRight className="h-5 w-5 text-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-cloud">{lane.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{lane.body}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
