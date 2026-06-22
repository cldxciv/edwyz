import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "posts", limit: 100, depth: 0 });
  return docs.map((p) => ({ slug: p.slug }));
}

async function getPost(slug: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return docs[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="py-24">
      <Container className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{post.category}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
        <div className="mt-4 flex gap-4 text-sm text-muted">
          <span>{post.author}</span>
          <span>&middot;</span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>

        <div className="prose prose-invert mt-10 max-w-none space-y-6 [&_p]:leading-relaxed [&_p]:text-muted">
          <RichText data={post.content} />
        </div>

        <div className="mt-12">
          <Button href="/blog" variant="secondary">Back to Blog</Button>
        </div>
      </Container>
    </div>
  );
}
