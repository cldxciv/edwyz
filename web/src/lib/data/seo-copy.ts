import type { Locale } from "@/i18n/routing";

type Seo = { title: string; description: string };

const SERVICE_EN: Record<string, Seo> = {
  "artificial-intelligence": {
    title: "AI Consulting & Implementation Services",
    description:
      "Move from AI pilots to production systems that deliver measurable results. Edwyz provides end-to-end AI consulting and implementation. Book a call.",
  },
  "machine-learning": {
    title: "Machine Learning Development Services",
    description:
      "Predictive models that learn from your data and ship to production. Edwyz delivers machine learning development services. Book a consultation.",
  },
  "generative-ai": {
    title: "Generative AI Development Services",
    description:
      "Cut cycle times with generative AI built on your own data. Edwyz delivers generative AI development services for enterprises. Book a consultation.",
  },
  "llm-development": {
    title: "LLM Development Services",
    description:
      "Ship secure, accurate LLM applications grounded in your data. Edwyz provides custom LLM development, RAG and fine-tuning. Book a consultation.",
  },
  "ai-agents": {
    title: "AI Agent Development Services",
    description:
      "Automate multi-step work with autonomous AI agents that take real action. Edwyz provides AI agent development services. Book a consultation.",
  },
  "cloud-engineering": {
    title: "Cloud Engineering Services",
    description:
      "Run on scalable, secure and cost-efficient cloud infrastructure. Edwyz provides cloud engineering and migration services. Book a consultation.",
  },
  "data-engineering": {
    title: "Data Engineering Services",
    description:
      "Replace brittle scripts and spreadsheets with reliable data pipelines. Edwyz provides data engineering services for analytics and AI. Book a call.",
  },
  "data-analytics": {
    title: "Data Analytics Services",
    description:
      "Turn raw data into decisions your teams can act on. Edwyz provides data analytics services, from dashboards to predictive models. Book a call.",
  },
  "business-intelligence": {
    title: "Business Intelligence Services",
    description:
      "Give every team one trusted view of the business. Edwyz builds enterprise business intelligence platforms and dashboards. Book a consultation.",
  },
  devops: {
    title: "DevOps Consulting Services",
    description:
      "Ship software faster and safer with automated CI/CD and infrastructure as code. Edwyz provides DevOps consulting services. Book a consultation.",
  },
  "software-development": {
    title: "Custom Software Development Services",
    description:
      "Get custom software built right, from architecture to launch. Edwyz provides custom software development services for enterprises. Book a call.",
  },
  "product-engineering": {
    title: "Product Engineering Services",
    description:
      "Take your product from idea to a shipped, scalable release. Edwyz provides product engineering services across design, build and scale. Book a call.",
  },
  "mobile-app-development": {
    title: "Mobile App Development Services",
    description:
      "Launch fast, reliable iOS and Android apps your users keep. Edwyz provides native and cross-platform mobile app development. Book a consultation.",
  },
  "web-development": {
    title: "Web Development Services",
    description:
      "Launch fast, accessible, modern web applications that convert. Edwyz provides web development services for enterprises. Book a consultation.",
  },
  "cyber-security": {
    title: "Cyber Security Services",
    description:
      "Protect your systems, data and customers before attackers find the gaps. Edwyz provides enterprise cyber security services. Book a consultation.",
  },
  "penetration-testing": {
    title: "Penetration Testing Services",
    description:
      "Find and fix exploitable weaknesses before attackers do. Edwyz provides penetration testing services with clear remediation guidance. Book a test.",
  },
  "application-security": {
    title: "Application Security Services",
    description:
      "Build security into every layer of your software. Edwyz provides application security services, from code review to threat modelling. Book a call.",
  },
  "qa-testing": {
    title: "QA & Software Testing Services",
    description:
      "Catch defects before your customers do. Edwyz provides QA and software testing services with automation built in. Book a consultation.",
  },
  "ai-visibility-discovery": {
    title: "AI Visibility & AEO Services",
    description:
      "Audit and improve how your brand is described in AI assistants and AI search. Clear scope, honest limits, no guaranteed placements. Talk to Edwyz.",
  },
  "digital-transformation": {
    title: "Digital Transformation Services",
    description:
      "Modernise legacy systems and operations without disrupting the business. Edwyz provides digital transformation services. Book a consultation.",
  },
};

