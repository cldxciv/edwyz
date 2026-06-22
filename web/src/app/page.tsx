import { Hero } from "@/components/home/Hero";
import { AboutSnippet } from "@/components/home/AboutSnippet";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { TechStack } from "@/components/home/TechStack";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { CaseStudiesPreview } from "@/components/home/CaseStudiesPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogPreview } from "@/components/home/BlogPreview";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSnippet />
      <ServicesGrid />
      <TechStack />
      <IndustriesSection />
      <CaseStudiesPreview />
      <Testimonials />
      <BlogPreview />
      <ContactCTA />
    </>
  );
}
