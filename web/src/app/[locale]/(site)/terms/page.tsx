import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TermsPage" });
  return buildPageMetadata(locale, "/terms", { title: t("metaTitle"), description: t("metaDescription") });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("TermsPage");

  return (
    <div className="py-24">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
        <p className="mt-6 leading-relaxed text-muted">{t("body")}</p>
      </Container>
    </div>
  );
}
