import type { MetadataRoute } from "next";
import { execFileSync } from "node:child_process";
import { BLOG_POSTS } from "@/lib/blog-data";
import { CASE_STUDIES } from "@/lib/case-studies";
import { PAGES, SITE_URL } from "@/lib/seo";

/** Last commit date of a file, so lastmod reflects real edits instead of build time. */
function lastCommit(file: string): Date | undefined {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { encoding: "utf8" }).trim();
    return out ? new Date(out) : undefined;
  } catch {
    return undefined;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.entries(PAGES).map(([path, p]) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: lastCommit(p.source),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const studies = CASE_STUDIES.map((study) => ({
    url: `${SITE_URL}/case-studies/${study.slug}`,
    lastModified: lastCommit("lib/case-studies.ts"),
    changeFrequency: "monthly" as const,
    priority: study.comingSoon ? 0.3 : 0.7,
  }));

  return [...pages, ...posts, ...studies];
}
