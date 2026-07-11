import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createToolInventoryAudit, resolveRoots } from "./audit-tool-inventory.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultOutputRoot = path.resolve(scriptDir, "../output/playwright/public-tool-workspace-smoke");
const defaultBaseUrl = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088";

export async function createPublicToolWorkspaceSmokeManifest(options = {}) {
  const roots = resolveRoots(options);
  const audit = await createToolInventoryAudit(roots);
  const launchCertifiedSlugs = audit.entries
    .filter((entry) => entry.launchCertified)
    .map((entry) => entry.slug)
    .sort((a, b) => a.localeCompare(b));
  const publicUncertifiedSlugs = [];
  const publicSlugs = launchCertifiedSlugs;

  return {
    generatedAt: new Date().toISOString(),
    roots,
    summary: {
      total: publicSlugs.length,
      launchCertified: launchCertifiedSlugs.length,
      publicUncertified: publicUncertifiedSlugs.length
    },
    scenarios: publicSlugs.map((slug) => ({
      slug,
      path: `/tools/${slug}`,
      workspaceSelectors: createWorkspaceSelectors(slug)
    }))
  };
}

export function createWorkspaceSelectors(slug) {
  return [
    `[data-tool-workspace="${slug}"]`,
    `[data-ai-lab-tool="${slug}"]`,
    `[data-pdf-desktop-layout="workspace-v2"]`
  ];
}

export function evaluatePublicToolWorkspaceSnapshot(snapshot) {
  if (!snapshot.status || snapshot.status < 200 || snapshot.status >= 400) {
    return { ok: false, error: `HTTP ${snapshot.status ?? "unknown"}` };
  }
  if (snapshot.markerCount < 1) {
    return { ok: false, error: "Workspace marker missing" };
  }
  if (snapshot.interactiveControlCount < 1) {
    return { ok: false, error: "Interactive controls missing" };
  }
  if ((snapshot.pageErrors?.length ?? 0) > 0 || (snapshot.consoleErrors?.length ?? 0) > 0) {
    return { ok: false, error: "Browser errors found" };
  }

  return { ok: true, error: null };
}

export async function runPublicToolWorkspaceSmoke({
  baseUrl = defaultBaseUrl,
  outputRoot = process.env.TOOLARS_PUBLIC_WORKSPACE_SMOKE_OUTPUT_DIR ?? defaultOutputRoot,
  manifest,
  scenarios,
  limit,
  concurrency = 4,
  headless = process.env.TOOLARS_SMOKE_HEADED === "1" ? false : true
} = {}) {
  const normalizedBaseUrl = stripTrailingSlash(baseUrl);
  const smokeManifest = manifest ?? (await createPublicToolWorkspaceSmokeManifest());
  const selectedScenarios = (scenarios ?? smokeManifest.scenarios).slice(0, limit ?? undefined);
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({ baseURL: normalizedBaseUrl });
  const results = new Array(selectedScenarios.length);
  let cursor = 0;

  await fs.mkdir(outputRoot, { recursive: true });

  async function runNext() {
    const index = cursor;
    cursor += 1;
    if (index >= selectedScenarios.length) return;

    results[index] = await runWorkspaceScenario(context, selectedScenarios[index]);
    await runNext();
  }

  try {
    const workerCount = Math.max(1, Math.min(concurrency, selectedScenarios.length));
    await Promise.all(Array.from({ length: workerCount }, () => runNext()));
  } finally {
    await context.close();
    await browser.close();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: normalizedBaseUrl,
    manifestSummary: smokeManifest.summary,
    summary: {
      total: results.length,
      passed: results.filter((result) => result.ok).length,
      failed: results.filter((result) => !result.ok).length
    },
    results
  };

  await fs.writeFile(path.join(outputRoot, "public-tool-workspace-smoke-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

export function parsePublicToolWorkspaceSmokeArgs(argv) {
  const options = {
    baseUrl: stripTrailingSlash(defaultBaseUrl),
    concurrency: 4
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      continue;
    } else if (arg === "--base-url") {
      options.baseUrl = stripTrailingSlash(requireValue(argv, index));
      index += 1;
    } else if (arg === "--limit") {
      options.limit = parsePositiveInteger(requireValue(argv, index), "--limit");
      index += 1;
    } else if (arg === "--concurrency") {
      options.concurrency = parsePositiveInteger(requireValue(argv, index), "--concurrency");
      index += 1;
    } else if (arg === "--write") {
      options.write = requireValue(argv, index);
      index += 1;
    } else if (arg === "--output-dir") {
      options.outputRoot = requireValue(argv, index);
      index += 1;
    } else if (arg === "--headed") {
      options.headless = false;
    } else {
      throw new Error(`Unknown public workspace smoke option: ${arg}`);
    }
  }

  return options;
}

export function formatPublicToolWorkspaceSmokeSummary(report) {
  return [
    "Public tool workspace smoke: " + (report.summary.failed === 0 ? "pass" : "fail"),
    `Base URL: ${report.baseUrl}`,
    `Workspaces: ${report.summary.passed}/${report.summary.total}`,
    ...report.results
      .filter((result) => !result.ok)
      .slice(0, 20)
      .map((result) => `fail ${result.slug} - ${result.error}`)
  ].join("\n") + "\n";
}

async function runWorkspaceScenario(context, scenario) {
  const startedAt = Date.now();
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  try {
    const response = await page.goto(scenario.path, { waitUntil: "networkidle", timeout: 30_000 });
    const markerSelector = scenario.workspaceSelectors.join(", ");
    const marker = page.locator(markerSelector);
    await marker.first().waitFor({ state: "visible", timeout: 15_000 });
    const snapshot = {
      status: response?.status() ?? 0,
      markerCount: await visibleCount(marker),
      interactiveControlCount: await visibleCount(page.locator('input:not([type="hidden"]), textarea, select, button, [role="button"]')),
      consoleErrors,
      pageErrors
    };
    const verdict = evaluatePublicToolWorkspaceSnapshot(snapshot);

    return {
      slug: scenario.slug,
      path: scenario.path,
      ok: verdict.ok,
      error: verdict.error,
      elapsedMs: Date.now() - startedAt,
      snapshot
    };
  } catch (error) {
    return {
      slug: scenario.slug,
      path: scenario.path,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      elapsedMs: Date.now() - startedAt,
      snapshot: {
        consoleErrors,
        pageErrors
      }
    };
  } finally {
    await page.close();
  }
}

async function visibleCount(locator) {
  return locator.evaluateAll((nodes) =>
    nodes.filter((node) => {
      if (!(node instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(node);
      return style.visibility !== "hidden" && style.display !== "none" && node.getClientRects().length > 0;
    }).length
  );
}

function stripTrailingSlash(value) {
  return String(value).replace(/\/+$/, "");
}

function requireValue(args, index) {
  const value = args[index + 1];
  if (!value) throw new Error(`${args[index]} requires a value`);
  return value;
}

function parsePositiveInteger(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${label} must be a positive integer`);
  return parsed;
}

export { defaultOutputRoot };

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = parsePublicToolWorkspaceSmokeArgs(process.argv.slice(2));
    const report = await runPublicToolWorkspaceSmoke(options);
    if (options.write) {
      await fs.mkdir(path.dirname(options.write), { recursive: true });
      await fs.writeFile(options.write, `${JSON.stringify(report, null, 2)}\n`);
    }
    process.stdout.write(formatPublicToolWorkspaceSmokeSummary(report));
    if (report.summary.failed > 0) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
