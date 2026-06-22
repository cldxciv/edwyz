import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AboutPage");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const valueKeys = ["engineeringExcellence", "clientObsession", "responsibleAi", "continuousLearning"] as const;

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");

  return (
    <div className="py-24">
      <Container className="max-w-4xl">
        <SectionHeading align="left" eyebrow={t("eyebrow")} title={t("title")} />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{t("intro")}</p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold">{t("visionTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("visionBody")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold">{t("missionTitle")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t("missionBody")}</p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-xl font-semibold">{t("coreValues")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {valueKeys.map((key) => (
              <div key={key} className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground">{t(`values.${key}.title`)}</h3>
                <p className="mt-2 text-sm text-muted">{t(`values.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-surface p-8">
          <h2 className="font-heading text-xl font-semibold">{t("leadershipTitle")}</h2>
          <p className="mt-4 leading-relaxed text-muted">&ldquo;{t("leadershipQuote")}&rdquo;</p>
        </div>

        <div className="mt-16">
          <Button href="/contact" variant="primary">{t("workWithUs")}</Button>
        </div>
      </Container>
    </div>
  );
}
