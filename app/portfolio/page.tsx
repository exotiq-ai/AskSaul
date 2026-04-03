import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Code2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { PORTFOLIO_PROJECTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Custom websites, web apps, and AI-powered platforms built by Gregory Ringler. Real projects, shipped to production.",
  openGraph: {
    title: "Portfolio | AskSaul.ai",
    description:
      "Custom websites, web apps, and AI-powered platforms built by Gregory Ringler.",
    url: "https://asksaul.ai/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">
                Portfolio
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Work that ships.
                <br className="hidden sm:block" />
                <span className="text-cyan"> No templates, no outsourcing.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl">
                Every project built from scratch. Real businesses, production deployments, and measurable results.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {PORTFOLIO_PROJECTS.map((project, i) => {
                const hasImage = project.images && project.images.length > 0;
                const isComingSoon = "comingSoon" in project && project.comingSoon;

                return (
                  <AnimatedSection key={project.id} delay={i * 80}>
                    <Card glow className="overflow-hidden flex flex-col h-full">
                      {/* Image or placeholder */}
                      {hasImage ? (
                        <div className="relative w-full aspect-video overflow-hidden">
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full aspect-video bg-graphite flex items-center justify-center overflow-hidden">
                          {/* Subtle grid pattern */}
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage:
                                "linear-gradient(to right, #3a3a3a 1px, transparent 1px), linear-gradient(to bottom, #3a3a3a 1px, transparent 1px)",
                              backgroundSize: "32px 32px",
                            }}
                          />
                          <div className="relative flex flex-col items-center gap-3">
                            <Code2 className="w-10 h-10 text-dim" />
                            <Badge variant="muted">Coming Soon</Badge>
                          </div>
                        </div>
                      )}

                      {/* Card body */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h2 className="font-display text-xl font-bold text-cloud leading-snug">
                            {project.title}
                          </h2>
                          <a
                            href={project.url}
                            target={isComingSoon ? undefined : "_blank"}
                            rel={isComingSoon ? undefined : "noopener noreferrer"}
                            aria-label={`Visit ${project.title}`}
                            className={
                              isComingSoon
                                ? "pointer-events-none opacity-50 shrink-0"
                                : "shrink-0 text-dim hover:text-cyan transition-colors"
                            }
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>

                        {/* Description */}
                        <p className="text-slate text-base leading-relaxed mb-5 flex-1">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="muted">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center bg-graphite border border-wire rounded-2xl p-10">
              <h2 className="font-display text-2xl font-bold text-cloud mb-3">
                Ready to build something?
              </h2>
              <p className="text-slate mb-6">
                Tell me what you need. I'll scope it, price it, and ship it.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="lg">
                    Build Your Proposal
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" size="lg">
                    Send a Message
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://asksaul.ai",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Portfolio",
                item: "https://asksaul.ai/portfolio",
              },
            ],
          }),
        }}
      />
    </>
  );
}
