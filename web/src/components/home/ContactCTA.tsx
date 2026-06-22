import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function ContactCTA() {
  return (
    <section className="py-24">
      <Container>
        <div className="glow-border relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-2 px-8 py-16 text-center sm:px-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,255,0.18),_transparent_60%)]" />
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build what&apos;s next?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Tell us about your project and we&apos;ll get back to you within one business day with next steps.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/contact" variant="primary">Schedule a Consultation</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
