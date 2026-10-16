// Submits every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam,
// Naver; Bing powers ChatGPT search and Copilot). Run after a deploy:
//   npm run seo:indexnow
const SITE = "https://asksaul.ai";
const KEY = "d08a6379230c18ffe1d22a7d38af7a63"; // also served at /${KEY}.txt (public by design)

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "asksaul.ai", key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs -> ${res.status} ${res.statusText}`);
