import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore Edwyz's full range of AI, software, data, and cloud engineering services.",
};

export default function ServicesPage() {
  return (
    <div className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Everything you need to build, scale, and modernize"
          description="From AI strategy to production software, our teams cover the full technology stack."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </div>
  );
}
