import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { getPayloadClient } from "@/lib/payload";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CareersPage" });
  return buildPageMetadata(locale, "/careers", { title: t("metaTitle"), description: t("metaDescription") });
}

export const revalidate = 3600;

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("CareersPage");
  const locale = await getLocale();
  const payload = await getPayloadClient();
  const { docs: jobListings } = await payload.find({
    collection: "job-listings",
    where: { isOpen: { equals: true } },
    limit: 50,
    locale,
  });

  return (
    <div className="py-24">
      <Container>
        <SectionHeading as="h1" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <div className="mx-auto mt-16 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
          {jobListings.map((job) => (
            <div key={job.slug} className="flex items-center justify-between gap-4 p-6">
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">{job.title}</h3>
                <p className="mt-1 text-sm text-muted">{job.department} &middot; {job.location} &middot; {job.type}</p>
              </div>
              <Button href={`/careers/apply?role=${job.slug}`} variant="secondary">{t("apply")}</Button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          {t("noFit")} <Link href="/careers/apply" className="text-cyan hover:underline">{t("applyAnyway")}</Link> — {t("alwaysLooking")}
        </p>
      </Container>
    </div>
  );
}
