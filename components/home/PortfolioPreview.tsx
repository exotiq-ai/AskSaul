import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import { PORTFOLIO_PROJECTS } from "@/lib/constants";

export default function PortfolioPreview() {
  return (
    <section className="relative py-24 bg-obsidian">
      <div
        className="absolute inset-0 dot-pattern opacity-30"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
            Recent Work
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-cloud mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent work
          </h2>
          <p className="text-slate max-w-xl mx-auto">
            Live projects. Real businesses. Full builds — sites, CRMs, voice agents, quote flows, and handoffs that actually run.
          </p>
        </AnimatedSection>

        <AnimatedSection className="mb-10 grid grid-cols-1 gap-4 rounded-3xl border border-cyan/20 bg-cyan/5 p-5 sm:grid-cols-3 sm:p-6">
          {[
            ["5+", "live platforms shipped"],
            ["24/7", "voice + chat intake patterns"],
            ["GHL", "CRM handoff built in"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-wire bg-carbon/80 p-5 text-center">
              <p className="font-display text-3xl font-bold text-cloud">{value}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-dim">{label}</p>
            </div>
          ))}
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIO_PROJECTS.filter((p) => p.images.length > 0).slice(0, 4).map((project, i) => (
            <AnimatedSection
              key={project.id}
              delay={i * 100}
              className="group bg-carbon border border-wire rounded-2xl overflow-hidden hover:border-cyan/30 hover:shadow-[0_0_40px_rgba(0,212,170,0.06)] transition-all duration-300"
            >
              {/* Screenshot area */}
              <div className="relative aspect-video bg-gradient-to-br from-cyan/15 via-graphite to-obsidian overflow-hidden">
                <Image
                  src={project.images[0]}
                  alt={`${project.title} website screenshot`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-obsidian/45 to-transparent" aria-hidden="true" />
                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-obsidian/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cloud backdrop-blur-sm">
                  Live proof
                </div>

                {/* Overlay on hover */}
                {project.url !== "#" && (
                  <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-cloud bg-carbon/80 backdrop-blur-sm border border-wire/60 rounded-lg px-4 py-2 hover:border-cyan/40 hover:text-cyan transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live Site
                    </a>
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3
                    className="text-lg font-bold text-cloud group-hover:text-cyan transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.title}
                  </h3>
                  {project.url !== "#" ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate hover:text-cyan transition-colors shrink-0 mt-0.5"
                      aria-label={`Visit ${project.title}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
                <p className="text-base text-slate leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="muted">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-cyan/80 transition-colors"
          >
            View Full Portfolio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
