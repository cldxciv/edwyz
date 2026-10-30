import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedIconBadge } from "@/components/ui/AnimatedIconBadge";
import { getIndustryIcon } from "@/lib/contentIcons";
import { getPayloadClient } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CaseStudiesPage" });
  return buildPageMetadata(locale, "/case-studies", { title: t("metaTitle"), description: t("metaDescription") });
}

export const revalidate = 3600;

export default async function CaseStudiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("CaseStudiesPage");
  const locale = await getLocale();
  const payload = await getPayloadClient();
  const { docs: caseStudies } = await payload.find({
    collection: "case-studies",
    where: { _status: { equals: "published" } },
    limit: 50,
    locale,
  });

  return (
    <div className="py-24">
      <Container>
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={(i % 3) * 0.1}>
              <Link
                href={`/case-studies/${cs.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40"
              >
                <AnimatedIconBadge
                  id={getIndustryIcon(cs.industry)}
                  gradientClassName="bg-gradient-to-br from-purple/20 to-indigo/10 text-purple"
                  sizeClassName="h-11 w-11"
                  iconSize={20}
                />
                <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{cs.industry}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{cs.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cs.summary}</p>
                <div className="mt-6 flex gap-6 border-t border-border pt-4">
                  {cs.results.slice(0, 2).map((r: { id?: string | null; label: string; value: string }) => (
                    <div key={r.id ?? r.label}>
                      <p className="font-display text-xl font-bold gradient-text">{r.value}</p>
                      <p className="text-xs text-muted">{r.label}</p>
                    </div>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
