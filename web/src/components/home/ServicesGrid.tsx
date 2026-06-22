import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data/services";

export function ServicesGrid() {
  const featured = services.slice(0, 8);
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="End-to-end technology services"
          description="From AI strategy to production engineering, we cover the full stack of what modern enterprises need to compete."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/services" variant="secondary">View All Services</Button>
        </div>
      </Container>
    </section>
  );
}
