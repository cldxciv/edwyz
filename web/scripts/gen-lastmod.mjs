// Regenerates src/lib/data/lastmod.json: per-page "last content update" dates from git
// (latest commit touching the page's source files; files never committed fall back to mtime).
// Pass --include-uncommitted to also count working-tree edits. Run it after committing page changes.
// No-op without git (e.g. on the VPS), so the committed JSON is used as-is.
import { execFileSync } from "node:child_process";
import { existsSync, statSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "src/app/[locale]/(site)";
const MAP = {
  "/": [`${SITE}/page.tsx`, "src/components/home"],
  "/about": [`${SITE}/about/page.tsx`],
  "/services": [`${SITE}/services/page.tsx`, "src/lib/data/services.ts"],
  "/services/*": [`${SITE}/services/[slug]/page.tsx`, "src/lib/data/services.ts", "src/lib/data/seo-copy.ts"],
  "/industries": [`${SITE}/industries/page.tsx`, "src/lib/data/industries.ts"],
  "/industries/*": [`${SITE}/industries/[slug]/page.tsx`, "src/lib/data/industries.ts", "src/lib/data/seo-copy.ts"],
  "/case-studies": [`${SITE}/case-studies/page.tsx`],
  "/blog": [`${SITE}/blog/page.tsx`],
  "/careers": [`${SITE}/careers/page.tsx`],
  "/contact": [`${SITE}/contact/page.tsx`],
  "/ai-hub": [`${SITE}/ai-hub/page.tsx`],
  "/faq": [`${SITE}/faq/page.tsx`],
  "/team": [`${SITE}/team/page.tsx`],
  "/privacy": [`${SITE}/privacy/page.tsx`],
  "/terms": [`${SITE}/terms/page.tsx`],
};

const git = (...args) => execFileSync("git", ["--literal-pathspecs", ...args], { encoding: "utf8" }).trim();

try {
  git("rev-parse", "--is-inside-work-tree");
} catch {
  console.log("lastmod: not a git checkout, keeping existing lastmod.json");
  process.exit(0);
}

const walk = (p) =>
  statSync(p).isDirectory() ? readdirSync(p).flatMap((f) => walk(join(p, f))) : [p];

const root = git("rev-parse", "--show-toplevel");
const out = {};
for (const [key, paths] of Object.entries(MAP)) {
  const dates = [];
  const committed = git("log", "-1", "--format=%cI", "--", ...paths);
  if (committed) dates.push(new Date(committed));
  const dirty = !process.argv.includes("--include-uncommitted") ? [] : git("status", "--porcelain", "--", ...paths)
    .split("\n")
    .filter(Boolean)
    .map((l) => l.slice(3).replace(/^"|"$/g, ""));
  for (const d of dirty) {
    const abs = join(root, d);
    if (existsSync(abs)) for (const f of walk(abs)) dates.push(statSync(f).mtime);
  }
  if (!dates.length) for (const p of paths) if (existsSync(p)) for (const f of walk(p)) dates.push(statSync(f).mtime);
  out[key] = new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString();
}
writeFileSync("src/lib/data/lastmod.json", JSON.stringify(out, null, 2) + "\n");
console.log("lastmod: wrote", Object.keys(out).length, "entries");
