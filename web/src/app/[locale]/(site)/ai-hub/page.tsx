import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AiHubPage");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AiHubPage() {
  const t = await getTranslations("AiHubPage");

  return (
    <div className="py-24">
      <Container className="max-w-2xl text-center">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <div className="mt-10 flex justify-center">
          <Button href="/contact" variant="primary">{t("talkToOurTeam")}</Button>
        </div>
      </Container>
    </div>
  );
}
