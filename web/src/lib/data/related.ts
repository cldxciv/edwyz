import type { Locale } from "@/i18n/routing";
import { getPayloadClient } from "@/lib/payload";
import { getIndustriesInLocale } from "@/lib/data/industries";

/** Case studies store `industry` as free text (English by default), so matching is done against the English names. */
export async function getCaseStudiesForIndustries(industrySlugs: string[], locale: Locale, limit = 6) {
  const names = getIndustriesInLocale("en")
    .filter((i) => industrySlugs.includes(i.slug))
    .map((i) => i.name);
  if (names.length === 0) return [];
  const payload = await getPayloadClient();
  const { docs: matches } = await payload.find({
    collection: "case-studies",
    where: { industry: { in: names }, _status: { equals: "published" } },
    limit,
    depth: 0,
    locale: "en",
    sort: "-updatedAt",
  });
  if (matches.length === 0) return [];
  const { docs } = await payload.find({
    collection: "case-studies",
    where: { id: { in: matches.map((m) => m.id) }, _status: { equals: "published" } },
    limit,
    depth: 0,
    locale,
    sort: "-updatedAt",
  });
  return docs;
}

export function industriesForService(serviceSlug: string): string[] {
  return getIndustriesInLocale("en")
    .filter((i) => i.relatedServiceSlugs.includes(serviceSlug))
    .map((i) => i.slug);
}
