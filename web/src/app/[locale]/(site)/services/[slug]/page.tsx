import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Compass, PenTool, Hammer, Rocket } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ServiceCard";
import { IndustryCard } from "@/components/IndustryCard";
import { getServiceBySlug, getServiceSlugs, getServices } from "@/lib/data/services";
import { getIndustries } from "@/lib/data/industries";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORG_ID, breadcrumbJsonLd, buildMetadata, localizedUrl } from "@/lib/seo-core";
import { serviceSeo } from "@/lib/data/seo-copy";
import { getCaseStudiesForIndustries, industriesForService } from "@/lib/data/related";
import { relatedServiceSlugs } from "@/lib/data/service-links";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const service = await getServiceBySlug(slug);
  if (!service) return { robots: { index: false } };
  const seo = serviceSeo(slug, locale as Locale, service.name, service.short);
  return buildMetadata({ locale, path: `/services/${slug}`, title: seo.title, description: seo.description });
}

const SERVICE_GUIDES: Record<string, { slug: string; title: string }> = {
  "ai-visibility-discovery": {
    slug: "ai-brand-discovery-chatgpt-advertising-aeo",
    title: "Why Brands Must Become AI-Discoverable",
  },
};

const PROCESS_STEPS = [
  { key: "discover", icon: Compass },
  { key: "design", icon: PenTool },
  { key: "build", icon: Hammer },
  { key: "scale", icon: Rocket },
] as const;

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations("ServiceDetailPage");
  const [allServices, industries, relatedCaseStudies] = await Promise.all([
    getServices(),
    getIndustries(),
    getCaseStudiesForIndustries(industriesForService(slug), locale as Locale, 4),
  ]);
  const topical = relatedServiceSlugs(slug)
    .map((r) => allServices.find((s) => s.slug === r))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedServices = topical.length ? topical : allServices.filter((s) => s.slug !== slug).slice(0, 3);
  const relevantIndustries = industries.filter((i) => i.relatedServiceSlugs.includes(slug));

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: localizedUrl(locale, `/services/${slug}`),
    provider: { "@id": ORG_ID },
    "@id": `${localizedUrl(locale, `/services/${slug}`)}#service`,
    serviceType: service.name,
    areaServed: "Worldwide",
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd
        data={breadcrumbJsonLd(
          locale,
          [
            { name: "Home", path: "" },
            { name: "Services", path: "/services" },
            { name: service.name },
          ],
          `/services/${slug}`,
        )}
      />
    <div className="py-24">
      <Container className="max-w-4xl">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.name },
          ]}
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-electric/20 to-cyan/10 text-cyan">
          <Icon id={service.icon} size={26} />
        </div>
        <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{t("eyebrow")}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{service.name}</h1>
        <p className="mt-5 text-xl font-medium text-foreground/90">{service.short}</p>
        <p className="mt-4 text-lg leading-relaxed text-muted">{service.description}</p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">{t("scheduleConsultation")}</Button>
          <Button href="/case-studies" variant="secondary">{t("exploreCaseStudies")}</Button>
        </div>

        <div className="mt-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{t("processEyebrow")}</span>
          <h2 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">{t("processTitle")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="relative rounded-2xl border border-border bg-surface p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electric/20 to-cyan/10 text-cyan">
                      <Icon size={18} />
                    </div>
                    <span className="font-display text-sm font-bold text-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                    {t(`process.${step.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`process.${step.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 rounded-2xl border border-border bg-surface p-8">
          <h2 className="font-heading text-xl font-semibold">{t("whatWeDeliver")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {service.capabilities.map((c) => (
              <div key={c} className="flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-4 text-sm text-muted">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan" />
                {c}
              </div>
            ))}
          </div>
        </div>

        {SERVICE_GUIDES[slug] && (
          <div className="mt-20 rounded-2xl border border-border bg-surface p-6 text-sm">
            <Link href={`/blog/${SERVICE_GUIDES[slug].slug}`} className="font-semibold text-cyan hover:underline">
              {t("relatedGuide")}: {SERVICE_GUIDES[slug].title}
            </Link>
          </div>
        )}

        {relatedCaseStudies.length > 0 && (
          <div className="mt-20">
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
          </div>
        )}

        {relevantIndustries.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-xl font-semibold">{t("industriesWeServe")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relevantIndustries.map((industry) => (
                <IndustryCard key={industry.slug} industry={industry} />
              ))}
            </div>
          </div>
        )}

        {relatedServices.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-xl font-semibold">{t("relatedServices")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {relatedServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">{t("scheduleConsultation")}</Button>
          <Button href="/services" variant="secondary">{t("backToAllServices")}</Button>
        </div>
      </Container>
    </div>
    </>
  );
}
