import PageSchema from "./PageSchema";
import { breadcrumbSchema } from "./schema";
import { PAGES, SITE_URL, breadcrumbs } from "@/lib/seo";

/**
 * Per-page JSON-LD: a WebPage tied to the site graph, its breadcrumb trail,
 * plus any page-specific entities (Service, etc.).
 */
export default function PageSeoSchema({ path, extra = [] }: { path: string; extra?: Record<string, unknown>[] }) {
  const page = PAGES[path];
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const name = page?.title.split(" | ")[0] ?? path;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page?.title ?? name,
      description: page?.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#org` },
      inLanguage: "en-US",
    },
    ...(path === "/" ? [] : [breadcrumbSchema(breadcrumbs(path, name))]),
    ...extra,
  ];
  return <PageSchema graph={graph} />;
}
