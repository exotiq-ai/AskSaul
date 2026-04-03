import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { BRAND } from "@/lib/constants";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "AI & Automation", href: "/ai-automation" },
      { label: "Websites & Apps", href: "/web-development" },
      { label: "Marketing Engine", href: "/marketing-engine" },
      { label: "Build Your Proposal", href: "/build-your-proposal" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-carbon border-t border-wire">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl font-bold text-cloud hover:text-cyan transition-colors"
            >
              Ask<span className="text-cyan">Saul</span>
            </Link>
            <p className="mt-4 text-sm text-slate leading-relaxed">
              Done-for-you AI assistants, custom websites, and marketing
              automation. Built by Gregory Ringler in Denver, CO.
            </p>
            <div className="mt-6 space-y-2">
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2 text-sm text-slate hover:text-cyan transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                {BRAND.email}
              </a>
              <a
                href={`tel:${BRAND.phone.replace(/\./g, "")}`}
                className="flex items-center gap-2 text-sm text-slate hover:text-cyan transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                {BRAND.phone}
              </a>
              <div className="flex items-center gap-2 text-sm text-slate">
                <MapPin className="w-4 h-4 shrink-0" />
                {BRAND.location}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-dim mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate hover:text-cloud transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact / CTA column */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-dim mb-4">
              Get Started
            </h3>
            <p className="text-sm text-slate leading-relaxed mb-4">
              Ready to automate and build? Start with a proposal or book a call.
            </p>
            <Link
              href="/build-your-proposal"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:text-cyan/80 transition-colors"
            >
              Build Your Proposal
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-wire flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dim">
            &copy; 2026 AskSaul.ai, a subsidiary of G &amp; G Holdings MT. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-dim hover:text-slate transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-dim hover:text-slate transition-colors"
            >
              Terms
            </Link>
            <span className="text-xs text-dim">
              Built by Gregory Ringler, Denver, CO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
