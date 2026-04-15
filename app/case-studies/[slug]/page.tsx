import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CASE_STUDIES } from "@/lib/case-studies";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return { title: "Case Study Not Found" };
  return {
    title: `${study.client}: ${study.title}`,
    description: study.tagline,
    openGraph: {
      title: `${study.client}: ${study.title} | AskSaul.ai`,
      description: study.tagline,
      url: `https://asksaul.ai/case-studies/${study.slug}`,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="pt-24 pb-12 px-4 dot-pattern">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-cloud transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                All case studies
              </Link>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {study.tags.map((t) => (
                  <Badge key={t} variant="muted">
                    {t}
                  </Badge>
                ))}
                {study.comingSoon && <Badge variant="muted">Coming Soon</Badge>}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan mb-2">
                {study.client}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-4 leading-tight">
                {study.title}
              </h1>
              <p className="text-lg text-slate leading-relaxed">
                {study.tagline}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {study.comingSoon ? (
          <section className="py-16 px-4">
            <AnimatedSection>
              <div className="max-w-2xl mx-auto bg-graphite border border-wire rounded-2xl p-10 text-center">
                <p className="text-slate mb-6">{study.challenge}</p>
                <Link href="/case-studies">
                  <Button variant="primary" size="md">
                    See other case studies
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </section>
        ) : (
          <section className="py-12 px-4">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
              <AnimatedSection className="bg-graphite border border-wire rounded-2xl p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-cloud mb-3">
                  Challenge
                </h2>
                <p className="text-base text-slate leading-relaxed">
                  {study.challenge}
                </p>
              </AnimatedSection>

              <AnimatedSection className="bg-graphite border border-wire rounded-2xl p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-cloud mb-4">
                  What Saul built
                </h2>
                <ul className="flex flex-col gap-3">
                  {study.built.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-base text-slate leading-relaxed"
                    >
                      <Check className="w-4 h-4 text-cyan shrink-0 mt-1.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </AnimatedSection>

              <AnimatedSection className="bg-cyan/5 border border-cyan/40 rounded-2xl p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-cloud mb-4">
                  Results
                </h2>
                <ul className="flex flex-col gap-3">
                  {study.results.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-2.5 text-base text-cloud leading-relaxed"
                    >
                      <Check className="w-4 h-4 text-cyan shrink-0 mt-1.5" />
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm font-semibold text-cyan">
                  {study.timeline}
                </p>
              </AnimatedSection>
            </div>
          </section>
        )}

        <section className="pb-24 px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center bg-graphite border border-wire rounded-2xl p-10">
              <h2 className="font-display text-2xl font-bold text-cloud mb-3">
                Want this for your business?
              </h2>
              <p className="text-slate mb-6">
                Tell us what you need. We will scope it, price it, and have a plan in your inbox within 24 hours.
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
