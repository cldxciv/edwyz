// Usage: node scripts/audit-page.mjs http://localhost:3400
// Loads key pages in Chromium, logs console errors / failed requests and runs axe colour-contrast.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const paths = ["/en", "/en/services/generative-ai", "/en/industries/healthcare", "/en/blog", "/en/contact", "/en/about", "/en/faq"];
const browser = await chromium.launch();

for (const [label, viewport, theme] of [
  ["desktop-dark", { width: 1366, height: 800 }, "dark"],
  ["desktop-light", { width: 1366, height: 800 }, "light"],
  ["mobile-dark", { width: 390, height: 844 }, "dark"],
]) {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
  for (const p of paths) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text().slice(0, 160)}`));
    page.on("pageerror", (e) => errors.push(`pageerror: ${String(e).slice(0, 160)}`));
    page.on("requestfailed", (r) => errors.push(`requestfailed: ${r.url().slice(0, 120)}`));
    page.on("response", (r) => r.status() >= 400 && errors.push(`http ${r.status()}: ${r.url().slice(0, 120)}`));
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(3500);
    const axe = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
    const nodes = axe.violations.flatMap((v) => v.nodes);
    console.log(`[${label}] ${p}: ${errors.length} console/network issues, ${nodes.length} contrast failures`);
    for (const e of [...new Set(errors)].slice(0, 6)) console.log("   ", e);
    for (const n of nodes.slice(0, 8)) {
      const d = n.any[0]?.data ?? {};
      console.log(`    contrast ${d.contrastRatio} fg ${d.fgColor} bg ${d.bgColor} :: ${n.target.join(" ")} :: ${(n.html || "").slice(0, 90)}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
