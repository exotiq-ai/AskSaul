import type { Metadata, MetadataRoute } from "next";

export const SITE_URL = "https://asksaul.ai";
export const SITE_NAME = "AskSaul.ai";

/** Front Range cities AskSaul serves for the founding program and local SEO. */
export const SERVICE_AREA = ["Denver", "Boulder", "Fort Collins", "Colorado Springs", "Loveland", "Longmont", "Greeley"];

type PageSeo = {
  /** Full <title>. Kept under ~60 characters so search results don't truncate it. */
  title: string;
  /** 120 to 160 characters. */
  description: string;
  /** Shorter headline for social cards, if different from the title. */
  social?: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  /** Source file whose last git commit is the page's lastmod. */
  source: string;
};

/**
 * One source of truth for every indexable static page: titles, descriptions,
 * canonicals, social cards, the sitemap, and llms.txt all read from here.
 */
export const PAGES: Record<string, PageSeo> = {
  "/": {
    title: "AI Receptionists & Automation for Small Business | AskSaul.ai",
    description:
      "AskSaul builds AI receptionists, follow-up automation, AI assistants, and websites for small businesses. Founder-built in Denver. Get your free Automation Map.",
    social: "AI that does the work your team keeps doing by hand",
    priority: 1,
    changeFrequency: "weekly",
    source: "app/page.tsx",
  },
  "/voice-agents": {
    title: "AI Receptionist for Roofing & HVAC in Colorado | AskSaul.ai",
    description:
      "We make your phone ring. Saul makes sure it gets answered. AI receptionist plus Google visibility for Front Range roofing and HVAC shops. 10 founding spots.",
    social: "We make your phone ring. Saul makes sure it gets answered.",
    priority: 1,
    changeFrequency: "weekly",
    source: "app/voice-agents/page.tsx",
  },
  "/voice-agents/hvac": {
    title: "AI Receptionist for HVAC Companies | Denver & Front Range",
    description:
      "Every no-heat call answered. Saul is an AI receptionist for Front Range HVAC shops: after-hours and overflow calls, booked by your rules. One shop per city.",
    social: "More homeowners find you. Every no-heat call gets answered.",
    priority: 0.9,
    changeFrequency: "weekly",
    source: "app/voice-agents/hvac/page.tsx",
  },
  "/voice-agents/roofing": {
    title: "AI Receptionist for Roofing Companies | Denver & Front Range",
    description:
      "Every storm call answered, even when you're on a roof. Saul is an AI receptionist for Front Range roofers that handles hail-day rushes and books inspections.",
    social: "More homeowners find you. Every call answered, even on a roof.",
    priority: 0.9,
    changeFrequency: "weekly",
    source: "app/voice-agents/roofing/page.tsx",
  },
  "/voice-agents/waste": {
    title: "AI Voice Agent for Dumpster Rental & Waste Companies | AskSaul",
    description:
      "Saul answers dumpster rental and roll-off calls 24/7, checks ZIP codes, captures debris, size, and delivery details, and sends quote-ready leads to your CRM.",
    priority: 0.8,
    changeFrequency: "monthly",
    source: "app/voice-agents/waste/page.tsx",
  },
  "/audit": {
    title: "Free Missed-Call & Visibility Audit for Roofing & HVAC",
    description:
      "Free one-page report for Front Range roofing and HVAC shops: your Google profile, reviews vs the top 3 nearby, AI search presence, mobile site, and top 3 fixes.",
    social: "See where your calls are leaking.",
    priority: 0.9,
    changeFrequency: "monthly",
    source: "app/audit/page.tsx",
  },
  "/build-your-proposal": {
    title: "Get Your Automation Map | Free AI Proposal in 24 Hours",
    description:
      "Answer a few questions in 3 minutes and get a scoped proposal in 24 hours: the 1 to 3 workflows worth automating first, ranked by time saved and revenue impact.",
    social: "Get your Automation Map in 3 minutes",
    priority: 0.9,
    changeFrequency: "monthly",
    source: "app/build-your-proposal/page.tsx",
  },
  "/ai-automation": {
    title: "Self-Hosted AI Assistants & Automation | AskSaul.ai",
    description:
      "Security-hardened AI assistants built on OpenClaw that live in Telegram, WhatsApp, Slack, or Discord. Done for you, your data on your infrastructure.",
    priority: 0.8,
    changeFrequency: "monthly",
    source: "app/ai-automation/page.tsx",
  },
  "/web-development": {
    title: "Website & Web App Development in Denver | AskSaul.ai",
    description:
      "Fast, mobile-first websites and web apps built to turn visitors into leads: quote flows, booking, CRM handoff, and local SEO. Fixed price before we start.",
    priority: 0.8,
    changeFrequency: "monthly",
    source: "app/web-development/page.tsx",
  },
  "/marketing-engine": {
    title: "Saul Marketing: CRM, Email, SMS & Reviews in One Platform",
    description:
      "Replace 5+ disconnected tools with one CRM, email and SMS follow-up, funnels, scheduling, and review management, with an AI assistant working your pipeline.",
    priority: 0.8,
    changeFrequency: "monthly",
    source: "app/marketing-engine/page.tsx",
  },
  "/services": {
    title: "AI, Automation & Web Services for Small Business | AskSaul.ai",
    description:
      "AI receptionists, AI assistants, follow-up automation, marketing systems, and conversion websites for small businesses, built and supported by a Denver founder.",
    priority: 0.7,
    changeFrequency: "monthly",
    source: "app/services/page.tsx",
  },
  "/industries": {
    title: "Industries We Serve: Home Services, MSPs & More | AskSaul.ai",
    description:
      "How AskSaul applies AI receptionists and automation to home services, property management, MSPs, real estate, professional services, and sales-led startups.",
    priority: 0.6,
    changeFrequency: "monthly",
    source: "app/industries/page.tsx",
  },
  "/case-studies": {
    title: "Case Studies: Real AI & Web Results | AskSaul.ai",
    description:
      "Real deployments with real numbers: a Front Range HVAC shop with website visits up 300%, and a CRM and outreach engine live in 48 hours.",
    priority: 0.7,
    changeFrequency: "monthly",
    source: "app/case-studies/page.tsx",
  },
  "/portfolio": {
    title: "Portfolio: Live Sites, Apps & Voice Agents | AskSaul.ai",
    description:
      "Live projects built by Gregory Ringler: local lead-gen sites with Saul voice intake, rental marketplaces, fleet platforms, and an HVAC website rebuild.",
    priority: 0.6,
    changeFrequency: "monthly",
    source: "app/portfolio/page.tsx",
  },
  "/about": {
    title: "About Gregory Ringler, Founder of AskSaul.ai | Denver",
    description:
      "A non-technical founder who taught himself to build software, shipped a fleet platform solo, and now builds AI systems and websites for small businesses.",
    priority: 0.6,
    changeFrequency: "yearly",
    source: "app/about/page.tsx",
  },
  "/contact": {
    title: "Contact AskSaul.ai | Talk to Gregory in Denver",
    description:
      "Reach Gregory Ringler at AskSaul.ai: call 970.343.9634, email saul@asksaul.ai, or hear Saul on the demo line at (970) 401-7285. Currently accepting clients.",
    priority: 0.6,
    changeFrequency: "yearly",
    source: "app/contact/page.tsx",
  },
  "/blog": {
    title: "Blog: AI Search, Automation & Lead Generation | AskSaul.ai",
    description:
      "Practical articles on AI search optimization, automations that pay for themselves, and why small-business websites don't get leads, from Gregory Ringler.",
    priority: 0.6,
    changeFrequency: "weekly",
    source: "app/blog/page.tsx",
  },
  "/privacy": {
    title: "Privacy Policy | AskSaul.ai",
    description: "How AskSaul.ai collects, uses, and protects your information, including SMS consent, lead forms, chat, and call recordings.",
    priority: 0.2,
    changeFrequency: "yearly",
    source: "app/privacy/page.tsx",
  },
  "/terms": {
    title: "Terms of Service | AskSaul.ai",
    description: "The terms that govern use of asksaul.ai and AskSaul services, including AI receptionists, automation, websites, and SMS, from Ask Saul Inc.",
    priority: 0.2,
    changeFrequency: "yearly",
    source: "app/terms/page.tsx",
  },
};

