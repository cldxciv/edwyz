import { getPayloadClient } from "@/lib/payload";
import { siteConfig } from "@/lib/nav";

function esc(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const revalidate = 3600;

export async function GET() {
  const payload = await getPayloadClient();
  const { docs: posts } = await payload.find({
    collection: "posts",
    sort: "-publishedAt",
    limit: 50,
    locale: "en",
  });

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${siteConfig.url}/en/blog/${p.slug}</link>
      <description>${esc(p.excerpt)}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteConfig.url}/en/blog/${p.slug}</guid>
      <category>${esc(p.category)}</category>
      <author>${esc(p.author)}</author>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.name)} Blog</title>
    <link>${siteConfig.url}/en/blog</link>
    <description>AI, software, and data engineering insights from ${esc(siteConfig.name)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
