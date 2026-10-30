// Comprehensive UI/UX + SEO audit for edwyz.com
import { chromium } from '@playwright/test';

const BASE = 'https://www.edwyz.com';
const PAGES = [
  { path: '/en',              label: 'Home' },
  { path: '/en/services',     label: 'Services' },
  { path: '/en/industries',   label: 'Industries' },
  { path: '/en/case-studies', label: 'Case Studies' },
  { path: '/en/about',        label: 'About' },
  { path: '/en/blog',         label: 'Blog' },
  { path: '/en/contact',      label: 'Contact' },
  { path: '/en/careers',      label: 'Careers' },
  { path: '/en/team',         label: 'Team' },
  { path: '/en/faq',          label: 'FAQ' },
];

const MOBILE = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 900 };

const issues = [];
const log = (page, severity, type, msg) => {
  issues.push({ page, severity, type, msg });
  const icon = severity === 'CRITICAL' ? '🔴' : severity === 'HIGH' ? '🟠' : severity === 'MEDIUM' ? '🟡' : '🔵';
  console.log(`  ${icon} [${severity}] [${type}] ${msg}`);
};

async function auditPage(browser, url, label) {
  console.log(`\n${'─'.repeat(60)}\n📄 ${label}  (${url})\n${'─'.repeat(60)}`);
  const ctx = await browser.newContext({ viewport: DESKTOP });
  const p = await ctx.newPage();

  // Collect console errors
  const consoleErrors = [];
  p.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  const failedRequests = [];
  p.on('requestfailed', r => failedRequests.push(r.url()));

  const t0 = Date.now();
  const res = await p.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => null);
  const loadTime = Date.now() - t0;

  if (!res || res.status() >= 400) {
    log(label, 'CRITICAL', 'HTTP', `Page returned ${res?.status() ?? 'error'}`);
    await ctx.close(); return;
  }
  console.log(`  ⏱  Load: ${loadTime}ms  |  Status: ${res.status()}`);
  if (loadTime > 3000) log(label, 'HIGH', 'PERF', `Slow load: ${loadTime}ms (target <3s)`);
  else if (loadTime > 2000) log(label, 'MEDIUM', 'PERF', `Load: ${loadTime}ms (target <2s)`);

  // ── SEO: Title ──────────────────────────────────────────────────────
  const title = await p.title();
  if (!title)                    log(label, 'CRITICAL', 'SEO', 'Missing <title> tag');
  else if (title.length < 30)   log(label, 'HIGH',     'SEO', `Title too short (${title.length} chars): "${title}"`);
  else if (title.length > 60)   log(label, 'MEDIUM',   'SEO', `Title too long (${title.length} chars): "${title}"`);
  else                           console.log(`  ✅ Title (${title.length}): "${title}"`);

  // ── SEO: Meta description ───────────────────────────────────────────
  const desc = await p.$eval('meta[name="description"]', el => el.content).catch(() => '');
  if (!desc)                     log(label, 'CRITICAL', 'SEO', 'Missing meta description');
  else if (desc.length < 50)    log(label, 'HIGH',     'SEO', `Meta description too short (${desc.length}): "${desc}"`);
  else if (desc.length > 160)   log(label, 'MEDIUM',   'SEO', `Meta description too long (${desc.length} chars)`);
  else                           console.log(`  ✅ Meta desc (${desc.length} chars)`);

  // ── SEO: Canonical ──────────────────────────────────────────────────
  const canonical = await p.$eval('link[rel="canonical"]', el => el.href).catch(() => '');
  if (!canonical) log(label, 'HIGH', 'SEO', 'Missing canonical URL');
  else            console.log(`  ✅ Canonical: ${canonical}`);

  // ── SEO: OG tags ────────────────────────────────────────────────────
  const ogTitle  = await p.$eval('meta[property="og:title"]', el => el.content).catch(() => '');
  const ogDesc   = await p.$eval('meta[property="og:description"]', el => el.content).catch(() => '');
  const ogImage  = await p.$eval('meta[property="og:image"]', el => el.content).catch(() => '');
  if (!ogTitle)  log(label, 'HIGH',   'SEO', 'Missing og:title');
  if (!ogDesc)   log(label, 'HIGH',   'SEO', 'Missing og:description');
  if (!ogImage)  log(label, 'MEDIUM', 'SEO', 'Missing og:image');
  else           console.log(`  ✅ OG tags present`);

  // ── SEO: H1 ─────────────────────────────────────────────────────────
  const h1s = await p.$$eval('h1', els => els.map(el => el.textContent?.trim()));
  if (h1s.length === 0)   log(label, 'CRITICAL', 'SEO', 'No H1 tag found');
  else if (h1s.length > 1) log(label, 'HIGH',   'SEO', `Multiple H1s (${h1s.length}): ${h1s.map(h=>`"${h}"`).join(', ')}`);
  else                     console.log(`  ✅ H1: "${h1s[0]?.slice(0,60)}"`);

  // ── SEO: Structured data ────────────────────────────────────────────
  const jsonLd = await p.$$eval('script[type="application/ld+json"]', els => els.length);
  if (jsonLd === 0) log(label, 'MEDIUM', 'SEO', 'No JSON-LD structured data');
  else              console.log(`  ✅ JSON-LD: ${jsonLd} block(s)`);

  // ── Images: alt text + sizing ───────────────────────────────────────
  const imgIssues = await p.$$eval('img', imgs => imgs.map(img => ({
    src: img.src.slice(-40),
    alt: img.alt,
    loading: img.loading,
    width: img.width,
    height: img.height,
    natural: img.naturalWidth,
  })));
  const noAlt = imgIssues.filter(i => i.alt === '');
  const noLazy = imgIssues.filter((i, idx) => idx > 0 && i.loading !== 'lazy');
  const noSize = imgIssues.filter(i => !i.width || !i.height);
  if (noAlt.length)  log(label, 'HIGH',   'A11Y', `${noAlt.length} image(s) missing alt text`);
  if (noLazy.length) log(label, 'MEDIUM', 'PERF', `${noLazy.length} non-hero image(s) missing loading="lazy"`);
  if (noSize.length) log(label, 'MEDIUM', 'PERF', `${noSize.length} image(s) missing explicit width/height (causes CLS)`);
  if (!noAlt.length && !noLazy.length) console.log(`  ✅ Images (${imgIssues.length}): alt + lazy OK`);

  // ── Links: href check ───────────────────────────────────────────────
  const emptyLinks = await p.$$eval('a', els => els.filter(a => !a.href || a.href === '#' || a.href === 'javascript:void(0)').length);
  if (emptyLinks) log(label, 'MEDIUM', 'UX', `${emptyLinks} link(s) with empty/hash href`);

  // ── Accessibility: buttons without label ────────────────────────────
  const unlabeledBtns = await p.$$eval('button', els =>
    els.filter(b => !b.textContent?.trim() && !b.getAttribute('aria-label') && !b.getAttribute('aria-labelledby')).length
  );
  if (unlabeledBtns) log(label, 'HIGH', 'A11Y', `${unlabeledBtns} button(s) missing accessible label`);

  // ── Focus / keyboard nav: inputs without labels ─────────────────────
  const unlabeledInputs = await p.$$eval('input:not([type="hidden"])', els =>
    els.filter(i => !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby') && !document.querySelector(`label[for="${i.id}"]`)).length
  );
  if (unlabeledInputs) log(label, 'HIGH', 'A11Y', `${unlabeledInputs} input(s) missing labels`);

  // ── Mobile viewport ─────────────────────────────────────────────────
  const mCtx = await browser.newContext({ viewport: MOBILE, isMobile: true });
  const mp = await mCtx.newPage();
  await mp.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => null);

  // Check for horizontal overflow (sign of mobile layout breakage)
  const hasHorizScroll = await mp.evaluate(() => document.body.scrollWidth > window.innerWidth + 4);
  if (hasHorizScroll) log(label, 'HIGH', 'MOBILE', 'Horizontal overflow on mobile — layout broken');
  else                console.log(`  ✅ Mobile: no horizontal overflow`);

  // Check viewport meta
  const viewportMeta = await mp.$eval('meta[name="viewport"]', el => el.content).catch(() => '');
  if (!viewportMeta.includes('width=device-width')) log(label, 'CRITICAL', 'MOBILE', 'Missing/invalid viewport meta tag');

  // Check tap target sizes (buttons < 44px)
  const smallTargets = await mp.$$eval('button, a', els =>
    els.filter(el => {
      const r = el.getBoundingClientRect();
      return (r.width > 0 && r.height > 0) && (r.width < 44 || r.height < 44);
    }).length
  );
  if (smallTargets > 2) log(label, 'MEDIUM', 'MOBILE', `${smallTargets} tap targets smaller than 44×44px`);

  await mCtx.close();

  // ── Console errors ──────────────────────────────────────────────────
  if (consoleErrors.length) log(label, 'MEDIUM', 'JS', `${consoleErrors.length} JS console error(s): ${consoleErrors[0]?.slice(0,80)}`);
  if (failedRequests.length) log(label, 'HIGH',  'NET', `${failedRequests.length} failed request(s): ${failedRequests[0]?.slice(0,80)}`);

  await ctx.close();
}

