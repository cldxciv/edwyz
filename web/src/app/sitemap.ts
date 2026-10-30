import type { MetadataRoute } from "next";
import { getServiceSlugs } from "@/lib/data/services";
import { getIndustrySlugs } from "@/lib/data/industries";
import { STATIC_BLOGS } from "@/lib/data/static-blogs";
import lastmodMap from "@/lib/data/lastmod.json";
import { getPayloadClient } from "@/lib/payload";
import { routing, type Locale } from "@/i18n/routing";
import { localizedUrl, staticPageLocales } from "@/lib/seo-core";

export const revalidate = 3600;

type Entry = { path: string; lastModified: Date; locales: readonly Locale[] };

const lastmod = lastmodMap as Record<string, string>;
const fileDate = (key: string) => new Date(lastmod[key]);
const latest = (...dates: Date[]) => new Date(Math.max(...dates.map((d) => d.getTime())));

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/industries",
  "/case-studies",
  "/blog",
  "/careers",
  "/contact",
  "/ai-hub",
  "/faq",
  "/team",
  "/privacy",
  "/terms",
];

type CmsDoc = { slug: string; updatedAt: string; locales: Locale[] };

async function cmsDocs(collection: "posts" | "case-studies"): Promise<CmsDoc[]> {
  const payload = await getPayloadClient();
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const { docs } = await payload.find({
        collection,
        where: { _status: { equals: "published" } },
        limit: 200,
        depth: 0,
        locale,
        fallbackLocale: false,
      });
      return { locale, docs };
    }),
  );
  const bySlug = new Map<string, CmsDoc>();
  for (const { locale, docs } of perLocale) {
    for (const d of docs) {
      if (!d.title) continue;
      const existing: CmsDoc = bySlug.get(d.slug) ?? { slug: d.slug, updatedAt: d.updatedAt, locales: [] };
      existing.locales.push(locale);
      bySlug.set(d.slug, existing);
    }
  }
  return [...bySlug.values()];
}

async function noIndexPaths(): Promise<Set<string>> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "seo-pages",
    where: { noIndex: { equals: true } },
    limit: 200,
    depth: 0,
  });
  return new Set(docs.map((d) => (d.path === "/" ? "" : String(d.path))));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, posts, excluded] = await Promise.all([
    cmsDocs("case-studies"),
    cmsDocs("posts"),
    noIndexPaths(),
  ]);

  const newest = (docs: { updatedAt: string }[]) => docs.map((d) => new Date(d.updatedAt));
  const staticBlogs = STATIC_BLOGS.filter((b) => !posts.some((p) => p.slug === b.slug));

  const pageDate = (path: string) => {
    const base = fileDate(path === "" ? "/" : path);
    if (path === "/blog") {
      return latest(base, ...newest(posts), ...staticBlogs.map((b) => new Date(b.publishedAt)));
    }
    if (path === "/case-studies") return latest(base, ...newest(caseStudies));
    return base;
  };

  const entries: Entry[] = [
    ...STATIC_PATHS.map((path) => ({ path, lastModified: pageDate(path), locales: staticPageLocales(path) })),
    ...getServiceSlugs().map((slug) => ({
      path: `/services/${slug}`,
      lastModified: fileDate("/services/*"),
      locales: routing.locales,
    })),
    ...getIndustrySlugs().map((slug) => ({
      path: `/industries/${slug}`,
      lastModified: fileDate("/industries/*"),
      locales: routing.locales,
    })),
    ...caseStudies.map((c) => ({
      path: `/case-studies/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      locales: c.locales,
    })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastModified: new Date(p.updatedAt), locales: p.locales })),
    ...staticBlogs.map((b) => ({
      path: `/blog/${b.slug}`,
      lastModified: new Date(b.publishedAt),
      locales: ["en"] as Locale[],
    })),
  ].filter((e) => !excluded.has(e.path));

  return entries.flatMap(({ path, lastModified, locales }) => {
    const languages: Record<string, string> = {};
    if (locales.length > 1 && locales.includes("en")) {
      for (const l of locales) languages[l] = localizedUrl(l, path);
      languages["x-default"] = localizedUrl("en", path);
    }
    return locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      ...(Object.keys(languages).length ? { alternates: { languages } } : {}),
    }));
  });
}
