import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { jobListings } from "@/lib/data/careers";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Edwyz and help build the future of AI and software engineering.",
};

export default function CareersPage() {
  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Careers"
          title="Build the future of AI with us"
          description="We're a remote-first team of engineers, scientists, and product builders. Here's what we're hiring for right now."
        />
        <div className="mx-auto mt-16 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
          {jobListings.map((job) => (
            <div key={job.slug} className="flex items-center justify-between gap-4 p-6">
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">{job.title}</h3>
                <p className="mt-1 text-sm text-muted">{job.department} &middot; {job.location} &middot; {job.type}</p>
              </div>
              <Button href={`/careers/apply?role=${job.slug}`} variant="secondary">Apply</Button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t see a fit? <a href="/careers/apply" className="text-cyan hover:underline">Apply anyway</a> — we&apos;re always looking for great people.
        </p>
      </Container>
    </div>
  );
}
