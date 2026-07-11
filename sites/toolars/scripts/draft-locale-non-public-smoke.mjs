import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outputRoot = process.env.TOOLARS_DRAFT_LOCALE_SMOKE_OUTPUT_DIR
  ? path.resolve(process.env.TOOLARS_DRAFT_LOCALE_SMOKE_OUTPUT_DIR)
  : path.join(repoRoot, "output", "draft-locale-smoke", runId);
const baseUrl = (process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088").replace(/\/$/, "");

const launchLocaleLabels = ["English", "Español", "简体中文", "繁體中文"];
const draftLocales = [
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" }
];

mkdirSync(outputRoot, { recursive: true });

const results = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runCheck(name, check) {
  const startedAt = Date.now();
  try {
    const detail = await check();
    results.push({ name, ok: true, elapsedMs: Date.now() - startedAt, ...detail });
    console.log(`ok ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, ok: false, elapsedMs: Date.now() - startedAt, error: message });
    console.error(`fail ${name}: ${message}`);
  }
}

function extractSitemapUrls(xml) {
  const urls = [];
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(match[1]);
  for (const match of xml.matchAll(/\shref="([^"]+)"/g)) urls.push(match[1]);
  return urls;
}

function firstPathSegment(url) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean)[0] ?? "";
  } catch {
    return "";
  }
}

await runCheck("sitemap-excludes-draft-locales", async () => {
  const response = await fetch(`${baseUrl}/sitemap.xml`);
  assert(response.ok, `Expected sitemap 2xx, got ${response.status}`);
  const xml = await response.text();
  const urls = extractSitemapUrls(xml);
  const hreflangs = [...xml.matchAll(/hreflang="([^"]+)"/g)].map((match) => match[1]);
  const leakedSegments = urls.filter((url) => draftLocales.some(({ code }) => firstPathSegment(url) === code));
  const leakedHreflangs = hreflangs.filter((hreflang) => draftLocales.some(({ code }) => hreflang.toLowerCase() === code));

  assert(leakedSegments.length === 0, `Draft locale URL leaked into sitemap: ${leakedSegments.join(", ")}`);
  assert(leakedHreflangs.length === 0, `Draft hreflang leaked into sitemap: ${leakedHreflangs.join(", ")}`);
  assert(hreflangs.includes("en") && hreflangs.includes("es"), "Launch hreflangs missing from sitemap");

  return { sitemapUrlCount: urls.length, checkedDraftLocales: draftLocales.map((locale) => locale.code) };
});

await runCheck("language-switcher-excludes-draft-locales", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    await page.goto(`${baseUrl}/explore/pdf`, { waitUntil: "networkidle", timeout: 30000 });
    await page.getByRole("button", { name: "Switch language: English" }).click();
    const menu = page.getByRole("listbox", { name: "Switch language: English" });
    await menu.waitFor({ state: "visible", timeout: 5000 });
    const optionTexts = await menu.locator("[role='option']").evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim() ?? ""));
    assert(JSON.stringify(optionTexts) === JSON.stringify(launchLocaleLabels), `Unexpected launch options: ${optionTexts.join(", ")}`);
    for (const { label } of draftLocales) {
      assert(!optionTexts.includes(label), `Draft locale leaked into desktop switcher: ${label}`);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/explore/pdf`, { waitUntil: "networkidle", timeout: 30000 });
    await page.locator('[data-mobile-menu="rustdesk-mobile-language-v1"] summary').click();
    const panel = page.locator('[data-mobile-menu-panel="rustdesk-mobile-language-v1"]');
    await panel.waitFor({ state: "visible", timeout: 5000 });
    const mobileOptionTexts = await panel.locator("[role='option']").evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim() ?? ""));
    assert(JSON.stringify(mobileOptionTexts) === JSON.stringify(launchLocaleLabels), `Unexpected mobile launch options: ${mobileOptionTexts.join(", ")}`);
    for (const { label } of draftLocales) {
      assert(!mobileOptionTexts.includes(label), `Draft locale leaked into mobile switcher: ${label}`);
    }

    return { desktopOptions: optionTexts, mobileOptions: mobileOptionTexts };
  } finally {
    await browser.close();
  }
});

await runCheck("direct-draft-locale-requests-redirect-then-404", async () => {
  const routes = draftLocales.flatMap(({ code }) => [`/${code}`, `/${code}/explore/pdf`]);
  const checked = [];

  for (const route of routes) {
    const initial = await fetch(`${baseUrl}${route}`, {
      redirect: "manual",
      headers: { "accept-language": "en-US,en;q=0.9" }
    });
    const expectedRedirectPath = `/en${route}`;
    const location = initial.headers.get("location");
    assert(initial.status === 308, `Expected 308 for ${route}, got ${initial.status}`);
    assert(location && new URL(location, baseUrl).pathname === expectedRedirectPath, `Unexpected redirect for ${route}: ${location}`);

    const final = await fetch(`${baseUrl}${route}`, {
      redirect: "follow",
      headers: { "accept-language": "en-US,en;q=0.9" }
    });
    assert(final.status === 404, `Expected final 404 for ${route}, got ${final.status}`);
    assert(new URL(final.url).pathname === expectedRedirectPath, `Unexpected final URL for ${route}: ${final.url}`);
    checked.push({ route, initialStatus: initial.status, redirectPath: expectedRedirectPath, finalStatus: final.status });
  }

  return { checked };
});

const report = {
  baseUrl,
  createdAt: new Date().toISOString(),
  outputRoot,
  passed: results.filter((result) => result.ok).length,
  failed: results.filter((result) => !result.ok).length,
  results
};

writeFileSync(path.join(outputRoot, "draft-locale-smoke-report.json"), JSON.stringify(report, null, 2));

if (report.failed > 0) {
  console.error(`Draft locale non-public smoke failed: ${report.failed}/${results.length} checks failed.`);
  console.error(outputRoot);
  process.exit(1);
}

console.log(`Draft locale non-public smoke complete: ${report.passed}/${results.length} checks passed.`);
console.log(outputRoot);
