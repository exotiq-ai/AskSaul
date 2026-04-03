import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "AI automation tips, web development insights, and business growth strategies from Gregory Ringler.",
  openGraph: {
    title: "Blog | AskSaul.ai",
    description:
      "AI automation tips, web development insights, and business growth strategies.",
    url: "https://asksaul.ai/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 dot-pattern">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <Badge variant="cyan" className="mb-4">
                Blog
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-cloud mb-5 leading-tight">
                Straight talk about AI, automation,
                <br className="hidden sm:block" />
                <span className="text-cyan"> and building things that work.</span>
              </h1>
              <p className="text-slate text-lg leading-relaxed max-w-2xl">
                No hype. No filler. Just practical insights on what AI can actually do for
                your business, how to automate the right things, and what it takes to build
                software that holds up.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_POSTS.map((post, i) => (
                <AnimatedSection key={post.slug} delay={i * 80}>
                  <Link href={`/blog/${post.slug}`} className="block h-full group">
                    <Card glow className="p-6 h-full flex flex-col">
                      <div className="mb-3">
                        <Badge variant="cyan">{post.category}</Badge>
                      </div>

                      <h2 className="font-display text-xl font-bold text-cloud mb-3 leading-snug group-hover:text-cyan transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-slate text-base line-clamp-3 leading-relaxed mb-4 flex-1">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto">
                        <p className="text-dim text-xs mb-3">By Gregory Ringler</p>
                        <div className="flex items-center justify-between">
                          <span className="text-dim text-xs">
                            {post.readTime} &middot; {post.date}
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
      </main>
      <Footer />
    </>
  );
}
