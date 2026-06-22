import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IndustryCard } from "@/components/IndustryCard";
import { getIndustries } from "@/lib/data/industries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("IndustriesPage");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function IndustriesPage() {
  const t = await getTranslations("IndustriesPage");
  const industries = await getIndustries();

  return (
    <div className="py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Container>
    </div>
  );
}
