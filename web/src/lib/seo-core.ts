import type { Metadata } from "next";
import { siteConfig } from "@/lib/nav";
import { routing, type Locale } from "@/i18n/routing";

export const BRAND = siteConfig.name;
export const ORG_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;
export const LOGO_PATH = "/img/logo-edwyz-mini.png";
export const DEFAULT_OG = "/img/og/edwyz-cover-photo-v2-1200x630.png";

export const TITLE_MAX = 60;
export const DESC_MIN = 120;
export const DESC_MAX = 155;
export const DESC_HARD_MAX = 160;

const localeToOg: Record<string, string> = { en: "en_US", es: "es_ES", fr: "fr_FR", de: "de_DE" };

/** Paths whose body copy is English-only: they get no hreflang and non-English URLs canonicalise to /en. */
const ENGLISH_ONLY_PATHS = new Set(["/faq", "/team", "/privacy"]);

export function normalizePath(path: string): string {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "");
  if (!clean) return "";
  return clean.startsWith("/") ? clean : `/${clean}`;
}

export function localizedUrl(locale: string, path = ""): string {
  return `${siteConfig.url}/${locale}${normalizePath(path)}`;
}

export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function staticPageLocales(path: string): Locale[] {
  return ENGLISH_ONLY_PATHS.has(normalizePath(path)) ? ["en"] : [...routing.locales];
}

/** OG images must be 1200x630; /img/og holds pre-cropped variants (see scripts/gen-og-images.mjs). */
export function ogImageFor(image?: string): string {
  if (!image || !image.startsWith("/img/") || image.startsWith("/img/og/")) return DEFAULT_OG;
  return image.replace(/^\/img\/(.+)\.png$/, "/img/og/$1-1200x630.png");
}

function cutAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max + 1);
  const space = slice.lastIndexOf(" ");
  let out = (space > 0 ? slice.slice(0, space) : text.slice(0, max)).trimEnd();
  out = out.replace(/[\s,:;|&/\-–—(]+$/, "").replace(/\s+(and|or|the|of|for|with|a|an|in|to|at|on)$/i, "");
  return out.trimEnd();
}

/** Last natural break (colon, dash, comma) so a long title is shortened at a phrase boundary, not mid-phrase. */
function cutAtBoundary(text: string, max: number, min: number): string | null {
  let best = -1;
  for (const m of text.matchAll(/:\s| [–—-] |,\s/g)) {
    if (m.index !== undefined && m.index <= max && m.index >= min) best = m.index;
  }
  return best > 0 ? text.slice(0, best).trimEnd() : null;
}

export function fitTitle(pageTitle: string, brandSuffix: string = BRAND): string {
  const clean = pageTitle
    .replace(/\s+/g, " ")
    .replace(new RegExp(`\\s*[|—–-]\\s*(${BRAND}|${brandSuffix})$`, "i"), "")
    .trim();
  const brands = brandSuffix === BRAND ? [BRAND] : [brandSuffix, BRAND];
  for (const brand of brands) {
    if (clean.length + brand.length + 3 <= TITLE_MAX) return `${clean} | ${brand}`;
  }
  const short = ` | ${BRAND}`;
  const boundary = cutAtBoundary(clean, TITLE_MAX - short.length, 24);
  if (boundary) return `${boundary}${short}`;
  if (clean.length <= TITLE_MAX) return clean;
  const cut = cutAtWord(clean, TITLE_MAX - short.length);
  return cut.length >= 24 ? `${cut}${short}` : cutAtWord(clean, TITLE_MAX);
}

export function fitDescription(raw: string, opts: { label: string; strict: boolean }): string {
  const d = raw.replace(/\s+/g, " ").trim();
  if (d.length > DESC_HARD_MAX) {
    const msg = `[seo] description for "${opts.label}" is ${d.length} chars (max ${DESC_HARD_MAX})`;
    if (opts.strict && process.env.NEXT_PHASE === "phase-production-build") throw new Error(msg);
    if (process.env.NODE_ENV !== "production") console.error(msg);
  }
  if (d.length <= DESC_MAX) {
    if (d.length < DESC_MIN && process.env.NODE_ENV !== "production") {
      console.warn(`[seo] description for "${opts.label}" is ${d.length} chars (min ${DESC_MIN})`);
    }
    return d;
  }
  let sentenceEnd = -1;
  for (let i = DESC_MIN - 1; i < DESC_MAX; i++) {
    if (/[.!?]/.test(d[i]) && (i + 1 === d.length || d[i + 1] === " ")) sentenceEnd = i + 1;
  }
  if (sentenceEnd > 0) return d.slice(0, sentenceEnd);
  const clause = cutAtBoundary(d, DESC_MAX - 1, DESC_MIN - 10);
  if (clause) return `${clause}.`;
  return `${cutAtWord(d, DESC_MAX - 1)}…`;
}

