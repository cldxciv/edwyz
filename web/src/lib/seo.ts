import { getPayloadClient } from "@/lib/payload";
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { buildMetadata, staticPageLocales, type MetaOptions } from "@/lib/seo-core";

export * from "@/lib/seo-core";

/** Static pages: looks up an optional CMS override (seo-pages collection) by path, then builds metadata. */
export async function buildPageMetadata(
  locale: string,
  path: string,
  fallback: { title: string; description: string },
  opts: Partial<Omit<MetaOptions, "locale" | "path" | "title" | "description">> = {},
): Promise<Metadata> {
  let override: Awaited<ReturnType<typeof findOverride>>;
  try {
    override = await findOverride(path, locale);
  } catch {
    override = undefined;
  }
  const ogImage =
    override?.ogImage && typeof override.ogImage === "object" ? (override.ogImage.url ?? undefined) : undefined;
  return buildMetadata({
    ...opts,
    locale,
    path: override?.canonicalPath || path,
    title: override?.metaTitle || fallback.title,
    description: override?.metaDescription || fallback.description,
    locales: opts.locales ?? staticPageLocales(path),
    source: override?.metaDescription ? "cms" : (opts.source ?? "code"),
    noIndex: override?.noIndex ?? opts.noIndex ?? undefined,
    image: ogImage ?? opts.image,
  });
}

async function findOverride(path: string, locale: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "seo-pages",
    where: { path: { equals: path || "/" } },
    limit: 1,
    locale: locale as Locale,
  });
  return docs[0] as (typeof docs)[number] | undefined;
}

/** Locales in which a CMS document actually has translated content (no fallback to English). */
export async function cmsTranslatedLocales(collection: "posts" | "case-studies", slug: string): Promise<Locale[]> {
  const payload = await getPayloadClient();
  const hits = await Promise.all(
    routing.locales.map(async (l) => {
      const { docs } = await payload.find({
        collection,
        where: { slug: { equals: slug }, _status: { equals: "published" } },
        limit: 1,
        depth: 0,
        locale: l,
        fallbackLocale: false,
      });
      return docs[0]?.title ? l : null;
    }),
  );
  return hits.filter((l): l is Locale => l !== null);
}

