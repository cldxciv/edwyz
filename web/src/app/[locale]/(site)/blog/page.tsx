import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlogClient } from "@/components/blog/BlogClient";
import { getPayloadClient } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/seo";
import { STATIC_BLOGS } from "@/lib/data/static-blogs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BlogPage" });
  return buildPageMetadata(locale, "/blog", { title: t("metaTitle"), description: t("metaDescription") });
}

export const revalidate = 3600;

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("BlogPage");
  const locale = await getLocale();
  const payload = await getPayloadClient();

  const { docs: cmsPosts } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 100,
    locale,
  });

  const cmsSlugs = new Set(cmsPosts.map((p) => p.slug));
  const posts = [
    ...cmsPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      author: p.author,
      readingTime: p.readingTime,
      publishedAt: p.publishedAt,
    })),
    ...STATIC_BLOGS.filter((b) => !cmsSlugs.has(b.slug)).map((b) => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      author: b.author,
      readingTime: b.readingTime,
      publishedAt: b.publishedAt,
    })),
  ]
    .sort((x, y) => new Date(y.publishedAt).getTime() - new Date(x.publishedAt).getTime())
    .map(({ publishedAt, ...rest }) => (void publishedAt, rest));

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))];

  return (
    <div className="py-24">
      <Container>
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} />
        <BlogClient
          posts={posts}
          categories={categories}
          allLabel={t("allPosts") ?? "All Posts"}
        />
      </Container>
    </div>
  );
}
