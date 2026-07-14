import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createRouteCrawlTargets } from "./launch-route-crawl.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");

export const layoutGateLocales = ["en", "es", "zh-hans", "zh-hant"];
export const layoutGateWorkflowSlugs = ["pdf-summary", "ai-prompt-hardening", "llm-cost-review", "mcp-tool-launch"];
export const layoutGateViewports = [
  { id: "desktop", width: 1280, height: 720 },
  { id: "mobile", width: 390, height: 844 }
];
export const requiredWorkflowLayoutPaths = layoutGateLocales.flatMap((locale) =>
  layoutGateWorkflowSlugs.map((slug) => `/${locale}/workflows/${slug}`)
);

export function createLayoutFindings({ controls, root, url, viewport }) {
  const findings = [];

  if (root.scrollWidth > root.clientWidth + 1) {
    findings.push({
      actualWidth: root.scrollWidth,
      expectedWidth: root.clientWidth,
      kind: "page-horizontal-overflow",
      url,
      viewport
    });
  }

  for (const control of controls) {
    if (control.lineCount > 1 || control.whiteSpace !== "nowrap" || control.scrollWidth > control.clientWidth + 1) {
      findings.push({
        clientWidth: control.clientWidth,
        kind: "control-not-single-line",
        label: control.label,
        lineCount: control.lineCount,
        scrollWidth: control.scrollWidth,
        selector: control.selector,
        url,
        viewport,
        whiteSpace: control.whiteSpace
      });
    }
  }

  return findings;
}

export function createLayoutTargets(sitemap, { baseUrl }) {
  const base = new URL(baseUrl);
  const sitemapTargets = createRouteCrawlTargets(sitemap, { baseUrl });
  const workflowTargets = requiredWorkflowLayoutPaths.map((pathname) => new URL(pathname, base).toString());
  return [...new Set([...sitemapTargets, ...workflowTargets])];
}

export async function runLayoutContractAudit({
  baseUrl = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088",
  concurrency = Number(process.env.TOOLARS_LAYOUT_GATE_CONCURRENCY ?? "6"),
  fetcher = fetch,
  targets,
  viewports = layoutGateViewports
} = {}) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const sitemap = targets
    ? null
    : await fetchSitemap(normalizedBaseUrl, fetcher);
  const auditTargets = targets ?? createLayoutTargets(sitemap, { baseUrl: normalizedBaseUrl });
  const missingWorkflowPaths = requiredWorkflowLayoutPaths.filter((pathname) => !auditTargets.some((target) => new URL(target).pathname === pathname));
  const browser = await chromium.launch();

  try {
    const reports = [];
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      try {
        reports.push(...await auditTargetsAtViewport(context, auditTargets, viewport, concurrency));
      } finally {
        await context.close();
      }
    }

    const findings = reports.flatMap((report) => report.findings);
    for (const pathname of missingWorkflowPaths) {
      findings.push({ kind: "missing-workflow-layout-target", pathname });
    }

    return {
      createdAt: new Date().toISOString(),
      findings,
      status: findings.length === 0 ? "pass" : "fail",
      summary: {
        findings: findings.length,
        pages: reports.length,
        passed: reports.filter((report) => report.findings.length === 0).length,
        requiredWorkflowPages: requiredWorkflowLayoutPaths.length,
        targets: auditTargets.length,
        viewports: viewports.length
      },
      reports
    };
  } finally {
    await browser.close();
  }
}

async function fetchSitemap(baseUrl, fetcher) {
  const response = await fetcher(`${baseUrl}/sitemap.xml`);
  if (!response.ok) throw new Error(`Unable to fetch sitemap.xml: HTTP ${response.status}`);
  return response.text();
}

async function auditTargetsAtViewport(context, targets, viewport, requestedConcurrency) {
  const reports = new Array(targets.length);
  const concurrency = Math.max(1, Math.min(Number.isFinite(requestedConcurrency) ? requestedConcurrency : 6, targets.length));
  let cursor = 0;

  async function worker() {
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    try {
      while (cursor < targets.length) {
        const index = cursor;
        cursor += 1;
        const url = targets[index];
        pageErrors.length = 0;

        try {
          const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
          if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? "unknown"}`);
          const observation = await collectLayoutObservation(page);
          const findings = createLayoutFindings({ ...observation, url, viewport });
          for (const message of pageErrors) findings.push({ kind: "page-error", message, url, viewport });
          reports[index] = { findings, url, viewport };
        } catch (error) {
          reports[index] = {
            findings: [{
              kind: "layout-audit-navigation-error",
              message: error instanceof Error ? error.message : String(error),
              url,
              viewport
            }],
            url,
            viewport
          };
        }
      }
    } finally {
      await page.close();
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return reports;
}

async function collectLayoutObservation(page) {
  return page.evaluate(() => {
    const isVisible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const lineCount = (element) => {
      const textNodes = [];
      const collectTextNodes = (node) => {
        for (const child of node.childNodes) {
          if (child.nodeType === 3 && child.textContent?.trim()) textNodes.push(child);
          else collectTextNodes(child);
        }
      };
      collectTextNodes(element);

      const rows = new Set();
      for (const textNode of textNodes) {
        const range = document.createRange();
        range.selectNodeContents(textNode);
        for (const rect of range.getClientRects()) rows.add(Math.round(rect.top));
      }
      return Math.max(1, rows.size);
    };

    const controls = [...document.querySelectorAll("button:not(.command-trigger), .kbd")]
      .filter(isVisible)
      .flatMap((element) => {
        const label = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
        if (!label) return [];
        const style = getComputedStyle(element);
        return [{
          clientWidth: element.clientWidth,
          label,
          lineCount: lineCount(element),
          scrollWidth: element.scrollWidth,
          selector: element.matches(".kbd") ? ".kbd" : "button",
          whiteSpace: style.whiteSpace
        }];
      });

    return {
      controls,
      root: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }
    };
  });
}

function defaultOutputRoot() {
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(repoRoot, "output", "layout-contract", runId);
}

async function runCli() {
  const outputRoot = path.resolve(process.env.TOOLARS_LAYOUT_GATE_OUTPUT_DIR ?? defaultOutputRoot());
  mkdirSync(outputRoot, { recursive: true });
  const report = await runLayoutContractAudit();
  writeFileSync(path.join(outputRoot, "layout-contract-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Layout contract: ${report.summary.passed}/${report.summary.pages} page viewports passed`);
  console.log(`Layout findings: ${report.summary.findings}`);
  console.log(outputRoot);

  if (report.status !== "pass") {
    console.error(JSON.stringify(report.findings.slice(0, 40), null, 2));
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
