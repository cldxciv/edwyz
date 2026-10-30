import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/company";
import { getPayloadClient } from "@/lib/payload";
import CalendlyEmbed from "@/components/ui/CalendlyEmbed";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return buildPageMetadata(locale, "/contact", { title: t("metaTitle"), description: t("metaDescription") });
}

export const revalidate = 3600;

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const t = await getTranslations("ContactPage");

  let calendlyUrl = "";
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({ slug: "settings", overrideAccess: true });
    calendlyUrl = (settings as { calendlyUrl?: string }).calendlyUrl ?? "";
  } catch {}

  return (
    <div className="py-24">
      <Container className="grid gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading as="h1" align="left" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
          <div className="mt-10 space-y-4 text-sm text-muted">
            <p>hello@edwyz.com</p>
            <p>{t("remoteFirst")}</p>
            <p>
              {COMPANY.legalName}
              <br />
              {COMPANY.postalAddress}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8">
          <ContactForm />
        </div>
      </Container>

      {calendlyUrl && (
        <Container className="mt-24">
          <SectionHeading
            eyebrow="Book a Meeting"
            title="Schedule time with our team"
            description="Pick a time that works for you and we'll be ready."
          />
          <div className="mt-12">
            <CalendlyEmbed url={calendlyUrl} />
          </div>
        </Container>
      )}
    </div>
  );
}
