import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Gregory Ringler built a fleet management platform solo with 1,120+ commits. Now he builds AI systems, websites, and automation for other businesses.",
  openGraph: {
    title: "About Gregory Ringler | AskSaul.ai",
    description:
      "Gregory Ringler built a fleet management platform solo with 1,120+ commits. Now he builds AI systems, websites, and automation for other businesses.",
    url: "https://asksaul.ai/about",
  },
};

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "Python",
  "Supabase",
  "PostgreSQL",
  "Figma",
  "Vercel",
  "Netlify",
  "OpenClaw",
  "Marketing Automation",
  "Framer Motion",
  "REST APIs",
  "Zod",
  "React Hook Form",
  "Git",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">
                About
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                The guy who built the thing
                <br className="hidden sm:block" />
                <span className="text-cyan"> then started doing it for others.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl">
                Non-technical founder. Self-taught developer. 1,120+ commits solo. Based in Denver, CO.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Gregory's Story */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Story text */}
              <AnimatedSection>
                {/* Photo */}
                <div className="mb-8">
                  <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-cyan/30 shadow-[0_0_30px_rgba(0,212,170,0.12)]">
                    <Image
                      src="/images/gregory-ringler.jpg"
                      alt="Gregory Ringler, founder of AskSaul.ai"
                      fill
                      className="object-cover object-top"
                      sizes="160px"
                      priority
                    />
                  </div>
                </div>

                <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
                  Gregory's Story
                </p>
                <h2 className="font-display text-3xl font-bold text-cloud mb-8">
                  I didn't come up coding.
                </h2>

                <div className="space-y-6 text-slate leading-relaxed">
                  <p>
                    My background is hospitality and brand work. I know how to run operations,
                    talk to customers, and build something people actually want to use. But I had
                    never shipped a line of code before 2024. That changed when I watched my own
                    business get killed by broken software and $500/month SaaS tools that did half
                    of what I needed.
                  </p>
                  <p>
                    I was running an exotic car rental business on Turo - one of those side
                    businesses that looks glamorous from the outside and is pure operational chaos
                    on the inside. Fleet tracking was a spreadsheet. Reservations lived in three
                    different apps. Nothing talked to anything else. The platforms that existed
                    either weren't built for how I operated or cost more per month than some of my
                    cars made. So I decided to build what I needed.
                  </p>
                  <p>
                    I used AI tools to teach myself everything I needed to know - React, Next.js,
                    TypeScript, Supabase, REST APIs, the works. Eight months later I had a full
                    fleet management platform: 1,120+ commits, 63 active dev days, running in
                    production. Solo. No outsourced dev, no co-founder to handle the technical
                    side. Just me, Claude, and a lot of late nights in Denver.
                  </p>
                  <p>
                    That experience changed what I thought was possible for a non-technical founder
                    with the right tools. Now I build AI systems, websites, and automation stacks
                    for other small businesses - the kind of people who know exactly what their
                    business needs but can't find or afford a dev team to build it. I'm not a
                    traditional agency. I'm a founder who's lived the problem and knows how to solve it.
                  </p>
                </div>
              </AnimatedSection>

              {/* Metrics + Availability */}
              <div className="space-y-5">
                {/* Metrics */}
                <AnimatedSection delay={100}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "1,120+", label: "Commits shipped" },
                      { value: "63", label: "Active dev days" },
                      { value: "8 mo", label: "Idea to full platform" },
                      { value: "Solo", label: "Zero outsourced dev" },
                    ].map((m) => (
                      <Card key={m.label} className="p-5 text-center">
                        <p className="font-display text-2xl font-bold text-cyan mb-1">
                          {m.value}
                        </p>
                        <p className="text-xs text-slate">{m.label}</p>
                      </Card>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Contact info card */}
                <AnimatedSection delay={200}>
                  <Card glow className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                      <p className="text-xs font-semibold uppercase tracking-widest text-cyan">
                        Currently accepting clients
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <a
                        href="mailto:1.gregory.ringler@gmail.com"
                        className="flex items-center gap-3 text-sm text-slate hover:text-cloud transition-colors"
                      >
                        <Mail className="w-4 h-4 text-cyan shrink-0" />
                        1.gregory.ringler@gmail.com
                      </a>
                      <a
                        href="tel:+19703439634"
                        className="flex items-center gap-3 text-sm text-slate hover:text-cloud transition-colors"
                      >
                        <Phone className="w-4 h-4 text-cyan shrink-0" />
                        970.343.9634
                      </a>
                      <div className="flex items-center gap-3 text-sm text-slate">
                        <MapPin className="w-4 h-4 text-cyan shrink-0" />
                        Denver, CO
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/build-your-proposal" className="flex-1">
                        <Button variant="primary" size="sm" className="w-full">
                          Build Your Proposal
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link href="/contact" className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full">
                          Send a Message
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </AnimatedSection>

                {/* Background badges */}
                <AnimatedSection delay={300}>
                  <Card className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-3">
                      Background
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Hospitality",
                        "Brand Development",
                        "Customer Experience",
                        "Fleet Operations",
                        "Exotic Car Rental",
                        "SMB Owner",
                      ].map((tag) => (
                        <Badge key={tag} variant="muted">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Saul's Story */}
        <section className="py-16 px-4 bg-carbon/40">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="max-w-3xl">
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
                  Saul's Story
                </p>
                <h2 className="font-display text-2xl font-bold text-cloud mb-5">
                  Saul started as an internal tool. He got good at it.
                </h2>
                <p className="text-slate leading-relaxed mb-4">
                  Saul started as Gregory's personal AI assistant built on OpenClaw - handling
                  research, drafting, scheduling, and the hundred small tasks that eat up a solo
                  founder's day. He got so good at it that clients started asking if they could
                  have one too. Turns out a well-configured AI assistant is useful for more than
                  just one business.
                </p>
                <p className="text-slate leading-relaxed">
                  Now Saul works for other businesses as well. Same security standards. Same
                  personality configuration process. Yours just gets tuned to your team, your
                  voice, and your workflows.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Skills Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
                Tech Stack
              </p>
              <h2 className="font-display text-2xl font-bold text-cloud mb-8">
                Tools of the trade
              </h2>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill, i) => (
                  <AnimatedSection key={skill} delay={i * 30}>
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-graphite border border-wire text-sm font-medium text-cloud hover:border-cyan/40 hover:text-cyan hover:bg-cyan/5 transition-all duration-200 cursor-default">
                      {skill}
                    </span>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-4">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center bg-graphite border border-wire rounded-2xl p-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-cyan" />
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan">
                  Currently accepting clients
                </p>
              </div>
              <h2 className="font-display text-2xl font-bold text-cloud mb-3">
                Ready to work together?
              </h2>
              <p className="text-slate mb-6">
                Tell me what you're building. I'll tell you what it'll take to make it happen.
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
            "@type": "Person",
            name: "Gregory Ringler",
            jobTitle: "Founder",
            url: "https://asksaul.ai/about",
            email: "1.gregory.ringler@gmail.com",
            telephone: "+19703439634",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Denver",
              addressRegion: "CO",
            },
          }),
        }}
      />
    </>
  );
}