export type MetaOptions = {
  locale: string;
  path: string;
  title: string;
  /** Brand suffix after the "|" separator; defaults to "Edwyz". */
  titleSuffix?: string;
  description: string;
  /** Locales in which this exact page has translated content. Defaults to every locale. */
  locales?: readonly Locale[];
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
  /** "cms" descriptions are trimmed silently; "code" descriptions fail the production build when over 160 chars. */
  source?: "code" | "cms";
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[]; tags?: string[]; section?: string };
  keywords?: string[];
  noIndex?: boolean;
};

export function buildMetadata(o: MetaOptions): Metadata {
  const path = normalizePath(o.path);
  const available = o.locales ?? routing.locales;
  const translated = available.includes(o.locale as Locale);
  const canonical = localizedUrl(translated ? o.locale : "en", path);

  const languages: Record<string, string> = {};
  if (translated && available.length > 1) {
    for (const l of available) languages[l] = localizedUrl(l, path);
    languages["x-default"] = localizedUrl("en", path);
  }

  const title = fitTitle(o.title, o.titleSuffix);
  const description = fitDescription(o.description, { label: `${o.locale}${path || "/"}`, strict: o.source !== "cms" });
  const ogImage = absoluteUrl(ogImageFor(o.image));
  const images = [{ url: ogImage, width: 1200, height: 630, alt: o.imageAlt ?? o.title }];

  return {
    title: { absolute: title },
    description,
    ...(o.keywords?.length ? { keywords: o.keywords } : {}),
    alternates: { canonical, ...(Object.keys(languages).length ? { languages } : {}) },
    robots: o.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BRAND,
      type: o.type ?? "website",
      locale: localeToOg[o.locale] ?? "en_US",
      ...(Object.keys(languages).length
        ? { alternateLocale: available.filter((l) => l !== o.locale).map((l) => localeToOg[l]) }
        : {}),
      images,
      ...(o.type === "article"
        ? {
            publishedTime: o.article?.publishedTime,
            modifiedTime: o.article?.modifiedTime,
            authors: o.article?.authors,
            tags: o.article?.tags,
            section: o.article?.section,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      title,
      description,
      images: [ogImage],
    },
  };
}

/* ---------- JSON-LD ---------- */

export function siteGraph() {
  const logoUrl = absoluteUrl(LOGO_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: BRAND,
        url: siteConfig.url,
        description: siteConfig.description,
        foundingDate: "2023",
        address: { "@type": "PostalAddress", addressCountry: "IN" },
        areaServed: "Worldwide",
        knowsAbout: [
          "Artificial intelligence",
          "Machine learning",
          "Generative AI",
          "Data engineering",
          "Cloud engineering",
          "Software development",
          "Cyber security",
        ],
        logo: { "@type": "ImageObject", "@id": `${siteConfig.url}/#logo`, url: logoUrl, contentUrl: logoUrl, width: 1992, height: 1992 },
        image: logoUrl,
        sameAs: [
          "https://www.linkedin.com/company/edwyz/",
          "https://www.facebook.com/edwyzexcellence",
          "https://x.com/edwyzexcellence",
          "https://www.instagram.com/edwyzexcellence",
        ],
        contactPoint: { "@type": "ContactPoint", email: "hello@edwyz.com", contactType: "customer support" },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: siteConfig.url,
        name: BRAND,
        description: siteConfig.description,
        publisher: { "@id": ORG_ID },
        inLanguage: [...routing.locales],
      },
    ],
  };
}

export type Crumb = { name: string; path?: string };

/** crumbs: Home > Section > Page; the last crumb may omit `path` (it is the current page, `currentPath`). */
export function breadcrumbJsonLd(locale: string, crumbs: Crumb[], currentPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: localizedUrl(locale, c.path ?? currentPath),
    })),
  };
}

export function articleJsonLd(a: {
  locale: string;
  path: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
  keywords?: string[];
  section?: string;
}) {
  const url = localizedUrl(a.locale, a.path);
  const authorIsOrg = !a.authorName || /edwyz/i.test(a.authorName);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: a.headline,
    description: a.description,
    image: [absoluteUrl(ogImageFor(a.image))],
    author: authorIsOrg ? { "@id": ORG_ID } : { "@type": "Person", name: a.authorName },
    publisher: { "@id": ORG_ID },
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    inLanguage: a.locale,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(a.keywords?.length ? { keywords: a.keywords.join(", ") } : {}),
    ...(a.section ? { articleSection: a.section } : {}),
  };
}
