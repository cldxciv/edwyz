import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="py-24">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-6 leading-relaxed text-muted">
          This is a placeholder privacy policy page. Full policy content covering data collection,
          usage, and user rights will be added prior to production launch.
        </p>
      </Container>
    </div>
  );
}
