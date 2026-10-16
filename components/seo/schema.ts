import { SERVICE_AREA, SITE_URL } from "@/lib/seo";

export const ORG_ID = `${SITE_URL}/#org`;
export const LOCAL_ID = `${SITE_URL}/#local`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

export const areaServed = SERVICE_AREA.map((name) => ({
  "@type": "City",
  name,
  containedInPlace: { "@type": "State", name: "Colorado" },
}));

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceSchema({
  path,
  name,
  serviceType,
  description,
  audience,
  local = true,
  free = false,
}: {
  path: string;
  name: string;
  serviceType: string;
  description: string;
  audience?: string;
  local?: boolean;
  free?: boolean;
}) {
  const url = `${SITE_URL}${path}`;
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType,
    description,
    url,
    provider: { "@id": LOCAL_ID },
    brand: { "@id": ORG_ID },
    areaServed: local ? areaServed : { "@type": "Country", name: "United States" },
    ...(audience ? { audience: { "@type": "BusinessAudience", audienceType: audience } } : {}),
    ...(free
      ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", url } }
      : {}),
  };
}
