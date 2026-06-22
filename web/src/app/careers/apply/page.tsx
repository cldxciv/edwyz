import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ApplicationForm } from "@/components/ApplicationForm";
import { jobListings } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to join the Edwyz team.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const job = role ? jobListings.find((j) => j.slug === role) : undefined;
  const roleTitle = job?.title ?? "General Application";
  const roleSlug = job?.slug ?? "general";

  return (
    <div className="py-24">
      <Container className="max-w-2xl">
        <SectionHeading
          align="left"
          eyebrow="Careers"
          title={`Apply: ${roleTitle}`}
          description={job ? `${job.department} · ${job.location} · ${job.type}` : "Tell us why you'd be a great fit for Edwyz."}
        />
        <div className="mt-10 rounded-2xl border border-border bg-surface p-8">
          <ApplicationForm roleSlug={roleSlug} roleTitle={roleTitle} />
        </div>
      </Container>
    </div>
  );
}
