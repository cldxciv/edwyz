import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export type Industry = {
  slug: string;
  icon: string;
  name: string;
  description: string;
  challenges: string[];
  relatedServiceSlugs: string[];
};

type IndustryTranslation = { name: string; description: string; challenges: string[] };

type IndustryEntry = {
  slug: string;
  icon: string;
  relatedServiceSlugs: string[];
  translations: Record<Locale, IndustryTranslation>;
};

const industryEntries: IndustryEntry[] = [
  {
    slug: "healthcare",
    icon: "heart-pulse",
    relatedServiceSlugs: ["artificial-intelligence", "data-engineering", "cyber-security"],
    translations: {
      en: {
        name: "Healthcare",
        description: "AI-driven diagnostics, patient data platforms, and compliant digital health solutions.",
        challenges: [
          "Patient data spread across disconnected EHR and scheduling systems",
          "Manual diagnostic workflows that don't scale with patient volume",
          "Strict compliance requirements (HIPAA, data residency) for any new system",
        ],
      },
      es: {
        name: "Salud",
        description: "Diagnósticos basados en IA, plataformas de datos de pacientes y soluciones de salud digital conformes con la normativa.",
        challenges: [
          "Datos de pacientes dispersos en sistemas de historia clínica y citas desconectados",
          "Flujos de diagnóstico manuales que no escalan con el volumen de pacientes",
          "Requisitos de cumplimiento estrictos (HIPAA, residencia de datos) para cualquier sistema nuevo",
        ],
      },
      fr: {
        name: "Santé",
        description: "Diagnostics pilotés par l'IA, plateformes de données patients et solutions de santé numérique conformes.",
        challenges: [
          "Données patients dispersées entre des systèmes de dossiers médicaux et de planification déconnectés",
          "Flux de diagnostic manuels qui ne s'adaptent pas au volume de patients",
          "Exigences de conformité strictes (HIPAA, résidence des données) pour tout nouveau système",
        ],
      },
      de: {
        name: "Gesundheitswesen",
        description: "KI-gestützte Diagnostik, Patientendatenplattformen und konforme digitale Gesundheitslösungen.",
        challenges: [
          "Patientendaten verteilt über getrennte EHR- und Terminsysteme",
          "Manuelle Diagnose-Workflows, die nicht mit dem Patientenvolumen skalieren",
          "Strenge Compliance-Anforderungen (HIPAA, Datenresidenz) für jedes neue System",
        ],
      },
    },
  },
  {
    slug: "finance",
    icon: "landmark",
    relatedServiceSlugs: ["ai-agents", "data-analytics", "cyber-security"],
    translations: {
      en: {
        name: "Finance",
        description: "Fraud detection, algorithmic insights, and secure digital banking platforms.",
        challenges: [
          "Fraud patterns that evolve faster than rule-based systems can keep up",
          "Disconnected risk, compliance, and customer data across legacy cores",
          "Real-time decisioning requirements with strict audit and explainability needs",
        ],
      },
      es: {
        name: "Finanzas",
        description: "Detección de fraude, análisis algorítmico y plataformas de banca digital segura.",
        challenges: [
          "Patrones de fraude que evolucionan más rápido de lo que los sistemas basados en reglas pueden seguir",
          "Datos de riesgo, cumplimiento y clientes desconectados entre sistemas centrales heredados",
          "Requisitos de decisión en tiempo real con necesidades estrictas de auditoría y explicabilidad",
        ],
      },
      fr: {
        name: "Finance",
        description: "Détection de fraude, analyses algorithmiques et plateformes bancaires numériques sécurisées.",
        challenges: [
          "Des schémas de fraude qui évoluent plus vite que les systèmes basés sur des règles ne peuvent suivre",
          "Données de risque, de conformité et clients déconnectées entre systèmes cœurs historiques",
          "Exigences de décision en temps réel avec des besoins stricts d'audit et d'explicabilité",
        ],
      },
      de: {
        name: "Finanzwesen",
        description: "Betrugserkennung, algorithmische Einblicke und sichere digitale Banking-Plattformen.",
        challenges: [
          "Betrugsmuster, die sich schneller entwickeln, als regelbasierte Systeme mithalten können",
          "Getrennte Risiko-, Compliance- und Kundendaten über veraltete Kernsysteme",
          "Echtzeit-Entscheidungsanforderungen mit strengen Audit- und Erklärbarkeitsanforderungen",
        ],
      },
    },
  },
  {
    slug: "retail",
    icon: "shopping-bag",
    relatedServiceSlugs: ["generative-ai", "data-analytics", "web-development"],
    translations: {
      en: {
        name: "Retail",
        description: "Personalization engines, demand forecasting, and omnichannel commerce platforms.",
        challenges: [
          "Generic, one-size-fits-all shopping experiences that hurt conversion",
          "Inventory and demand forecasting disconnected from real-time signals",
          "Customer data fragmented across web, app, POS, and loyalty systems",
        ],
      },
      es: {
        name: "Retail",
        description: "Motores de personalización, previsión de demanda y plataformas de comercio omnicanal.",
        challenges: [
          "Experiencias de compra genéricas que perjudican la conversión",
          "Previsión de inventario y demanda desconectada de señales en tiempo real",
          "Datos de clientes fragmentados entre web, app, punto de venta y programas de lealtad",
        ],
      },
      fr: {
        name: "Commerce de détail",
        description: "Moteurs de personnalisation, prévision de la demande et plateformes de commerce omnicanal.",
        challenges: [
          "Des expériences d'achat génériques qui nuisent à la conversion",
          "Prévision des stocks et de la demande déconnectée des signaux en temps réel",
          "Données clients fragmentées entre web, application, point de vente et programmes de fidélité",
        ],
      },
      de: {
        name: "Einzelhandel",
        description: "Personalisierungs-Engines, Bedarfsprognosen und Omnichannel-Commerce-Plattformen.",
        challenges: [
          "Generische Einkaufserlebnisse, die der Konversion schaden",
          "Bestands- und Bedarfsprognosen ohne Anbindung an Echtzeitsignale",
          "Kundendaten verteilt über Web, App, Kasse und Treueprogramme",
        ],
      },
    },
  },
  {
    slug: "manufacturing",
    icon: "factory",
    relatedServiceSlugs: ["machine-learning", "data-engineering", "devops"],
    translations: {
      en: {
        name: "Manufacturing",
        description: "Predictive maintenance, supply chain optimization, and IoT-driven operations.",
        challenges: [
          "Unplanned equipment downtime with no early warning system",
          "Supply chain visibility gaps across plants and suppliers",
          "Legacy OT systems that don't talk to modern data platforms",
        ],
      },
      es: {
        name: "Manufactura",
        description: "Mantenimiento predictivo, optimización de la cadena de suministro y operaciones impulsadas por IoT.",
        challenges: [
          "Tiempo de inactividad de equipos no planificado sin sistema de alerta temprana",
          "Brechas de visibilidad en la cadena de suministro entre plantas y proveedores",
          "Sistemas OT heredados que no se comunican con plataformas de datos modernas",
        ],
      },
      fr: {
        name: "Industrie",
        description: "Maintenance prédictive, optimisation de la chaîne d'approvisionnement et opérations pilotées par l'IoT.",
        challenges: [
          "Des temps d'arrêt d'équipement imprévus sans système d'alerte précoce",
          "Des lacunes de visibilité de la chaîne d'approvisionnement entre usines et fournisseurs",
          "Des systèmes OT existants qui ne communiquent pas avec les plateformes de données modernes",
        ],
      },
      de: {
        name: "Fertigung",
        description: "Vorausschauende Wartung, Optimierung der Lieferkette und IoT-gesteuerte Abläufe.",
        challenges: [
          "Ungeplante Anlagenausfälle ohne Frühwarnsystem",
          "Lücken in der Lieferkettentransparenz zwischen Werken und Lieferanten",
          "Veraltete OT-Systeme, die nicht mit modernen Datenplattformen kommunizieren",
        ],
      },
    },
  },
  {
    slug: "education",
    icon: "graduation-cap",
    relatedServiceSlugs: ["ai-agents", "product-engineering", "web-development"],
    translations: {
      en: {
        name: "Education",
        description: "Adaptive learning platforms and data-driven student success tools.",
        challenges: [
          "Student engagement and outcomes data trapped in disconnected tools",
          "One-size-fits-all curricula that don't adapt to individual pace",
          "Administrative overhead that pulls educators away from teaching",
        ],
      },
      es: {
        name: "Educación",
        description: "Plataformas de aprendizaje adaptativo y herramientas basadas en datos para el éxito estudiantil.",
        challenges: [
          "Datos de participación y resultados estudiantiles atrapados en herramientas desconectadas",
          "Planes de estudio genéricos que no se adaptan al ritmo individual",
          "Carga administrativa que aleja a los educadores de la enseñanza",
        ],
      },
      fr: {
        name: "Éducation",
        description: "Plateformes d'apprentissage adaptatif et outils de réussite étudiante basés sur les données.",
        challenges: [
          "Données d'engagement et de résultats des élèves enfermées dans des outils déconnectés",
          "Des programmes uniformes qui ne s'adaptent pas au rythme individuel",
          "Une charge administrative qui éloigne les enseignants de l'enseignement",
        ],
      },
      de: {
        name: "Bildung",
        description: "Adaptive Lernplattformen und datengestützte Tools für den Studienerfolg.",
        challenges: [
          "Daten zu Engagement und Lernerfolg in getrennten Tools gefangen",
          "Einheitliche Lehrpläne, die sich nicht an das individuelle Tempo anpassen",
          "Verwaltungsaufwand, der Lehrkräfte vom Unterrichten abhält",
        ],
      },
    },
  },
  {
    slug: "logistics",
    icon: "truck",
    relatedServiceSlugs: ["machine-learning", "data-engineering", "mobile-app-development"],
    translations: {
      en: {
        name: "Logistics",
        description: "Route optimization, fleet visibility, and real-time supply chain analytics.",
        challenges: [
          "Route and fleet decisions made on stale or incomplete data",
          "Limited real-time visibility into shipments across carriers",
          "Manual planning processes that can't react to disruptions fast enough",
        ],
      },
      es: {
        name: "Logística",
        description: "Optimización de rutas, visibilidad de flotas y analítica de la cadena de suministro en tiempo real.",
        challenges: [
          "Decisiones de rutas y flotas basadas en datos obsoletos o incompletos",
          "Visibilidad en tiempo real limitada de los envíos entre transportistas",
          "Procesos de planificación manuales que no reaccionan con suficiente rapidez ante interrupciones",
        ],
      },
      fr: {
        name: "Logistique",
        description: "Optimisation des itinéraires, visibilité de la flotte et analytique de la chaîne d'approvisionnement en temps réel.",
        challenges: [
          "Des décisions d'itinéraire et de flotte basées sur des données obsolètes ou incomplètes",
          "Une visibilité en temps réel limitée des expéditions entre transporteurs",
          "Des processus de planification manuels qui ne réagissent pas assez vite aux perturbations",
        ],
      },
      de: {
        name: "Logistik",
        description: "Routenoptimierung, Flottentransparenz und Echtzeit-Analysen der Lieferkette.",
        challenges: [
          "Routen- und Flottenentscheidungen auf Basis veralteter oder unvollständiger Daten",
          "Begrenzte Echtzeit-Transparenz über Sendungen bei verschiedenen Spediteuren",
          "Manuelle Planungsprozesse, die nicht schnell genug auf Störungen reagieren",
        ],
      },
    },
  },
  {
    slug: "government",
    icon: "building-2",
    relatedServiceSlugs: ["cyber-security", "digital-transformation", "software-development"],
    translations: {
      en: {
        name: "Government",
        description: "Secure citizen services platforms and data modernization for public agencies.",
        challenges: [
          "Legacy systems that make citizen services slow and hard to access",
          "Data silos across departments that block coordinated service delivery",
          "Strict security and compliance requirements for any modernization",
        ],
      },
      es: {
        name: "Gobierno",
        description: "Plataformas seguras de servicios al ciudadano y modernización de datos para organismos públicos.",
        challenges: [
          "Sistemas heredados que hacen que los servicios al ciudadano sean lentos y difíciles de usar",
          "Silos de datos entre departamentos que impiden una prestación de servicios coordinada",
          "Requisitos estrictos de seguridad y cumplimiento para cualquier modernización",
        ],
      },
      fr: {
        name: "Secteur public",
        description: "Plateformes sécurisées de services aux citoyens et modernisation des données pour les administrations publiques.",
        challenges: [
          "Des systèmes existants qui rendent les services aux citoyens lents et difficiles d'accès",
          "Des silos de données entre services qui bloquent une prestation coordonnée",
          "Des exigences strictes de sécurité et de conformité pour toute modernisation",
        ],
      },
      de: {
        name: "Behörden",
        description: "Sichere Bürgerserviceplattformen und Datenmodernisierung für öffentliche Einrichtungen.",
        challenges: [
          "Altsysteme, die Bürgerdienste langsam und schwer zugänglich machen",
          "Datensilos zwischen Abteilungen, die eine koordinierte Leistungserbringung blockieren",
          "Strenge Sicherheits- und Compliance-Anforderungen für jede Modernisierung",
        ],
      },
    },
  },
  {
    slug: "telecom",
    icon: "radio-tower",
    relatedServiceSlugs: ["data-analytics", "ai-agents", "cloud-engineering"],
    translations: {
      en: {
        name: "Telecom",
        description: "Network analytics, churn prediction, and customer experience platforms.",
        challenges: [
          "High customer churn with limited early warning signals",
          "Network performance issues detected only after customers complain",
          "Customer experience data spread across billing, support, and network systems",
        ],
      },
      es: {
        name: "Telecomunicaciones",
        description: "Analítica de redes, predicción de abandono y plataformas de experiencia del cliente.",
        challenges: [
          "Alta tasa de abandono de clientes con señales de alerta temprana limitadas",
          "Problemas de rendimiento de red detectados solo después de quejas de clientes",
          "Datos de experiencia del cliente dispersos entre facturación, soporte y sistemas de red",
        ],
      },
      fr: {
        name: "Télécommunications",
        description: "Analytique réseau, prédiction de l'attrition et plateformes d'expérience client.",
        challenges: [
          "Un taux d'attrition élevé avec des signaux d'alerte précoce limités",
          "Des problèmes de performance réseau détectés seulement après des plaintes clients",
          "Des données d'expérience client dispersées entre facturation, support et systèmes réseau",
        ],
      },
      de: {
        name: "Telekommunikation",
        description: "Netzwerkanalysen, Abwanderungsprognosen und Customer-Experience-Plattformen.",
        challenges: [
          "Hohe Kundenabwanderung mit begrenzten Frühwarnsignalen",
          "Netzwerkprobleme werden erst nach Kundenbeschwerden erkannt",
          "Customer-Experience-Daten verteilt über Abrechnung, Support und Netzwerksysteme",
        ],
      },
    },
  },
  {
    slug: "real-estate",
    icon: "building",
    relatedServiceSlugs: ["data-analytics", "web-development", "digital-transformation"],
    translations: {
      en: {
        name: "Real Estate",
        description: "Property analytics, valuation models, and digital transaction platforms.",
        challenges: [
          "Property valuations based on outdated or incomplete market data",
          "Manual, paper-heavy transaction and due-diligence processes",
          "Buyer and tenant data disconnected from marketing and sales systems",
        ],
      },
      es: {
        name: "Bienes Raíces",
        description: "Analítica inmobiliaria, modelos de valoración y plataformas de transacciones digitales.",
        challenges: [
          "Valoraciones de propiedades basadas en datos de mercado desactualizados o incompletos",
          "Procesos de transacción y diligencia debida manuales y cargados de papeleo",
          "Datos de compradores e inquilinos desconectados de los sistemas de marketing y ventas",
        ],
      },
      fr: {
        name: "Immobilier",
        description: "Analytique immobilière, modèles d'évaluation et plateformes de transactions numériques.",
        challenges: [
          "Des évaluations immobilières basées sur des données de marché obsolètes ou incomplètes",
          "Des processus de transaction et de due diligence manuels et chargés de papier",
          "Des données acheteurs et locataires déconnectées des systèmes marketing et ventes",
        ],
      },
      de: {
        name: "Immobilien",
        description: "Immobilienanalysen, Bewertungsmodelle und digitale Transaktionsplattformen.",
        challenges: [
          "Immobilienbewertungen auf Basis veralteter oder unvollständiger Marktdaten",
          "Manuelle, papierintensive Transaktions- und Due-Diligence-Prozesse",
          "Käufer- und Mieterdaten ohne Anbindung an Marketing- und Vertriebssysteme",
        ],
      },
    },
  },
];

function toIndustry(entry: IndustryEntry, locale: Locale): Industry {
  const translation = entry.translations[locale] ?? entry.translations.en;
  return {
    slug: entry.slug,
    icon: entry.icon,
    relatedServiceSlugs: entry.relatedServiceSlugs,
    ...translation,
  };
}

export async function getIndustries(): Promise<Industry[]> {
  const locale = (await getLocale()) as Locale;
  return industryEntries.map((entry) => toIndustry(entry, locale));
}

/** Locale-independent accessor for contexts without a next-intl request context (e.g. the AI knowledge base). */
export function getIndustriesInLocale(locale: Locale = "en"): Industry[] {
  return industryEntries.map((entry) => toIndustry(entry, locale));
}

export async function getIndustryBySlug(slug: string): Promise<Industry | undefined> {
  const locale = (await getLocale()) as Locale;
  const entry = industryEntries.find((i) => i.slug === slug);
  return entry ? toIndustry(entry, locale) : undefined;
}

export function getIndustrySlugs(): string[] {
  return industryEntries.map((entry) => entry.slug);
}
