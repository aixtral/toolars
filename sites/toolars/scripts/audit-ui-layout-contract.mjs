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
  { id: "desktop-wide", width: 1440, height: 900 },
  { id: "desktop", width: 1280, height: 720 },
  { id: "tablet", width: 1024, height: 768 },
  { id: "mobile", width: 390, height: 844 }
];
export const headerSearchLayoutContracts = {
  // The command column is fluid: the trigger anchors to the brand gutter and
  // takes the space left by the nav (capped at 560px), so exact widths vary
  // by viewport and locale. The contract pins the left anchor plus a minimum
  // usable width; mobile keeps a fixed full-width row.
  "desktop-wide": { left: 262, minWidth: 480 },
  desktop: { left: 262, minWidth: 320 },
  tablet: { left: 24, width: 976 },
  mobile: { left: 12, width: 366 }
};
export const requiredWorkflowLayoutPaths = layoutGateLocales.flatMap((locale) =>
  layoutGateWorkflowSlugs.map((slug) => `/${locale}/workflows/${slug}`)
);

export function createHeaderGeometryFindings({ header, url, viewport }) {
  const expected = headerSearchLayoutContracts[viewport.id];
  if (!expected || header === undefined) return [];

  if (!header?.topbar || !header?.command) {
    return [{
      kind: "missing-shared-header-search",
      url,
      viewport
    }];
  }

  const actual = {
    left: header.command.left,
    width: header.command.width
  };
  const leftMatches = actual.left === expected.left;
  const widthMatches = expected.width !== undefined
    ? actual.width === expected.width
    : actual.width >= expected.minWidth;
  if (leftMatches && widthMatches) return [];

  return [{
    actual,
    expected,
    kind: "header-search-geometry-drift",
    url,
    viewport
  }];
}

export function createLayoutFindings({ controls, header, horizontalOffenders, root, url, viewport }) {
  const findings = [];

  findings.push(...createHeaderGeometryFindings({ header, url, viewport }));

  if (root.scrollWidth > root.clientWidth + 1) {
    findings.push({
      actualWidth: root.scrollWidth,
      expectedWidth: root.clientWidth,
      horizontalOffenders: horizontalOffenders ?? [],
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
          // Measure the settled page: web font swaps change text metrics, so a
          // measurement taken while fallback fonts are still active can report
          // transient overflow that users never see.
          await page.evaluate(() => document.fonts?.ready?.then(() => true) ?? true);
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

    const viewportWidth = document.documentElement.clientWidth;
    const pageScrollWidth = document.documentElement.scrollWidth;
    const horizontalOffenders = pageScrollWidth > viewportWidth + 1
      ? [...document.querySelectorAll("body *")]
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width > 0 && rect.height > 0 && (rect.right - viewportWidth > 0.5 || rect.left < -0.5))
        .slice(0, 5)
        .map(({ element, rect }) => ({
          left: Math.round(rect.left * 100) / 100,
          right: Math.round(rect.right * 100) / 100,
          selector: element.tagName.toLowerCase() + (typeof element.className === "string" && element.className.trim() ? `.${element.className.trim().replace(/\s+/g, ".")}` : ""),
          text: (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80)
        }))
      : [];

    return {
      controls,
      header: (() => {
        const topbar = document.querySelector(".topbar");
        const command = topbar?.querySelector(".command-trigger");
        if (!topbar || !command || !isVisible(topbar) || !isVisible(command)) return null;
        const topbarRect = topbar.getBoundingClientRect();
        const commandRect = command.getBoundingClientRect();
        const rounded = (value) => Math.round(value * 100) / 100;
        return {
          command: {
            left: rounded(commandRect.left),
            width: rounded(commandRect.width)
          },
          topbar: {
            left: rounded(topbarRect.left),
            width: rounded(topbarRect.width)
          }
        };
      })(),
      horizontalOffenders,
      root: {
        clientWidth: viewportWidth,
        scrollWidth: pageScrollWidth
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
