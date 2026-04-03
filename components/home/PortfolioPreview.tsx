import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ImageOff, ArrowRight } from "lucide-react";
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
            Live projects. Real businesses. Full builds.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIO_PROJECTS.filter((p) => !p.comingSoon).map((project, i) => (
            <AnimatedSection
              key={project.id}
              delay={i * 100}
              className="group bg-carbon border border-wire rounded-2xl overflow-hidden hover:border-cyan/30 hover:shadow-[0_0_40px_rgba(0,212,170,0.06)] transition-all duration-300"
            >
              {/* Screenshot area */}
              <div className="relative aspect-video bg-graphite overflow-hidden">
                {project.images.length > 0 ? (
                  <Image
                    src={project.images[0]}
                    alt={`${project.title} screenshot`}
                    fill
                    className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-graphite">
                    <div className="w-12 h-12 rounded-xl bg-wire/60 flex items-center justify-center">
                      <ImageOff className="w-6 h-6 text-dim" />
                    </div>
                    <p className="text-xs text-dim">Screenshot coming soon</p>
                  </div>
                )}

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
