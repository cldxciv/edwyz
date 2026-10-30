import dns from "node:dns/promises";
import type { Where } from "payload";
import { getPayloadClient } from "@/lib/payload";
import { siteConfig } from "@/lib/nav";
import { routing } from "@/i18n/routing";
import { getServicesInLocale } from "@/lib/data/services";
import { getIndustriesInLocale } from "@/lib/data/industries";
import { STATIC_BLOGS } from "@/lib/data/static-blogs";
import { BRAND_FACTS } from "@/lib/ops/brand";

type Args = Record<string, unknown>;

export type OpsTool = {
  name: string;
  description: string;
  inputSchema: { type: "object"; properties: Record<string, unknown>; required?: string[]; additionalProperties: false };
  annotations: { title: string; readOnlyHint: boolean; destructiveHint: boolean; idempotentHint: boolean; openWorldHint: boolean };
  handler: (args: Args) => Promise<unknown>;
};

export const PROPOSAL_KINDS = [
  "seo_fix",
  "aeo_geo",
  "content_draft",
  "social_post",
  "ux_recommendation",
  "outreach_draft",
  "lead_reply_draft",
  "market_intel",
  "email_ops",
  "report",
  "task",
] as const;
const PRIORITIES = ["low", "medium", "high"] as const;

const SITE = siteConfig.url;
const base = () => (process.env.OPS_SITE_URL ?? SITE).replace(/\/$/, "");
const toBase = (u: string) => (u.startsWith(SITE) ? base() + u.slice(SITE.length) : u);
const clip = (s: unknown, n: number) => String(s ?? "").slice(0, n);

function str(a: Args, key: string, max: number, required = false): string | undefined {
  const v = a[key];
  if (v === undefined || v === null || v === "") {
    if (required) throw new Error(`'${key}' is required`);
    return undefined;
  }
  if (typeof v !== "string") throw new Error(`'${key}' must be a string`);
  if (v.length > max) throw new Error(`'${key}' is too long (max ${max})`);
  return v;
}
function int(a: Args, key: string, def: number, min: number, max: number): number {
  const v = a[key];
  if (v === undefined) return def;
  if (typeof v !== "number" || !Number.isFinite(v)) throw new Error(`'${key}' must be a number`);
  return Math.min(max, Math.max(min, Math.floor(v)));
}
function oneOf<T extends string>(a: Args, key: string, allowed: readonly T[], def?: T): T {
  const v = a[key];
  if (v === undefined && def) return def;
  if (typeof v !== "string" || !allowed.includes(v as T)) throw new Error(`'${key}' must be one of: ${allowed.join(", ")}`);
  return v as T;
}

/* ---------- HTML helpers (own site only) ---------- */

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (html: string, re: RegExp) => {
  const m = html.match(re);
  return m?.[1] !== undefined ? decode(m[1]) : undefined;
};
const meta = (html: string, key: string) =>
  attr(html, new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]+content="([^"]*)"`)) ??
  attr(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${key}"`));

function visibleText(html: string): string {
  return decode(
    html
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function parsePage(html: string) {
  const jsonLd: string[] = [];
  let jsonLdValid = true;
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      for (const n of j["@graph"] ?? [j]) jsonLd.push(String(n["@type"]));
    } catch {
      jsonLdValid = false;
    }
  }
  const hreflang = Object.fromEntries(
    [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)].map((m) => [m[1], m[2]]),
  );
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const links = [...html.matchAll(/<a\b[^>]*href="([^"#][^"]*)"/gi)].map((m) => decode(m[1]));
  const heads = (tag: string) =>
    [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))].map((m) => visibleText(m[1])).filter(Boolean);
  return {
    title: attr(html, /<title>([\s\S]*?)<\/title>/),
    description: meta(html, "description"),
    canonical: attr(html, /<link rel="canonical" href="([^"]+)"/),
    robots: meta(html, "robots"),
    ogTitle: meta(html, "og:title"),
    ogDescription: meta(html, "og:description"),
    ogUrl: meta(html, "og:url"),
    ogImage: meta(html, "og:image"),
    twitterTitle: meta(html, "twitter:title"),
    h1: heads("h1"),
    h2: heads("h2").slice(0, 25),
    jsonLdTypes: jsonLd,
    jsonLdValid,
    hreflang,
    images: { total: imgs.length, missingAlt: imgs.filter((i) => !/\balt="[^"]+"/i.test(i)).length },
    internalLinks: links.filter((l) => l.startsWith("/") || l.startsWith(SITE)),
    externalLinks: links.filter((l) => /^https?:\/\//.test(l) && !l.startsWith(SITE)),
  };
}

async function getText(url: string, timeoutMs = 15000) {
  const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(timeoutMs), headers: { "user-agent": "edwyz-ops-agent/1.0" } });
  const text = res.status === 200 ? await res.text() : "";
  return { status: res.status, location: res.headers.get("location"), cacheControl: res.headers.get("cache-control"), text };
}

