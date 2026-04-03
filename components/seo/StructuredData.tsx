interface StructuredDataProps {
  includeService?: boolean;
}

export default function StructuredData({
  includeService = false,
}: StructuredDataProps) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": "https://asksaul.ai/#org",
      name: "AskSaul.ai",
      url: "https://asksaul.ai",
      logo: "https://asksaul.ai/images/logo.png",
      description:
        "Done-for-you AI assistants, custom websites, and marketing automation for businesses that are done duct-taping their tech together.",
      founder: {
        "@type": "Person",
        "@id": "https://asksaul.ai/#founder",
        name: "Gregory Ringler",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Denver",
        addressRegion: "CO",
        addressCountry: "US",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+19703439634",
        email: "1.gregory.ringler@gmail.com",
        contactType: "customer service",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://asksaul.ai/#local",
      name: "AskSaul.ai",
      url: "https://asksaul.ai",
      telephone: "+19703439634",
      email: "1.gregory.ringler@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Denver",
        addressRegion: "CO",
        addressCountry: "US",
      },
      priceRange: "$$",
      description:
        "AI assistants, web development, and marketing automation for small and medium businesses.",
      areaServed: "United States",
    },
    {
      "@type": "Person",
      "@id": "https://asksaul.ai/#founder",
      name: "Gregory Ringler",
      jobTitle: "Founder",
      url: "https://asksaul.ai/about",
      worksFor: {
        "@type": "Organization",
        "@id": "https://asksaul.ai/#org",
        name: "AskSaul.ai",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Denver",
        addressRegion: "CO",
      },
    },
  ];

  if (includeService) {
    graph.push({
      "@type": "Service",
      "@id": "https://asksaul.ai/#service-ai-automation",
      name: "AI & Automation Setup",
      provider: {
        "@type": "Organization",
        "@id": "https://asksaul.ai/#org",
        name: "AskSaul.ai",
      },
      description:
        "Self-hosted AI assistant deployments and workflow automation for small businesses.",
      areaServed: "United States",
      offers: {
        "@type": "Offer",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "500",
          maxPrice: "2500",
          priceCurrency: "USD",
        },
      },
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
