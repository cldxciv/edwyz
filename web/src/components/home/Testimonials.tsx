import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/data/testimonials";

export function Testimonials() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow="Trusted By Industry Leaders" title="What our clients say" />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.author} className="flex flex-col rounded-2xl border border-border bg-surface p-6">
              <div className="flex gap-1 text-neon-green">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{t.author}</p>
                <p className="text-xs text-muted">{t.role}, {t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
