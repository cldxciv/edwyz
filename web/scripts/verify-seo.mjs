// Usage: node scripts/verify-seo.mjs http://localhost:3400
// Crawls every URL in /sitemap.xml and checks canonical, hreflang, titles, descriptions, OG/Twitter and JSON-LD.
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const SITE = "https://www.edwyz.com";
const local = (u) => u.replace(SITE, base);
const prod = (u) => u.replace(base, SITE);

const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
  const block = m[1];
  const loc = block.match(/<loc>(.*?)<\/loc>/)[1];
  const alts = Object.fromEntries(
    [...block.matchAll(/<xhtml:link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map((a) => [a[1], a[2]]),
  );
  const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
  return { loc, alts, lastmod };
});

const attr = (html, re) => html.match(re)?.[1]?.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const meta = (html, key) =>
  attr(html, new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]+content="([^"]*)"`)) ??
  attr(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${key}"`));

const problems = [];
const bad = (url, msg) => problems.push(`${url}\n    ${msg}`);
const kinds = {};

for (const e of entries) {
  const res = await fetch(local(e.loc), { redirect: "manual" });
  if (res.status !== 200) {
    bad(e.loc, `status ${res.status}`);
    continue;
  }
  const html = await res.text();
  const title = attr(html, /<title>([\s\S]*?)<\/title>/);
  const desc = meta(html, "description");
  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  const hreflangs = Object.fromEntries(
    [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map((m) => [m[1], m[2]]),
  );

  if (!title || title.length > 60) bad(e.loc, `title ${title?.length}: ${title}`);
  if (!desc || desc.length > 155) bad(e.loc, `description ${desc?.length}`);
  else if (desc.length < 120 && !/\/(faq|team|privacy)$/.test(e.loc)) bad(e.loc, `description short ${desc.length}`);
  if (canonical !== e.loc) bad(e.loc, `canonical ${canonical} != url`);
  if (canonical && (/\/$/.test(canonical) || !canonical.startsWith(SITE))) bad(e.loc, `canonical shape ${canonical}`);
  if (meta(html, "og:title") !== title) bad(e.loc, `og:title mismatch`);
  if (meta(html, "og:description") !== desc) bad(e.loc, `og:description mismatch`);
  if (meta(html, "og:url") !== canonical) bad(e.loc, `og:url mismatch ${meta(html, "og:url")}`);
  if (meta(html, "twitter:title") !== title) bad(e.loc, `twitter:title mismatch`);
  if (meta(html, "twitter:description") !== desc) bad(e.loc, `twitter:description mismatch`);
  if (meta(html, "og:image:width") !== "1200" || meta(html, "og:image:height") !== "630") bad(e.loc, `og:image size`);
  if (/noindex/.test(meta(html, "robots") ?? "")) bad(e.loc, `noindex while in sitemap`);

  const same = JSON.stringify(Object.entries(hreflangs).sort()) === JSON.stringify(Object.entries(e.alts).sort());
  if (!same) bad(e.loc, `hreflang head ${JSON.stringify(hreflangs)} != sitemap ${JSON.stringify(e.alts)}`);
  if (Object.keys(e.alts).length && e.alts["x-default"] !== `${SITE}/en${new URL(e.loc).pathname.replace(/^\/[a-z]{2}/, "")}`) {
    bad(e.loc, `x-default wrong`);
  }
  if (res.headers.get("set-cookie")) bad(e.loc, `set-cookie header present`);
  if (!/s-maxage/.test(res.headers.get("cache-control") ?? "")) bad(e.loc, `cache-control ${res.headers.get("cache-control")}`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const types = [];
  for (const b of blocks) {
    try {
      const j = JSON.parse(b);
      for (const n of j["@graph"] ?? [j]) types.push(n["@type"]);
    } catch {
      bad(e.loc, "invalid JSON-LD");
    }
  }
  if (types.filter((t) => t === "Organization").length !== 1) bad(e.loc, `Organization count ${types.filter((t) => t === "Organization").length}`);
  if (types.filter((t) => t === "WebSite").length !== 1) bad(e.loc, `WebSite count ${types.filter((t) => t === "WebSite").length}`);
  const path = new URL(e.loc).pathname.replace(/^\/[a-z]{2}/, "");
  const detail = /^\/(services|industries|case-studies|blog)\/[^/]+$/.test(path);
  if (detail && !types.includes("BreadcrumbList")) bad(e.loc, "missing BreadcrumbList");
  if (/^\/(blog|case-studies)\//.test(path) && !types.includes("Article")) bad(e.loc, "missing Article");
  if (/^\/services\//.test(path) && !types.includes("Service")) bad(e.loc, "missing Service");
  if (path === "/faq" && !types.includes("FAQPage")) bad(e.loc, "missing FAQPage");
  kinds[path.split("/")[1] || "home"] = (kinds[path.split("/")[1] || "home"] ?? 0) + 1;
}

console.log(`Checked ${entries.length} sitemap URLs`, kinds);
console.log(problems.length ? `${problems.length} problem(s):\n${problems.join("\n")}` : "No problems found.");
process.exit(problems.length ? 1 : 0);
