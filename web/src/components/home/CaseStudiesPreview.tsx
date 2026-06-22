import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getPayloadClient } from "@/lib/payload";

export async function CaseStudiesPreview() {
  const payload = await getPayloadClient();
  const { docs: featured } = await payload.find({ collection: "case-studies", limit: 3 });

  return (
    <section className="border-y border-border/60 bg-surface/40 py-24">
      <Container>
        <SectionHeading eyebrow="Proof, not promises" title="Results our clients can measure" />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {featured.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{cs.industry}</span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{cs.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cs.summary}</p>
              <div className="mt-6 flex gap-6 border-t border-border pt-4">
                {cs.results.slice(0, 2).map((r: { id?: string | null; label: string; value: string }) => (
                  <div key={r.id ?? r.label}>
                    <p className="font-display text-xl font-bold gradient-text">{r.value}</p>
                    <p className="text-xs text-muted">{r.label}</p>
                  </div>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan opacity-0 transition-opacity group-hover:opacity-100">
                Read case study <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/case-studies" variant="secondary">View All Case Studies</Button>
        </div>
      </Container>
    </section>
  );
}
