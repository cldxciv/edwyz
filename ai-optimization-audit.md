# Edwyz vs Google's "Optimizing for generative AI features on Google Search" guide

Audit date: 2026-10-03. Guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide (fetched successfully via WebFetch; the content below is taken from that fetch, which returns a summarised rendering, so quotes are as returned by the tool). Site checked: C:\Users\ADMIN\projects\edwyz\web source (read-only) plus live pages at https://www.edwyz.com (robots.txt, llms.txt, the ai-visibility-discovery service page, the AEO blog post).

## What the guide actually says

- Optimising for generative AI features is still SEO. The guide explicitly rejects "AEO"/"GEO" as separate disciplines and "hacks".
- Eligibility: a page must be indexed and eligible to show in Search with a snippet, and be crawlable.
- Biggest lever: unique, non-commodity, expert, first-hand content that is well written and clearly structured (headings, paragraphs), supported by good images/video. Do not mass-produce variations (scaled content abuse).
- Technical: semantic HTML is a good idea but not required; follow JavaScript SEO practice; good page experience (mobile, accessibility); reduce duplicate content.
- Local/ecommerce: Merchant Center, Google Business Profile where relevant.
- Measure with Search Console's generative AI performance report; do not trust third-party tools claiming access to Google's AI ranking.
- NOT needed: llms.txt or other AI text files, special markup or Markdown ("Google Search ignores them", harmless but no benefit); chunking content into tiny pieces; writing in a special way for AI or chasing long-tail variants; inauthentic mentions; structured data is not required and there is no special schema (still useful for rich results). Page length: no ideal length.
- Emerging agentic use: agents read screenshots, the DOM and the accessibility tree, so clean DOM and accessible markup help.

## Verdict

The technical foundation is good: everything is indexable, crawlable, server-rendered, with correct canonicals, hreflang, sitemaps and sensible JSON-LD. Nothing blocks AI features. The gaps are in content and trust signals, which the guide says matter most: no named human authors or real team page, thin service-page copy for the flagship AI Visibility service (no FAQ, no evidence/case study, no dates), a blog post that is partly commodity and unsourced and that contradicts Google's position, and no way of measuring performance documented in the repo. There is no llms.txt (404), which is fine per the guide.

## Recommendation-by-recommendation status

