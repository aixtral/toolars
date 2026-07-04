import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { getCaptureOptions, getExpectedFirstViewportSize } from "./visual-design-pack-utils.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const mapPath = path.join(scriptDir, "visual-design-pack-map.json");
const designRoot = path.join(repoRoot, "design");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outputRoot = process.env.TOOLARS_VISUAL_OUTPUT_DIR
  ? path.resolve(process.env.TOOLARS_VISUAL_OUTPUT_DIR)
  : path.join(repoRoot, "output", "visual-design-pack", runId);
const baseUrl = (process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9321").replace(/\/$/, "");
const limit = Number(process.env.TOOLARS_VISUAL_LIMIT ?? "0");
const requestedIds = new Set(
  (process.env.TOOLARS_VISUAL_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
);

const manifest = JSON.parse(readFileSync(mapPath, "utf8"));
const filteredEntries = requestedIds.size > 0 ? manifest.filter((entry) => requestedIds.has(entry.id)) : manifest;
const entries = Number.isFinite(limit) && limit > 0 ? filteredEntries.slice(0, limit) : filteredEntries;

mkdirSync(outputRoot, { recursive: true });

const results = [];
const browser = await chromium.launch();

try {
  for (const entry of entries) {
    const designPath = path.join(designRoot, entry.design);
    const screenshotName = `${entry.id}-${entry.surface}-${entry.formFactor}.png`;
    const screenshotPath = path.join(outputRoot, screenshotName);
    const url = `${baseUrl}${entry.route}`;
    const designExists = existsSync(designPath);
    const captureOptions = getCaptureOptions(entry);
    const expectedFirstViewportSize = getExpectedFirstViewportSize(entry);
    const startedAt = Date.now();
    let error = null;

    try {
      const context = await browser.newContext({
        viewport: captureOptions.viewport,
        deviceScaleFactor: captureOptions.deviceScaleFactor,
        colorScheme: "light"
      });
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.localStorage.setItem(
          "toolars:cookie-consent",
          JSON.stringify({ status: "rejected", timestamp: Date.now() })
        );
      });
      await page.goto(url, { timeout: 25000, waitUntil: "networkidle" });
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      await page.waitForTimeout(900);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await context.close();
    } catch (captureError) {
      error = captureError instanceof Error ? captureError.message : String(captureError);
    }

    const ok = !error && designExists && existsSync(screenshotPath);
    results.push({
      ...entry,
      url,
      designPath,
      screenshotPath,
      ok,
      elapsedMs: Date.now() - startedAt,
      deviceScaleFactor: captureOptions.deviceScaleFactor,
      expectedFirstViewportSize,
      error: ok ? null : error ?? "Screenshot command failed"
    });

    const status = ok ? "ok" : "fail";
    console.log(`${status} ${entry.id} ${entry.formFactor} ${entry.route}`);
  }
} finally {
  await browser.close();
}

const report = {
  baseUrl,
  createdAt: new Date().toISOString(),
  designRoot,
  outputRoot,
  requested: entries.length,
  passed: results.filter((result) => result.ok).length,
  failed: results.filter((result) => !result.ok).length,
  results
};

writeFileSync(path.join(outputRoot, "visual-design-pack-report.json"), JSON.stringify(report, null, 2));

if (report.failed > 0) {
  console.error(`Visual design-pack verification failed: ${report.failed}/${report.requested} screenshots failed.`);
  process.exit(1);
}

console.log(`Visual design-pack verification complete: ${report.passed}/${report.requested} screenshots captured.`);
console.log(outputRoot);
