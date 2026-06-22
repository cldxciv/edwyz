export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "predictive-maintenance-manufacturing",
    title: "Cutting unplanned downtime with predictive maintenance",
    client: "Global Manufacturing Group",
    industry: "Manufacturing",
    summary: "Built an ML-driven predictive maintenance platform across 12 production facilities.",
    challenge: "Unplanned equipment failures were costing the client millions annually in lost production time and emergency repairs.",
    solution: "Deployed IoT sensors across critical machinery and built ML models to predict failures up to 2 weeks in advance, integrated into existing maintenance workflows.",
    results: [
      { label: "Unplanned downtime", value: "-42%" },
      { label: "Maintenance cost", value: "-28%" },
      { label: "Facilities covered", value: "12" },
    ],
  },
  {
    slug: "fraud-detection-fintech",
    title: "Real-time fraud detection at scale",
    client: "Fintech Payments Platform",
    industry: "Finance",
    summary: "Designed a real-time fraud detection system processing millions of transactions daily.",
    challenge: "Legacy rule-based fraud detection couldn't keep pace with transaction volume or evolving fraud patterns.",
    solution: "Built a real-time ML scoring pipeline combined with a rules engine, deployed on cloud infrastructure with sub-100ms latency.",
    results: [
      { label: "Fraud caught", value: "+63%" },
      { label: "False positives", value: "-35%" },
      { label: "Detection latency", value: "<100ms" },
    ],
  },
  {
    slug: "personalization-retail",
    title: "Personalized shopping experiences that convert",
    client: "Omnichannel Retail Brand",
    industry: "Retail",
    summary: "Built a recommendation engine and customer data platform driving measurable revenue lift.",
    challenge: "Generic product recommendations were leading to low engagement and high cart abandonment.",
    solution: "Implemented a unified customer data platform feeding a real-time personalization engine across web, app, and email.",
    results: [
      { label: "Conversion rate", value: "+24%" },
      { label: "Average order value", value: "+17%" },
      { label: "Email engagement", value: "+31%" },
    ],
  },
  {
    slug: "ai-agent-customer-support",
    title: "Autonomous AI agents for customer support",
    client: "SaaS Platform",
    industry: "Technology",
    summary: "Deployed Claude-powered AI agents handling tier-1 support and lead qualification.",
    challenge: "Support volume was outpacing team capacity, increasing response times and hurting CSAT.",
    solution: "Built a RAG-powered AI agent trained on the client's knowledge base, integrated with their ticketing system and CRM.",
    results: [
      { label: "Tickets auto-resolved", value: "58%" },
      { label: "First response time", value: "-71%" },
      { label: "CSAT", value: "+19%" },
    ],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
