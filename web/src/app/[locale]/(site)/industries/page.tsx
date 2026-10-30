import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IndustryCard } from "@/components/IndustryCard";
import { getIndustries } from "@/lib/data/industries";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "IndustriesPage" });
  return buildPageMetadata(locale, "/industries", { title: t("metaTitle"), description: t("metaDescription") });
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("IndustriesPage");
  const industries = await getIndustries();

  return (
    <div className="py-24">
      <Container>
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="font-heading text-lg font-semibold">{t("introTitle")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("introBody")}</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Container>
    </div>
  );
}
