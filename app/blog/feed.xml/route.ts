import { BLOG_POSTS } from "@/lib/blog-data";

export async function GET() {
  const baseUrl = "https://asksaul.ai";

  const items = BLOG_POSTS.map(
    (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>saul3000bot@gmail.com (Gregory Ringler)</author>
      <category>${post.category}</category>
    </item>`
  ).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AskSaul.ai Blog</title>
    <link>${baseUrl}/blog</link>
    <description>AI automation, web development, and marketing insights for businesses ready to stop duct-taping their tech together.</description>
    <language>en-us</language>
    <managingEditor>saul3000bot@gmail.com (Gregory Ringler)</managingEditor>
    <webMaster>saul3000bot@gmail.com (Gregory Ringler)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(feed.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
