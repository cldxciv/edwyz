import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedIconBadge } from "@/components/ui/AnimatedIconBadge";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { getCategoryIcon } from "@/lib/contentIcons";
import { getPayloadClient } from "@/lib/payload";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostCta } from "@/components/blog/PostCta";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, localizedUrl } from "@/lib/seo-core";
import { cmsTranslatedLocales } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { STATIC_BLOGS, type ContentBlock } from "@/lib/data/static-blogs";
import Image from "next/image";

export const revalidate = 3600;

type PostData = {
  _static: boolean;
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  excerpt: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  coverAlt?: string;
  author: string;
  readingTime: string;
  publishedAt: string;
  updatedAt?: string;
  content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    limit: 100,
    depth: 0,
  });
  const cmsSlugs = docs.map((p) => ({ slug: p.slug }));
  const staticSlugs = STATIC_BLOGS.map((b) => ({ slug: b.slug }));
  const seen = new Set(cmsSlugs.map((s) => s.slug));
  return [...cmsSlugs, ...staticSlugs.filter((s) => !seen.has(s.slug))];
}

async function getPost(slug: string, locale: string): Promise<PostData | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug }, _status: { equals: "published" } },
    limit: 1,
    locale,
  });
  if (docs[0]) return { ...docs[0], _static: false } as unknown as PostData;
  const staticPost = STATIC_BLOGS.find((b) => b.slug === slug);
  return staticPost ? { ...staticPost, updatedAt: staticPost.updatedAt ?? staticPost.publishedAt, _static: true } as PostData : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const post = await getPost(slug, locale);
  if (!post) return { robots: { index: false } };
  const locales = post._static ? (["en"] as Locale[]) : await cmsTranslatedLocales("posts", slug);
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    source: post.seoDescription ? "code" : "cms",
    type: "article",
    image: post.coverImage,
    imageAlt: post.coverAlt ?? post.title,
    locales: locales.length ? locales : (["en"] as Locale[]),
    keywords: post.tags,
    article: {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      section: post.category,
    },
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const post = await getPost(slug, locale);
  if (!post) notFound();

  const t = await getTranslations("BlogPostPage");

  const payload = await getPayloadClient();
  const { docs: cmsRelated } = await payload.find({
    collection: "posts",
    where: { slug: { not_equals: slug }, _status: { equals: "published" } },
    limit: 10,
    locale,
  });
  const relatedPosts: { slug: string; title: string; category: string }[] = [
    ...cmsRelated.map((p) => ({ slug: p.slug, title: p.title, category: p.category })),
    ...STATIC_BLOGS.filter((b) => b.slug !== slug && !cmsRelated.some((p) => p.slug === b.slug)).map((b) => ({
      slug: b.slug,
      title: b.title,
      category: b.category,
    })),
  ]
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const pageUrl = localizedUrl(locale, `/blog/${slug}`);

  const articleSchema = articleJsonLd({
    locale,
    path: `/blog/${slug}`,
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ?? "",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    authorName: post.author,
    keywords: post.tags,
    section: post.category,
  });

  return (
    <>
      <ReadingProgress />
      <JsonLd data={articleSchema} />
      <JsonLd
        data={breadcrumbJsonLd(
          locale,
          [
            { name: "Home", path: "" },
            { name: "Blog", path: "/blog" },
            { name: post.title },
          ],
          `/blog/${slug}`,
        )}
      />
      <div className="py-24">
        <Container className="max-w-2xl">
          <Breadcrumbs
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <AnimatedIconBadge
            id={getCategoryIcon(post.category)}
            gradientClassName="bg-gradient-to-br from-cyan/20 to-indigo/10 text-cyan"
          />
          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            {post.category}
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 text-sm text-muted">
              <span>{post.author}</span>
              <span>&middot;</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {post.updatedAt && new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 86400000 && (
                <>
                  <span>&middot;</span>
                  <span>
                    Updated{" "}
                    {new Date(post.updatedAt).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </>
              )}
              <span>&middot;</span>
              <span>{post.readingTime}</span>
            </div>
            <ShareButtons url={pageUrl} title={post.title} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.coverImage && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <Image
                src={post.coverImage}
                alt={post.coverAlt ?? post.title}
                width={800}
                height={420}
                className="w-full object-cover"
                priority
              />
            </div>
          )}

          <Reveal className="prose prose-invert mt-10 max-w-none space-y-6 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:text-muted [&_p]:leading-relaxed [&_p]:text-muted">
            {(post as { _static?: boolean })._static ? (
              <div className="space-y-6">
                {(post.content as ContentBlock[]).map((block, i) => {
                  if (block.type === "image") {
                    return (
                      <figure key={i} className="my-8">
                        <Image
                          src={block.src}
                          alt={block.alt}
                          width={800}
                          height={450}
                          className="w-full rounded-xl border border-border object-cover"
                        />
                        {block.caption && (
                          <figcaption className="mt-3 text-center text-xs text-muted">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  if (block.type === "callout") {
                    const text = block.children.map((c) => c.text).join("");
                    return (
                      <blockquote
                        key={i}
                        className="my-6 rounded-xl border border-cyan/20 bg-cyan/5 px-6 py-5 text-base font-medium leading-relaxed text-foreground"
                      >
                        {text}
                      </blockquote>
                    );
                  }
                  if (block.type === "heading") {
                    const text = block.children.map((c) => c.text).join("");
                    if (block.tag === "h3") return <h3 key={i}>{text}</h3>;
                    return <h2 key={i}>{text}</h2>;
                  }
                  return (
                    <p key={i}>
                      {block.children.map((c, j) =>
                        c.href?.startsWith("http") ? (
                          <a
                            key={j}
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan underline underline-offset-2 hover:text-foreground"
                          >
                            {c.text}
                          </a>
                        ) : c.href ? (
                          <Link key={j} href={c.href} className="text-cyan underline underline-offset-2 hover:text-foreground">
                            {c.text}
                          </Link>
                        ) : (
                          c.text
                        ),
                      )}
                    </p>
                  );
                })}
              </div>
            ) : (
              <RichText data={post.content as Parameters<typeof RichText>[0]["data"]} />
            )}
          </Reveal>

          <PostCta postSlug={slug} />

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button href="/blog" variant="secondary">
              {t("backToBlog")}
            </Button>
            <ShareButtons url={pageUrl} title={post.title} />
          </div>

          {relatedPosts.length > 0 && (
            <Reveal className="mt-20 border-t border-border pt-12">
              <h2 className="font-heading text-xl font-semibold">{t("relatedArticles")}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="rounded-xl border border-border bg-surface p-4 text-sm hover:border-cyan/40"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                      {p.category}
                    </span>
                    <p className="mt-2 font-heading font-semibold text-foreground">{p.title}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </Container>
      </div>
    </>
  );
}
