import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ApplicationForm } from "@/components/ApplicationForm";
import { getPayloadClient } from "@/lib/payload";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ApplyPage");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const t = await getTranslations("ApplyPage");
  const locale = await getLocale();

  let job = null;
  if (role) {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "job-listings",
      where: { slug: { equals: role } },
      limit: 1,
      locale,
    });
    job = docs[0] ?? null;
  }

  const roleTitle = job?.title ?? t("generalApplication");
  const roleSlug = job?.slug ?? "general";

  return (
    <div className="py-24">
      <Container className="max-w-2xl">
        <SectionHeading
          align="left"
          eyebrow={t("eyebrow")}
          title={`${t("applyTitle")}: ${roleTitle}`}
          description={job ? `${job.department} · ${job.location} · ${job.type}` : t("noRoleDescription")}
        />
        <div className="mt-10 rounded-2xl border border-border bg-surface p-8">
          <ApplicationForm roleSlug={roleSlug} roleTitle={roleTitle} />
        </div>
      </Container>
    </div>
  );
}