const INDUSTRY_EN: Record<string, string> = {
  healthcare:
    "AI-driven diagnostics, patient data platforms and compliant digital health systems. Edwyz builds healthcare AI and software solutions. Talk to our team.",
  finance:
    "Fraud detection, risk models and real-time analytics for regulated finance teams. Edwyz builds finance AI and software solutions. Talk to our team.",
  retail:
    "Demand forecasting, personalisation and unified commerce data. Edwyz builds retail AI and software solutions that grow revenue. Talk to our team.",
  manufacturing:
    "Predictive maintenance, quality vision and connected-factory data. Edwyz builds manufacturing AI and software that cuts downtime. Talk to our team.",
  education:
    "Adaptive learning, student analytics and scalable learning platforms. Edwyz builds education AI and software solutions for institutions. Talk to our team.",
  logistics:
    "Route optimisation, demand forecasting and real-time shipment visibility. Edwyz builds logistics AI and software solutions. Talk to our team.",
  government:
    "Secure, accessible digital services and data platforms for the public sector. Edwyz builds government AI and software solutions. Talk to our team.",
  telecom:
    "Network analytics, churn prediction and scalable billing and customer platforms. Edwyz builds telecom AI and software solutions. Talk to our team.",
  "real-estate":
    "Valuation models, listing intelligence and tenant-experience platforms. Edwyz builds real estate AI and software solutions. Talk to our team.",
};

function pick(candidates: string[]): string {
  const inRange = candidates.find((c) => c.length >= 120 && c.length <= 155);
  if (inRange) return inRange;
  const dist = (c: string) => (c.length < 120 ? 120 - c.length : c.length - 155);
  return [...candidates].sort((x, y) => dist(x) - dist(y))[0];
}

const SERVICE_L10N: Record<Exclude<Locale, "en">, { title: (n: string) => string; core: (n: string) => string; extra: string; cta: string }> = {
  es: {
    title: (n) => `Servicios de ${n} para Empresas`,
    core: (n) => `Servicios de ${n} de Edwyz para empresas.`,
    extra: "De la estrategia a producción.",
    cta: "Reserve una consulta.",
  },
  fr: {
    title: (n) => `Services ${n} pour Entreprises`,
    core: (n) => `Services ${n} d'Edwyz pour entreprises.`,
    extra: "De la stratégie à la production.",
    cta: "Réservez une consultation.",
  },
  de: {
    title: (n) => `${n}-Services für Unternehmen`,
    core: (n) => `${n}-Services von Edwyz für Unternehmen.`,
    extra: "Von Strategie bis Produktion.",
    cta: "Jetzt Beratung buchen.",
  },
};

const INDUSTRY_L10N: Record<Exclude<Locale, "en">, { title: (n: string) => string; core: (n: string) => string; cta: string }> = {
  es: {
    title: (n) => `Soluciones de IA y Software: ${n}`,
    core: (n) => `IA y software de Edwyz para ${n.toLowerCase()}.`,
    cta: "Hable con nuestros ingenieros.",
  },
  fr: {
    title: (n) => `Solutions IA et Logiciels : ${n}`,
    core: (n) => `IA et logiciels Edwyz : ${n.toLowerCase()}.`,
    cta: "Parlez à nos ingénieurs.",
  },
  de: {
    title: (n) => `KI- und Software-Lösungen: ${n}`,
    core: (n) => `KI und Software von Edwyz für ${n}.`,
    cta: "Jetzt Gespräch vereinbaren.",
  },
};

export function serviceSeo(slug: string, locale: Locale, name: string, short: string): Seo {
  if (locale === "en") {
    return (
      SERVICE_EN[slug] ?? {
        title: `${name} Services`,
        description: `${short} Edwyz provides ${name} services for enterprises. Book a consultation.`,
      }
    );
  }
  const l = SERVICE_L10N[locale];
  const core = l.core(name);
  return {
    title: l.title(name),
    description: pick([
      `${short} ${core} ${l.extra} ${l.cta}`,
      `${short} ${core} ${l.cta}`,
      `${core} ${l.extra} ${l.cta}`,
      `${core} ${l.cta}`,
    ]),
  };
}

export function industrySeo(slug: string, locale: Locale, name: string, description: string): Seo {
  if (locale === "en") {
    return {
      title: `${name} AI & Software Solutions`,
      description:
        INDUSTRY_EN[slug] ?? `${description} Edwyz builds ${name.toLowerCase()} AI and software solutions. Talk to our team.`,
    };
  }
  const l = INDUSTRY_L10N[locale];
  const core = l.core(name);
  return {
    title: l.title(name),
    description: pick([
      `${description} ${core} ${l.cta}`,
      `${description} ${core}`,
      `${description} ${l.cta}`,
      `${core} ${l.cta}`,
      description,
    ]),
  };
}
