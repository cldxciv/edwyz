import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getPayloadClient } from "@/lib/payload";
import { STATIC_BLOGS } from "@/lib/data/static-blogs";

export async function BlogPreview() {
  const t = await getTranslations("Home.blogPreview");
  const locale = await getLocale();
  const payload = await getPayloadClient();
  const { docs: cmsPosts } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 3,
    locale,
  });

  const cmsSlugs = new Set(cmsPosts.map((p) => p.slug));
  const blogPosts = [...cmsPosts, ...STATIC_BLOGS.filter((b) => !cmsSlugs.has(b.slug))]
    .sort((x, y) => new Date(y.publishedAt).getTime() - new Date(x.publishedAt).getTime())
    .slice(0, 3);

  const categoryColors: Record<string, string> = {
    "AI & Machine Learning": "text-cyan",
    "Data Engineering": "text-purple",
    "Cloud Infrastructure": "text-electric",
  };

  return (
    <section className="relative border-y border-border/60 bg-surface/40 py-24 overflow-hidden">
      {/* Animated grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-15"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,226,245,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,226,245,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post) => {
            const catColor = categoryColors[post.category ?? ""] ?? "text-cyan";
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-2 hover:border-cyan/40 hover:shadow-[0_0_40px_rgba(34,226,245,0.1),0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden"
              >
                {/* Top glow line */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${catColor}`}>
                  {post.category}
                </span>
                <h3 className="mt-3 flex-1 font-heading text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-cyan">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                  <span>{post.author}</span>
                  <div className="flex items-center gap-1">
                    <span>{post.readingTime}</span>
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan group-hover:opacity-100"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/blog" variant="secondary">{t("readMore")}</Button>
        </div>
      </Container>
    </section>
  );
}
