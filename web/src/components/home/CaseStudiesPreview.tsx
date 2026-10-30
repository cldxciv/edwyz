import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getPayloadClient } from "@/lib/payload";

export async function CaseStudiesPreview() {
  const t = await getTranslations("Home.caseStudiesPreview");
  const locale = await getLocale();
  const payload = await getPayloadClient();
  const { docs: featured } = await payload.find({
    collection: "case-studies",
    where: { _status: { equals: "published" } },
    sort: "-updatedAt",
    limit: 3,
    locale,
  });

  return (
    <section className="border-y border-border/60 bg-surface/40 py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {featured.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-2 hover:border-cyan/50 hover:shadow-[0_0_40px_rgba(34,226,245,0.12),0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden"
            >
              {/* Top glow line */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{cs.industry}</span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground group-hover:text-cyan transition-colors duration-200">{cs.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cs.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan opacity-0 transition-opacity group-hover:opacity-100">
                {t("readCaseStudy")} <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/case-studies" variant="secondary">{t("viewAll")}</Button>
        </div>
      </Container>
    </section>
  );
}