export const DEFAULT_OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "AskSaul.ai" };

/**
 * Builds a page's metadata with a self-referencing canonical, an og:url, and
 * social cards that keep an image (Next replaces nested openGraph objects
 * wholesale, so every page has to restate the image).
 */
export function seoMetadata({
  path,
  title,
  description,
  social,
  type = "website",
  publishedTime,
  noIndex = false,
}: {
  path: string;
  title: string;
  description: string;
  social?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const socialTitle = social ?? title;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      title: socialTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
      ...(publishedTime ? { publishedTime } : {}),
    },
    // No twitter:image: X falls back to og:image, which per-route opengraph-image files override.
    twitter: { card: "summary_large_image", title: socialTitle, description },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function pageMetadata(path: keyof typeof PAGES): Metadata {
  const p = PAGES[path];
  return seoMetadata({ path, title: p.title, description: p.description, social: p.social });
}

/** Ordered breadcrumb trail for a path, for BreadcrumbList structured data. */
export function breadcrumbs(path: string, leafName: string): { name: string; url: string }[] {
  const trail = [{ name: "Home", url: SITE_URL }];
  const parts = path.split("/").filter(Boolean);
  let acc = "";
  parts.forEach((part, i) => {
    acc += `/${part}`;
    const isLeaf = i === parts.length - 1;
    const known = PAGES[acc]?.title.split(" | ")[0];
    trail.push({ name: isLeaf ? leafName : known ?? part.replace(/-/g, " "), url: `${SITE_URL}${acc}` });
  });
  return trail;
}
