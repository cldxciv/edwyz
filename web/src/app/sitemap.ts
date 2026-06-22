import type { MetadataRoute } from "next";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { siteConfig } from "@/lib/nav";
import { getPayloadClient } from "@/lib/payload";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient();
  const [{ docs: caseStudies }, { docs: blogPosts }] = await Promise.all([
    payload.find({ collection: "case-studies", limit: 100, depth: 0 }),
    payload.find({ collection: "posts", limit: 100, depth: 0 }),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/industries",
    "/case-studies",
    "/blog",
    "/careers",
    "/contact",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${siteConfig.url}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const industryRoutes = industries.map((i) => ({
    url: `${siteConfig.url}/industries/${i.slug}`,
    lastModified: new Date(),
  }));

  const caseStudyRoutes = caseStudies.map((c) => ({
    url: `${siteConfig.url}/case-studies/${c.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((b) => ({
    url: `${siteConfig.url}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
  }));

  return [...staticRoutes, ...serviceRoutes, ...industryRoutes, ...caseStudyRoutes, ...blogRoutes];
}
