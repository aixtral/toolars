import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = path.resolve(scriptDir, "..");
const copiedValueAllowlist = new Set([
  "AI",
  "API",
  "Beta",
  "CSV",
  "Free",
  "Google",
  "JSON",
  "LLM",
  "MCP",
  "PDF",
  "Pro",
  "Team",
  "Toolars",
  "URL"
]);
const stableTechnicalValueAllowlist = new Set(["UTF-8 Base64"]);
const stableUnitPattern =
  /\b(?:g\/kg|ng\/dL|mg\/dL|mmol\/L|mmHg|KiB|MiB|GiB|KB|MB|GB|TB|B|kg|g|mg|cm|mm|m|bpm|kcal|cal|min)\b/g;
const launchLocaleCodes = ["es", "zh-hans", "zh-hant"];
const draftLocaleCodes = ["ar", "fr", "hi", "ja", "pt", "ru"];

export async function createI18nAudit(options = {}) {
  const siteRoot = path.resolve(options.siteRoot ?? defaultSiteRoot);
  const messages = await readMessages(path.join(siteRoot, "messages"));
  const coverage = auditMessageCoverage(messages);
  const englishMessages = messages.en ?? {};
  const copiedByLocale = {};

  for (const [locale, localeMessages] of Object.entries(messages)) {
    if (locale === "en") continue;
    copiedByLocale[locale] = findCopiedEnglishValues(englishMessages, localeMessages, locale);
  }
  const copiedEnglishAccounting = auditCopiedEnglishByPhase(copiedByLocale);

  const sourceFiles = await collectSourceFiles(path.join(siteRoot, "src"));
  const sourceScans = [];

  for (const filePath of sourceFiles) {
    const source = await fs.readFile(filePath, "utf8");
    sourceScans.push(scanSourceText(source, path.relative(siteRoot, filePath)));
  }

  const hardcodedText = sourceScans.flatMap((scan) => scan.hardcodedText);
  const absoluteHrefs = sourceScans.flatMap((scan) => scan.absoluteHrefs);
  const copiedEnglishStrings = Object.values(copiedByLocale).reduce((sum, items) => sum + items.length, 0);
  const messageKeyMismatches = Object.values(coverage.locales).reduce(
    (sum, locale) => sum + locale.missingKeys.length + locale.extraKeys.length,
    0
  );

  return {
    generatedAt: new Date().toISOString(),
    status:
      messageKeyMismatches === 0 && copiedEnglishStrings === 0 && hardcodedText.length === 0 && absoluteHrefs.length === 0
        ? "pass"
        : "needs-work",
    roots: { siteRoot },
    summary: {
      locales: Object.keys(messages),
      messageKeyMismatches,
      copiedEnglishStrings,
      copiedEnglishStringsByPhase: {
        launch: copiedEnglishAccounting.launch.total,
        draft: copiedEnglishAccounting.draft.total
      },
      hardcodedTextCandidates: hardcodedText.length,
      absoluteHrefCandidates: absoluteHrefs.length
    },
    messages: {
      coverage,
      copiedEnglishByLocale: copiedByLocale,
      copiedEnglishAccounting
    },
    source: {
      hardcodedText,
      absoluteHrefs,
      topHardcodedTextFiles: topFiles(hardcodedText),
      topAbsoluteHrefFiles: topFiles(absoluteHrefs)
    }
  };
}

export function auditMessageCoverage(messagesByLocale) {
  const english = flattenMessages(messagesByLocale.en ?? {});
  const englishKeys = Object.keys(english).sort();
  const locales = {};

  for (const [locale, messages] of Object.entries(messagesByLocale)) {
    if (locale === "en") continue;
    const flattened = flattenMessages(messages);
    const localeKeys = Object.keys(flattened).sort();
    locales[locale] = {
      missingKeys: englishKeys.filter((key) => !localeKeys.includes(key)),
      extraKeys: localeKeys.filter((key) => !englishKeys.includes(key))
    };
  }

  return {
    englishKeys: englishKeys.length,
    locales
  };
}

export function findCopiedEnglishValues(englishMessages, localeMessages, locale) {
  const english = flattenMessages(englishMessages);
  const localized = flattenMessages(localeMessages);
  const copied = [];

  for (const [key, englishValue] of Object.entries(english)) {
    const localizedValue = localized[key];
    if (localizedValue !== englishValue) continue;
    if (!isCopiedEnglishCandidate(key, englishValue)) continue;

    copied.push({
      locale,
      key,
      value: englishValue
    });
  }

  return copied;
}

