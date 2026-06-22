import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IndustryCard } from "@/components/IndustryCard";
import { industries } from "@/lib/data/industries";

export const metadata: Metadata = {
  title: "Industries",
  description: "Industry-specific AI and software solutions from Edwyz.",
};

export default function IndustriesPage() {
  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Industries"
          title="Built for the industries that demand precision"
          description="Deep domain expertise across the sectors that depend most on getting data and AI right."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Container>
    </div>
  );
}
