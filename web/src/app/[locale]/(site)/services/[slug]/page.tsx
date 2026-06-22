import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Compass, PenTool, Hammer, Rocket } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ServiceCard";
import { IndustryCard } from "@/components/IndustryCard";
import { getServiceBySlug, getServiceSlugs, getServices } from "@/lib/data/services";
import { getIndustries } from "@/lib/data/industries";

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
  };
}

const PROCESS_STEPS = [
  { key: "discover", icon: Compass },
  { key: "design", icon: PenTool },
  { key: "build", icon: Hammer },
  { key: "scale", icon: Rocket },
] as const;

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations("ServiceDetailPage");
  const [allServices, industries] = await Promise.all([getServices(), getIndustries()]);
  const relatedServices = allServices.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="py-24">
      <Container className="max-w-4xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{t("eyebrow")}</span>
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

        <div className="mt-20">
          <h2 className="font-heading text-xl font-semibold">{t("industriesWeServe")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <IndustryCard key={industry.slug} industry={industry} />
            ))}
          </div>
        </div>

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
  );
}
