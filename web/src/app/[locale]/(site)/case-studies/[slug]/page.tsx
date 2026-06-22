import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "case-studies", limit: 100, depth: 0 });
  return docs.map((cs) => ({ slug: cs.slug }));
}

async function getCaseStudy(slug: string, locale: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
  });
  return docs[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const cs = await getCaseStudy(slug, locale);
  if (!cs) return {};
  return { title: cs.title, description: cs.summary };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const cs = await getCaseStudy(slug, locale);
  if (!cs) notFound();

  const t = await getTranslations("CaseStudyDetailPage");

  return (
    <div className="py-24">
      <Container className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{cs.industry}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{cs.title}</h1>
        <p className="mt-4 text-sm text-muted">{t("client")}: {cs.client}</p>

        <div className="mt-10 grid grid-cols-3 gap-6 rounded-2xl border border-border bg-surface p-6">
          {cs.results.map((r: { id?: string | null; label: string; value: string }) => (
            <div key={r.id ?? r.label} className="text-center">
              <p className="font-display text-2xl font-bold gradient-text sm:text-3xl">{r.value}</p>
              <p className="mt-1 text-xs text-muted">{r.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-8">
          <div>
            <h2 className="font-heading text-xl font-semibold">{t("theChallenge")}</h2>
            <p className="mt-3 leading-relaxed text-muted">{cs.challenge}</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold">{t("theSolution")}</h2>
            <p className="mt-3 leading-relaxed text-muted">{cs.solution}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">{t("startSimilarProject")}</Button>
          <Button href="/case-studies" variant="secondary">{t("backToCaseStudies")}</Button>
        </div>
      </Container>
    </div>
  );
}
