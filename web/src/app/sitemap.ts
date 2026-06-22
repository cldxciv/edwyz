import type { MetadataRoute } from "next";
import { getServiceSlugs } from "@/lib/data/services";
import { getIndustrySlugs } from "@/lib/data/industries";
import { siteConfig } from "@/lib/nav";
import { getPayloadClient } from "@/lib/payload";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient();
  const [{ docs: caseStudies }, { docs: blogPosts }] = await Promise.all([
    payload.find({ collection: "case-studies", limit: 100, depth: 0 }),
    payload.find({ collection: "posts", limit: 100, depth: 0 }),
  ]);

  const staticPaths = ["", "/about", "/services", "/industries", "/case-studies", "/blog", "/careers", "/contact"];
  const servicePaths = getServiceSlugs().map((slug) => `/services/${slug}`);
  const industryPaths = getIndustrySlugs().map((slug) => `/industries/${slug}`);
  const caseStudyPaths = caseStudies.map((c) => `/case-studies/${c.slug}`);
  const blogPaths = blogPosts.map((b) => `/blog/${b.slug}`);

  const allPaths = [...staticPaths, ...servicePaths, ...industryPaths, ...caseStudyPaths, ...blogPaths];

  return routing.locales.flatMap((locale) =>
    allPaths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: new Date(),
    })),
  );
}
