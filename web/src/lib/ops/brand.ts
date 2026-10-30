import { siteConfig } from "@/lib/nav";
import { COMPANY } from "@/lib/company";

/** Single source of truth for what agents may state about Edwyz. Anything not here or returned by a tool is unverified. */
export const BRAND_FACTS = {
  name: siteConfig.name,
  legalName: COMPANY.legalName,
  website: siteConfig.url,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  founded: COMPANY.founded,
  country: COMPANY.country,
  postalAddress: COMPANY.postalAddress,
  contact: { general: "hello@edwyz.com", outreachSender: "anshuman@edwyz.com", senderName: "Anshuman Attri" },
  booking: "https://calendly.com/attri-anshuman/new-meeting",
  social: [
    "https://www.linkedin.com/company/edwyz/",
    "https://www.facebook.com/edwyzexcellence",
    "https://x.com/edwyzexcellence",
    "https://www.instagram.com/edwyzexcellence",
  ],
  siteLanguages: ["en", "es", "fr", "de"],
  currentOutreachOffer:
    "A free, passive security-posture review based only on publicly available information. No scanning, probing or testing of the recipient's systems.",
  mayState: [
    "Services, industries and capabilities exactly as listed on the website (see site_overview).",
    "Founded 2023; company and contact details above.",
    "The booking link and outreach offer above.",
  ],
  mustNotState: [
    "Named clients, logos, testimonials, awards, certifications, partnerships, headcount, revenue or pricing.",
    "Numeric results from case studies (for example speed-ups or percentages) in outbound material: they are not independently verified. Ask the owner first.",
    "Anything about named individuals as Edwyz staff: the people shown in site illustrations and videos are AI-generated.",
    "Statistics, market sizes or quotes without a cited public source URL.",
    "That any AI assistant currently recommends Edwyz, unless a tool or cited source shows it.",
  ],
  emailRules: [
    "Every commercial email names the sender and Edwyz, includes the postal address above, and a working unsubscribe line.",
    "Subject lines must be truthful and not deceptive. No fake reply or forward prefixes.",
    "Only write to addresses the owner supplied or to generic published organisational addresses the owner supplied. Never harvest personal addresses.",
    "Australian recipients: the Spam Act 2003 applies (consent, sender identification, unsubscribe). Flag anything uncertain for the owner instead of deciding.",
  ],
  googleAiGuidance:
    "Google states that optimising for its AI features is the same as SEO: helpful, original, well-structured content. llms.txt, special markup and rewriting content into chunks are not needed for Google. Label any tactic aimed at other assistants as non-Google.",
} as const;
