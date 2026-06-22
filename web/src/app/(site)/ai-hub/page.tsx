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
          title="Talk to our Claude-powered AI assistant"
          description="Our AI assistant is trained on Edwyz's services, case studies, and expertise so it can answer questions and point you to the right solution instantly. Click the chat bubble in the bottom-right corner of any page to start a conversation — or talk to our team directly."
        />
        <div className="mt-10 flex justify-center">
          <Button href="/contact" variant="primary">Talk to Our Team</Button>
        </div>
      </Container>
    </div>
  );
}
