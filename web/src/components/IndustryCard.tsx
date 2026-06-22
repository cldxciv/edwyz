import Link from "next/link";
import type { Industry } from "@/lib/data/industries";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple/40"
    >
      <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-cyan">
        {industry.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{industry.description}</p>
    </Link>
  );
}
