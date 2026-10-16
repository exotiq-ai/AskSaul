import { OG_SIZE, renderOg } from "@/lib/og";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-data";

export const alt = "AskSaul.ai blog";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return renderOg({ eyebrow: post?.category ?? "Blog", title: post?.title ?? "AskSaul.ai blog" });
}
