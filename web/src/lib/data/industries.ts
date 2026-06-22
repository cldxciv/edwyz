export type Industry = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export const industries: Industry[] = [
  { slug: "healthcare", name: "Healthcare", description: "AI-driven diagnostics, patient data platforms, and compliant digital health solutions.", icon: "heart-pulse" },
  { slug: "finance", name: "Finance", description: "Fraud detection, algorithmic insights, and secure digital banking platforms.", icon: "landmark" },
  { slug: "retail", name: "Retail", description: "Personalization engines, demand forecasting, and omnichannel commerce platforms.", icon: "shopping-bag" },
  { slug: "manufacturing", name: "Manufacturing", description: "Predictive maintenance, supply chain optimization, and IoT-driven operations.", icon: "factory" },
  { slug: "education", name: "Education", description: "Adaptive learning platforms and data-driven student success tools.", icon: "graduation-cap" },
  { slug: "logistics", name: "Logistics", description: "Route optimization, fleet visibility, and real-time supply chain analytics.", icon: "truck" },
  { slug: "government", name: "Government", description: "Secure citizen services platforms and data modernization for public agencies.", icon: "building-2" },
  { slug: "telecom", name: "Telecom", description: "Network analytics, churn prediction, and customer experience platforms.", icon: "radio-tower" },
  { slug: "real-estate", name: "Real Estate", description: "Property analytics, valuation models, and digital transaction platforms.", icon: "building" },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((i) => i.slug === slug);
}
