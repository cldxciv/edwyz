import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export type Service = {
  slug: string;
  icon: string;
  name: string;
  short: string;
  description: string;
  capabilities: string[];
};

type ServiceTranslation = {
  name: string;
  short: string;
  description: string;
  capabilities: string[];
};

type ServiceEntry = {
  slug: string;
  icon: string;
  translations: Record<Locale, ServiceTranslation>;
};

const serviceEntries: ServiceEntry[] = [
  {
    slug: "artificial-intelligence",
    icon: "brain-circuit",
    translations: {
      en: {
        name: "Artificial Intelligence",
        short: "End-to-end AI strategy and implementation.",
        description:
          "We design and deploy AI systems that solve real business problems — from predictive models to fully autonomous agents — grounded in your data and infrastructure.",
        capabilities: ["AI strategy & roadmap", "Model evaluation & selection", "Production deployment", "Responsible AI governance"],
      },
      es: {
        name: "Inteligencia Artificial",
        short: "Estrategia e implementación de IA de extremo a extremo.",
        description:
          "Diseñamos e implementamos sistemas de IA que resuelven problemas reales de negocio — desde modelos predictivos hasta agentes totalmente autónomos — basados en sus datos e infraestructura.",
        capabilities: ["Estrategia y hoja de ruta de IA", "Evaluación y selección de modelos", "Despliegue en producción", "Gobernanza responsable de IA"],
      },
      fr: {
        name: "Intelligence Artificielle",
        short: "Stratégie et mise en œuvre de l'IA de bout en bout.",
        description:
          "Nous concevons et déployons des systèmes d'IA qui résolvent de vrais problèmes métier — des modèles prédictifs aux agents totalement autonomes — ancrés dans vos données et votre infrastructure.",
        capabilities: ["Stratégie et feuille de route IA", "Évaluation et sélection de modèles", "Déploiement en production", "Gouvernance responsable de l'IA"],
      },
      de: {
        name: "Künstliche Intelligenz",
        short: "Ganzheitliche KI-Strategie und -Umsetzung.",
        description:
          "Wir entwerfen und implementieren KI-Systeme, die reale Geschäftsprobleme lösen — von Vorhersagemodellen bis zu vollständig autonomen Agenten — fundiert auf Ihren Daten und Ihrer Infrastruktur.",
        capabilities: ["KI-Strategie & Roadmap", "Modellbewertung & -auswahl", "Produktionseinsatz", "Verantwortungsvolle KI-Governance"],
      },
    },
  },
  {
    slug: "machine-learning",
    icon: "git-branch",
    translations: {
      en: {
        name: "Machine Learning",
        short: "Predictive models that learn from your data.",
        description:
          "Custom ML pipelines for forecasting, classification, recommendation, and anomaly detection — built for accuracy and built to scale.",
        capabilities: ["Feature engineering", "Model training & tuning", "MLOps pipelines", "Continuous monitoring"],
      },
      es: {
        name: "Aprendizaje Automático",
        short: "Modelos predictivos que aprenden de sus datos.",
        description:
          "Pipelines de ML personalizados para previsión, clasificación, recomendación y detección de anomalías — diseñados para precisión y escalabilidad.",
        capabilities: ["Ingeniería de características", "Entrenamiento y ajuste de modelos", "Pipelines de MLOps", "Monitoreo continuo"],
      },
      fr: {
        name: "Machine Learning",
        short: "Des modèles prédictifs qui apprennent de vos données.",
        description:
          "Pipelines de ML sur mesure pour la prévision, la classification, la recommandation et la détection d'anomalies — conçus pour la précision et la mise à l'échelle.",
        capabilities: ["Ingénierie des caractéristiques", "Entraînement et réglage des modèles", "Pipelines MLOps", "Surveillance continue"],
      },
      de: {
        name: "Maschinelles Lernen",
        short: "Vorhersagemodelle, die aus Ihren Daten lernen.",
        description:
          "Maßgeschneiderte ML-Pipelines für Prognosen, Klassifizierung, Empfehlungen und Anomalieerkennung — gebaut für Genauigkeit und Skalierbarkeit.",
        capabilities: ["Feature Engineering", "Modelltraining & -optimierung", "MLOps-Pipelines", "Kontinuierliches Monitoring"],
      },
    },
  },
  {
    slug: "generative-ai",
    icon: "sparkles",
    translations: {
      en: {
        name: "Generative AI",
        short: "Content, code, and creative generation at scale.",
        description:
          "Generative AI applications for content creation, design assistance, and synthetic data — tuned to your brand and domain.",
        capabilities: ["Fine-tuning & prompt engineering", "Multimodal generation", "Content pipelines", "Quality & safety controls"],
      },
      es: {
        name: "IA Generativa",
        short: "Generación de contenido, código y creatividad a escala.",
        description:
          "Aplicaciones de IA generativa para creación de contenido, asistencia de diseño y datos sintéticos — ajustadas a su marca y dominio.",
        capabilities: ["Ajuste fino e ingeniería de prompts", "Generación multimodal", "Pipelines de contenido", "Controles de calidad y seguridad"],
      },
      fr: {
        name: "IA Générative",
        short: "Génération de contenu, de code et de créativité à grande échelle.",
        description:
          "Applications d'IA générative pour la création de contenu, l'assistance à la conception et les données synthétiques — adaptées à votre marque et votre domaine.",
        capabilities: ["Fine-tuning et prompt engineering", "Génération multimodale", "Pipelines de contenu", "Contrôles de qualité et de sécurité"],
      },
      de: {
        name: "Generative KI",
        short: "Inhalte, Code und kreative Generierung im großen Maßstab.",
        description:
          "Generative KI-Anwendungen für Content-Erstellung, Design-Unterstützung und synthetische Daten — abgestimmt auf Ihre Marke und Domäne.",
        capabilities: ["Fine-Tuning & Prompt Engineering", "Multimodale Generierung", "Content-Pipelines", "Qualitäts- und Sicherheitskontrollen"],
      },
    },
  },
  {
    slug: "llm-development",
    icon: "message-square-code",
    translations: {
      en: {
        name: "LLM Development",
        short: "Custom large language model applications.",
        description:
          "We build retrieval-augmented, fine-tuned, and agentic LLM applications on top of leading foundation models.",
        capabilities: ["RAG architecture", "Fine-tuning", "Evaluation frameworks", "Cost & latency optimization"],
      },
      es: {
        name: "Desarrollo de LLM",
        short: "Aplicaciones personalizadas de grandes modelos de lenguaje.",
        description:
          "Construimos aplicaciones LLM con RAG, ajuste fino y capacidades de agente sobre los principales modelos base.",
        capabilities: ["Arquitectura RAG", "Ajuste fino", "Marcos de evaluación", "Optimización de costo y latencia"],
      },
      fr: {
        name: "Développement de LLM",
        short: "Applications personnalisées de grands modèles de langage.",
        description:
          "Nous construisons des applications LLM avec RAG, fine-tuning et capacités agentiques sur les meilleurs modèles de fondation.",
        capabilities: ["Architecture RAG", "Fine-tuning", "Cadres d'évaluation", "Optimisation du coût et de la latence"],
      },
      de: {
        name: "LLM-Entwicklung",
        short: "Maßgeschneiderte Anwendungen für große Sprachmodelle.",
        description:
          "Wir entwickeln RAG-gestützte, feinabgestimmte und agentenfähige LLM-Anwendungen auf Basis führender Foundation-Modelle.",
        capabilities: ["RAG-Architektur", "Fine-Tuning", "Evaluierungs-Frameworks", "Kosten- & Latenzoptimierung"],
      },
    },
  },
  {
    slug: "ai-agents",
    icon: "bot",
    translations: {
      en: {
        name: "AI Agents",
        short: "Autonomous agents that take action.",
        description:
          "Multi-step, tool-using AI agents that automate complex workflows across your business systems.",
        capabilities: ["Agent orchestration", "Tool/function integration", "Human-in-the-loop controls", "Monitoring & observability"],
      },
      es: {
        name: "Agentes de IA",
        short: "Agentes autónomos que actúan por sí mismos.",
        description:
          "Agentes de IA multietapa que usan herramientas para automatizar flujos de trabajo complejos en sus sistemas empresariales.",
        capabilities: ["Orquestación de agentes", "Integración de herramientas/funciones", "Controles humanos en el ciclo", "Monitoreo y observabilidad"],
      },
      fr: {
        name: "Agents IA",
        short: "Des agents autonomes qui agissent.",
        description:
          "Des agents IA multi-étapes utilisant des outils pour automatiser des flux de travail complexes dans vos systèmes métier.",
        capabilities: ["Orchestration d'agents", "Intégration d'outils/fonctions", "Contrôles avec supervision humaine", "Surveillance et observabilité"],
      },
      de: {
        name: "KI-Agenten",
        short: "Autonome Agenten, die handeln.",
        description:
          "Mehrstufige, werkzeugnutzende KI-Agenten, die komplexe Workflows in Ihren Geschäftssystemen automatisieren.",
        capabilities: ["Agenten-Orchestrierung", "Tool-/Funktionsintegration", "Human-in-the-loop-Kontrollen", "Monitoring & Observability"],
      },
    },
  },
  {
    slug: "cloud-engineering",
    icon: "cloud",
    translations: {
      en: {
        name: "Cloud Engineering",
        short: "Scalable, secure cloud infrastructure.",
        description:
          "Cloud-native architecture across AWS, Azure, and GCP — built for resilience, cost efficiency, and speed.",
        capabilities: ["Cloud migration", "Infrastructure as code", "Cost optimization", "Multi-cloud architecture"],
      },
      es: {
        name: "Ingeniería Cloud",
        short: "Infraestructura en la nube escalable y segura.",
        description:
          "Arquitectura nativa de la nube en AWS, Azure y GCP — diseñada para resiliencia, eficiencia de costos y velocidad.",
        capabilities: ["Migración a la nube", "Infraestructura como código", "Optimización de costos", "Arquitectura multi-nube"],
      },
      fr: {
        name: "Ingénierie Cloud",
        short: "Infrastructure cloud évolutive et sécurisée.",
        description:
          "Architecture cloud-native sur AWS, Azure et GCP — conçue pour la résilience, l'efficacité des coûts et la rapidité.",
        capabilities: ["Migration vers le cloud", "Infrastructure as code", "Optimisation des coûts", "Architecture multi-cloud"],
      },
      de: {
        name: "Cloud Engineering",
        short: "Skalierbare, sichere Cloud-Infrastruktur.",
        description:
          "Cloud-native Architektur auf AWS, Azure und GCP — gebaut für Resilienz, Kosteneffizienz und Geschwindigkeit.",
        capabilities: ["Cloud-Migration", "Infrastructure as Code", "Kostenoptimierung", "Multi-Cloud-Architektur"],
      },
    },
  },
  {
    slug: "data-engineering",
    icon: "database",
    translations: {
      en: {
        name: "Data Engineering",
        short: "Reliable pipelines for trustworthy data.",
        description:
          "We build the data infrastructure that powers analytics and AI — pipelines, warehouses, and governance that scale.",
        capabilities: ["ETL/ELT pipelines", "Data warehousing", "Real-time streaming", "Data quality & governance"],
      },
      es: {
        name: "Ingeniería de Datos",
        short: "Pipelines confiables para datos fiables.",
        description:
          "Construimos la infraestructura de datos que impulsa la analítica y la IA — pipelines, almacenes de datos y gobernanza escalables.",
        capabilities: ["Pipelines ETL/ELT", "Almacenamiento de datos", "Streaming en tiempo real", "Calidad y gobernanza de datos"],
      },
      fr: {
        name: "Ingénierie des Données",
        short: "Des pipelines fiables pour des données de confiance.",
        description:
          "Nous construisons l'infrastructure de données qui alimente l'analytique et l'IA — pipelines, entrepôts de données et gouvernance évolutifs.",
        capabilities: ["Pipelines ETL/ELT", "Entreposage de données", "Streaming en temps réel", "Qualité et gouvernance des données"],
      },
      de: {
        name: "Data Engineering",
        short: "Zuverlässige Pipelines für vertrauenswürdige Daten.",
        description:
          "Wir bauen die Dateninfrastruktur, die Analytics und KI antreibt — skalierbare Pipelines, Data Warehouses und Governance.",
        capabilities: ["ETL/ELT-Pipelines", "Data Warehousing", "Echtzeit-Streaming", "Datenqualität & Governance"],
      },
    },
  },
  {
    slug: "data-analytics",
    icon: "bar-chart-3",
    translations: {
      en: {
        name: "Data Analytics",
        short: "Turn raw data into decisions.",
        description:
          "Analytics solutions that surface the metrics that matter, with self-serve dashboards for every team.",
        capabilities: ["Descriptive & predictive analytics", "Self-serve dashboards", "KPI frameworks", "Data storytelling"],
      },
      es: {
        name: "Analítica de Datos",
        short: "Convierta datos brutos en decisiones.",
        description:
          "Soluciones de analítica que destacan las métricas que importan, con paneles de autoservicio para cada equipo.",
        capabilities: ["Analítica descriptiva y predictiva", "Paneles de autoservicio", "Marcos de KPI", "Narrativa de datos"],
      },
      fr: {
        name: "Analytique de Données",
        short: "Transformez les données brutes en décisions.",
        description:
          "Des solutions analytiques qui font ressortir les indicateurs qui comptent, avec des tableaux de bord en self-service pour chaque équipe.",
        capabilities: ["Analytique descriptive et prédictive", "Tableaux de bord en self-service", "Cadres de KPI", "Data storytelling"],
      },
      de: {
        name: "Datenanalyse",
        short: "Verwandeln Sie Rohdaten in Entscheidungen.",
        description:
          "Analytics-Lösungen, die die wichtigen Kennzahlen sichtbar machen — mit Self-Service-Dashboards für jedes Team.",
        capabilities: ["Deskriptive & prädiktive Analytik", "Self-Service-Dashboards", "KPI-Frameworks", "Data Storytelling"],
      },
    },
  },
  {
    slug: "business-intelligence",
    icon: "line-chart",
    translations: {
      en: {
        name: "Business Intelligence",
        short: "Enterprise-grade BI platforms.",
        description:
          "BI implementations that unify data across the organization into a single source of truth.",
        capabilities: ["BI platform implementation", "Semantic layer design", "Embedded analytics", "Executive reporting"],
      },
      es: {
        name: "Inteligencia de Negocio",
        short: "Plataformas de BI de nivel empresarial.",
        description:
          "Implementaciones de BI que unifican los datos de la organización en una única fuente de verdad.",
        capabilities: ["Implementación de plataforma BI", "Diseño de capa semántica", "Analítica integrada", "Informes ejecutivos"],
      },
      fr: {
        name: "Business Intelligence",
        short: "Plateformes de BI de niveau entreprise.",
        description:
          "Des implémentations de BI qui unifient les données de l'organisation en une seule source de vérité.",
        capabilities: ["Implémentation de plateforme BI", "Conception de couche sémantique", "Analytique intégrée", "Reporting exécutif"],
      },
      de: {
        name: "Business Intelligence",
        short: "BI-Plattformen auf Enterprise-Niveau.",
        description:
          "BI-Implementierungen, die Daten im gesamten Unternehmen zu einer einzigen Wahrheitsquelle vereinen.",
        capabilities: ["BI-Plattform-Implementierung", "Design der semantischen Schicht", "Eingebettete Analytics", "Management-Reporting"],
      },
    },
  },
  {
    slug: "devops",
    icon: "git-merge",
    translations: {
      en: {
        name: "DevOps",
        short: "Faster, safer software delivery.",
        description:
          "CI/CD, infrastructure automation, and observability that let your teams ship with confidence.",
        capabilities: ["CI/CD pipelines", "Infrastructure automation", "Observability & monitoring", "Site reliability engineering"],
      },
      es: {
        name: "DevOps",
        short: "Entrega de software más rápida y segura.",
        description:
          "CI/CD, automatización de infraestructura y observabilidad que permiten a sus equipos lanzar con confianza.",
        capabilities: ["Pipelines de CI/CD", "Automatización de infraestructura", "Observabilidad y monitoreo", "Ingeniería de confiabilidad"],
      },
      fr: {
        name: "DevOps",
        short: "Une livraison logicielle plus rapide et plus sûre.",
        description:
          "CI/CD, automatisation de l'infrastructure et observabilité qui permettent à vos équipes de livrer en toute confiance.",
        capabilities: ["Pipelines CI/CD", "Automatisation de l'infrastructure", "Observabilité et surveillance", "Ingénierie de fiabilité (SRE)"],
      },
      de: {
        name: "DevOps",
        short: "Schnellere, sicherere Softwarebereitstellung.",
        description:
          "CI/CD, Infrastrukturautomatisierung und Observability, die Ihren Teams ein sicheres Deployment ermöglichen.",
        capabilities: ["CI/CD-Pipelines", "Infrastrukturautomatisierung", "Observability & Monitoring", "Site Reliability Engineering"],
      },
    },
  },
  {
    slug: "software-development",
    icon: "code-2",
    translations: {
      en: {
        name: "Software Development",
        short: "Custom software, built right.",
        description:
          "Full-cycle custom software development — from architecture to deployment — for web, enterprise, and embedded systems.",
        capabilities: ["Custom application development", "System architecture", "API & integration development", "Legacy modernization"],
      },
      es: {
        name: "Desarrollo de Software",
        short: "Software a medida, hecho correctamente.",
        description:
          "Desarrollo de software a medida de ciclo completo — desde la arquitectura hasta el despliegue — para web, empresa y sistemas embebidos.",
        capabilities: ["Desarrollo de aplicaciones a medida", "Arquitectura de sistemas", "Desarrollo de APIs e integraciones", "Modernización de sistemas legados"],
      },
      fr: {
        name: "Développement Logiciel",
        short: "Des logiciels sur mesure, bien conçus.",
        description:
          "Développement logiciel sur mesure de bout en bout — de l'architecture au déploiement — pour le web, l'entreprise et les systèmes embarqués.",
        capabilities: ["Développement d'applications sur mesure", "Architecture système", "Développement d'API et d'intégrations", "Modernisation des systèmes existants"],
      },
      de: {
        name: "Softwareentwicklung",
        short: "Individuelle Software, richtig umgesetzt.",
        description:
          "Maßgeschneiderte Softwareentwicklung über den gesamten Zyklus — von der Architektur bis zum Deployment — für Web-, Enterprise- und Embedded-Systeme.",
        capabilities: ["Individuelle Anwendungsentwicklung", "Systemarchitektur", "API- & Integrationsentwicklung", "Modernisierung von Altsystemen"],
      },
    },
  },
  {
    slug: "product-engineering",
    icon: "layers",
    translations: {
      en: {
        name: "Product Engineering",
        short: "From idea to shipped product.",
        description:
          "We partner with product teams to design, build, and iterate on digital products users love.",
        capabilities: ["Product discovery", "UX/UI design", "Agile delivery", "Continuous iteration"],
      },
      es: {
        name: "Ingeniería de Producto",
        short: "De la idea al producto lanzado.",
        description:
          "Colaboramos con equipos de producto para diseñar, construir e iterar productos digitales que los usuarios aman.",
        capabilities: ["Descubrimiento de producto", "Diseño UX/UI", "Entrega ágil", "Iteración continua"],
      },
      fr: {
        name: "Ingénierie Produit",
        short: "De l'idée au produit livré.",
        description:
          "Nous accompagnons les équipes produit pour concevoir, construire et itérer des produits numériques que les utilisateurs adorent.",
        capabilities: ["Découverte produit", "Design UX/UI", "Livraison agile", "Itération continue"],
      },
      de: {
        name: "Produktentwicklung",
        short: "Von der Idee zum fertigen Produkt.",
        description:
          "Wir arbeiten mit Produktteams zusammen, um digitale Produkte zu entwerfen, zu bauen und kontinuierlich zu verbessern, die Nutzer lieben.",
        capabilities: ["Produktentdeckung", "UX/UI-Design", "Agile Lieferung", "Kontinuierliche Iteration"],
      },
    },
  },
  {
    slug: "mobile-app-development",
    icon: "smartphone",
    translations: {
      en: {
        name: "Mobile App Development",
        short: "Native and cross-platform apps.",
        description:
          "iOS, Android, and cross-platform mobile applications engineered for performance and scale.",
        capabilities: ["Native iOS & Android", "React Native / Flutter", "App store optimization", "Mobile DevOps"],
      },
      es: {
        name: "Desarrollo de Apps Móviles",
        short: "Aplicaciones nativas y multiplataforma.",
        description:
          "Aplicaciones móviles para iOS, Android y multiplataforma, diseñadas para rendimiento y escalabilidad.",
        capabilities: ["iOS y Android nativos", "React Native / Flutter", "Optimización en tiendas de apps", "DevOps móvil"],
      },
      fr: {
        name: "Développement d'Applications Mobiles",
        short: "Applications natives et multiplateformes.",
        description:
          "Applications mobiles iOS, Android et multiplateformes conçues pour la performance et la mise à l'échelle.",
        capabilities: ["iOS et Android natifs", "React Native / Flutter", "Optimisation des stores d'applications", "DevOps mobile"],
      },
      de: {
        name: "Mobile App-Entwicklung",
        short: "Native und plattformübergreifende Apps.",
        description:
          "iOS-, Android- und plattformübergreifende mobile Anwendungen, entwickelt für Leistung und Skalierbarkeit.",
        capabilities: ["Native iOS & Android", "React Native / Flutter", "App-Store-Optimierung", "Mobile DevOps"],
      },
    },
  },
  {
    slug: "web-development",
    icon: "globe",
    translations: {
      en: {
        name: "Web Development",
        short: "Fast, modern web applications.",
        description:
          "High-performance web applications built on modern frameworks, optimized for speed and conversion.",
        capabilities: ["Next.js / React applications", "Headless CMS integration", "Performance optimization", "Accessibility"],
      },
      es: {
        name: "Desarrollo Web",
        short: "Aplicaciones web rápidas y modernas.",
        description:
          "Aplicaciones web de alto rendimiento construidas sobre frameworks modernos, optimizadas para velocidad y conversión.",
        capabilities: ["Aplicaciones Next.js / React", "Integración de CMS headless", "Optimización de rendimiento", "Accesibilidad"],
      },
      fr: {
        name: "Développement Web",
        short: "Des applications web rapides et modernes.",
        description:
          "Des applications web haute performance construites sur des frameworks modernes, optimisées pour la vitesse et la conversion.",
        capabilities: ["Applications Next.js / React", "Intégration de CMS headless", "Optimisation des performances", "Accessibilité"],
      },
      de: {
        name: "Webentwicklung",
        short: "Schnelle, moderne Webanwendungen.",
        description:
          "Hochleistungsfähige Webanwendungen auf Basis moderner Frameworks, optimiert für Geschwindigkeit und Konversion.",
        capabilities: ["Next.js / React-Anwendungen", "Headless-CMS-Integration", "Leistungsoptimierung", "Barrierefreiheit"],
      },
    },
  },
  {
    slug: "cyber-security",
    icon: "shield",
    translations: {
      en: {
        name: "Cyber Security",
        short: "Protect what you've built.",
        description:
          "Security assessments, hardening, and monitoring to keep your applications and infrastructure safe.",
        capabilities: ["Security audits & pen testing", "Threat modeling", "Compliance readiness", "Incident response"],
      },
      es: {
        name: "Ciberseguridad",
        short: "Proteja lo que ha construido.",
        description:
          "Evaluaciones de seguridad, fortalecimiento y monitoreo para mantener seguras sus aplicaciones e infraestructura.",
        capabilities: ["Auditorías de seguridad y pruebas de penetración", "Modelado de amenazas", "Preparación para cumplimiento", "Respuesta a incidentes"],
      },
      fr: {
        name: "Cybersécurité",
        short: "Protégez ce que vous avez construit.",
        description:
          "Évaluations de sécurité, renforcement et surveillance pour garder vos applications et votre infrastructure en sécurité.",
        capabilities: ["Audits de sécurité et tests d'intrusion", "Modélisation des menaces", "Préparation à la conformité", "Réponse aux incidents"],
      },
      de: {
        name: "Cybersicherheit",
        short: "Schützen Sie, was Sie aufgebaut haben.",
        description:
          "Sicherheitsbewertungen, Hardening und Monitoring, um Ihre Anwendungen und Infrastruktur sicher zu halten.",
        capabilities: ["Sicherheitsaudits & Penetrationstests", "Bedrohungsmodellierung", "Compliance-Bereitschaft", "Incident Response"],
      },
    },
  },
  {
    slug: "qa-testing",
    icon: "check-circle-2",
    translations: {
      en: {
        name: "QA & Testing",
        short: "Ship with confidence.",
        description:
          "Comprehensive QA strategy spanning manual, automated, and performance testing.",
        capabilities: ["Test automation", "Performance & load testing", "Manual QA", "Continuous testing in CI/CD"],
      },
      es: {
        name: "QA y Pruebas",
        short: "Lance con confianza.",
        description:
          "Estrategia integral de QA que abarca pruebas manuales, automatizadas y de rendimiento.",
        capabilities: ["Automatización de pruebas", "Pruebas de rendimiento y carga", "QA manual", "Pruebas continuas en CI/CD"],
      },
      fr: {
        name: "QA et Tests",
        short: "Livrez en toute confiance.",
        description:
          "Une stratégie de QA complète couvrant les tests manuels, automatisés et de performance.",
        capabilities: ["Automatisation des tests", "Tests de performance et de charge", "QA manuel", "Tests continus en CI/CD"],
      },
      de: {
        name: "QA & Testing",
        short: "Mit Vertrauen ausliefern.",
        description:
          "Umfassende QA-Strategie mit manuellen, automatisierten und Performance-Tests.",
        capabilities: ["Testautomatisierung", "Performance- & Lasttests", "Manuelle QA", "Kontinuierliches Testen in CI/CD"],
      },
    },
  },
  {
    slug: "digital-transformation",
    icon: "rocket",
    translations: {
      en: {
        name: "Digital Transformation",
        short: "Modernize how your business runs.",
        description:
          "End-to-end digital transformation strategy and execution — process, technology, and people.",
        capabilities: ["Transformation strategy", "Process automation", "Change management", "Technology modernization"],
      },
      es: {
        name: "Transformación Digital",
        short: "Modernice la forma en que opera su negocio.",
        description:
          "Estrategia y ejecución integral de transformación digital — procesos, tecnología y personas.",
        capabilities: ["Estrategia de transformación", "Automatización de procesos", "Gestión del cambio", "Modernización tecnológica"],
      },
      fr: {
        name: "Transformation Numérique",
        short: "Modernisez le fonctionnement de votre entreprise.",
        description:
          "Stratégie et exécution de transformation numérique de bout en bout — processus, technologie et personnes.",
        capabilities: ["Stratégie de transformation", "Automatisation des processus", "Gestion du changement", "Modernisation technologique"],
      },
      de: {
        name: "Digitale Transformation",
        short: "Modernisieren Sie, wie Ihr Unternehmen arbeitet.",
        description:
          "Ganzheitliche Strategie und Umsetzung der digitalen Transformation — Prozesse, Technologie und Menschen.",
        capabilities: ["Transformationsstrategie", "Prozessautomatisierung", "Change Management", "Technologische Modernisierung"],
      },
    },
  },
];

function toService(entry: ServiceEntry, locale: Locale): Service {
  const translation = entry.translations[locale] ?? entry.translations.en;
  return { slug: entry.slug, icon: entry.icon, ...translation };
}

export async function getServices(): Promise<Service[]> {
  const locale = (await getLocale()) as Locale;
  return serviceEntries.map((entry) => toService(entry, locale));
}

/** Locale-independent accessor for contexts without a next-intl request context (e.g. the AI knowledge base). */
export function getServicesInLocale(locale: Locale = "en"): Service[] {
  return serviceEntries.map((entry) => toService(entry, locale));
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const locale = (await getLocale()) as Locale;
  const entry = serviceEntries.find((s) => s.slug === slug);
  return entry ? toService(entry, locale) : undefined;
}

export function getServiceSlugs(): string[] {
  return serviceEntries.map((entry) => entry.slug);
}
