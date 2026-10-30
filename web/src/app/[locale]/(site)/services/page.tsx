import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/data/services";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  return buildPageMetadata(locale, "/services", { title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("ServicesPage");
  const services = await getServices();

  return (
    <div className="py-24">
      <Container>
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </div>
  );
}
