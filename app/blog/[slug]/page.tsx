import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Calendar, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import {
  BLOG_POSTS,
  getBlogPost,
  getRelatedPosts,
  type BlogPost,
  type ContentBlock,
} from "@/lib/blog-data";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          key={index}
          id={slugify(block.content)}
          className="font-display text-2xl font-bold text-cloud mt-10 mb-4"
        >
          {block.content}
        </h2>
      );
    case "paragraph":
      return (
        <p key={index} className="text-slate leading-relaxed mb-6">
          {block.content}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="space-y-2 mb-6">
          {block.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-2">
              <span className="text-cyan mt-1">•</span>
              <span className="text-slate">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l-4 border-cyan pl-6 py-2 mb-6 italic text-cloud/80 bg-graphite/50 rounded-r-lg"
        >
          {block.content}
        </blockquote>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams(): { slug: string }[] {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | AskSaul.ai`,
      description: post.excerpt,
      url: `https://asksaul.ai/blog/${post.slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);
  const headings = post.content.filter((b) => b.type === "heading");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: "Gregory Ringler" },
    publisher: {
      "@type": "Organization",
      name: "AskSaul.ai",
      url: "https://asksaul.ai",
    },
    datePublished: post.date,
    url: `https://asksaul.ai/blog/${post.slug}`,
    mainEntityOfPage: `https://asksaul.ai/blog/${post.slug}`,
  };

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Article hero */}
        <section className="pt-24 pb-12 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate text-sm">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Two-column layout */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
              {/* Article body */}
              <article>
                {post.content.map((block, i) => renderBlock(block, i))}
              </article>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-24 self-start space-y-6">
                {/* Table of contents */}
                {headings.length > 0 && (
                  <Card className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-4">
                      In this article
                    </p>
                    <ul className="space-y-2">
                      {headings.map((h, i) => (
                        <li key={i}>
                          <a
                            href={`#${slugify(h.content)}`}
                            className="text-slate text-sm hover:text-cyan transition-colors leading-snug block"
                          >
                            {h.content}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* CTA card */}
                <Card glow className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-3">
                    Ready to act on this?
                  </p>
                  <p className="text-cloud font-display font-bold text-lg mb-2 leading-snug">
                    Ready to put this to work?
                  </p>
                  <p className="text-slate text-sm mb-4">
                    Tell us what you need and get a custom proposal in minutes.
                  </p>
                  <Link href="/build-your-proposal">
                    <Button variant="primary" size="sm">
                      Build Your Proposal
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </Card>

                {/* Author card */}
                <Card className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-3">
                    Written by
                  </p>
                  <p className="text-cloud font-semibold mb-0.5">Gregory Ringler</p>
                  <p className="text-slate text-sm mb-3">Founder at AskSaul.ai</p>
                  <Link
                    href="/about"
                    className="text-cyan text-sm hover:underline flex items-center gap-1"
                  >
                    About Gregory <ArrowRight className="w-3 h-3" />
                  </Link>
                </Card>
              </aside>
            </div>
          </div>
        </section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 px-4 bg-carbon/40">
            <div className="max-w-7xl mx-auto">
              <AnimatedSection>
                <h2 className="font-display text-2xl font-bold text-cloud mb-8">
                  More from the blog
                </h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((related, i) => (
                  <AnimatedSection key={related.slug} delay={i * 100}>
                    <Link href={`/blog/${related.slug}`} className="block group">
                      <Card glow className="p-6 h-full flex flex-col">
                        <div className="mb-3">
                          <Badge variant="cyan">{related.category}</Badge>
                        </div>
                        <h3 className="font-display text-xl font-bold text-cloud mb-3 leading-snug group-hover:text-cyan transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-slate text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
                          {related.excerpt}
                        </p>
                        <div className="mt-auto">
                          <p className="text-dim text-xs mb-3">By Gregory Ringler</p>
                          <div className="flex items-center justify-between">
                            <span className="text-dim text-xs">
                              {related.readTime} &middot; {related.date}
                            </span>
                            <span className="text-cyan flex items-center gap-1 text-sm font-medium">
                              Read <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="pb-24 px-4 pt-16">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="cyan" className="mb-4">
                Get Started
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-cloud mb-4">
                Stop reading about it.
                <span className="text-cyan"> Start building it.</span>
              </h2>
              <p className="text-slate text-lg leading-relaxed mb-8">
                Get a custom proposal for AI automation, a new website, or both. No calls
                required to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="lg">
                    Build Your Proposal
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" size="lg">
                    Send a Message
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </main>
      <Footer />

      {/* JSON-LD BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
