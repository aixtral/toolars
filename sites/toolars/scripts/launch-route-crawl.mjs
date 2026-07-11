import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const launchLocales = new Set(["en", "es", "zh-hans", "zh-hant"]);
const draftLocales = new Set(["ar", "fr", "hi", "ja", "pt", "ru"]);

export function extractSitemapUrls(xml) {
  const urls = [];
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(decodeXml(match[1]));
  for (const match of xml.matchAll(/\shref="([^"]+)"/g)) urls.push(decodeXml(match[1]));
  return [...new Set(urls)];
}

export function createRouteCrawlTargets(xml, { baseUrl }) {
  const base = new URL(baseUrl);
  const targets = [];

  for (const value of extractSitemapUrls(xml)) {
    const sourceUrl = safeUrl(value, base);
    if (!sourceUrl || isDraftLocalePath(sourceUrl.pathname)) continue;
    if (!isLaunchPath(sourceUrl.pathname)) continue;
    targets.push(new URL(`${sourceUrl.pathname}${sourceUrl.search}`, base).toString());
  }

  return [...new Set(targets)];
}

export async function crawlRouteTargets(targets, { fetcher = fetch, concurrency = 8 } = {}) {
  const results = new Array(targets.length);
  let cursor = 0;

  async function crawlNext() {
    const index = cursor;
    cursor += 1;
    if (index >= targets.length) return;

    const target = targets[index];
    const startedAt = Date.now();
    let status = 0;
    let ok = false;
    let error = null;

    try {
      const response = await fetcher(target, {
        redirect: "follow",
        headers: { "accept-language": "en-US,en;q=0.9" }
      });
      status = response.status;
      const text = await response.text();
      ok = response.ok && hasHealthyPageText(text);
      if (!ok) {
        error = response.ok ? "Application error marker or blank response found" : `HTTP ${response.status}`;
      }
    } catch (caught) {
      error = caught instanceof Error ? caught.message : String(caught);
    }

    results[index] = {
      url: target,
      ok,
      status,
      elapsedMs: Date.now() - startedAt,
      error
    };

    await crawlNext();
  }

  const workerCount = Math.max(1, Math.min(concurrency, targets.length));
  await Promise.all(Array.from({ length: workerCount }, () => crawlNext()));

  return {
    createdAt: new Date().toISOString(),
    status: results.every((result) => result.ok) ? "pass" : "fail",
    summary: {
      total: results.length,
      passed: results.filter((result) => result.ok).length,
      failed: results.filter((result) => !result.ok).length
    },
    results
  };
}

function isLaunchPath(pathname) {
  const segment = firstPathSegment(pathname);
  return segment === "" || launchLocales.has(segment) || !isLocaleLike(segment);
}

function isDraftLocalePath(pathname) {
  return draftLocales.has(firstPathSegment(pathname));
}

function firstPathSegment(pathname) {
  return pathname.split("/").filter(Boolean)[0] ?? "";
}

function isLocaleLike(segment) {
  return /^[a-z]{2}(?:-[a-z]+)?$/i.test(segment);
}

function hasHealthyPageText(text) {
  const trimmed = text.trim();
  if (trimmed.length < 40) return false;
  return ![
    "Application error",
    "Unhandled Runtime Error",
    "Build Error",
    "Failed to compile",
    "NEXT_NOT_FOUND"
  ].some((marker) => trimmed.includes(marker));
}

function safeUrl(value, base) {
  try {
    return new URL(value, base);
  } catch {
    return null;
  }
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function defaultOutputRoot() {
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(repoRoot, "output", "launch-route-crawl", runId);
}

async function runCli() {
  const baseUrl = (process.env.TOOLARS_BASE_URL ?? "http://127.0.0.1:9088").replace(/\/$/, "");
  const outputRoot = process.env.TOOLARS_ROUTE_CRAWL_OUTPUT_DIR
    ? path.resolve(process.env.TOOLARS_ROUTE_CRAWL_OUTPUT_DIR)
    : defaultOutputRoot();

  mkdirSync(outputRoot, { recursive: true });

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`, {
    headers: { "accept-language": "en-US,en;q=0.9" }
  });
  if (!sitemapResponse.ok) {
    throw new Error(`Unable to fetch sitemap.xml: HTTP ${sitemapResponse.status}`);
  }

  const sitemap = await sitemapResponse.text();
  const targets = createRouteCrawlTargets(sitemap, { baseUrl });
  const report = await crawlRouteTargets(targets);

  writeFileSync(path.join(outputRoot, "launch-route-crawl-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Launch route crawl complete: ${report.summary.passed}/${report.summary.total} passed`);
  console.log(outputRoot);

  if (report.status !== "pass") {
    const sample = report.results.filter((result) => !result.ok).slice(0, 10);
    console.error(JSON.stringify(sample, null, 2));
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
