import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IndustryCard } from "@/components/IndustryCard";
import { industries } from "@/lib/data/industries";

export function IndustriesSection() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Industries"
          title="Purpose-built solutions for every industry"
          description="Deep domain expertise across the sectors that depend most on getting data and AI right."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Container>
    </section>
  );
}
