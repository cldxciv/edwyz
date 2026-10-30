import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedIconBadge } from "@/components/ui/AnimatedIconBadge";
import { StatCard } from "@/components/ui/StatCard";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { getIndustryIcon } from "@/lib/contentIcons";
import { getPayloadClient } from "@/lib/payload";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, localizedUrl } from "@/lib/seo-core";
import { cmsTranslatedLocales } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "case-studies",
    where: { _status: { equals: "published" } },
    limit: 100,
    depth: 0,
  });
  return docs.map((cs) => ({ slug: cs.slug }));
}

async function getCaseStudy(slug: string, locale: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: slug }, _status: { equals: "published" } },
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
  setRequestLocale(locale);
  const cs = await getCaseStudy(slug, locale);
  if (!cs) return { robots: { index: false } };
  const locales = await cmsTranslatedLocales("case-studies", slug);
  return buildMetadata({
    locale,
    path: `/case-studies/${slug}`,
    title: cs.title,
    titleSuffix: "Edwyz Case Study",
    description: cs.summary,
    source: "cms",
    type: "article",
    locales: locales.length ? locales : (["en"] as Locale[]),
    article: { publishedTime: cs.createdAt, modifiedTime: cs.updatedAt, authors: ["Edwyz"], section: cs.industry },
  });
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const cs = await getCaseStudy(slug, locale);
  if (!cs) notFound();

  const t = await getTranslations("CaseStudyDetailPage");

  const payload = await getPayloadClient();
  const { docs: relatedCaseStudies } = await payload.find({
    collection: "case-studies",
    where: { slug: { not_equals: slug }, _status: { equals: "published" } },
    limit: 3,
    locale,
  });

  const pageUrl = localizedUrl(locale, `/case-studies/${slug}`);
  void pageUrl;

  const caseStudySchema = articleJsonLd({
    locale,
    path: `/case-studies/${slug}`,
    headline: cs.title,
    description: cs.summary,
    image: "",
    datePublished: cs.createdAt,
    dateModified: cs.updatedAt,
    section: cs.industry,
  });

  return (
    <>
      <JsonLd data={caseStudySchema} />
      <JsonLd
        data={breadcrumbJsonLd(
          locale,
          [
            { name: "Home", path: "" },
            { name: "Case Studies", path: "/case-studies" },
            { name: cs.title },
          ],
          `/case-studies/${slug}`,
        )}
      />
    <div className="py-24">
      <Container className="max-w-3xl">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Case Studies", href: "/case-studies" },
            { label: cs.title },
          ]}
        />

        <AnimatedIconBadge
          id={getIndustryIcon(cs.industry)}
          gradientClassName="bg-gradient-to-br from-purple/20 to-indigo/10 text-purple"
        />
        <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
          {cs.industry}
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {cs.title}
        </h1>
        <p className="mt-4 text-sm text-muted">
          {t("client")}: {cs.client}
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted">{cs.summary}</p>

        <Reveal className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cs.results.map((r: { id?: string | null; label: string; value: string }, i: number) => (
            <StatCard key={r.id ?? r.label} value={r.value} label={r.label} delay={i * 0.1} index={i} />
          ))}
        </Reveal>

        <div className="mt-12 space-y-8">
          <Reveal>
            <h2 className="font-heading text-xl font-semibold">{t("theChallenge")}</h2>
            <p className="mt-3 leading-relaxed text-muted">{cs.challenge}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-heading text-xl font-semibold">{t("theSolution")}</h2>
            <p className="mt-3 leading-relaxed text-muted">{cs.solution}</p>
          </Reveal>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <div className="flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              {t("startSimilarProject")}
            </Button>
            <Button href="/case-studies" variant="secondary">
              {t("backToCaseStudies")}
            </Button>
          </div>
          <ShareButtons url={pageUrl} title={cs.title} />
        </div>

        {relatedCaseStudies.length > 0 && (
          <Reveal className="mt-20 border-t border-border pt-12">
            <h2 className="font-heading text-xl font-semibold">{t("moreCaseStudies")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {relatedCaseStudies.map((other) => (
                <Link
                  key={other.slug}
                  href={`/case-studies/${other.slug}`}
                  className="rounded-xl border border-border bg-surface p-4 text-sm hover:border-cyan/40"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                    {other.industry}
                  </span>
                  <p className="mt-2 font-heading font-semibold text-foreground">{other.title}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </Container>
    </div>
    </>
  );
}
