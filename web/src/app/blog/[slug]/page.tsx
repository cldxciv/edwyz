import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/blog";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="py-24">
      <Container className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{post.category}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
        <div className="mt-4 flex gap-4 text-sm text-muted">
          <span>{post.author}</span>
          <span>&middot;</span>
          <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>

        <div className="mt-10 space-y-6">
          {post.content.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted">{paragraph}</p>
          ))}
        </div>

        <div className="mt-12">
          <Button href="/blog" variant="secondary">Back to Blog</Button>
        </div>
      </Container>
    </div>
  );
}
