import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createToolInventoryAudit, resolveRoots } from "./audit-tool-inventory.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultOutputRoot = path.resolve(scriptDir, "../output/smoke/deferred-tool-access");
const defaultBaseUrl = process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088";

export async function createDeferredToolAccessSmokeManifest(options = {}) {
  const roots = resolveRoots(options);
  const audit = await createToolInventoryAudit(roots);
  const deferredSlugs = audit.entries
    .filter((entry) => entry.coverage.registry && !entry.launchCertified)
    .map((entry) => entry.slug)
    .sort((a, b) => a.localeCompare(b));
  const launchLocales = audit.sources.locales.toolarsLaunchLocales;
  const surfaces = [
    { name: "workspace", suffix: "" },
    { name: "about", suffix: "/about" }
  ];

  return {
    generatedAt: new Date().toISOString(),
    roots,
    summary: {
      tools: deferredSlugs.length,
      locales: launchLocales.length,
      total: deferredSlugs.length * launchLocales.length * surfaces.length
    },
    scenarios: deferredSlugs.flatMap((slug) =>
      launchLocales.flatMap((locale) =>
        surfaces.map((surface) => ({
          slug,
          locale,
          path: `${locale === "en" ? "" : `/${locale}`}/tools/${slug}${surface.suffix}`,
          surface: surface.name
        }))
      )
    )
  };
}

export function evaluateDeferredToolAccessSnapshot(snapshot) {
  if (snapshot.status !== 404) {
    return { ok: false, error: `Expected HTTP 404, received ${snapshot.status ?? "unknown"}` };
  }
  if (snapshot.notFoundMarkerCount < 1) {
    return { ok: false, error: "Localized not-found marker missing" };
  }

  return { ok: true, error: null };
}

export async function runDeferredToolAccessSmoke({
  baseUrl = defaultBaseUrl,
  outputRoot = process.env.TOOLARS_DEFERRED_TOOL_SMOKE_OUTPUT_DIR ?? defaultOutputRoot,
  manifest,
  scenarios,
  limit,
  concurrency = 8
} = {}) {
  const normalizedBaseUrl = stripTrailingSlash(baseUrl);
  const smokeManifest = manifest ?? (await createDeferredToolAccessSmokeManifest());
  const selectedScenarios = (scenarios ?? smokeManifest.scenarios).slice(0, limit ?? undefined);
  const results = new Array(selectedScenarios.length);
  let cursor = 0;

  await fs.mkdir(outputRoot, { recursive: true });

  async function runNext() {
    const index = cursor;
    cursor += 1;
    if (index >= selectedScenarios.length) return;

    results[index] = await runDeferredToolAccessScenario(normalizedBaseUrl, selectedScenarios[index]);
    await runNext();
  }

  const workerCount = Math.max(1, Math.min(concurrency, selectedScenarios.length));
  await Promise.all(Array.from({ length: workerCount }, () => runNext()));

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

  await fs.writeFile(path.join(outputRoot, "deferred-tool-access-smoke-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

export function parseDeferredToolAccessSmokeArgs(argv) {
  const options = {
    baseUrl: stripTrailingSlash(defaultBaseUrl),
    concurrency: 8
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
    } else if (arg === "--output-dir") {
      options.outputRoot = requireValue(argv, index);
      index += 1;
    } else {
      throw new Error(`Unknown deferred tool access smoke option: ${arg}`);
    }
  }

  return options;
}

export function formatDeferredToolAccessSmokeSummary(report) {
  return [
    `Deferred tool access smoke: ${report.summary.failed === 0 ? "pass" : "fail"}`,
    `Base URL: ${report.baseUrl}`,
    `Routes: ${report.summary.passed}/${report.summary.total}`,
    ...report.results
      .filter((result) => !result.ok)
      .slice(0, 20)
      .map((result) => `fail ${result.locale}${result.path} - ${result.error}`)
  ].join("\n") + "\n";
}

async function runDeferredToolAccessScenario(baseUrl, scenario) {
  const startedAt = Date.now();
  try {
    const response = await fetch(new URL(scenario.path, baseUrl), {
      headers: { "accept-language": scenario.locale }
    });
    const html = await response.text();
    const snapshot = {
      status: response.status,
      notFoundMarkerCount: html.includes("not-found-page") ? 1 : 0
    };
    const verdict = evaluateDeferredToolAccessSnapshot(snapshot);

    return {
      ...scenario,
      ok: verdict.ok,
      error: verdict.error,
      elapsedMs: Date.now() - startedAt,
      snapshot
    };
  } catch (error) {
    return {
      ...scenario,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      elapsedMs: Date.now() - startedAt,
      snapshot: { status: null, notFoundMarkerCount: 0 }
    };
  }
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

if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseDeferredToolAccessSmokeArgs(process.argv.slice(2));
  const report = await runDeferredToolAccessSmoke(options);
  process.stdout.write(formatDeferredToolAccessSmokeSummary(report));
  if (report.summary.failed > 0) process.exitCode = 1;
}

export { defaultOutputRoot };