| Guide recommendation | Status | Evidence |
|---|---|---|
| Page indexed and eligible for snippet (no noindex/nosnippet) | Met | No `nosnippet`, `max-snippet` or `data-nosnippet` anywhere in src. Root `robots: {index:true, follow:true, googleBot:{...}}` in src/app/[locale]/layout.tsx:29. noIndex only via CMS `seo-pages` and excluded from sitemap (src/app/sitemap.ts:63, scripts/verify-seo.mjs:53) |
| Crawlable (robots.txt) | Met | Live robots.txt and src/app/robots.ts: `Allow: /`, disallow /admin and /api only, sitemap declared. No blocking of Googlebot or Google-Extended |
| Sitemap with accurate lastmod and hreflang | Met | src/app/sitemap.ts (CMS updatedAt, lastmod.json, alternates, x-default; English-only paths limited to /en) |
| Canonical / duplicate-content control | Met | seo-core.ts buildMetadata: canonical per locale, non-translated pages canonicalise to /en (ENGLISH_ONLY_PATHS: /faq, /team, /privacy; static blogs en-only) |
| Content is server-rendered text, not JS-only or image-only | Met | Pages are statically generated (revalidate 3600). Live blog and service pages return full article and service text. Static blog body rendered as plain h2/h3/p in blog/[slug]/page.tsx |
| Semantic HTML / clear heading structure | Met | Single H1 plus H2/H3 on service and blog pages; breadcrumbs; FAQ uses dl/dt/dd. Service page headings include generic ones ("How We Work") |
| Page experience, mobile, accessibility | Partial / not verified | Responsive Tailwind site; heavy animation components (Reveal, HeroScene) and chat/WhatsApp widgets. No Lighthouse/CWV data in repo. Live service page logo had no alt text in the fetched markup |
| Structured data matches visible content | Mostly met | Organization+WebSite graph (seo-core.ts siteGraph), Service on services/[slug], Article and BreadcrumbList on blog/case studies, FAQPage on /faq built from the same data as the visible text. Issues below (Person author, Service lacks offers detail, case studies marked up as Article, FAQPage rich results restricted by Google). Guide says structured data is optional anyway |
| Unique, non-commodity, expert, first-hand content | Partial | The AEO post has a point of view but is mostly generic: no original data, no client results, no screenshots of real audits. Service page copy is a capability list (services.ts:640-657). No case study for AI visibility. Team page is a single placeholder "Edwyz Leadership" (team/page.tsx:32-41) |
| Clear authorship and about/contact (E-E-A-T) | Partial | Author is "Edwyz Research Team" / "Edwyz Team" (static-blogs.ts:32,92...), no bio, no person, no credentials. Org JSON-LD has sameAs, email contactPoint, foundingDate; no address, phone, founder or employee Person entities. Contact email and WhatsApp visible. Privacy page states a registered address |
| Freshness (real dates) | Partial | Articles show real publish dates and Article JSON-LD has datePublished/dateModified. But static blogs set `updatedAt = publishedAt` (blog/[slug]/page.tsx:65) so dateModified never changes; service, industry and about pages show no "last updated". The AEO post is dated 2026-10-03 and cites 2025 figures (Perplexity 15M DAU early 2025, ChatGPT 200M weekly users, AI Overviews about 15%) with no sources, which is stale for 2026 |
| Internal linking | Partial | Nav, footer, breadcrumbs, related services/posts, industries and case studies are all present. The static blog body contains no in-text links (plain text only), so the AEO post does not link to /services/ai-visibility-discovery, and the service page does not link to the post. Static blog related-posts list is first 3 CMS posts, not topical |
| Multimodal: images with alt, video | Partial | Static blog images have descriptive alt and captions (static-blogs.ts:56,67). Cover image alt is just the post title (blog/[slug]/page.tsx:212). Blog images are marketing renders, not informative graphics. No video anywhere. next/image used, fixed 800x450 dims |
| Avoid scaled/duplicate content | Met | Four locales are real translations of static copy; English-only pages are not hreflang'd. Industries x services not templated spam, though service/industry pages share structure |
| Monitor with Search Console generative AI report | Unknown | No verification tag or Search Console reference in the repo (grep found none; may be DNS-verified). Cannot confirm from here |
| Google Business Profile (if relevant) | Not verified | No LocalBusiness/address markup. Edwyz is remote-first B2B so low priority, but the blog post itself tells clients to audit GBP |
| Agent-friendly (accessibility tree, DOM) | Partial | Standard forms with labels (ContactForm) and links. Chat widget is client-only and not required for core content. Worth an accessibility pass on icon-only buttons |
| llms.txt / AI-specific files / special markup | Not applicable (guide says not needed) | https://www.edwyz.com/llms.txt returns 404. Correct to leave out for Google. Do not spend time here |
| Chunking content for AI | Not applicable (guide says not needed) | n/a |
| Write specially for AI / long-tail variants | Not applicable (guide says not needed) | n/a. See content issue below: the AEO post and service copy promote "AI-specific" tactics |
| Avoid inauthentic mentions | Met | No evidence of mention-farming in the repo |

## Content accuracy problem (commercially important)

Edwyz sells "AEO content architecture", "Schema markup & entity optimization for AI indexing" and "structured data pipelines for RAG-ready content" (services.ts:648-657) and the blog post says AEO "overlap [with SEO] is smaller than most SEO professionals admit" and that schema, FAQ content and "RAG-ready documentation" are needed for AI visibility (static-blogs.ts:58-64). Google's guide says the opposite for Google's AI features: it is SEO, no special schema, no AI-specific files or writing. An informed client or a reviewer comparing to the guide will see the claims as overstated. The claims are defensible for non-Google systems (ChatGPT, Perplexity, Claude) but the site should say so explicitly and cite sources, rather than imply they apply to Google AI Overviews / AI Mode. The description also lists "Google AI Overviews" in the same sentence as AEO deliverables.

## Prioritised changes

### P1 (content and trust, highest influence per the guide)

