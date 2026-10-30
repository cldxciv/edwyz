import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { buildPageMetadata } from "@/lib/seo";
import { getPayloadClient } from "@/lib/payload";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "/faq", {
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about working with Edwyz: our process, project timelines, pricing, NDAs and IP ownership, and ongoing support after delivery.",
  });
}

export const revalidate = 3600;

type FAQ = { id: string; question: string; answer: string; category: string; order: number };

const FALLBACK_FAQS: FAQ[] = [
  { id: "1", question: "What types of projects do you take on?", answer: "We work on AI, data engineering, machine learning, cloud infrastructure, and full-stack software projects. We typically engage with mid-market and enterprise clients who need production-grade systems, not just prototypes.", category: "Services", order: 0 },
  { id: "2", question: "How long does a typical project take?", answer: "It depends on scope. A focused AI integration or MVP can take 4–8 weeks. A full platform build or data infrastructure overhaul typically runs 3–6 months. We define milestones upfront so you always know where things stand.", category: "Services", order: 1 },
  { id: "3", question: "What is your pricing model?", answer: "We work on fixed-scope projects with a milestone-based payment schedule, and on retainer for ongoing engineering support. We share a detailed proposal after our discovery call — no surprise costs.", category: "Pricing", order: 0 },
  { id: "4", question: "Do you work with early-stage startups?", answer: "Our sweet spot is mid-market and enterprise, but we do selectively work with well-funded startups where we can have real impact. Reach out and we'll let you know if it's a good fit.", category: "Pricing", order: 1 },
  { id: "5", question: "Where is your team based?", answer: "Edwyz is based in Shimla, India, and works with clients remotely. We are happy to schedule calls at times that suit your time zone.", category: "Team", order: 0 },
  { id: "6", question: "Do you sign NDAs?", answer: "Yes, we routinely sign NDAs before discovery calls for sensitive projects. Just let us know when you reach out.", category: "Process", order: 0 },
  { id: "7", question: "Who owns the code and IP after the project?", answer: "You do. All work product, code, and intellectual property developed for your project is assigned to you at project completion. We retain no rights to what we build for you.", category: "Process", order: 1 },
  { id: "8", question: "What happens after the project is delivered?", answer: "We hand off full documentation, source code, and a knowledge-transfer session. We also offer ongoing maintenance retainers if you need continued engineering support.", category: "Process", order: 2 },
  { id: "9", question: "What is Edwyz?", answer: "Edwyz (Edwyz Technologies Private Limited) is an AI consulting and software engineering company founded in 2023 and based in Shimla, India. We help enterprises build intelligent, scalable systems, from generative AI and machine learning to cloud migration and data engineering.", category: "Company", order: 0 },
  { id: "10", question: "Which industries do you work in?", answer: "Healthcare, finance, retail, manufacturing, education, logistics, government, telecom and real estate. Each has its own page on this site describing the challenges we typically see.", category: "Company", order: 1 },
  { id: "11", question: "How do we get started?", answer: "Book a call at https://calendly.com/attri-anshuman/new-meeting or email hello@edwyz.com with a few lines about what you want to build or fix.", category: "Company", order: 2 },
  { id: "12", question: "What services does Edwyz offer?", answer: "Twenty services across AI and machine learning, data, cloud and DevOps, software and product engineering, and security, including generative AI, LLM development, AI agents, data engineering, cyber security and AI visibility. The full list is on our Services page.", category: "Services", order: 2 },
  { id: "13", question: "Can you help us appear in AI assistant answers?", answer: "We can audit how your brand is described in AI assistants and improve the clarity, accuracy and consistency of your public content. No one can guarantee that any assistant will mention or recommend a brand. For Google's own AI features, Google says the approach is the same as good SEO: helpful, original, well-structured content.", category: "Services", order: 3 },
  { id: "14", question: "What affects the cost of a project?", answer: "Scope, data readiness, integrations, security and compliance needs, model and hosting costs, and support after launch. We give an estimate after a discovery call rather than publishing a price list.", category: "Pricing", order: 2 },
];

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  let faqs: FAQ[] = FALLBACK_FAQS;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "faqs",
      limit: 200,
      sort: "order",
      overrideAccess: true,
    });
    if (docs.length > 0) faqs = docs as unknown as FAQ[];
  } catch {}

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <div className="py-24">
      <Container className="max-w-3xl">
        <SectionHeading
          as="h1"
          eyebrow="FAQ"
          title="Questions we get asked a lot"
          description="If you have a question not answered here, just reach out — we reply within one business day."
        />

        <div className="mt-16 space-y-14">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">{cat}</h2>
              <dl className="space-y-6">
                {faqs
                  .filter((f) => f.category === cat)
                  .map((faq) => (
                    <div key={faq.id} className="border-b border-border pb-6">
                      <dt className="text-base font-semibold mb-2">{faq.question}</dt>
                      <dd className="text-sm text-muted leading-relaxed">{faq.answer}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-border bg-surface p-10 text-center">
          <p className="font-semibold text-lg mb-2">Still have questions?</p>
          <p className="text-sm text-muted mb-6">Our team is happy to help. Send us a message and we'll get back to you within one business day.</p>
          <Button href="/contact">Get in Touch</Button>
        </div>
      </Container>
    </div>
    </>
  );
}
