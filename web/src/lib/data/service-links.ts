const GROUPS: Record<string, string[]> = {
  "artificial-intelligence": ["machine-learning", "generative-ai", "ai-agents"],
  "machine-learning": ["artificial-intelligence", "data-engineering", "data-analytics"],
  "generative-ai": ["llm-development", "ai-agents", "artificial-intelligence"],
  "llm-development": ["generative-ai", "ai-agents", "data-engineering"],
  "ai-agents": ["llm-development", "generative-ai", "software-development"],
  "cloud-engineering": ["devops", "data-engineering", "cyber-security"],
  "data-engineering": ["data-analytics", "business-intelligence", "cloud-engineering"],
  "data-analytics": ["business-intelligence", "data-engineering", "machine-learning"],
  "business-intelligence": ["data-analytics", "data-engineering", "digital-transformation"],
  devops: ["cloud-engineering", "qa-testing", "application-security"],
  "software-development": ["product-engineering", "web-development", "qa-testing"],
  "product-engineering": ["software-development", "mobile-app-development", "web-development"],
  "mobile-app-development": ["product-engineering", "web-development", "qa-testing"],
  "web-development": ["software-development", "product-engineering", "mobile-app-development"],
  "cyber-security": ["penetration-testing", "application-security", "cloud-engineering"],
  "penetration-testing": ["cyber-security", "application-security", "qa-testing"],
  "application-security": ["penetration-testing", "cyber-security", "devops"],
  "qa-testing": ["devops", "software-development", "application-security"],
  "ai-visibility-discovery": ["generative-ai", "llm-development", "data-analytics"],
  "digital-transformation": ["cloud-engineering", "software-development", "artificial-intelligence"],
};

export function relatedServiceSlugs(slug: string): string[] {
  return GROUPS[slug] ?? [];
}

const POST_TOPICS: [RegExp, string][] = [
  [/brand|aeo|visibility|discovery/, "ai-visibility-discovery"],
  [/rag|fine-tun|llm/, "llm-development"],
  [/agent/, "ai-agents"],
  [/multimodal|generative/, "generative-ai"],
  [/data/, "data-engineering"],
  [/cloud|migration/, "cloud-engineering"],
  [/ai-act|compliance/, "artificial-intelligence"],
];

export function serviceForPost(slug: string): string {
  return POST_TOPICS.find(([re]) => re.test(slug))?.[1] ?? "artificial-intelligence";
}