1. Name real authors. Replace "Edwyz Research Team" / "Edwyz Team" with named people with role, short bio, photo and LinkedIn; add an author byline block to blog and case-study pages and emit `author: {"@type":"Person", name, url, sameAs}` in articleJsonLd. Files: src/lib/data/static-blogs.ts (author field), src/app/[locale]/(site)/blog/[slug]/page.tsx (byline, line ~180), src/lib/seo-core.ts (articleJsonLd, accept author url/sameAs; the `/edwyz/i` test at line 229 forces Organization author for any name containing "Edwyz").
2. Fill out the team page: it currently renders one placeholder card unless the Payload `team` collection has data (src/app/[locale]/(site)/team/page.tsx:32-41). Add real members in the CMS or fallback, and add Person JSON-LD with `worksFor: {"@id": ORG_ID}`. Add a Person `founder` to Organization in siteGraph().
3. Make the AEO blog post non-commodity and accurate: fix the SEO-vs-AEO framing to match Google's guide (state clearly that for Google AI features it is standard SEO plus quality, and that tactics such as llms.txt are not used by Google); cite sources and dates for the usage statistics or remove them (static-blogs.ts:47); add original material (a real audit of a named or anonymised client with before/after citation rate, screenshots, method). Add a "Last updated" with a true date.
4. Strengthen the ai-visibility-discovery page (src/lib/data/services.ts:640 plus the seo-copy.ts entry at line 96 and the page template): add proof (case study or measured result), a concrete methodology, pricing or engagement model, 4-6 real FAQs (visible and, optionally, FAQPage markup), and a visible author/reviewer and updated date. The page is currently a description plus a bullet list.

### P2 (internal links, freshness, structured data accuracy)

5. Add in-text links in static blog content: extend ContentBlock/paragraph rendering to support links (blog/[slug]/page.tsx:259-260 strips everything to plain text), then link the AEO post to /services/ai-visibility-discovery, /services/generative-ai, /services/llm-development, /faq and the contact page; add a contextual "Read our guide" link from the service page to the post. Make the related-posts selection topical (same category/tags) at blog/[slug]/page.tsx:112-125.
6. Real dateModified: stop setting `updatedAt: staticPost.publishedAt` (line 65); add an `updatedAt` field to StaticBlog and bump it when edited. Show "Updated <date>" next to the publish date. Consider a visible last-reviewed date on service pages and mirror it in `dateModified` of the Service/WebPage JSON-LD.
7. Structured data tidy-up:
   - Service JSON-LD (services/[slug]/page.tsx:64-73): `areaServed: "Worldwide"` is fine; add `url` of the service listing, `category`, and `offers` only if pricing is shown. Add `@id`.
   - Case studies use Article (case-studies/[slug]/page.tsx:89); acceptable, but author and dates must be real.
   - FAQPage on /faq: harmless, but Google only shows FAQ rich results for well-known government/health sites, so do not expect gains. The FAQ page is English-only while locales exist; either translate or keep canonical to /en (already done).
   - Organization (seo-core.ts siteGraph): add `address` (country/locality at least), `telephone` if public, `founder`, `areaServed`, `knowsAbout`. Keep in sync with the visible contact page.
8. Cover and body image alt text: use a descriptive alt for coverImage instead of the title (blog/[slug]/page.tsx:212; add `coverAlt` field). Replace decorative marketing renders in the AEO post with informative figures (for example the 3-layer visibility model as a labelled diagram with a text caption). Ensure the logo has non-empty alt in Header/Logo.tsx.

### P3 (measurement, polish, optional)

9. Confirm Search Console (domain property) is verified and review the Generative AI performance report monthly; record this in the repo docs. Do not rely on third-party "AI ranking" tools for Google-specific claims, per the guide.
10. Add an informative video or short walkthrough for the AI Visibility service (hosted on YouTube with transcript on-page), per the guide's multimedia advice. Low priority.
11. Run a Core Web Vitals / accessibility pass (Reveal and hero animations, icon-only buttons, chat widget focus) since the guide cites page experience and agentic readers use the accessibility tree.
12. Local: if Edwyz has a registered office, create/verify a Google Business Profile and match it with the Organization schema address. Optional for a remote B2B firm.
13. Locale coverage: the AEO post and FAQ and team pages are English-only. Either translate the AEO post (the service page is already translated in es/fr/de) or leave canonical to /en as now. Do not machine-translate at scale without review (scaled content abuse caution).

### Explicitly not recommended

- Creating llms.txt, AI-specific markdown mirrors, or special schema for Google's sake; the guide says Google ignores them. Optional for other AI services if the business wants it, but it will not affect Google visibility.
- Splitting articles into tiny chunks or rewriting copy for AI phrasing.
- Adding nosnippet or max-snippet (would reduce eligibility); current absence is correct.
- Buying or seeding "mentions" for AI visibility.

## Limitations

The WebFetch tool returns a processed summary, so live JSON-LD, canonical and robots meta tags could not be inspected directly; those were verified from source (seo-core.ts, layout.tsx, page files). Payload CMS content (team, FAQ, posts, case studies) is not visible from source, so the real production content of those collections was not audited. No builds or servers were run, and no project files were modified.
