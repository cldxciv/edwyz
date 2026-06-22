import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="py-24">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Terms of Service</h1>
        <p className="mt-6 leading-relaxed text-muted">
          This is a placeholder terms of service page. Full terms will be added prior to
          production launch.
        </p>
      </Container>
    </div>
  );
}
