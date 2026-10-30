import { Link } from "@/i18n/navigation";
import type { Industry } from "@/lib/data/industries";
import { Icon } from "@/components/ui/Icon";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-2 hover:border-purple/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.14),0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
