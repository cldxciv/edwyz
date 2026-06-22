import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ContactPage");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <div className="py-24">
      <Container className="grid gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading align="left" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
          <div className="mt-10 space-y-4 text-sm text-muted">
            <p>hello@edwyz.com</p>
            <p>+1 (555) 010-0100</p>
            <p>{t("remoteFirst")}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
