import { Link } from "@/i18n/navigation";
import type { Industry } from "@/lib/data/industries";
import { Icon } from "@/components/ui/Icon";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple/20 to-indigo/10 text-purple">
        <Icon id={industry.icon} size={20} />
      </div>
      <h3 className="mt-5 font-heading text-base font-semibold text-foreground group-hover:text-cyan">
        {industry.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{industry.description}</p>
    </Link>
  );
}