export function auditCopiedEnglishByPhase(copiedEnglishByLocale) {
  const byLocale = {};
  const launchTotal = sumCopiedEnglishCounts(copiedEnglishByLocale, launchLocaleCodes, byLocale, "launch");
  const draftTotal = sumCopiedEnglishCounts(copiedEnglishByLocale, draftLocaleCodes, byLocale, "draft");

  for (const locale of Object.keys(copiedEnglishByLocale).sort()) {
    if (byLocale[locale]) continue;
    const items = copiedEnglishByLocale[locale] ?? [];
    byLocale[locale] = {
      phase: "unknown",
      count: items.length,
      sampleKeys: items.slice(0, 5).map((item) => item.key)
    };
  }

  return {
    launch: {
      locales: launchLocaleCodes,
      total: launchTotal
    },
    draft: {
      locales: draftLocaleCodes,
      total: draftTotal
    },
    byLocale
  };
}

export function scanSourceText(source, file) {
  const hardcodedText = [];
  const absoluteHrefs = [];
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const visit = (node) => {
    if (ts.isJsxText(node)) {
      const text = normalizeText(node.getText(sourceFile));
      if (isLikelyHardcodedEnglish(text)) hardcodedText.push({ file, text, kind: "text-node" });
    }

    if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const name = node.name.text;
      const value = node.initializer.text;

      if (["aria-label", "placeholder", "title", "alt"].includes(name) && isLikelyHardcodedEnglish(normalizeText(value))) {
        hardcodedText.push({ file, text: normalizeText(value), kind: name });
      }

      if (name === "href" && /^\/(?!\/|#)/.test(value)) absoluteHrefs.push({ file, href: value });
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return {
    file,
    hardcodedText,
    absoluteHrefs
  };
}

export function formatI18nAuditSummary(audit) {
  const lines = [
    `Toolars i18n audit: ${audit.status}`,
    `Locales: ${audit.summary.locales.join(", ")}`,
    `Message key mismatches: ${audit.summary.messageKeyMismatches}`,
    `Copied English strings: ${audit.summary.copiedEnglishStrings}`,
    `Copied English strings by phase: launch=${audit.summary.copiedEnglishStringsByPhase.launch}, draft=${audit.summary.copiedEnglishStringsByPhase.draft}`,
    `Hardcoded UI text candidates: ${audit.summary.hardcodedTextCandidates}`,
    `Absolute href candidates: ${audit.summary.absoluteHrefCandidates}`
  ];

  if (audit.source.topHardcodedTextFiles.length > 0) {
    lines.push("Top hardcoded text files:");
    for (const item of audit.source.topHardcodedTextFiles.slice(0, 8)) {
      lines.push(`- ${item.file}: ${item.count}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function readMessages(messagesDir) {
  const files = await safeReadDir(messagesDir);
  const messageFiles = files
    .filter((file) => file.isFile() && file.name.endsWith(".json"))
    .map((file) => file.name)
    .sort((a, b) => (a === "en.json" ? -1 : b === "en.json" ? 1 : a.localeCompare(b)));
  const messages = {};

  for (const file of messageFiles) {
    const locale = file.replace(/\.json$/, "");
    messages[locale] = JSON.parse(await fs.readFile(path.join(messagesDir, file), "utf8"));
  }

  return messages;
}

async function collectSourceFiles(srcRoot) {
  const files = [];
  await walk(srcRoot, files);

  return files
    .filter((file) => /\.(tsx|ts)$/.test(file))
    .filter((file) => !/\.(test|spec)\.(tsx|ts)$/.test(file))
    .filter((file) => file.includes(`${path.sep}src${path.sep}app${path.sep}[locale]${path.sep}`) || file.includes(`${path.sep}src${path.sep}components${path.sep}`))
    .sort((a, b) => a.localeCompare(b));
}

async function walk(dir, output) {
  if (!existsSync(dir)) return;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const nextPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(nextPath, output);
      continue;
    }
    output.push(nextPath);
  }
}

async function safeReadDir(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

function flattenMessages(value, prefix = "", output = {}) {
  if (!value || typeof value !== "object") {
    if (prefix) output[prefix] = String(value ?? "");
    return output;
  }

  const entries = Array.isArray(value) ? value.entries() : Object.entries(value);
  for (const [key, nestedValue] of entries) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (nestedValue && typeof nestedValue === "object") {
      flattenMessages(nestedValue, nextKey, output);
      continue;
    }
    output[nextKey] = String(nestedValue ?? "");
  }

  return output;
}

function isCopiedEnglishCandidate(key, value) {
  const text = normalizeText(value);
  if (!text || copiedValueAllowlist.has(text)) return false;
  if (/(^|\.)(href|id|key|path|slug|url)$/.test(key)) return false;
  if (isStableCopiedFormat(key, text)) return false;
  if (!/[a-z]/.test(text)) return false;
  if (text.length < 8) return false;
  if (text.split(/\s+/).length < 2) return false;

  return true;
}

function isStableCopiedFormat(key, text) {
  return (
    isPlaceholderFormulaOrMeasurement(text) ||
    isStableUserAgentSample(key, text) ||
    isStableMaskedPaymentLabel(key, text) ||
    isStableServiceName(key, text) ||
    isStableTechnicalValue(key, text)
  );
}

function isPlaceholderFormulaOrMeasurement(text) {
  if (!/[{}\d]/.test(text)) return false;

  const remainder = text
    .replace(/\{[^{}]+\}/g, " ")
    .replace(/\d+(?:\.\d+)?/g, " ")
    .replace(stableUnitPattern, " ")
    .replace(/\s+/g, " ")
    .trim();

  return remainder === "" || /^[.,:;()[\]|/\\+\-*=<>\u00d7\u2013\u2014~% ]+$/.test(remainder);
}

function isStableUserAgentSample(key, text) {
  if (!keyEndsWithAny(key, ["placeholder", "inputPlaceholder", "userAgent"])) return false;
  return /^Mozilla\/5\.0\b.*\bChrome\/\d+(?:\.\d+)*\b.*\bSafari\/\d+(?:\.\d+)*\b/.test(text);
}

function isStableMaskedPaymentLabel(key, text) {
  if (!keyEndsWithAny(key, ["card", "label", "value"])) return false;
  return /^(?:Visa|Mastercard|MasterCard|Amex|American Express|Discover)\s*[\u00b7\u2022* xX.-]*\d{2,4}$/.test(text);
}

function isStableServiceName(key, text) {
  if (!keyEndsWithAny(key, ["appName", "name", "providerName", "serviceName"])) return false;
  return text === "Google Drive";
}

function isStableTechnicalValue(key, text) {
  if (!keyEndsWithAny(key, ["encoding", "format", "mode", "runMode"])) return false;
  return stableTechnicalValueAllowlist.has(text);
}

function keyEndsWithAny(key, suffixes) {
  return suffixes.some((suffix) => key === suffix || key.endsWith(`.${suffix}`));
}

function isLikelyHardcodedEnglish(text) {
  if (!text || text.length < 3) return false;
  if (/^&(?:copy|reg|trade);$/i.test(text)) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  if (/^[A-Z0-9 /&+-]{2,8}$/.test(text)) return false;
  if (/^[{}()[\].,:;'"`]+$/.test(text)) return false;
  if (copiedValueAllowlist.has(text)) return false;

  return true;
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function topFiles(items) {
  const counts = new Map();
  for (const item of items) {
    counts.set(item.file, (counts.get(item.file) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
}

function sumCopiedEnglishCounts(copiedEnglishByLocale, localeCodes, byLocale, phase) {
  return localeCodes.reduce((sum, locale) => {
    const items = copiedEnglishByLocale[locale] ?? [];
    byLocale[locale] = {
      phase,
      count: items.length,
      sampleKeys: items.slice(0, 5).map((item) => item.key)
    };
    return sum + items.length;
  }, 0);
}

async function runCli() {
  const args = process.argv.slice(2);
  const writeIndex = args.indexOf("--write");
  const writePath = writeIndex >= 0 ? args[writeIndex + 1] : null;
  const audit = await createI18nAudit();

  if (writePath) {
    const target = path.resolve(defaultSiteRoot, writePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  }

  if (args.includes("--json")) {
    process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
  } else {
    process.stdout.write(formatI18nAuditSummary(audit));
  }

  if (args.includes("--fail-on-blockers") && audit.status !== "pass") {
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
