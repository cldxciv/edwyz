import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export type Industry = {
  slug: string;
  icon: string;
  name: string;
  description: string;
};

type IndustryTranslation = { name: string; description: string };

type IndustryEntry = {
  slug: string;
  icon: string;
  translations: Record<Locale, IndustryTranslation>;
};

const industryEntries: IndustryEntry[] = [
  {
    slug: "healthcare",
    icon: "heart-pulse",
    translations: {
      en: { name: "Healthcare", description: "AI-driven diagnostics, patient data platforms, and compliant digital health solutions." },
      es: { name: "Salud", description: "Diagnósticos basados en IA, plataformas de datos de pacientes y soluciones de salud digital conformes con la normativa." },
      fr: { name: "Santé", description: "Diagnostics pilotés par l'IA, plateformes de données patients et solutions de santé numérique conformes." },
      de: { name: "Gesundheitswesen", description: "KI-gestützte Diagnostik, Patientendatenplattformen und konforme digitale Gesundheitslösungen." },
    },
  },
  {
    slug: "finance",
    icon: "landmark",
    translations: {
      en: { name: "Finance", description: "Fraud detection, algorithmic insights, and secure digital banking platforms." },
      es: { name: "Finanzas", description: "Detección de fraude, análisis algorítmico y plataformas de banca digital segura." },
      fr: { name: "Finance", description: "Détection de fraude, analyses algorithmiques et plateformes bancaires numériques sécurisées." },
      de: { name: "Finanzwesen", description: "Betrugserkennung, algorithmische Einblicke und sichere digitale Banking-Plattformen." },
    },
  },
  {
    slug: "retail",
    icon: "shopping-bag",
    translations: {
      en: { name: "Retail", description: "Personalization engines, demand forecasting, and omnichannel commerce platforms." },
      es: { name: "Retail", description: "Motores de personalización, previsión de demanda y plataformas de comercio omnicanal." },
      fr: { name: "Commerce de détail", description: "Moteurs de personnalisation, prévision de la demande et plateformes de commerce omnicanal." },
      de: { name: "Einzelhandel", description: "Personalisierungs-Engines, Bedarfsprognosen und Omnichannel-Commerce-Plattformen." },
    },
  },
  {
    slug: "manufacturing",
    icon: "factory",
    translations: {
      en: { name: "Manufacturing", description: "Predictive maintenance, supply chain optimization, and IoT-driven operations." },
      es: { name: "Manufactura", description: "Mantenimiento predictivo, optimización de la cadena de suministro y operaciones impulsadas por IoT." },
      fr: { name: "Industrie", description: "Maintenance prédictive, optimisation de la chaîne d'approvisionnement et opérations pilotées par l'IoT." },
      de: { name: "Fertigung", description: "Vorausschauende Wartung, Optimierung der Lieferkette und IoT-gesteuerte Abläufe." },
    },
  },
  {
    slug: "education",
    icon: "graduation-cap",
    translations: {
      en: { name: "Education", description: "Adaptive learning platforms and data-driven student success tools." },
      es: { name: "Educación", description: "Plataformas de aprendizaje adaptativo y herramientas basadas en datos para el éxito estudiantil." },
      fr: { name: "Éducation", description: "Plateformes d'apprentissage adaptatif et outils de réussite étudiante basés sur les données." },
      de: { name: "Bildung", description: "Adaptive Lernplattformen und datengestützte Tools für den Studienerfolg." },
    },
  },
  {
    slug: "logistics",
    icon: "truck",
    translations: {
      en: { name: "Logistics", description: "Route optimization, fleet visibility, and real-time supply chain analytics." },
      es: { name: "Logística", description: "Optimización de rutas, visibilidad de flotas y analítica de la cadena de suministro en tiempo real." },
      fr: { name: "Logistique", description: "Optimisation des itinéraires, visibilité de la flotte et analytique de la chaîne d'approvisionnement en temps réel." },
      de: { name: "Logistik", description: "Routenoptimierung, Flottentransparenz und Echtzeit-Analysen der Lieferkette." },
    },
  },
  {
    slug: "government",
    icon: "building-2",
    translations: {
      en: { name: "Government", description: "Secure citizen services platforms and data modernization for public agencies." },
      es: { name: "Gobierno", description: "Plataformas seguras de servicios al ciudadano y modernización de datos para organismos públicos." },
      fr: { name: "Secteur public", description: "Plateformes sécurisées de services aux citoyens et modernisation des données pour les administrations publiques." },
      de: { name: "Behörden", description: "Sichere Bürgerserviceplattformen und Datenmodernisierung für öffentliche Einrichtungen." },
    },
  },
  {
    slug: "telecom",
    icon: "radio-tower",
    translations: {
      en: { name: "Telecom", description: "Network analytics, churn prediction, and customer experience platforms." },
      es: { name: "Telecomunicaciones", description: "Analítica de redes, predicción de abandono y plataformas de experiencia del cliente." },
      fr: { name: "Télécommunications", description: "Analytique réseau, prédiction de l'attrition et plateformes d'expérience client." },
      de: { name: "Telekommunikation", description: "Netzwerkanalysen, Abwanderungsprognosen und Customer-Experience-Plattformen." },
    },
  },
  {
    slug: "real-estate",
    icon: "building",
    translations: {
      en: { name: "Real Estate", description: "Property analytics, valuation models, and digital transaction platforms." },
      es: { name: "Bienes Raíces", description: "Analítica inmobiliaria, modelos de valoración y plataformas de transacciones digitales." },
      fr: { name: "Immobilier", description: "Analytique immobilière, modèles d'évaluation et plateformes de transactions numériques." },
      de: { name: "Immobilien", description: "Immobilienanalysen, Bewertungsmodelle und digitale Transaktionsplattformen." },
    },
  },
];

function toIndustry(entry: IndustryEntry, locale: Locale): Industry {
  const translation = entry.translations[locale] ?? entry.translations.en;
  return { slug: entry.slug, icon: entry.icon, ...translation };
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
