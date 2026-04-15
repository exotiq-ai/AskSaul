import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Gregory Ringler. AskSaul.ai builds AI systems, websites, and automation for small businesses. Based in Denver, CO. Responding within 24 hours.",
  openGraph: {
    title: "Contact | AskSaul.ai",
    description:
      "Get in touch with Gregory Ringler. Currently accepting new clients. Based in Denver, CO.",
    url: "https://asksaul.ai/contact",
  },
};

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "saul3000bot@gmail.com",
    href: "mailto:saul3000bot@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "970.343.9634",
    href: "tel:+19703439634",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Denver, CO",
    href: null,
  },
  {
    icon: Clock,
    label: "Availability",
    value: "Mon-Fri, responding within 24 hours",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">
                Contact
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Let's talk about
                <br className="hidden sm:block" />
                <span className="text-cyan"> what you're building.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl">
                No sales funnel. No gatekeeping assistant. You're talking directly to Gregory.
                Send a message or call - whichever is faster for you.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Main content */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Form - takes more space */}
              <div className="lg:col-span-3">
                <AnimatedSection>
                  <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
                    Send a Message
                  </p>
                  <h2 className="font-display text-2xl font-bold text-cloud mb-6">
                    What can I help you with?
                  </h2>
                  <ContactForm />
                </AnimatedSection>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-5">
                {/* Status */}
                <AnimatedSection delay={100}>
                  <Card glow className="p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                      <p className="text-xs font-semibold uppercase tracking-widest text-cyan">
                        Currently accepting clients
                      </p>
                    </div>

                    <div className="space-y-4">
                      {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                        <div key={label} className="flex items-start gap-3">
                          <Icon className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-dim mb-0.5">{label}</p>
                            {href ? (
                              <a
                                href={href}
                                className="text-sm text-slate hover:text-cloud transition-colors"
                              >
                                {value}
                              </a>
                            ) : (
                              <p className="text-sm text-slate">{value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </AnimatedSection>

                {/* Book a Call */}
                <AnimatedSection delay={200}>
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-cyan" />
                      <p className="text-xs font-semibold uppercase tracking-widest text-dim">
                        Book a Call
                      </p>
                    </div>
                    <p className="text-base text-slate mb-4 leading-relaxed">
                      Want to talk through your project before committing to anything? Email Gregory
                      directly to request a discovery call. No pitch deck. Just a real conversation
                      about what you need.
                    </p>
                    <a
                      href="mailto:saul3000bot@gmail.com?subject=Discovery%20Call%20Request&body=Hi%20Gregory%2C%20I'd%20like%20to%20book%20a%20discovery%20call."
                    >
                      <Button variant="secondary" size="sm" className="w-full">
                        Request a Discovery Call
                      </Button>
                    </a>
                    <p className="text-xs text-dim text-center mt-2">(Calendly coming soon)</p>
                  </Card>
                </AnimatedSection>

                {/* Build your proposal */}
                <AnimatedSection delay={300}>
                  <Card className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-2">
                      Know what you want?
                    </p>
                    <p className="text-base text-slate mb-4">
                      Skip the back and forth. Build a scoped proposal and get a quote in your
                      inbox within 24 hours.
                    </p>
                    <Link href="/build-your-proposal">
                      <Button variant="ghost" size="sm" className="w-full">
                        Build Your Proposal
                      </Button>
                    </Link>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
