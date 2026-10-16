import { OG_SIZE, renderOg } from "@/lib/og";
import { CASE_STUDIES } from "@/lib/case-studies";

export const alt = "AskSaul.ai case study";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  return renderOg({ eyebrow: "Case study", title: study ? `${study.client}: ${study.title}` : "AskSaul.ai case study" });
}
