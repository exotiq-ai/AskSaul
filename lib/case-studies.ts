export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  tagline: string;
  challenge: string;
  built: string[];
  results: string[];
  timeline: string;
  tags: string[];
  comingSoon: boolean;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "exotiq",
    title: "AI-Powered GTM in 48 Hours",
    client: "Exotiq",
    tagline: "Full CRM, outreach engine, and pipeline visibility live in under 72 hours.",
    challenge:
      "Founder-led sales with fragmented tools. Manual lead tracking. No outreach system. No pipeline visibility.",
    built: [
      "Full CRM dashboard with lead enrichment, scoring, and pipeline management",
      "Automated outreach system across Instagram DM, email, and SMS",
      "Closed-loop feedback engine tracking campaign performance",
      "Integration with GoHighLevel for marketing automation",
    ],
    results: [
      "4 demo calls booked within 24 hours of deployment",
      "Full CRM and pipeline management live within 48 hours",
      "Dashboard operational for daily lead management within 1 week",
      "Converting demos to paying customers",
    ],
    timeline: "Built and deployed in under 72 hours.",
    tags: ["GTM", "CRM", "AI Outreach", "Pipeline"],
    comingSoon: false,
  },
  {
    slug: "lous-hvac",
    title: "Front Range HVAC Shop: Website Visits Up 300%",
    client: "Lou's Heating & Cooling",
    tagline: "Website rebuild, Google Business Profile, local SEO, and AI search for a Front Range HVAC shop.",
    challenge:
      "Lou's does good work, but homeowners searching for HVAC help were not finding them. The old website was not bringing in jobs, and the Google Business Profile was not pulling its weight.",
    built: [
      "Full website rebuild with bilingual support",
      "Google Business Profile cleanup and optimization",
      "Local SEO and service area mapping",
      "Set up to show in AI search, not just Google",
      "Google Reviews integration on the site",
    ],
    results: [
      "Website visits up 300% since the rebuild",
      "Contact form submissions doubled",
    ],
    timeline: "Measured since the rebuild. See it live at LousHvac303.com.",
    tags: ["Web", "Local SEO", "AI Search", "HVAC"],
    comingSoon: false,
  },
  {
    slug: "lex-partnership",
    title: "Mid-Market Deployment via Lex",
    client: "Lex Partnership",
    tagline: "Enterprise-grade AI + automation systems deployed through the Lex channel.",
    challenge:
      "Full case study in progress. Check back after first deployment wraps.",
    built: [],
    results: [],
    timeline: "",
    tags: ["Enterprise", "AI", "Partnership"],
    comingSoon: true,
  },
];
