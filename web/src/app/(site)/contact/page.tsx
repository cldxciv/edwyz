import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Edwyz to discuss your next AI or software project.",
};

export default function ContactPage() {
  return (
    <div className="py-24">
      <Container className="grid gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Contact Us"
            title="Let's build something great together"
            description="Tell us about your project and a member of our team will follow up within one business day."
          />
          <div className="mt-10 space-y-4 text-sm text-muted">
            <p>hello@edwyz.com</p>
            <p>+1 (555) 010-0100</p>
            <p>Remote-first, with hubs across North America, Europe, and Asia.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
