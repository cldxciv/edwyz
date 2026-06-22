import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/Button";
import { getServices } from "@/lib/data/services";

export async function ServicesGrid() {
  const t = await getTranslations("Home.servicesGrid");
  const services = await getServices();
  const featured = services.slice(0, 8);
  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/services" variant="secondary">{t("viewAll")}</Button>
        </div>
      </Container>
    </section>
  );
}
