"use client";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedIconBadge } from "@/components/ui/AnimatedIconBadge";
import { getCategoryIcon } from "@/lib/contentIcons";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readingTime: string;
};

export function BlogClient({
  posts,
  categories,
  allLabel,
}: {
  posts: Post[];
  categories: string[];
  allLabel: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <>
      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
            active === null
              ? "border-cyan bg-cyan/10 text-cyan"
              : "border-border text-muted hover:border-cyan/40 hover:text-foreground"
          }`}
        >
          {allLabel}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat === active ? null : cat)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              active === cat
                ? "border-cyan bg-cyan/10 text-cyan"
                : "border-border text-muted hover:border-cyan/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {filtered.map((post, i) => (
          <Reveal key={post.slug} delay={(i % 3) * 0.08}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40"
            >
              <AnimatedIconBadge
                id={getCategoryIcon(post.category)}
                gradientClassName="bg-gradient-to-br from-cyan/20 to-indigo/10 text-cyan"
                sizeClassName="h-11 w-11"
                iconSize={20}
              />
              <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                {post.category}
              </span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground group-hover:text-cyan">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                <span>{post.author}</span>
                <span>{post.readingTime}</span>
              </div>
            </Link>
          </Reveal>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 py-12 text-center text-muted">No posts in this category yet.</p>
        )}
      </div>
    </>
  );
}
