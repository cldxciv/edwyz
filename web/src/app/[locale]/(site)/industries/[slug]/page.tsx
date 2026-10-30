import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { ServiceCard } from "@/components/ServiceCard";
import { getIndustryBySlug, getIndustrySlugs } from "@/lib/data/industries";
import { getServices } from "@/lib/data/services";
import { AnimatedIconBadge } from "@/components/ui/AnimatedIconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo-core";
import { industrySeo } from "@/lib/data/seo-copy";
import { getCaseStudiesForIndustries } from "@/lib/data/related";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

export function generateStaticParams() {
  return getIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const industry = await getIndustryBySlug(slug);
  if (!industry) return { robots: { index: false } };
  const seo = industrySeo(slug, locale as Locale, industry.name, industry.description);
  return buildMetadata({ locale, path: `/industries/${slug}`, title: seo.title, description: seo.description });
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();

  const t = await getTranslations("IndustryDetailPage");

  const [allServices, relatedCaseStudies] = await Promise.all([
    getServices(),
    getCaseStudiesForIndustries([slug], locale as Locale, 10),
  ]);
  const relatedServices = allServices.filter((s) => industry.relatedServiceSlugs.includes(s.slug));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          locale,
          [
            { name: "Home", path: "" },
            { name: "Industries", path: "/industries" },
            { name: industry.name },
          ],
          `/industries/${slug}`,
        )}
      />
    <div className="py-24">
      <Container className="max-w-4xl">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Industries", href: "/industries" },
            { label: industry.name },
          ]}
        />
        <AnimatedIconBadge id={industry.icon} gradientClassName="bg-gradient-to-br from-purple/20 to-indigo/10 text-purple" />
        <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{t("eyebrow")}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{industry.name}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{industry.description}</p>
        <p className="mt-4 text-base leading-relaxed text-muted/90">{industry.overview}</p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">{t("scheduleConsultation")}</Button>
          <Button href="/industries" variant="secondary">{t("backToAllIndustries")}</Button>
        </div>

        <Reveal className="mt-20 rounded-2xl border border-border bg-surface p-8">
          <h2 className="font-heading text-xl font-semibold">{t("challengesTitle")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-1">
            {industry.challenges.map((challenge, i) => (
              <Reveal key={challenge} delay={i * 0.08} className="flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-purple" />
                {challenge}
              </Reveal>
            ))}
          </div>
        </Reveal>

        {relatedServices.length > 0 && (
          <Reveal className="mt-20">
            <h2 className="font-heading text-xl font-semibold">{t("relatedServices")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {relatedServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </Reveal>
        )}

        {relatedCaseStudies.length > 0 && (
          <Reveal className="mt-20">
            <h2 className="font-heading text-xl font-semibold">{t("relatedCaseStudies")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedCaseStudies.map((cs) => (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="rounded-xl border border-border bg-surface p-5 text-sm text-muted hover:border-cyan/40 hover:text-foreground"
                >
                  {cs.title}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <div className="mt-16 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">{t("talkToOurTeam")}</Button>
          <Button href="/industries" variant="secondary">{t("backToAllIndustries")}</Button>
        </div>
      </Container>
    </div>
    </>
  );
}
