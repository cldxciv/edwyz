import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { caseStudies } from "@/lib/data/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real results Edwyz has delivered for clients across industries.",
};

export default function CaseStudiesPage() {
  return (
    <div className="py-24">
      <Container>
        <SectionHeading eyebrow="Case Studies" title="Results our clients can measure" />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">{cs.industry}</span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{cs.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cs.summary}</p>
              <div className="mt-6 flex gap-6 border-t border-border pt-4">
                {cs.results.slice(0, 2).map((r) => (
                  <div key={r.label}>
                    <p className="font-display text-xl font-bold gradient-text">{r.value}</p>
                    <p className="text-xs text-muted">{r.label}</p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
