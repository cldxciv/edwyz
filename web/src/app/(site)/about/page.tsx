import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Edwyz's story, vision, mission, and the team building the future of AI and software.",
};

const values = [
  { title: "Engineering Excellence", description: "We hold our work to a production-grade standard, every time." },
  { title: "Client Obsession", description: "Your outcomes are the only metric that matters to us." },
  { title: "Responsible AI", description: "We build AI systems that are transparent, safe, and accountable." },
  { title: "Continuous Learning", description: "The technology moves fast — so do we." },
];

export default function AboutPage() {
  return (
    <div className="py-24">
      <Container className="max-w-4xl">
        <SectionHeading
          align="left"
          eyebrow="About Edwyz"
          title="We build the technology that powers what's next"
        />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Edwyz was founded to close the gap between what AI promises and what enterprises can actually
          ship. We combine deep technical expertise in AI, data, and cloud engineering with a relentless
          focus on production-grade delivery — because a brilliant model that never reaches users isn&apos;t
          a result, it&apos;s a demo.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold">Our Vision</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A world where every enterprise has the technology foundation to turn data into decisions and
              ideas into shipped products — at the speed AI now makes possible.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold">Our Mission</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              To design, build, and scale intelligent systems for our clients with the same rigor we&apos;d
              demand of our own products.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-xl font-semibold">Core Values</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-surface p-8">
          <h2 className="font-heading text-xl font-semibold">A note from our leadership</h2>
          <p className="mt-4 leading-relaxed text-muted">
            &ldquo;We started Edwyz because we kept seeing the same pattern: companies investing heavily in
            AI initiatives that never made it past the pilot stage. Our job is to make sure that doesn&apos;t
            happen to you — we measure our success by what actually ships and the impact it has.&rdquo;
          </p>
        </div>

        <div className="mt-16">
          <Button href="/contact" variant="primary">Work With Us</Button>
        </div>
      </Container>
    </div>
  );
}
