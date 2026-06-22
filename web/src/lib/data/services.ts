export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  capabilities: string[];
  icon: string;
};

export const services: Service[] = [
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    short: "End-to-end AI strategy and implementation.",
    description:
      "We design and deploy AI systems that solve real business problems — from predictive models to fully autonomous agents — grounded in your data and infrastructure.",
    capabilities: ["AI strategy & roadmap", "Model evaluation & selection", "Production deployment", "Responsible AI governance"],
    icon: "brain-circuit",
  },
  {
    slug: "machine-learning",
    name: "Machine Learning",
    short: "Predictive models that learn from your data.",
    description:
      "Custom ML pipelines for forecasting, classification, recommendation, and anomaly detection — built for accuracy and built to scale.",
    capabilities: ["Feature engineering", "Model training & tuning", "MLOps pipelines", "Continuous monitoring"],
    icon: "git-branch",
  },
  {
    slug: "generative-ai",
    name: "Generative AI",
    short: "Content, code, and creative generation at scale.",
    description:
      "Generative AI applications for content creation, design assistance, and synthetic data — tuned to your brand and domain.",
    capabilities: ["Fine-tuning & prompt engineering", "Multimodal generation", "Content pipelines", "Quality & safety controls"],
    icon: "sparkles",
  },
  {
    slug: "llm-development",
    name: "LLM Development",
    short: "Custom large language model applications.",
    description:
      "We build retrieval-augmented, fine-tuned, and agentic LLM applications on top of leading foundation models.",
    capabilities: ["RAG architecture", "Fine-tuning", "Evaluation frameworks", "Cost & latency optimization"],
    icon: "message-square-code",
  },
  {
    slug: "ai-agents",
    name: "AI Agents",
    short: "Autonomous agents that take action.",
    description:
      "Multi-step, tool-using AI agents that automate complex workflows across your business systems.",
    capabilities: ["Agent orchestration", "Tool/function integration", "Human-in-the-loop controls", "Monitoring & observability"],
    icon: "bot",
  },
  {
    slug: "cloud-engineering",
    name: "Cloud Engineering",
    short: "Scalable, secure cloud infrastructure.",
    description:
      "Cloud-native architecture across AWS, Azure, and GCP — built for resilience, cost efficiency, and speed.",
    capabilities: ["Cloud migration", "Infrastructure as code", "Cost optimization", "Multi-cloud architecture"],
    icon: "cloud",
  },
  {
    slug: "data-engineering",
    name: "Data Engineering",
    short: "Reliable pipelines for trustworthy data.",
    description:
      "We build the data infrastructure that powers analytics and AI — pipelines, warehouses, and governance that scale.",
    capabilities: ["ETL/ELT pipelines", "Data warehousing", "Real-time streaming", "Data quality & governance"],
    icon: "database",
  },
  {
    slug: "data-analytics",
    name: "Data Analytics",
    short: "Turn raw data into decisions.",
    description:
      "Analytics solutions that surface the metrics that matter, with self-serve dashboards for every team.",
    capabilities: ["Descriptive & predictive analytics", "Self-serve dashboards", "KPI frameworks", "Data storytelling"],
    icon: "bar-chart-3",
  },
  {
    slug: "business-intelligence",
    name: "Business Intelligence",
    short: "Enterprise-grade BI platforms.",
    description:
      "BI implementations that unify data across the organization into a single source of truth.",
    capabilities: ["BI platform implementation", "Semantic layer design", "Embedded analytics", "Executive reporting"],
    icon: "line-chart",
  },
  {
    slug: "devops",
    name: "DevOps",
    short: "Faster, safer software delivery.",
    description:
      "CI/CD, infrastructure automation, and observability that let your teams ship with confidence.",
    capabilities: ["CI/CD pipelines", "Infrastructure automation", "Observability & monitoring", "Site reliability engineering"],
    icon: "git-merge",
  },
  {
    slug: "software-development",
    name: "Software Development",
    short: "Custom software, built right.",
    description:
      "Full-cycle custom software development — from architecture to deployment — for web, enterprise, and embedded systems.",
    capabilities: ["Custom application development", "System architecture", "API & integration development", "Legacy modernization"],
    icon: "code-2",
  },
  {
    slug: "product-engineering",
    name: "Product Engineering",
    short: "From idea to shipped product.",
    description:
      "We partner with product teams to design, build, and iterate on digital products users love.",
    capabilities: ["Product discovery", "UX/UI design", "Agile delivery", "Continuous iteration"],
    icon: "layers",
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    short: "Native and cross-platform apps.",
    description:
      "iOS, Android, and cross-platform mobile applications engineered for performance and scale.",
    capabilities: ["Native iOS & Android", "React Native / Flutter", "App store optimization", "Mobile DevOps"],
    icon: "smartphone",
  },
  {
    slug: "web-development",
    name: "Web Development",
    short: "Fast, modern web applications.",
    description:
      "High-performance web applications built on modern frameworks, optimized for speed and conversion.",
    capabilities: ["Next.js / React applications", "Headless CMS integration", "Performance optimization", "Accessibility"],
    icon: "globe",
  },
  {
    slug: "cyber-security",
    name: "Cyber Security",
    short: "Protect what you've built.",
    description:
      "Security assessments, hardening, and monitoring to keep your applications and infrastructure safe.",
    capabilities: ["Security audits & pen testing", "Threat modeling", "Compliance readiness", "Incident response"],
    icon: "shield",
  },
  {
    slug: "qa-testing",
    name: "QA & Testing",
    short: "Ship with confidence.",
    description:
      "Comprehensive QA strategy spanning manual, automated, and performance testing.",
    capabilities: ["Test automation", "Performance & load testing", "Manual QA", "Continuous testing in CI/CD"],
    icon: "check-circle-2",
  },
  {
    slug: "digital-transformation",
    name: "Digital Transformation",
    short: "Modernize how your business runs.",
    description:
      "End-to-end digital transformation strategy and execution — process, technology, and people.",
    capabilities: ["Transformation strategy", "Process automation", "Change management", "Technology modernization"],
    icon: "rocket",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
