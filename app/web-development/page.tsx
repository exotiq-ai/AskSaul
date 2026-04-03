import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Accordion from "@/components/ui/Accordion";
import { PORTFOLIO_PROJECTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "Custom websites and web apps built mobile-first, SEO-optimized, and engineered to convert. From $5,000. Portfolio includes DriveExotiq, Exotiq.ai, and more.",
};

const SERVICES = [
  {
    name: "Custom business website",
    desc: "Mobile-first, SEO-optimized from day one. Built in Next.js with Tailwind CSS. Not a template, not a theme.",
    price: "$5,000 to $15,000",
  },
  {
    name: "Web application development",
    desc: "Custom functionality, user authentication, dashboards, booking systems, marketplaces. Scoped per project.",
    price: "Scoped per project",
  },
  {
    name: "E-commerce build",
    desc: "Shopify or custom-built storefronts. Product catalog, cart, checkout, inventory integration.",
    price: "Scoped per project",
  },
  {
    name: "Redesign or migration",
    desc: "Take an existing site and make it fast, modern, and conversion-focused. Same URL, new results.",
    price: "From $3,500",
  },
  {
    name: "SEO and maintenance retainer",
    desc: "Monthly updates, performance monitoring, content publishing, technical SEO. Ongoing partnership.",
    price: "$500 to $1,500/mo",
  },
];


const TECH_STACK = [
  "React", "Next.js", "TypeScript", "Tailwind CSS",
  "Node.js", "Supabase", "PostgreSQL", "Prisma",
  "Vercel", "Netlify", "Figma", "Framer Motion",
  "Shopify", "WordPress", "Stripe", "Resend",
];

const FAQ_ITEMS = [
  {
    question: "How much does a custom website cost?",
    answer:
      "Most business websites fall between $5,000 and $15,000. Simple marketing sites with 5 to 10 pages land at the lower end. Complex web apps, marketplaces, or sites requiring custom backend functionality land higher. Every project gets a scoped proposal with a fixed price before we start.",
  },
  {
    question: "How long does a website build take?",
    answer:
      "A standard business website typically takes 4 to 8 weeks from kickoff to launch. More complex web applications take longer. Timeline depends on scope, how quickly content and feedback come back from your side, and whether you need custom integrations.",
  },
  {
    question: "Do you work with existing websites or only build new ones?",
    answer:
      "Both. Redesigns and migrations are a significant portion of the work. If your current site is built on WordPress, Squarespace, Wix, or anything else and you want it rebuilt properly, that is a common starting point.",
  },
  {
    question: "Will my site rank on Google?",
    answer:
      "Every site is built with technical SEO as a requirement, not an afterthought. That means semantic HTML, fast load times, proper heading structure, mobile-first design, schema markup, and meta optimization. What happens after launch depends on your content strategy and domain authority, which takes time. We build the right foundation. We also offer ongoing SEO retainers specifically designed to accelerate that process. Most clients who pair a new site with a 6-month SEO retainer see meaningful organic traffic growth.",
  },
  {
    question: "What happens after the site launches?",
    answer:
      "You can manage it yourself or retain us for ongoing updates, performance monitoring, and SEO. Maintenance retainers run $500 to $1,500/mo depending on scope. Either way, you get full ownership of the code and hosting.",
  },
];

export default function WebDevelopmentPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <Badge variant="ice" className="mb-4">Websites & Apps</Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                A website that does its job.
                <br className="hidden sm:block" />
                <span className="text-ice">Built, not assembled.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                Mobile-first, fast, SEO-ready on day one, and engineered around your actual conversion goals. Not a template. Not a theme. Code written to spec.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="secondary" size="lg">
                  Build Your Proposal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-8">What we build</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((service, i) => (
                <AnimatedSection key={service.name} delay={i * 70}>
                  <Card glow className="p-5 h-full flex flex-col">
                    <h3 className="font-semibold text-cloud mb-2">{service.name}</h3>
                    <p className="text-base text-slate leading-relaxed flex-1 mb-4">{service.desc}</p>
                    <p className="text-sm font-semibold text-ice">{service.price}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="py-20 px-4 bg-carbon/40">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-2">Portfolio</p>
                <h2 className="font-display text-2xl font-bold text-cloud">Production work</h2>
                <p className="text-slate mt-2">
                  Five platforms built solo. Over 1,120 commits shipped. Zero outsourced dev.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {PORTFOLIO_PROJECTS.filter((p) => p.images.length > 0).map((project, i) => (
                <AnimatedSection key={project.id} delay={i * 80}>
                  <div className="group h-full bg-graphite border border-wire rounded-2xl overflow-hidden hover:border-ice/30 transition-all duration-300">
                    {/* Screenshot */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={project.images[0]}
                        alt={`${project.title} screenshot`}
                        fill
                        className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="muted">{tag}</Badge>
                        ))}
                      </div>

                      <h3 className="font-display font-bold text-cloud mb-1.5">{project.title}</h3>
                      <p className="text-base text-slate leading-relaxed mb-4">{project.description}</p>

                      {project.url !== "#" ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-ice font-semibold hover:text-ice/80 transition-colors"
                        >
                          View live site
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-dim">Not publicly available</span>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-8 text-center">Tech stack</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-graphite border border-wire text-sm text-slate font-medium hover:border-ice/30 hover:text-cloud transition-colors duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* What you get */}
        <section className="py-16 px-4 bg-carbon/40">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-6">What every project includes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Mobile-first responsive design",
                  "Technical SEO from day one",
                  "Google Core Web Vitals optimized",
                  "Accessibility (WCAG 2.1 AA)",
                  "Semantic HTML and schema markup",
                  "Full code ownership, no lock-in",
                  "Deployment to Vercel, Netlify, or your host",
                  "30-day post-launch support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-base text-slate">
                    <Check className="w-4 h-4 text-ice shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl font-bold text-cloud mb-8">Frequently asked</h2>
              <Accordion items={FAQ_ITEMS} />
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center bg-graphite border border-wire rounded-2xl p-10">
              <h2 className="font-display text-2xl font-bold text-cloud mb-3">
                Ready to build something real?
              </h2>
              <p className="text-slate mb-6">
                Tell us what you need. We will scope it, price it, and have a proposal in your inbox within 24 hours.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="secondary" size="lg">
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
