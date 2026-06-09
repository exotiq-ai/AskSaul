export const BRAND = {
  name: "AskSaul",
  domain: "asksaul.ai",
  tagline: "Practical AI systems for the work your business keeps doing by hand.",
  email: "saul3000bot@gmail.com",
  phone: "970.343.9634",
  location: "Denver, CO",
};

export const NAV_LINKS = [
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
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
    label: "Voice Agents",
    href: "/voice-agents",
    description: "Answer missed calls and qualify service leads",
  },
  {
    label: "Waste Voice Agents",
    href: "/voice-agents/waste",
    description: "Dumpster rental and roll-off call intake",
  },
  {
    label: "Saul Marketing",
    href: "/marketing-engine",
    description: "Your entire marketing stack, managed for you",
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
    title: "Saul Marketing",
    tagline: "Your entire marketing stack, handled",
    description:
      "CRM, email and SMS sequences, funnels, pipelines, and reputation management. One platform with AI built in.",
    href: "/marketing-engine",
    icon: "TrendingUp",
    features: [
      "CRM + pipeline management",
      "Email + SMS sequences",
      "Lead gen funnels",
      "AI-powered follow-up",
    ],
  },
];

export const METRICS = [
  { value: "5", label: "live platforms built and running" },
  { value: "2-4 wks", label: "average launch timeline" },
  { value: "Zero", label: "monthly subscription to AskSaul" },
  { value: "Denver", label: "CO" },
];

export const OPENCLAW_TIERS = [
  {
    id: "starter",
    name: "Saul Classic",
    label: "Starter",
    price: 500,
    ongoing: "$20 to $80/mo",
    forWho: "Solopreneurs, individual professionals",
  },
  {
    id: "team",
    name: "AskSaul Team",
    label: "Team",
    price: 1000,
    ongoing: "$50 to $200/mo",
    forWho: "Small teams (2 to 10 people)",
  },
  {
    id: "pro",
    name: "AskSaul Pro",
    label: "Pro",
    price: 2500,
    ongoing: "$100 to $500/mo",
    forWho: "Businesses with customer-facing needs",
  },
  {
    id: "developer",
    name: "AskSaul Dev",
    label: "Developer",
    price: 1200,
    ongoing: "$50 to $300/mo",
    forWho: "Developers, technical teams",
  },
];

export const SAUL_MARKETING_PRICING = {
  setup: 3500,
  monthly: 1000,
};

export const CONTACT_INFO = {
  email: "saul3000bot@gmail.com",
  phone: "970.343.9634",
  location: "Denver, CO",
  calendly: "https://calendly.com/gregoryr/discovery",
};

export const PORTFOLIO_PROJECTS = [
  {
    id: "pueblo-dumpster-rental",
    title: "Pueblo Dumpster Rentals",
    description:
      "Rank-and-rent dumpster rental site for Pueblo with local SEO, quote-focused conversion flow, and Saul voice-agent call intake installed.",
    url: "https://pueblodumpsterrental.com/",
    images: [
      "/images/portfolio/rank-rent/pueblo-desktop.png",
      "/images/portfolio/rank-rent/pueblo-mobile.png",
    ],
    tags: ["Rank & Rent", "Dumpster Rental", "Voice Agent"],
    comingSoon: false,
  },
  {
    id: "fayetteville-rolloff",
    title: "Fayetteville Rolloff",
    description:
      "Local roll-off dumpster lead-gen site for Fayetteville with service-area qualification, quote-ready copy, and Saul-powered phone intake.",
    url: "https://fayettevillerolloff.com/",
    images: [
      "/images/portfolio/rank-rent/fayetteville-desktop.png",
      "/images/portfolio/rank-rent/fayetteville-mobile.png",
    ],
    tags: ["Rank & Rent", "Local SEO", "AI Intake"],
    comingSoon: false,
  },
  {
    id: "lake-charles-dumpster",
    title: "Lake Charles Dumpster",
    description:
      "Waste lead-gen site for Lake Charles with market-specific SEO, quote flow, and live Saul demo call routing for proof-of-work testing.",
    url: "https://lakecharlesdumpster.com/",
    images: [
      "/images/portfolio/rank-rent/lake-charles-desktop.png",
      "/images/portfolio/rank-rent/lake-charles-mobile.png",
    ],
    tags: ["Rank & Rent", "Waste", "Voice Agent"],
    comingSoon: false,
  },
  {
    id: "driveexotiq",
    title: "DriveExotiq.com",
    description:
      "Consumer rental marketplace for exotic cars. Conversion-optimized search and booking flow with AI-powered dynamic pricing.",
    url: "https://driveexotiq.com",
    images: [
      "/images/portfolio/driveexotiq-hero.jpg",
      "/images/portfolio/driveexotiq-marketplace.jpg",
    ],
    tags: ["Next.js", "Marketplace", "AI Pricing"],
    comingSoon: false,
  },
  {
    id: "exotiq",
    title: "Exotiq.ai",
    description:
      "Marketing site and brand hub for fleet technology. Gulf livery aesthetic, FleetCopilot product demo, and AI-optimized blog content.",
    url: "https://exotiq.ai",
    images: [
      "/images/portfolio/exotiq-fleetcopilot.jpg",
      "/images/portfolio/exotiq-blog-header.jpg",
    ],
    tags: ["Next.js", "AI", "Brand Hub"],
    comingSoon: false,
  },
  {
    id: "exotiq-command-center",
    title: "Exotiq Command Center",
    description:
      "Fleet intelligence platform with AI-powered pricing optimization, MotoIQ revenue analytics module, FleetCopilot voice AI assistant, and real-time fleet utilization tracking.",
    url: "https://app.exotiq.ai",
    images: [
      "/images/portfolio/exotiq-command-center.jpg",
      "/images/portfolio/exotiq-motoriq.jpg",
      "/images/portfolio/exotiq-dashboard-revenue.jpg",
      "/images/portfolio/exotiq-fleetcopilot-rari.jpg",
    ],
    tags: ["React", "AI", "Dashboard", "Analytics"],
    comingSoon: false,
  },
  {
    id: "polaris",
    title: "Polaris Estate",
    description:
      "AI-powered luxury real estate platform designed for ultra-high-net-worth clients. Premium design system with advanced property search.",
    url: "https://polaris.estate",
    images: ["/images/portfolio/polaris-estate.jpg"],
    tags: ["React", "Real Estate", "Premium Design"],
    comingSoon: false,
  },
  {
    id: "lous-hvac",
    title: "Lou's Heating & Cooling",
    description:
      "Full business website for a local HVAC company. Local SEO optimization, service area mapping, Google Reviews integration, and bilingual support.",
    url: "#",
    images: ["/images/portfolio/lous-hvac.jpg"],
    tags: ["Next.js", "Local SEO", "Bilingual"],
    comingSoon: false,
  },
  {
    id: "exotiq-rent",
    title: "Exotiq.rent",
    description:
      "Consumer marketplace for exotic car rentals. Filterable search, instant-book flow, multi-location inventory, and conversion-focused vehicle cards.",
    url: "https://exotiq.rent",
    images: ["/images/portfolio/exotiq-rent-marketplace.png"],
    tags: ["Next.js", "Marketplace", "Instant Book"],
    comingSoon: false,
  },
];
