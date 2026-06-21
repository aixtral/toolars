import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "../..");
const mapPath = path.join(scriptDir, "visual-design-pack-map.json");
const designRoot = path.join(repoRoot, "design");
const captureReportPath = resolveCaptureReportPath();
const captureReport = JSON.parse(readFileSync(captureReportPath, "utf8"));
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outputRoot = process.env.TOOLARS_PIXELMATCH_OUTPUT_DIR
  ? path.resolve(process.env.TOOLARS_PIXELMATCH_OUTPUT_DIR)
  : path.join(repoRoot, "output", "visual-design-diff", runId);
const limit = Number(process.env.TOOLARS_PIXELMATCH_LIMIT ?? "0");
const threshold = Number(process.env.TOOLARS_PIXELMATCH_THRESHOLD ?? "0.1");
const maxRatio = process.env.TOOLARS_PIXELMATCH_MAX_RATIO
  ? Number(process.env.TOOLARS_PIXELMATCH_MAX_RATIO)
  : null;
const requestedIds = new Set(
  (process.env.TOOLARS_PIXELMATCH_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
);

const manifest = JSON.parse(readFileSync(mapPath, "utf8"));
const filteredEntries = requestedIds.size > 0
  ? manifest.filter((entry) => requestedIds.has(entry.id))
  : manifest;
const entries = Number.isFinite(limit) && limit > 0 ? filteredEntries.slice(0, limit) : filteredEntries;
const screenshotResults = new Map(
  captureReport.results.map((result) => [entryKey(result), result])
);
const results = [];

mkdirSync(outputRoot, { recursive: true });

for (const entry of entries) {
  const key = entryKey(entry);
  const reportResult = screenshotResults.get(key);
  const designPath = path.join(designRoot, entry.design);
  const screenshotPath = reportResult?.screenshotPath;
  const artifactName = `${entry.id}-${entry.surface}-${entry.formFactor}`;
  const diffPath = path.join(outputRoot, `${artifactName}-diff.png`);

  if (!existsSync(designPath) || !screenshotPath || !existsSync(screenshotPath)) {
    const error = !existsSync(designPath)
      ? "Missing design PNG"
      : "Missing implementation screenshot";
    results.push({
      ...entry,
      ok: false,
      error,
      designPath,
      screenshotPath: screenshotPath ?? null,
      diffPath: null
    });
    console.log(`fail ${entry.id} ${entry.formFactor} ${entry.route} ${error}`);
    continue;
  }

  const design = readPng(designPath);
  const implementation = readPng(screenshotPath);
  const normalized = normalizeImplementation(implementation, entry, design, reportResult);
  const diff = new PNG({ width: design.width, height: design.height });
  const mismatchedPixels = pixelmatch(
    design.data,
    normalized.image.data,
    diff.data,
    design.width,
    design.height,
    { threshold, includeAA: false, alpha: 0.35 }
  );
  const totalPixels = design.width * design.height;
  const mismatchRatio = mismatchedPixels / totalPixels;
  const ratioExceeded = maxRatio !== null && Number.isFinite(maxRatio) && mismatchRatio > maxRatio;

  writeFileSync(diffPath, PNG.sync.write(diff));

  results.push({
    ...entry,
    ok: !ratioExceeded,
    error: ratioExceeded ? `Mismatch ratio exceeded ${maxRatio}` : null,
    designPath,
    screenshotPath,
    diffPath,
    designSize: { width: design.width, height: design.height },
    implementationSize: { width: implementation.width, height: implementation.height },
    comparedSize: { width: design.width, height: design.height },
    deviceScaleFactor: normalized.deviceScaleFactor,
    implementationCropSize: normalized.cropSize,
    implementationResized: normalized.resized,
    mismatchedPixels,
    totalPixels,
    mismatchRatio
  });

  const status = ratioExceeded ? "fail" : "diff";
  console.log(`${status} ${entry.id} ${entry.formFactor} ${formatPercent(mismatchRatio)} ${entry.route}`);
}

const compared = results.filter((result) => typeof result.mismatchRatio === "number");
const failed = results.filter((result) => !result.ok);
const averageMismatchRatio = compared.length > 0
  ? compared.reduce((sum, result) => sum + result.mismatchRatio, 0) / compared.length
  : 0;
const maxMismatchResult = compared.reduce(
  (max, result) => result.mismatchRatio > max.mismatchRatio ? result : max,
  { mismatchRatio: 0 }
);

const report = {
  createdAt: new Date().toISOString(),
  designRoot,
  captureReportPath,
  captureOutputRoot: captureReport.outputRoot,
  outputRoot,
  threshold,
  maxRatio,
  requested: entries.length,
  compared: compared.length,
  failed: failed.length,
  averageMismatchRatio,
  maxMismatchRatio: maxMismatchResult.mismatchRatio,
  maxMismatchEntry: maxMismatchResult.id
    ? {
        id: maxMismatchResult.id,
        route: maxMismatchResult.route,
        surface: maxMismatchResult.surface,
        formFactor: maxMismatchResult.formFactor,
        mismatchRatio: maxMismatchResult.mismatchRatio,
        diffPath: maxMismatchResult.diffPath
      }
    : null,
  results
};

writeFileSync(path.join(outputRoot, "visual-design-diff-report.json"), JSON.stringify(report, null, 2));

console.log(`Pixelmatch design diff complete: ${report.compared}/${report.requested} compared.`);
console.log(`Average mismatch: ${formatPercent(report.averageMismatchRatio)}.`);
console.log(`Max mismatch: ${formatPercent(report.maxMismatchRatio)}.`);
console.log(outputRoot);

if (failed.length > 0) {
  console.error(`Pixelmatch design diff found ${failed.length}/${entries.length} failed inputs or threshold breaches.`);
  process.exit(1);
}

function resolveCaptureReportPath() {
  if (process.env.TOOLARS_VISUAL_REPORT) {
    return path.resolve(process.env.TOOLARS_VISUAL_REPORT);
  }

  if (process.env.TOOLARS_VISUAL_CAPTURE_DIR) {
    return path.join(path.resolve(process.env.TOOLARS_VISUAL_CAPTURE_DIR), "visual-design-pack-report.json");
  }

  const visualRoot = path.join(repoRoot, "output", "visual-design-pack");
  const latest = readdirSync(visualRoot)
    .map((name) => path.join(visualRoot, name))
    .filter((candidate) => existsSync(path.join(candidate, "visual-design-pack-report.json")))
    .sort((left, right) => statSync(right).mtimeMs - statSync(left).mtimeMs)[0];

  if (!latest) {
    throw new Error(`No visual design-pack report found under ${visualRoot}`);
  }

  return path.join(latest, "visual-design-pack-report.json");
}

function readPng(filePath) {
  return PNG.sync.read(readFileSync(filePath));
}

function normalizeImplementation(image, entry, design, reportResult) {
  const deviceScaleFactor = reportResult?.deviceScaleFactor ?? 1;
  const viewportWidth = Math.round((entry.viewport?.width ?? image.width) * deviceScaleFactor);
  const viewportHeight = Math.round((entry.viewport?.height ?? image.height) * deviceScaleFactor);
  const cropWidth = Math.min(viewportWidth, image.width);
  const cropHeight = Math.min(viewportHeight, image.height);
  const cropped = cropTopLeft(image, cropWidth, cropHeight);
  const resized = cropped.width !== design.width || cropped.height !== design.height;
  const normalized = resized ? resizeNearest(cropped, design.width, design.height) : cropped;

  return {
    image: normalized,
    deviceScaleFactor,
    cropSize: { width: cropWidth, height: cropHeight },
    resized
  };
}

function cropTopLeft(image, width, height) {
  const output = blankPng(width, height);
  const copyWidth = Math.min(width, image.width);
  const copyHeight = Math.min(height, image.height);

  for (let y = 0; y < copyHeight; y += 1) {
    for (let x = 0; x < copyWidth; x += 1) {
      copyPixel(image, output, x, y, x, y);
    }
  }

  return output;
}

function resizeNearest(image, width, height) {
  const output = blankPng(width, height);

  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.min(image.height - 1, Math.floor((y / height) * image.height));
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.min(image.width - 1, Math.floor((x / width) * image.width));
      copyPixel(image, output, sourceX, sourceY, x, y);
    }
  }

  return output;
}

function blankPng(width, height) {
  const output = new PNG({ width, height });
  for (let index = 0; index < output.data.length; index += 4) {
    output.data[index] = 255;
    output.data[index + 1] = 255;
    output.data[index + 2] = 255;
    output.data[index + 3] = 255;
  }
  return output;
}

function copyPixel(source, target, sourceX, sourceY, targetX, targetY) {
  const sourceIndex = (source.width * sourceY + sourceX) * 4;
  const targetIndex = (target.width * targetY + targetX) * 4;
  target.data[targetIndex] = source.data[sourceIndex];
  target.data[targetIndex + 1] = source.data[sourceIndex + 1];
  target.data[targetIndex + 2] = source.data[sourceIndex + 2];
  target.data[targetIndex + 3] = source.data[sourceIndex + 3];
}

function entryKey(entry) {
  return `${entry.id}-${entry.surface}-${entry.formFactor}`;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}