async function checkGlobalSEO(browser) {
  console.log(`\n${'═'.repeat(60)}\n🌐 GLOBAL SEO CHECKS\n${'═'.repeat(60)}`);
  const ctx = await browser.newContext();
  const p = await ctx.newPage();

  // robots.txt
  const rRes = await p.goto(`${BASE}/robots.txt`).catch(() => null);
  const rOK = rRes?.status() === 200;
  if (!rOK) log('Global', 'HIGH', 'SEO', 'robots.txt not found or not serving');
  else       console.log(`  ✅ robots.txt: OK`);

  // sitemap
  const sRes = await p.goto(`${BASE}/sitemap.xml`).catch(() => null);
  const sOK = sRes?.status() === 200;
  if (!sOK) log('Global', 'HIGH', 'SEO', 'sitemap.xml missing — critical for indexing');
  else {
    const body = await p.content();
    const urlCount = (body.match(/<loc>/g) || []).length;
    console.log(`  ✅ sitemap.xml: ${urlCount} URL(s)`);
  }

  // favicon
  const fRes = await p.goto(`${BASE}/favicon.ico`).catch(() => null);
  if (!fRes || fRes.status() >= 400) log('Global', 'MEDIUM', 'UX', 'favicon.ico missing');
  else console.log(`  ✅ favicon.ico: OK`);

  // www → https redirect
  const redirCtx = await browser.newContext();
  const redirP = await redirCtx.newPage();
  const redir = await redirP.goto('http://edwyz.com', { waitUntil: 'commit' }).catch(() => null);
  const finalUrl = redirP.url();
  if (!finalUrl.startsWith('https://')) log('Global', 'CRITICAL', 'SEO', `HTTP not redirecting to HTTPS (landed on ${finalUrl})`);
  else                                   console.log(`  ✅ HTTP→HTTPS redirect: OK`);
  await redirCtx.close();

  await ctx.close();
}

