import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { HowWeWork } from "@/components/home/HowWeWork";
import { TechStack } from "@/components/home/TechStack";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { CaseStudiesPreview } from "@/components/home/CaseStudiesPreview";
import { WorkSamples } from "@/components/home/WorkSamples";
import { BlogPreview } from "@/components/home/BlogPreview";
import { ContactCTA } from "@/components/home/ContactCTA";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/company";
import { getServiceSlugs } from "@/lib/data/services";
import { getIndustrySlugs } from "@/lib/data/industries";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/", {
    title: "AI Consulting & Software Engineering",
    description:
      "Edwyz builds generative AI, machine learning, data and cloud systems for enterprises, from strategy to production. Talk to our engineers.",
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <AboutSnippet
        values={{
          founded: COMPANY.founded,
          services: String(getServiceSlugs().length),
          industries: String(getIndustrySlugs().length),
          languages: String(routing.locales.length),
        }}
      />
      <ServicesGrid />
      <HowWeWork />
      <TechStack />
      <IndustriesSection />
      <CaseStudiesPreview />
      <WorkSamples />
      <BlogPreview />
      <ContactCTA />
    </>
  );
}