async function pool<T, R>(items: T[], size: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

/* ---------- audit ---------- */

type AuditProblem = { url: string; problem: string };
let auditCache: { at: number; result: unknown } | null = null;

async function runSeoAudit(limit: number) {
  if (auditCache && Date.now() - auditCache.at < 10 * 60_000) return { ...(auditCache.result as object), cached: true };
  const sitemap = await getText(`${base()}/sitemap.xml`, 30000);
  const urls = [...sitemap.text.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((m) => ({ loc: m[1].match(/<loc>(.*?)<\/loc>/)?.[1] ?? "", alts: Object.fromEntries([...m[1].matchAll(/hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map((a) => [a[1], a[2]])) }))
    .filter((u) => u.loc)
    .slice(0, limit);
  const problems: AuditProblem[] = [];
  const bad = (url: string, problem: string) => problems.push({ url, problem });

  await pool(urls, 4, async ({ loc, alts }) => {
    try {
      const r = await getText(toBase(loc));
      if (r.status !== 200) return bad(loc, `status ${r.status}`);
      const p = parsePage(r.text);
      const path = new URL(loc).pathname.replace(/^\/[a-z]{2}/, "");
      if (!p.title || p.title.length > 60) bad(loc, `title length ${p.title?.length ?? 0}: ${p.title ?? "missing"}`);
      if (!p.description) bad(loc, "missing meta description");
      else if (p.description.length > 155) bad(loc, `description too long (${p.description.length})`);
      else if (p.description.length < 120 && !/^\/(faq|team|privacy)$/.test(path)) bad(loc, `description short (${p.description.length})`);
      if (p.canonical !== loc) bad(loc, `canonical ${p.canonical} differs from URL`);
      if (p.ogUrl !== p.canonical) bad(loc, "og:url differs from canonical");
      if (p.ogTitle !== p.title) bad(loc, "og:title differs from title");
      if (/noindex/.test(p.robots ?? "")) bad(loc, "noindex but listed in sitemap");
      if (p.images.missingAlt > 0) bad(loc, `${p.images.missingAlt} image(s) without alt text`);
      if (!p.jsonLdValid) bad(loc, "invalid JSON-LD");
      if (p.jsonLdTypes.filter((t) => t === "Organization").length !== 1) bad(loc, "Organization JSON-LD count is not 1");
      if (p.jsonLdTypes.filter((t) => t === "WebSite").length !== 1) bad(loc, "WebSite JSON-LD count is not 1");
      if (JSON.stringify(Object.entries(p.hreflang).sort()) !== JSON.stringify(Object.entries(alts).sort())) bad(loc, "hreflang differs from sitemap alternates");
      if (p.h1.length !== 1) bad(loc, `${p.h1.length} h1 elements`);
    } catch (e) {
      bad(loc, `fetch failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  });

  const result = { checkedUrls: urls.length, problemCount: problems.length, problems: problems.slice(0, 80), truncated: problems.length > 80 };
  auditCache = { at: Date.now(), result };
  return result;
}

/* ---------- DNS / mail ---------- */

const DNSBLS = [
  { zone: "zen.spamhaus.org", note: "Spamhaus ZEN (answers 127.255.255.x mean the resolver was blocked, not that the IP is listed)" },
  { zone: "b.barracudacentral.org", note: "Barracuda" },
  { zone: "bl.spamcop.net", note: "SpamCop" },
  { zone: "psbl.surriel.com", note: "PSBL" },
];

const NO_RECORD = new Set(["ENOTFOUND", "ENODATA"]);
const dnsState: { via: "system" | "doh" } = { via: "system" };
const usedDoh = () => dnsState.via === "doh";

async function dohQuery(name: string, type: "TXT" | "MX" | "A" | "PTR"): Promise<string[]> {
  const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`, {
    signal: AbortSignal.timeout(8000),
    headers: { accept: "application/dns-json" },
  });
  if (!res.ok) throw new Error(`DNS-over-HTTPS lookup failed (HTTP ${res.status})`);
  const j = (await res.json()) as { Status: number; Answer?: { type: number; data: string }[] };
  if (j.Status !== 0 && j.Status !== 3) throw new Error(`DNS-over-HTTPS lookup failed (status ${j.Status})`);
  const code = { TXT: 16, MX: 15, A: 1, PTR: 12 }[type];
  return (j.Answer ?? [])
    .filter((x) => x.type === code)
    .map((x) => (type === "TXT" ? x.data.replace(/"\s*"/g, "").replace(/^"|"$/g, "") : x.data.replace(/\.$/, "")));
}

/** System resolver first; DNS-over-HTTPS only if the resolver itself is unreachable. Never returns [] for a resolver failure. */
async function lookup(name: string, type: "TXT" | "MX" | "A" | "PTR"): Promise<string[]> {
  try {
    if (type === "TXT") return (await dns.resolveTxt(name)).map((r) => r.join(""));
    if (type === "MX") return (await dns.resolveMx(name)).map((m) => `${m.priority} ${m.exchange}`);
    if (type === "A") return await dns.resolve4(name);
    return await dns.resolvePtr(name);
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code ?? "";
    if (NO_RECORD.has(code)) return [];
    dnsState.via = "doh";
    try {
      return await dohQuery(name, type);
    } catch (doh) {
      throw new Error(`DNS lookup failed for ${name} (system resolver: ${code || String(e)}; ${doh instanceof Error ? doh.message : String(doh)})`);
    }
  }
}

async function dnsMailCheck() {
  const domain = "edwyz.com";
  dnsState.via = "system";
  const [txtRoot, dmarc, dkim, mtaSts, tlsRpt, mx, a] = await Promise.all([
    lookup(domain, "TXT"),
    lookup(`_dmarc.${domain}`, "TXT"),
    lookup(`mail._domainkey.${domain}`, "TXT"),
    lookup(`_mta-sts.${domain}`, "TXT"),
    lookup(`_smtp._tls.${domain}`, "TXT"),
    lookup(domain, "MX"),
    lookup(`mail.${domain}`, "A"),
  ]);
  const spf = txtRoot.filter((t) => t.startsWith("v=spf1"));
  const ptr = a[0] ? await lookup(`${a[0].split(".").reverse().join(".")}.in-addr.arpa`, "PTR") : [];
  const blacklists = a[0]
    ? await Promise.all(
        DNSBLS.map(async ({ zone, note }) => {
          const q = `${a[0].split(".").reverse().join(".")}.${zone}`;
          try {
            const res = await dns.resolve4(q);
            const status = res.some((r) => r.startsWith("127.255.255.")) ? "inconclusive (resolver blocked by the list)" : `LISTED (${res.join(",")})`;
            return { list: zone, status, note };
          } catch (e) {
            const code = (e as NodeJS.ErrnoException).code ?? "";
            return { list: zone, status: NO_RECORD.has(code) ? "not listed" : `inconclusive (${code || "lookup error"}; the server's resolver could not query this list)`, note };
          }
        }),
      )
    : [];
  return {
    domain,
    resolvedVia: usedDoh() ? "DNS-over-HTTPS (system resolver unreachable)" : "system resolver",
    mx,
    mailHostIps: a,
    reverseDns: ptr,
    spf,
    dmarc,
    dkimSelectorMailPresent: dkim.length > 0,
    mtaSts,
    tlsRpt,
    blacklists,
    note: "Read-only DNS lookups about edwyz.com and its own mail host only. DKIM signing by the server cannot be verified from DNS. Blocklist results marked inconclusive are unknown, not clean.",
  };
}

/* ---------- registry ---------- */

const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

export const OPS_TOOLS: OpsTool[] = [
  {
    name: "brand_facts",
    description:
      "Verified facts about Edwyz and the rules for what may and must not be claimed. Call this first, before writing any copy, outreach or report.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { title: "Brand facts and claim rules", ...RO },
    handler: async () => BRAND_FACTS,
  },
  {
    name: "site_overview",
    description:
      "Structure of the Edwyz website: locales, services, industries, published blog posts (CMS and built-in) and case studies, with dates. Case-study metrics are unverified.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { title: "Website overview", ...RO },
    handler: async () => {
      const payload = await getPayloadClient();
      const [posts, studies, faqs] = await Promise.all([
        payload.find({ collection: "posts", where: { _status: { equals: "published" } }, limit: 100, depth: 0, sort: "-publishedAt" }),
        payload.find({ collection: "case-studies", where: { _status: { equals: "published" } }, limit: 100, depth: 0 }),
        payload.count({ collection: "faqs" }),
      ]);
      const cms = new Set(posts.docs.map((p) => p.slug));
      return {
        base: base(),
        locales: routing.locales,
        services: getServicesInLocale("en").map((s) => ({ slug: s.slug, name: s.name, short: s.short })),
        industries: getIndustriesInLocale("en").map((i) => ({ slug: i.slug, name: i.name })),
        blogPosts: [
          ...posts.docs.map((p) => ({ slug: p.slug, title: p.title, category: p.category, publishedAt: p.publishedAt, source: "cms" })),
          ...STATIC_BLOGS.filter((b) => !cms.has(b.slug)).map((b) => ({ slug: b.slug, title: b.title, category: b.category, publishedAt: b.publishedAt, source: "built-in" })),
        ],
        caseStudies: studies.docs.map((c) => ({ slug: c.slug, title: c.title, industry: c.industry, updatedAt: c.updatedAt })),
        faqCount: faqs.totalDocs,
        englishOnlyPages: ["/faq", "/team", "/privacy", "built-in blog posts"],
        knownGaps: ["No named authors", "Team page has no real members", "No Search Console or analytics data connected to agents"],
      };
    },
  },
  {
    name: "fetch_page",
    description:
      "Fetch one page of the Edwyz website (path such as /en/services/devops) and return parsed SEO and structure data: title, description, canonical, robots, headings, JSON-LD types, hreflang, image alt counts, links. Set include_text for the visible text.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Site path beginning with '/', for example /en or /en/blog" },
        include_text: { type: "boolean", description: "Also return up to 6000 characters of visible text" },
      },
      required: ["path"],
      additionalProperties: false,
    },
    annotations: { title: "Fetch and parse a site page", ...RO },
    handler: async (a) => {
      const path = str(a, "path", 300, true) as string;
      if (!/^\/[A-Za-z0-9/_\-.%]*$/.test(path) || path.includes("//") || path.includes("..")) throw new Error("path must be a plain site path");
      const r = await getText(`${base()}${path}`);
      if (r.status !== 200) return { path, status: r.status, redirectsTo: r.location };
      const p = parsePage(r.text);
      const text = visibleText(r.text);
      return {
        path,
        status: r.status,
        cacheControl: r.cacheControl,
        ...p,
        internalLinks: [...new Set(p.internalLinks)].slice(0, 60),
        externalLinks: [...new Set(p.externalLinks)].slice(0, 30),
        wordCount: text.split(" ").length,
        ...(a.include_text ? { text: text.slice(0, 6000) } : {}),
      };
    },
  },
  {
    name: "seo_audit",
    description:
      "Crawl the site's own sitemap and report technical SEO problems (titles, descriptions, canonicals, hreflang, JSON-LD, alt text, headings, noindex). Cached for 10 minutes; takes up to a minute.",
    inputSchema: {
      type: "object",
      properties: { limit: { type: "number", description: "Maximum URLs to check (default 250, max 400)" } },
      additionalProperties: false,
    },
    annotations: { title: "Technical SEO audit of own site", ...RO },
    handler: async (a) => runSeoAudit(int(a, "limit", 250, 1, 400)),
  },
  {
    name: "dns_mail_check",
    description:
      "Read-only check of edwyz.com mail DNS (MX, SPF, DKIM selector, DMARC, MTA-STS, TLS-RPT), reverse DNS of the mail host and its status on common public blocklists. Only ever checks Edwyz's own domain and mail server.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { title: "Own-domain mail DNS and blocklist check", ...RO },
    handler: async () => dnsMailCheck(),
  },
  {
    name: "lead_stats",
    description: "Counts of inbound leads by status and source, and how many arrived in the last 7 and 30 days.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { title: "Lead statistics", ...RO },
    handler: async () => {
      const payload = await getPayloadClient();
      const since = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();
      const count = async (where: Where) => (await payload.count({ collection: "leads", where })).totalDocs;
      const statuses = ["new", "contacted", "qualified", "won", "lost"];
      const sources = ["contact_form", "ai_chat", "chat_ticket"];
      return {
        total: await count({}),
        last7Days: await count({ createdAt: { greater_than: since(7) } }),
        last30Days: await count({ createdAt: { greater_than: since(30) } }),
        byStatus: Object.fromEntries(await Promise.all(statuses.map(async (s) => [s, await count({ status: { equals: s } })]))),
        bySource: Object.fromEntries(await Promise.all(sources.map(async (s) => [s, await count({ source: { equals: s } })]))),
      };
    },
  },
  {
    name: "list_leads",
    description:
      "Recent inbound leads WITHOUT personal contact details (no name, email or phone; only the email domain). Use the lead id as the reference and leave name placeholders in drafts for the owner to fill.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["new", "contacted", "qualified", "won", "lost"] },
        limit: { type: "number", description: "Default 20, max 50" },
      },
      additionalProperties: false,
    },
    annotations: { title: "Recent leads (redacted)", ...RO },
    handler: async (a) => {
      const payload = await getPayloadClient();
      const status = a.status === undefined ? undefined : oneOf(a, "status", ["new", "contacted", "qualified", "won", "lost"] as const);
      const res = await payload.find({
        collection: "leads",
        where: status ? { status: { equals: status } } : {},
        sort: "-createdAt",
        limit: int(a, "limit", 20, 1, 50),
        depth: 0,
      });
      return res.docs.map((l) => ({
        id: l.id,
        createdAt: l.createdAt,
        status: l.status,
        source: l.source,
        company: clip(l.company, 120) || null,
        emailDomain: String(l.email ?? "").split("@")[1] ?? null,
        requirements: clip(l.requirements, 700),
        budget: l.budget ?? null,
        timeline: l.timeline ?? null,
        hasPhone: Boolean(l.phone),
      }));
    },
  },
  {
    name: "list_proposals",
    description: "Proposals already submitted by agents (to avoid duplicates and to see what is pending the owner's decision).",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["pending", "approved", "rejected", "applied", "needs_info"] },
        agent: { type: "string" },
        limit: { type: "number", description: "Default 30, max 100" },
      },
      additionalProperties: false,
    },
    annotations: { title: "List proposals", ...RO },
    handler: async (a) => {
      const payload = await getPayloadClient();
      const where: Where = {};
      if (a.status) where.status = { equals: oneOf(a, "status", ["pending", "approved", "rejected", "applied", "needs_info"] as const) };
      const agent = str(a, "agent", 40);
      if (agent) where.agent = { equals: agent };
      const res = await payload.find({ collection: "ops-proposals", where, sort: "-createdAt", limit: int(a, "limit", 30, 1, 100), depth: 0 });
      return res.docs.map((p) => ({
        id: p.id,
        createdAt: p.createdAt,
        agent: p.agent,
        kind: p.kind,
        priority: p.priority,
        status: p.status,
        title: p.title,
        summary: clip(p.summary, 300),
        reviewerNote: p.reviewerNote ? clip(p.reviewerNote, 300) : null,
      }));
    },
  },
  {
    name: "submit_proposal",
    description:
      "Submit ONE proposal for the owner to approve, reject or edit. This is the only way agents change anything: it creates a pending item in the admin panel and takes no other action. Put the full draft or the exact change in 'details' (Markdown).",
    inputSchema: {
      type: "object",
      properties: {
        agent: { type: "string", description: "Your agent slug, for example seo" },
        kind: { type: "string", enum: [...PROPOSAL_KINDS] },
        title: { type: "string", description: "8 to 140 characters, specific" },
        summary: { type: "string", description: "What and why in 20 to 600 characters" },
        details: { type: "string", description: "Full Markdown: the draft, the exact change, sources with URLs, claims needing owner confirmation" },
        priority: { type: "string", enum: [...PRIORITIES] },
        run_id: { type: "string" },
      },
      required: ["agent", "kind", "title", "summary"],
      additionalProperties: false,
    },
    annotations: { title: "Submit a proposal for approval", readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    handler: async (a) => {
      const agent = str(a, "agent", 30, true) as string;
      if (!/^[a-z][a-z0-9-]{1,29}$/.test(agent)) throw new Error("agent must be a lowercase slug");
      const kind = oneOf(a, "kind", PROPOSAL_KINDS);
      const title = (str(a, "title", 140, true) as string).trim();
      const summary = (str(a, "summary", 600, true) as string).trim();
      if (title.length < 8) throw new Error("title is too short");
      if (summary.length < 20) throw new Error("summary is too short");
      const details = str(a, "details", 20000);
      const priority = oneOf(a, "priority", PRIORITIES, "medium");

      const payload = await getPayloadClient();
      const dup = await payload.find({
        collection: "ops-proposals",
        where: { and: [{ agent: { equals: agent } }, { title: { equals: title } }, { status: { in: ["pending", "needs_info", "approved"] } }] },
        limit: 1,
        depth: 0,
      });
      if (dup.docs[0]) return { duplicate: true, id: dup.docs[0].id, message: "An open proposal with this title already exists. Not created." };

      const recent = await payload.count({
        collection: "ops-proposals",
        where: { and: [{ agent: { equals: agent } }, { createdAt: { greater_than: new Date(Date.now() - 86_400_000).toISOString() } }] },
      });
      if (recent.totalDocs >= 25) throw new Error("Daily proposal limit reached for this agent (25).");

      const doc = await payload.create({
        collection: "ops-proposals",
        data: { agent, kind, title, summary, details, priority, status: "pending", runId: str(a, "run_id", 60) },
        overrideAccess: true,
      });
      return { created: true, id: doc.id, status: "pending", message: "Submitted for owner review. Nothing has been sent, published or changed." };
    },
  },
];

export async function callTool(name: string, args: Args): Promise<{ ok: true; result: unknown } | { ok: false; error: string }> {
  const tool = OPS_TOOLS.find((t) => t.name === name);
  if (!tool) return { ok: false, error: `Unknown tool '${name}'` };
  try {
    return { ok: true, result: await tool.handler(args) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
