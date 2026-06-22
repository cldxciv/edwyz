import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { industries, getIndustryBySlug } from "@/lib/data/industries";
import { caseStudies } from "@/lib/data/case-studies";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};
  return { title: industry.name, description: industry.description };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const relatedCaseStudies = caseStudies.filter(
    (cs) => cs.industry.toLowerCase() === industry.name.toLowerCase()
  );

  return (
    <div className="py-24">
      <Container className="max-w-4xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Industry</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{industry.name}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{industry.description}</p>

        {relatedCaseStudies.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-xl font-semibold">Related case studies</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedCaseStudies.map((cs) => (
                <a
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="rounded-xl border border-border bg-surface p-5 text-sm text-muted hover:border-cyan/40 hover:text-foreground"
                >
                  {cs.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">Talk to Our Team</Button>
          <Button href="/industries" variant="secondary">Back to All Industries</Button>
        </div>
      </Container>
    </div>
  );
}
