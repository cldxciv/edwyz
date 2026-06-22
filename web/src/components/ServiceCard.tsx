import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/data/services";
import { Icon } from "@/components/ui/Icon";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_0_30px_rgba(34,226,245,0.08)]"
    >
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
