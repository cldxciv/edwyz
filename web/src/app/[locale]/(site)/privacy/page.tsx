import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PrivacyPage");
  return { title: t("metaTitle") };
}

export default async function PrivacyPage() {
  const t = await getTranslations("PrivacyPage");

  return (
    <div className="py-24">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
        <p className="mt-6 leading-relaxed text-muted">{t("body")}</p>
      </Container>
    </div>
  );
}
