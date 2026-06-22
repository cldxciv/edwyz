import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { caseStudies, getCaseStudyBySlug } from "@/lib/data/case-studies";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};
  return { title: cs.title, description: cs.summary };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  return (
    <div className="py-24">
      <Container className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{cs.industry}</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{cs.title}</h1>
        <p className="mt-4 text-sm text-muted">Client: {cs.client}</p>

        <div className="mt-10 grid grid-cols-3 gap-6 rounded-2xl border border-border bg-surface p-6">
          {cs.results.map((r) => (
            <div key={r.label} className="text-center">
              <p className="font-display text-2xl font-bold gradient-text sm:text-3xl">{r.value}</p>
              <p className="mt-1 text-xs text-muted">{r.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-8">
          <div>
            <h2 className="font-heading text-xl font-semibold">The Challenge</h2>
            <p className="mt-3 leading-relaxed text-muted">{cs.challenge}</p>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold">The Solution</h2>
            <p className="mt-3 leading-relaxed text-muted">{cs.solution}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">Start a Similar Project</Button>
          <Button href="/case-studies" variant="secondary">Back to Case Studies</Button>
        </div>
      </Container>
    </div>
  );
}