(async () => {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🔍  EDWYZ.COM — FULL AUDIT  (${new Date().toISOString()})`);
  console.log(`${'═'.repeat(60)}`);

  const browser = await chromium.launch({ headless: true });

  await checkGlobalSEO(browser);

  for (const { path, label } of PAGES) {
    await auditPage(browser, `${BASE}${path}`, label);
  }

  await browser.close();

  // ── Summary ──────────────────────────────────────────────────────────
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📊  AUDIT SUMMARY`);
  console.log(`${'═'.repeat(60)}`);
  const bySeverity = { CRITICAL: [], HIGH: [], MEDIUM: [], LOW: [] };
  for (const i of issues) (bySeverity[i.severity] || []).push(i);
  for (const [sev, list] of Object.entries(bySeverity)) {
    if (list.length) {
      const icon = sev === 'CRITICAL' ? '🔴' : sev === 'HIGH' ? '🟠' : sev === 'MEDIUM' ? '🟡' : '🔵';
      console.log(`\n${icon} ${sev} (${list.length}):`);
      for (const i of list) console.log(`   • [${i.page}] [${i.type}] ${i.msg}`);
    }
  }
  console.log(`\nTotal issues: ${issues.length}  (${bySeverity.CRITICAL.length} critical, ${bySeverity.HIGH.length} high, ${bySeverity.MEDIUM.length} medium)`);
})();
