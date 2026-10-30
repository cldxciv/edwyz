import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted">
      {crumbs.map((crumb, i) => (
        <Fragment key={crumb.label}>
          {i > 0 && <ChevronRight size={12} className="shrink-0 opacity-50" />}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground">{crumb.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
