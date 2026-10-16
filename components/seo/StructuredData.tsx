import { BRAND } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { FOUNDER_ID, LOCAL_ID, ORG_ID, areaServed } from "./schema";

const SERVICES = [
  { name: "AI receptionist for roofing and HVAC", path: "/voice-agents" },
  { name: "Free Missed-Call & Visibility Audit", path: "/audit" },
  { name: "AI voice agent for dumpster rental and waste companies", path: "/voice-agents/waste" },
  { name: "Self-hosted AI assistants and automation", path: "/ai-automation" },
  { name: "Website and web app development", path: "/web-development" },
  { name: "Saul Marketing: CRM, email, SMS, and reviews", path: "/marketing-engine" },
];

/** Site-wide entities every page links to by @id. */
export default function StructuredData() {
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "AskSaul.ai",
      alternateName: "AskSaul",
      url: SITE_URL,
      inLanguage: "en-US",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "AskSaul.ai",
      legalName: "Ask Saul Inc.",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
      image: `${SITE_URL}/opengraph-image`,
      description:
        "AskSaul builds AI receptionists, follow-up automation, AI assistants, and websites for small businesses, with a focus on Front Range Colorado roofing and HVAC shops.",
      slogan: "We make your phone ring. Saul makes sure it gets answered.",
      email: BRAND.email,
      telephone: "+19703439634",
      founder: { "@id": FOUNDER_ID },
      foundingLocation: { "@type": "Place", name: "Denver, Colorado" },
      knowsAbout: [
        "AI receptionists",
        "AI voice agents",
        "Missed call recovery",
        "Local SEO",
        "Google Business Profile optimization",
        "AI search optimization",
        "Marketing automation",
        "GoHighLevel",
        "Web development",
      ],
      contactPoint: [
        { "@type": "ContactPoint", contactType: "sales", telephone: "+19703439634", email: "gregory@asksaul.ai", areaServed: "US", availableLanguage: "English" },
        { "@type": "ContactPoint", contactType: "customer service", email: BRAND.email, telephone: "+17202927554", areaServed: "US", availableLanguage: "English" },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": LOCAL_ID,
      name: "AskSaul.ai",
      url: SITE_URL,
      parentOrganization: { "@id": ORG_ID },
      image: `${SITE_URL}/opengraph-image`,
      logo: `${SITE_URL}/logo.png`,
      telephone: "+19703439634",
      email: BRAND.email,
      address: { "@type": "PostalAddress", addressLocality: "Denver", addressRegion: "CO", addressCountry: "US" },
      geo: { "@type": "GeoCoordinates", latitude: 39.7392, longitude: -104.9903 },
      areaServed,
      priceRange: "$$",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AskSaul services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, url: `${SITE_URL}${s.path}` },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: "Gregory Ringler",
      jobTitle: "Founder",
      url: `${SITE_URL}/about`,
      image: `${SITE_URL}/images/gregory-ringler.jpg`,
      email: "gregory@asksaul.ai",
      worksFor: { "@id": ORG_ID },
      homeLocation: { "@type": "Place", name: "Denver, Colorado" },
      knowsAbout: ["AI voice agents", "Automation", "Next.js", "Local SEO", "Small business operations"],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
