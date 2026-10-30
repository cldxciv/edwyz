import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export type Industry = {
  slug: string;
  icon: string;
  name: string;
  description: string;
  overview: string;
  challenges: string[];
  relatedServiceSlugs: string[];
};

type IndustryTranslation = { name: string; description: string; overview: string; challenges: string[] };

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
        overview:
          "Healthcare organizations sit on more data than almost any other industry — clinical records, imaging, claims, wearables — yet most of it stays locked in disconnected systems that can't talk to each other. We help health systems and digital health companies turn that data into something useful: earlier diagnoses, smarter triage, and operational efficiency, without compromising on the compliance and security standards patient data demands.",
        challenges: [
          "Patient data spread across disconnected EHR and scheduling systems",
          "Manual diagnostic workflows that don't scale with patient volume",
          "Strict compliance requirements (HIPAA, data residency) for any new system",
        ],
      },
      es: {
        name: "Salud",
        description: "Diagnósticos basados en IA, plataformas de datos de pacientes y soluciones de salud digital conformes con la normativa.",
        overview:
          "Las organizaciones de salud manejan más datos que casi cualquier otra industria — historiales clínicos, imágenes, reclamaciones, wearables — pero la mayoría permanece encerrada en sistemas desconectados que no se comunican entre sí. Ayudamos a sistemas de salud y empresas de salud digital a convertir esos datos en algo útil: diagnósticos más tempranos, triaje más inteligente y eficiencia operativa, sin comprometer los estándares de cumplimiento y seguridad que exigen los datos de pacientes.",
        challenges: [
          "Datos de pacientes dispersos en sistemas de historia clínica y citas desconectados",
          "Flujos de diagnóstico manuales que no escalan con el volumen de pacientes",
          "Requisitos de cumplimiento estrictos (HIPAA, residencia de datos) para cualquier sistema nuevo",
        ],
      },
      fr: {
        name: "Santé",
        description: "Diagnostics pilotés par l'IA, plateformes de données patients et solutions de santé numérique conformes.",
        overview:
          "Les organisations de santé détiennent plus de données que presque tout autre secteur — dossiers cliniques, imagerie, remboursements, objets connectés — mais la majorité reste enfermée dans des systèmes déconnectés qui ne communiquent pas entre eux. Nous aidons les systèmes de santé et les entreprises de santé numérique à transformer ces données en quelque chose d'utile : des diagnostics plus précoces, un triage plus intelligent et une efficacité opérationnelle, sans compromettre les normes de conformité et de sécurité qu'exigent les données patients.",
        challenges: [
          "Données patients dispersées entre des systèmes de dossiers médicaux et de planification déconnectés",
          "Flux de diagnostic manuels qui ne s'adaptent pas au volume de patients",
          "Exigences de conformité strictes (HIPAA, résidence des données) pour tout nouveau système",
        ],
      },
      de: {
        name: "Gesundheitswesen",
        description: "KI-gestützte Diagnostik, Patientendatenplattformen und konforme digitale Gesundheitslösungen.",
        overview:
          "Gesundheitsorganisationen verfügen über mehr Daten als fast jede andere Branche — klinische Aufzeichnungen, Bildgebung, Abrechnungen, Wearables — doch der Großteil bleibt in getrennten Systemen gefangen, die nicht miteinander kommunizieren. Wir helfen Gesundheitssystemen und Digital-Health-Unternehmen, diese Daten in etwas Nützliches zu verwandeln: frühere Diagnosen, intelligentere Triage und betriebliche Effizienz, ohne Kompromisse bei den Compliance- und Sicherheitsstandards, die Patientendaten erfordern.",
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
        overview:
          "Financial institutions operate at the intersection of speed and scrutiny — every model needs to be fast enough for real-time decisions and explainable enough to survive an audit. We've built fraud detection, credit risk, and customer intelligence systems that meet both bars, integrating with legacy cores rather than asking you to rip and replace them.",
        challenges: [
          "Fraud patterns that evolve faster than rule-based systems can keep up",
          "Disconnected risk, compliance, and customer data across legacy cores",
          "Real-time decisioning requirements with strict audit and explainability needs",
        ],
      },
      es: {
        name: "Finanzas",
        description: "Detección de fraude, análisis algorítmico y plataformas de banca digital segura.",
        overview:
          "Las instituciones financieras operan en la intersección entre velocidad y escrutinio — cada modelo debe ser lo bastante rápido para decisiones en tiempo real y lo bastante explicable para sobrevivir una auditoría. Hemos construido sistemas de detección de fraude, riesgo crediticio e inteligencia de clientes que cumplen ambos estándares, integrándose con los sistemas centrales existentes en lugar de exigir reemplazarlos por completo.",
        challenges: [
          "Patrones de fraude que evolucionan más rápido de lo que los sistemas basados en reglas pueden seguir",
          "Datos de riesgo, cumplimiento y clientes desconectados entre sistemas centrales heredados",
          "Requisitos de decisión en tiempo real con necesidades estrictas de auditoría y explicabilidad",
        ],
      },
      fr: {
        name: "Finance",
        description: "Détection de fraude, analyses algorithmiques et plateformes bancaires numériques sécurisées.",
        overview:
          "Les institutions financières opèrent à la croisée de la rapidité et du contrôle — chaque modèle doit être assez rapide pour des décisions en temps réel et assez explicable pour résister à un audit. Nous avons construit des systèmes de détection de fraude, de risque de crédit et d'intelligence client qui répondent à ces deux exigences, en s'intégrant aux systèmes cœurs existants plutôt que d'exiger leur remplacement complet.",
        challenges: [
          "Des schémas de fraude qui évoluent plus vite que les systèmes basés sur des règles ne peuvent suivre",
          "Données de risque, de conformité et clients déconnectées entre systèmes cœurs historiques",
          "Exigences de décision en temps réel avec des besoins stricts d'audit et d'explicabilité",
        ],
      },
      de: {
        name: "Finanzwesen",
        description: "Betrugserkennung, algorithmische Einblicke und sichere digitale Banking-Plattformen.",
        overview:
          "Finanzinstitute bewegen sich im Spannungsfeld zwischen Geschwindigkeit und Prüfung — jedes Modell muss schnell genug für Echtzeitentscheidungen und erklärbar genug sein, um ein Audit zu überstehen. Wir haben Systeme für Betrugserkennung, Kreditrisiko und Kundenanalyse entwickelt, die beide Anforderungen erfüllen und sich in bestehende Kernsysteme integrieren, statt deren vollständigen Austausch zu verlangen.",
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
        overview:
          "Retail margins are won or lost in the details — a recommendation that lands, a restock that happens before the shelf goes empty, a checkout that doesn't lose the sale. We build the personalization, forecasting, and unified customer data infrastructure that turns those details from guesswork into a repeatable advantage across every channel you sell on.",
        challenges: [
          "Generic, one-size-fits-all shopping experiences that hurt conversion",
          "Inventory and demand forecasting disconnected from real-time signals",
          "Customer data fragmented across web, app, POS, and loyalty systems",
        ],
      },
      es: {
        name: "Retail",
        description: "Motores de personalización, previsión de demanda y plataformas de comercio omnicanal.",
        overview:
          "Los márgenes en retail se ganan o se pierden en los detalles — una recomendación que conecta, una reposición que ocurre antes de que el estante quede vacío, un pago que no pierde la venta. Construimos la infraestructura de personalización, previsión y datos de clientes unificados que convierte esos detalles de conjeturas en una ventaja repetible en cada canal en el que vende.",
        challenges: [
          "Experiencias de compra genéricas que perjudican la conversión",
          "Previsión de inventario y demanda desconectada de señales en tiempo real",
          "Datos de clientes fragmentados entre web, app, punto de venta y programas de lealtad",
        ],
      },
      fr: {
        name: "Commerce de détail",
        description: "Moteurs de personnalisation, prévision de la demande et plateformes de commerce omnicanal.",
        overview:
          "Les marges du commerce de détail se gagnent ou se perdent dans les détails — une recommandation qui fait mouche, un réapprovisionnement qui arrive avant la rupture de stock, un paiement qui ne fait pas perdre la vente. Nous construisons l'infrastructure de personnalisation, de prévision et de données clients unifiées qui transforme ces détails d'une question de hasard en un avantage reproductible sur chaque canal de vente.",
        challenges: [
          "Des expériences d'achat génériques qui nuisent à la conversion",
          "Prévision des stocks et de la demande déconnectée des signaux en temps réel",
          "Données clients fragmentées entre web, application, point de vente et programmes de fidélité",
        ],
      },
      de: {
        name: "Einzelhandel",
        description: "Personalisierungs-Engines, Bedarfsprognosen und Omnichannel-Commerce-Plattformen.",
        overview:
          "Margen im Einzelhandel werden in den Details gewonnen oder verloren — eine Empfehlung, die trifft, ein Nachschub, der eintritt, bevor das Regal leer ist, ein Checkout, der den Verkauf nicht verliert. Wir bauen die Personalisierungs-, Prognose- und einheitliche Kundendateninfrastruktur, die diese Details von Vermutungen in einen wiederholbaren Vorteil über jeden Verkaufskanal verwandelt.",
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
        overview:
          "Manufacturing runs on physical assets that don't forgive downtime — a single unplanned outage can cost more than a year of monitoring software. We instrument equipment, build the data pipelines to make sense of the signals, and deploy predictive models that give maintenance teams a head start measured in days, not minutes.",
        challenges: [
          "Unplanned equipment downtime with no early warning system",
          "Supply chain visibility gaps across plants and suppliers",
          "Legacy OT systems that don't talk to modern data platforms",
        ],
      },
      es: {
        name: "Manufactura",
        description: "Mantenimiento predictivo, optimización de la cadena de suministro y operaciones impulsadas por IoT.",
        overview:
          "La manufactura depende de activos físicos que no perdonan el tiempo de inactividad — una sola interrupción no planificada puede costar más que un año de software de monitoreo. Instrumentamos equipos, construimos los pipelines de datos para darle sentido a las señales, y desplegamos modelos predictivos que dan a los equipos de mantenimiento una ventaja medida en días, no en minutos.",
        challenges: [
          "Tiempo de inactividad de equipos no planificado sin sistema de alerta temprana",
          "Brechas de visibilidad en la cadena de suministro entre plantas y proveedores",
          "Sistemas OT heredados que no se comunican con plataformas de datos modernas",
        ],
      },
      fr: {
        name: "Industrie",
        description: "Maintenance prédictive, optimisation de la chaîne d'approvisionnement et opérations pilotées par l'IoT.",
        overview:
          "L'industrie repose sur des actifs physiques qui ne pardonnent pas les arrêts — une seule panne imprévue peut coûter plus qu'une année de logiciel de surveillance. Nous instrumentons les équipements, construisons les pipelines de données pour donner du sens aux signaux, et déployons des modèles prédictifs qui donnent aux équipes de maintenance une avance mesurée en jours, pas en minutes.",
        challenges: [
          "Des temps d'arrêt d'équipement imprévus sans système d'alerte précoce",
          "Des lacunes de visibilité de la chaîne d'approvisionnement entre usines et fournisseurs",
          "Des systèmes OT existants qui ne communiquent pas avec les plateformes de données modernes",
        ],
      },
      de: {
        name: "Fertigung",
        description: "Vorausschauende Wartung, Optimierung der Lieferkette und IoT-gesteuerte Abläufe.",
        overview:
          "Die Fertigung basiert auf physischen Anlagen, die keine Ausfallzeiten verzeihen — ein einziger ungeplanter Stillstand kann mehr kosten als ein Jahr Überwachungssoftware. Wir statten Anlagen mit Sensoren aus, bauen die Daten-Pipelines, um die Signale zu verstehen, und setzen Vorhersagemodelle ein, die Wartungsteams einen in Tagen statt Minuten gemessenen Vorsprung verschaffen.",
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
        overview:
          "Educational institutions are under pressure to personalize learning and prove outcomes with fewer resources, not more. We build adaptive learning platforms and student-success analytics that surface which students need help before they fall behind, without adding to the administrative burden already weighing on educators.",
        challenges: [
          "Student engagement and outcomes data trapped in disconnected tools",
          "One-size-fits-all curricula that don't adapt to individual pace",
          "Administrative overhead that pulls educators away from teaching",
        ],
      },
      es: {
        name: "Educación",
        description: "Plataformas de aprendizaje adaptativo y herramientas basadas en datos para el éxito estudiantil.",
        overview:
          "Las instituciones educativas están bajo presión para personalizar el aprendizaje y demostrar resultados con menos recursos, no más. Construimos plataformas de aprendizaje adaptativo y analítica de éxito estudiantil que identifican qué estudiantes necesitan ayuda antes de quedarse atrás, sin añadir más carga administrativa a la que ya pesa sobre los educadores.",
        challenges: [
          "Datos de participación y resultados estudiantiles atrapados en herramientas desconectadas",
          "Planes de estudio genéricos que no se adaptan al ritmo individual",
          "Carga administrativa que aleja a los educadores de la enseñanza",
        ],
      },
      fr: {
        name: "Éducation",
        description: "Plateformes d'apprentissage adaptatif et outils de réussite étudiante basés sur les données.",
        overview:
          "Les établissements d'enseignement subissent une pression pour personnaliser l'apprentissage et démontrer des résultats avec moins de ressources, pas plus. Nous construisons des plateformes d'apprentissage adaptatif et des outils d'analyse de la réussite étudiante qui identifient les élèves ayant besoin d'aide avant qu'ils ne soient distancés, sans ajouter à la charge administrative qui pèse déjà sur les enseignants.",
        challenges: [
          "Données d'engagement et de résultats des élèves enfermées dans des outils déconnectés",
          "Des programmes uniformes qui ne s'adaptent pas au rythme individuel",
          "Une charge administrative qui éloigne les enseignants de l'enseignement",
        ],
      },
      de: {
        name: "Bildung",
        description: "Adaptive Lernplattformen und datengestützte Tools für den Studienerfolg.",
        overview:
          "Bildungseinrichtungen stehen unter dem Druck, das Lernen zu personalisieren und Ergebnisse mit weniger statt mehr Ressourcen nachzuweisen. Wir bauen adaptive Lernplattformen und Analysen zum Lernerfolg, die zeigen, welche Studierenden Hilfe brauchen, bevor sie zurückfallen — ohne die Verwaltungslast zu erhöhen, die bereits auf Lehrkräften liegt.",
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
        overview:
          "Logistics margins are thin and the cost of a bad decision compounds fast — a suboptimal route or a missed disruption ripples through the whole network. We build the real-time visibility and optimization systems that let dispatchers and planners react in minutes instead of hours, across fleets, carriers, and warehouses.",
        challenges: [
          "Route and fleet decisions made on stale or incomplete data",
          "Limited real-time visibility into shipments across carriers",
          "Manual planning processes that can't react to disruptions fast enough",
        ],
      },
      es: {
        name: "Logística",
        description: "Optimización de rutas, visibilidad de flotas y analítica de la cadena de suministro en tiempo real.",
        overview:
          "Los márgenes en logística son ajustados y el costo de una mala decisión se multiplica rápido — una ruta subóptima o una interrupción no detectada repercute en toda la red. Construimos los sistemas de visibilidad en tiempo real y optimización que permiten a despachadores y planificadores reaccionar en minutos en lugar de horas, en flotas, transportistas y almacenes.",
        challenges: [
          "Decisiones de rutas y flotas basadas en datos obsoletos o incompletos",
          "Visibilidad en tiempo real limitada de los envíos entre transportistas",
          "Procesos de planificación manuales que no reaccionan con suficiente rapidez ante interrupciones",
        ],
      },
      fr: {
        name: "Logistique",
        description: "Optimisation des itinéraires, visibilité de la flotte et analytique de la chaîne d'approvisionnement en temps réel.",
        overview:
          "Les marges en logistique sont étroites et le coût d'une mauvaise décision s'amplifie vite — un itinéraire sous-optimal ou une perturbation manquée se répercute sur tout le réseau. Nous construisons les systèmes de visibilité en temps réel et d'optimisation qui permettent aux répartiteurs et planificateurs de réagir en minutes plutôt qu'en heures, sur les flottes, transporteurs et entrepôts.",
        challenges: [
          "Des décisions d'itinéraire et de flotte basées sur des données obsolètes ou incomplètes",
          "Une visibilité en temps réel limitée des expéditions entre transporteurs",
          "Des processus de planification manuels qui ne réagissent pas assez vite aux perturbations",
        ],
      },
      de: {
        name: "Logistik",
        description: "Routenoptimierung, Flottentransparenz und Echtzeit-Analysen der Lieferkette.",
        overview:
          "Die Margen in der Logistik sind knapp, und die Kosten einer schlechten Entscheidung summieren sich schnell — eine suboptimale Route oder eine übersehene Störung wirkt sich auf das gesamte Netzwerk aus. Wir bauen die Echtzeit-Transparenz- und Optimierungssysteme, die Disponenten und Planern erlauben, in Minuten statt Stunden zu reagieren — über Flotten, Spediteure und Lager hinweg.",
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
        overview:
          "Public agencies carry the highest bar for security and accessibility, and the least tolerance for downtime or failed modernization projects. We approach government technology work with that reality first — incremental, well-governed delivery that modernizes citizen services without betting the agency's reputation on a single big-bang rollout.",
        challenges: [
          "Legacy systems that make citizen services slow and hard to access",
          "Data silos across departments that block coordinated service delivery",
          "Strict security and compliance requirements for any modernization",
        ],
      },
      es: {
        name: "Gobierno",
        description: "Plataformas seguras de servicios al ciudadano y modernización de datos para organismos públicos.",
        overview:
          "Los organismos públicos enfrentan el estándar más alto en seguridad y accesibilidad, y la menor tolerancia a interrupciones o proyectos de modernización fallidos. Abordamos el trabajo tecnológico gubernamental con esa realidad como prioridad — entrega incremental y bien gobernada que moderniza los servicios al ciudadano sin apostar la reputación del organismo a un único gran lanzamiento.",
        challenges: [
          "Sistemas heredados que hacen que los servicios al ciudadano sean lentos y difíciles de usar",
          "Silos de datos entre departamentos que impiden una prestación de servicios coordinada",
          "Requisitos estrictos de seguridad y cumplimiento para cualquier modernización",
        ],
      },
      fr: {
        name: "Secteur public",
        description: "Plateformes sécurisées de services aux citoyens et modernisation des données pour les administrations publiques.",
        overview:
          "Les administrations publiques font face à l'exigence la plus élevée en matière de sécurité et d'accessibilité, et à la plus faible tolérance aux interruptions ou aux échecs de modernisation. Nous abordons les projets technologiques gouvernementaux avec cette réalité en tête — une livraison incrémentale et bien gouvernée qui modernise les services aux citoyens sans jouer la réputation de l'administration sur un seul déploiement massif.",
        challenges: [
          "Des systèmes existants qui rendent les services aux citoyens lents et difficiles d'accès",
          "Des silos de données entre services qui bloquent une prestation coordonnée",
          "Des exigences strictes de sécurité et de conformité pour toute modernisation",
        ],
      },
      de: {
        name: "Behörden",
        description: "Sichere Bürgerserviceplattformen und Datenmodernisierung für öffentliche Einrichtungen.",
        overview:
          "Öffentliche Einrichtungen unterliegen den höchsten Anforderungen an Sicherheit und Zugänglichkeit und haben die geringste Toleranz für Ausfälle oder gescheiterte Modernisierungsprojekte. Wir gehen Regierungstechnologie-Projekte mit dieser Realität im Blick an — inkrementelle, gut gesteuerte Umsetzung, die Bürgerdienste modernisiert, ohne den Ruf der Behörde auf einen einzigen großen Rollout zu setzen.",
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
        overview:
          "Telecom operators compete on a service that's invisible until it breaks — churn and network complaints both spike well after the underlying problem started. We build the network analytics and customer experience platforms that catch degradation early and connect it to customer impact, so issues get fixed before they show up in next quarter's churn numbers.",
        challenges: [
          "High customer churn with limited early warning signals",
          "Network performance issues detected only after customers complain",
          "Customer experience data spread across billing, support, and network systems",
        ],
      },
      es: {
        name: "Telecomunicaciones",
        description: "Analítica de redes, predicción de abandono y plataformas de experiencia del cliente.",
        overview:
          "Los operadores de telecomunicaciones compiten con un servicio que es invisible hasta que falla — el abandono de clientes y las quejas de red aumentan mucho después de que el problema subyacente comenzó. Construimos las plataformas de analítica de red y experiencia del cliente que detectan la degradación temprano y la conectan con el impacto en el cliente, para que los problemas se resuelvan antes de aparecer en las cifras de abandono del próximo trimestre.",
        challenges: [
          "Alta tasa de abandono de clientes con señales de alerta temprana limitadas",
          "Problemas de rendimiento de red detectados solo después de quejas de clientes",
          "Datos de experiencia del cliente dispersos entre facturación, soporte y sistemas de red",
        ],
      },
      fr: {
        name: "Télécommunications",
        description: "Analytique réseau, prédiction de l'attrition et plateformes d'expérience client.",
        overview:
          "Les opérateurs télécoms se mesurent sur un service invisible jusqu'à ce qu'il tombe en panne — l'attrition et les plaintes réseau augmentent bien après le début du problème sous-jacent. Nous construisons les plateformes d'analytique réseau et d'expérience client qui détectent la dégradation tôt et la relient à l'impact client, afin que les problèmes soient résolus avant d'apparaître dans les chiffres d'attrition du trimestre suivant.",
        challenges: [
          "Un taux d'attrition élevé avec des signaux d'alerte précoce limités",
          "Des problèmes de performance réseau détectés seulement après des plaintes clients",
          "Des données d'expérience client dispersées entre facturation, support et systèmes réseau",
        ],
      },
      de: {
        name: "Telekommunikation",
        description: "Netzwerkanalysen, Abwanderungsprognosen und Customer-Experience-Plattformen.",
        overview:
          "Telekommunikationsanbieter konkurrieren mit einer Dienstleistung, die unsichtbar ist, bis sie ausfällt — Abwanderung und Netzwerkbeschwerden steigen erst lange nach Beginn des eigentlichen Problems. Wir bauen die Netzwerkanalyse- und Customer-Experience-Plattformen, die Verschlechterungen frühzeitig erkennen und mit der Kundenwirkung verknüpfen, damit Probleme behoben werden, bevor sie in den Abwanderungszahlen des nächsten Quartals auftauchen.",
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
        overview:
          "Real estate decisions — buying, selling, leasing, valuing — still run on data that's often stale by the time it reaches a decision-maker. We build the analytics, valuation models, and digital transaction platforms that bring real-time market signal into a process that has historically moved at the speed of paperwork.",
        challenges: [
          "Property valuations based on outdated or incomplete market data",
          "Manual, paper-heavy transaction and due-diligence processes",
          "Buyer and tenant data disconnected from marketing and sales systems",
        ],
      },
      es: {
        name: "Bienes Raíces",
        description: "Analítica inmobiliaria, modelos de valoración y plataformas de transacciones digitales.",
        overview:
          "Las decisiones inmobiliarias — comprar, vender, arrendar, valorar — todavía dependen de datos que a menudo están desactualizados cuando llegan a quien decide. Construimos la analítica, los modelos de valoración y las plataformas de transacciones digitales que aportan señales de mercado en tiempo real a un proceso que históricamente se movía a la velocidad del papeleo.",
        challenges: [
          "Valoraciones de propiedades basadas en datos de mercado desactualizados o incompletos",
          "Procesos de transacción y diligencia debida manuales y cargados de papeleo",
          "Datos de compradores e inquilinos desconectados de los sistemas de marketing y ventas",
        ],
      },
      fr: {
        name: "Immobilier",
        description: "Analytique immobilière, modèles d'évaluation et plateformes de transactions numériques.",
        overview:
          "Les décisions immobilières — acheter, vendre, louer, évaluer — reposent encore sur des données souvent obsolètes au moment où elles atteignent un décideur. Nous construisons l'analytique, les modèles d'évaluation et les plateformes de transactions numériques qui apportent un signal de marché en temps réel à un processus qui a historiquement avancé au rythme de la paperasse.",
        challenges: [
          "Des évaluations immobilières basées sur des données de marché obsolètes ou incomplètes",
          "Des processus de transaction et de due diligence manuels et chargés de papier",
          "Des données acheteurs et locataires déconnectées des systèmes marketing et ventes",
        ],
      },
      de: {
        name: "Immobilien",
        description: "Immobilienanalysen, Bewertungsmodelle und digitale Transaktionsplattformen.",
        overview:
          "Immobilienentscheidungen — Kauf, Verkauf, Vermietung, Bewertung — basieren noch immer auf Daten, die oft veraltet sind, wenn sie einen Entscheidungsträger erreichen. Wir bauen die Analysen, Bewertungsmodelle und digitalen Transaktionsplattformen, die Echtzeit-Marktsignale in einen Prozess bringen, der sich historisch im Tempo von Papierkram bewegt hat.",
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
