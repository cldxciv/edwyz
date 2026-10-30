import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/data/services";
import { Icon } from "@/components/ui/Icon";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-2 hover:border-cyan/50 hover:shadow-[0_0_40px_rgba(34,226,245,0.14),0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden"
    >
      {/* Animated top-edge glow line */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-electric/20 to-cyan/10 text-cyan">
          <Icon id={service.icon} size={20} />
        </div>
        <ArrowUpRight
          size={18}
          className="text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan group-hover:opacity-100"
        />
      </div>
      <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{service.short}</p>
    </Link>
  );
}
