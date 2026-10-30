const CATEGORY_ICONS: Record<string, string> = {
  "AI Strategy": "brain-circuit",
  Engineering: "code-2",
  "Data & Analytics": "bar-chart-3",
  Security: "shield",
  Product: "layers",
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? "sparkles";
}

const INDUSTRY_ICONS: Record<string, string> = {
  Healthcare: "heart-pulse",
  Finance: "landmark",
  Retail: "shopping-bag",
  Manufacturing: "factory",
  Education: "graduation-cap",
  Logistics: "truck",
  Government: "building-2",
  Telecom: "radio-tower",
  "Real Estate": "building",
};

export function getIndustryIcon(industry: string): string {
  return INDUSTRY_ICONS[industry] ?? "sparkles";
}
