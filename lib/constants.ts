export const BRAND = {
  name: "AskSaul",
  domain: "asksaul.ai",
  tagline: "Your competitors are automating. You are still doing it manually.",
  email: "1.gregory.ringler@gmail.com",
  phone: "970.343.9634",
  location: "Denver, CO",
};

export const NAV_LINKS = [
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const SERVICES_DROPDOWN = [
  {
    label: "AI & Automation",
    href: "/ai-automation",
    description: "Self-hosted AI assistants and workflow automation",
  },
  {
    label: "Websites & Apps",
    href: "/web-development",
    description: "Custom sites and web apps that convert",
  },
  {
    label: "Marketing Engine",
    href: "/marketing-engine",
    description: "Full GoHighLevel stack, managed for you",
  },
];

export const SERVICE_LANES = [
  {
    id: "ai",
    title: "AI & Automation",
    tagline: "Make Saul work for your business",
    description:
      "Self-hosted AI assistants, chatbots, workflow automation, and CRM intelligence. Your data stays on your infrastructure.",
    href: "/ai-automation",
    icon: "Bot",
    features: [
      "OpenClaw deployments",
      "AI chatbots",
      "Workflow automation",
      "CRM intelligence",
    ],
  },
  {
    id: "web",
    title: "Websites & Apps",
    tagline: "A site that actually converts",
    description:
      "Custom websites and web apps built mobile-first, SEO-optimized, and engineered to turn visitors into leads.",
    href: "/web-development",
    icon: "Code2",
    features: [
      "Custom websites",
      "Web applications",
      "SEO optimization",
      "Redesigns",
    ],
  },
  {
    id: "marketing",
    title: "Marketing Engine",
    tagline: "Your entire marketing stack, handled",
    description:
      "Full GoHighLevel white-label setup. CRM, email and SMS sequences, funnels, pipelines, and reputation management.",
    href: "/marketing-engine",
    icon: "TrendingUp",
    features: [
      "GHL white-label",
      "Email + SMS sequences",
      "Lead gen funnels",
      "Pipeline management",
    ],
  },
];

export const METRICS = [
  { value: "1,120+", label: "commits shipped" },
  { value: "5", label: "production platforms built" },
  { value: "Solo", label: "founder, zero outsourced dev" },
  { value: "8 months", label: "idea to full platform" },
];

export const PORTFOLIO_PROJECTS = [
  {
    id: "driveexotiq",
    title: "DriveExotiq.com",
    description:
      "Consumer rental marketplace. Conversion-optimized with AI-powered pricing and a complete search and booking flow.",
    url: "https://driveexotiq.com",
    images: [
      "/images/portfolio/driveexotiq-hero.jpg",
      "/images/portfolio/driveexotiq-marketplace.jpg",
    ],
    tags: ["Next.js", "Marketplace", "AI Pricing"],
  },
  {
    id: "exotiq",
    title: "Exotiq.ai",
    description:
      "Marketing site and brand hub. Gulf livery aesthetic, FleetCopilot demo, and AI-optimized blog content.",
    url: "https://exotiq.ai",
    images: [
      "/images/portfolio/exotiq-fleetcopilot.jpg",
      "/images/portfolio/exotiq-blog-header.jpg",
    ],
    tags: ["Next.js", "AI", "Brand Hub"],
  },
  {
    id: "polaris",
    title: "Polaris Estate",
    description:
      "AI-powered luxury real estate platform designed for ultra-high-net-worth clients. Premium design and advanced search.",
    url: "#",
    images: [],
    tags: ["React", "Real Estate", "AI"],
    comingSoon: true,
  },
  {
    id: "lous-hvac",
    title: "Lou's HVAC",
    description:
      "Full business website with SEO optimization, service pages, review integration, bilingual support, and service area mapping.",
    url: "#",
    images: [],
    tags: ["Next.js", "SEO", "Local Business"],
    comingSoon: true,
  },
];
