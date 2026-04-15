import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { INDUSTRIES } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "AskSaul builds AI, automation, and web systems for MSPs, property managers, home services, title insurance, professional services, real estate, startups, and PE portfolio companies.",
  openGraph: {
    title: "Industries We Serve | AskSaul.ai",
    description:
      "Built for businesses that sell, schedule, and serve. See how Saul delivers impact across 8 industries.",
    url: "https://asksaul.ai/industries",
  },
};

export default function IndustriesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">
                Industries
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Built for the businesses that
                <br className="hidden sm:block" />
                <span className="text-cyan">sell, schedule, and serve.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                Saul is not a one-size-fits-all tool. It is a system tuned to the way your industry actually runs. Here are the eight verticals where we deliver the most impact.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Industries detail */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            {INDUSTRIES.map((industry, i) => (
              <AnimatedSection
                key={industry.slug}
                delay={i * 60}
                className="bg-graphite border border-wire rounded-2xl p-6 sm:p-8 hover:border-cyan/30 transition-colors duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="font-display text-xl font-bold text-cloud mb-3">
                      {industry.name}
                    </h2>
                    <p className="text-base text-slate leading-relaxed mb-5">
                      {industry.longDescription}
                    </p>
                    <ul className="flex flex-col gap-2 mb-5">
                      {industry.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-slate">
                          <Check className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:border-l md:border-wire md:pl-6 flex flex-col justify-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-3">
                      Start here
                    </p>
                    <p className="text-sm text-slate mb-4">
                      Three minutes. We scope your proposal and have a real quote back within 24 hours.
                    </p>
                    <Link href={`/build-your-proposal?industry=${industry.slug}`}>
                      <Button variant="primary" size="sm" className="w-full">
                        Build Your Proposal
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center bg-graphite border border-wire rounded-2xl p-10">
              <h2 className="font-display text-2xl font-bold text-cloud mb-3">
                Not sure which bucket you fall in?
              </h2>
              <p className="text-slate mb-6">
                Most of our work sits at the edge of these categories. Tell us what you do and we will scope it.
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
