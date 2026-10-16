// Runs automatically after every successful Netlify deploy (the file name is
// the event). On production deploys it tells IndexNow (Bing, Yandex, Seznam,
// Naver; Bing powers ChatGPT search and Copilot) which pages changed.
const SITE = "https://asksaul.ai";
const KEY = "d08a6379230c18ffe1d22a7d38af7a63"; // served at /<KEY>.txt, public by design
const RECENT_MS = 36 * 60 * 60 * 1000;

type DeployPayload = { context?: string; branch?: string; id?: string };

export function changedUrls(sitemapXml: string, now = Date.now()): string[] {
  const urls: string[] = [];
  for (const block of sitemapXml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (!loc) continue;
    // No lastmod means we can't tell, so submit it.
    if (!lastmod || now - new Date(lastmod).getTime() < RECENT_MS) urls.push(loc);
  }
  return urls;
}

export default async (req: Request) => {
  const body = (await req.json().catch(() => ({}))) as { payload?: DeployPayload };
  const deploy = body.payload ?? {};
  if (deploy.context !== "production") {
    console.log(`[indexnow] skipped: ${deploy.context ?? "unknown"} deploy`);
    return new Response("skipped");
  }

  const xml = await (await fetch(`${SITE}/sitemap.xml`, { headers: { "Cache-Control": "no-cache" } })).text();
  const urlList = changedUrls(xml);
  if (!urlList.length) {
    console.log("[indexnow] no recently changed URLs");
    return new Response("nothing to submit");
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: "asksaul.ai", key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  console.log(`[indexnow] deploy ${deploy.id}: submitted ${urlList.length} URLs -> ${res.status}`);
  return new Response(`submitted ${urlList.length}: ${res.status}`);
};
