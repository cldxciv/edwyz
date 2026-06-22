import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { getIndustryBySlug, getIndustrySlugs } from "@/lib/data/industries";
import { getPayloadClient } from "@/lib/payload";

export function generateStaticParams() {
  return getIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return {};
  return { title: industry.name, description: industry.description };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();

  const t = await getTranslations("IndustryDetailPage");

  const payload = await getPayloadClient();
  const { docs: relatedCaseStudies } = await payload.find({
    collection: "case-studies",
    where: { industry: { equals: industry.name } },
    limit: 10,
  });

  return (
    <div className="py-24">
      <Container className="max-w-4xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{t("eyebrow")}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{industry.name}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{industry.description}</p>

        {relatedCaseStudies.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-xl font-semibold">{t("relatedCaseStudies")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedCaseStudies.map((cs) => (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="rounded-xl border border-border bg-surface p-5 text-sm text-muted hover:border-cyan/40 hover:text-foreground"
                >
                  {cs.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">{t("talkToOurTeam")}</Button>
          <Button href="/industries" variant="secondary">{t("backToAllIndustries")}</Button>
        </div>
      </Container>
    </div>
  );
}
