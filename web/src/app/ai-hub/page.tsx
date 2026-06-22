import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "AI Innovation Hub",
  description: "Edwyz's dedicated hub for AI innovation, powered by Claude.",
};

export default function AiHubPage() {
  return (
    <div className="py-24">
      <Container className="max-w-2xl text-center">
        <SectionHeading
          eyebrow="AI Innovation Hub"
          title="Our Claude-powered AI assistant is coming soon"
          description="We're building an intelligent assistant trained on our services, case studies, and expertise to help you find the right solution faster. In the meantime, our team is happy to talk through your project directly."
        />
        <div className="mt-10 flex justify-center">
          <Button href="/contact" variant="primary">Talk to Our Team</Button>
        </div>
      </Container>
    </div>
  );
}
