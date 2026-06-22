import { Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPayloadClient } from "@/lib/payload";

export async function Testimonials() {
  const t = await getTranslations("Home.testimonials");
  const locale = await getLocale();
  const payload = await getPayloadClient();
  const { docs: testimonials } = await payload.find({ collection: "testimonials", limit: 6, locale });

  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.id} className="flex flex-col rounded-2xl border border-border bg-surface p-6">
              <div className="flex gap-1 text-neon-green">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{item.author}</p>
                <p className="text-xs text-muted">{item.role}, {item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
