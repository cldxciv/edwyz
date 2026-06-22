import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { services, getServiceBySlug } from "@/lib/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div className="py-24">
      <Container className="max-w-4xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Service</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{service.name}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{service.description}</p>

        <div className="mt-12 rounded-2xl border border-border bg-surface p-8">
          <h2 className="font-heading text-xl font-semibold">What we deliver</h2>
          <ul className="mt-6 space-y-4">
            {service.capabilities.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm text-muted">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary">Schedule Consultation</Button>
          <Button href="/services" variant="secondary">Back to All Services</Button>
        </div>
      </Container>
    </div>
  );
}
