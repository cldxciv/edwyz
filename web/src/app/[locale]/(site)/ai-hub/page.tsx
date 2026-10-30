import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AiHubPage" });
  return buildPageMetadata(locale, "/ai-hub", { title: t("metaTitle"), description: t("metaDescription") });
}

export default async function AiHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("AiHubPage");

  return (
    <div className="py-24">
      <Container className="max-w-2xl text-center">
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <div className="mt-10 flex justify-center">
          <Button href="/contact" variant="primary">{t("talkToOurTeam")}</Button>
        </div>
      </Container>
    </div>
  );
}
