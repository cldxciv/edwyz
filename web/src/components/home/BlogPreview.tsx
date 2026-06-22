import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getPayloadClient } from "@/lib/payload";

export async function BlogPreview() {
  const t = await getTranslations("Home.blogPreview");
  const locale = await getLocale();
  const payload = await getPayloadClient();
  const { docs: blogPosts } = await payload.find({ collection: "posts", sort: "-publishedAt", limit: 3, locale });

  return (
    <section className="border-y border-border/60 bg-surface/40 py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{post.category}</span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground group-hover:text-cyan">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                <span>{post.author}</span>
                <span>{post.readingTime}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/blog" variant="secondary">{t("readMore")}</Button>
        </div>
      </Container>
    </section>
  );
}
