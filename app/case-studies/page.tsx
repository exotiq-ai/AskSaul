import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CASE_STUDIES } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real deployments, real timelines, real results. See what AskSaul has shipped for AI-native startups, local service businesses, and enterprise partners.",
  openGraph: {
    title: "Case Studies | AskSaul.ai",
    description:
      "Real deployments, real timelines, real results.",
    url: "https://asksaul.ai/case-studies",
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="pt-24 pb-12 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">
                Case Studies
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Real deployments.
                <br className="hidden sm:block" />
                <span className="text-cyan">Real results.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto">
                We do not ship slideware. Here is what AskSaul has actually built and what it has produced.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {CASE_STUDIES.map((study, i) => (
              <AnimatedSection
                key={study.slug}
                delay={i * 80}
                className={`group bg-graphite border rounded-2xl p-6 transition-all duration-300 ${
                  study.comingSoon
                    ? "border-wire opacity-70"
                    : "border-wire hover:border-cyan/40 hover:shadow-[0_0_30px_rgba(0,212,170,0.08)]"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {study.tags.map((t) => (
                    <Badge key={t} variant="muted">
                      {t}
                    </Badge>
                  ))}
                  {study.comingSoon && <Badge variant="muted">Coming Soon</Badge>}
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-1">
                  {study.client}
                </p>
                <h2 className="font-display text-xl font-bold text-cloud mb-2">
                  {study.title}
                </h2>
                <p className="text-base text-slate leading-relaxed mb-5">
                  {study.tagline}
                </p>
                {study.comingSoon ? (
                  <span className="text-sm text-dim">Case study coming soon</span>
                ) : (
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan group-hover:gap-2 transition-all duration-200"
                  >
                    Read the case study
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="pb-24 px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center bg-graphite border border-wire rounded-2xl p-10">
              <h2 className="font-display text-2xl font-bold text-cloud mb-3">
                Want numbers like these for your business?
              </h2>
              <p className="text-slate mb-6">
                Build a proposal. We will scope it, price it, and have a plan in your inbox within 24 hours.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />
    </>
  );
}
