import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STATS = [
  { n: "+300%", l: "website visits for Lou's Heating & Cooling since the rebuild" },
  { n: "48 hrs", l: "to a live CRM and outreach engine for Exotiq" },
  { n: "5+", l: "live platforms built and running" },
];

const CASES = [
  {
    href: "/case-studies/lous-hvac",
    img: "/images/portfolio/lous-hvac.jpg",
    tag: "Front Range HVAC",
    title: "Lou's Heating & Cooling",
    body: "Website rebuild, Google Business Profile, local SEO, and AI search. Contact form submissions doubled.",
  },
  {
    href: "/case-studies/exotiq",
    img: "/images/portfolio/exotiq-command-center.jpg",
    tag: "GTM system",
    title: "Exotiq",
    body: "Full CRM, multi-channel outreach, and pipeline visibility. Four demos booked in the first 24 hours.",
  },
];

export default function ProofWall() {
  return (
    <section className="bg-obsidian py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-16 max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Proof</p>
          <h2 className="font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">Shipped, live, and working.</h2>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-10 border-y border-wire py-12 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.n} className="reveal">
              <p className="text-gradient font-display text-6xl font-bold sm:text-7xl">{s.n}</p>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-slate">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {CASES.map((c) => (
            <Link key={c.href} href={c.href} className="reveal group block">
              <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[2rem] border border-wire bg-carbon">
                <Image
                  src={c.img}
                  alt={`${c.title} project`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute left-5 top-5 rounded-full bg-obsidian/80 px-3 py-1 text-xs font-semibold text-cloud backdrop-blur">
                  {c.tag}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-cloud transition-colors group-hover:text-cyan">{c.title}</h3>
              <p className="mt-2 max-w-lg leading-relaxed text-slate">{c.body}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/portfolio"
          className="reveal mt-16 inline-flex items-center gap-2 font-semibold text-cyan transition-all hover:gap-3"
        >
          See all live projects <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
