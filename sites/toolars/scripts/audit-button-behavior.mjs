import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = path.resolve(scriptDir, "..");

export async function createButtonBehaviorAudit(options = {}) {
  const siteRoot = options.siteRoot ?? defaultSiteRoot;
  const sourceRoot = options.sourceRoot ?? path.join(siteRoot, "src");
  const files = await listSourceFiles(sourceRoot);
  const findings = [];

  for (const filePath of files) {
    const source = await fs.readFile(filePath, "utf8");
    findings.push(...scanButtonBehaviorSource(source, path.relative(siteRoot, filePath)));
  }

  return {
    findings,
    summary: {
      ambiguousButtons: findings.length,
      scannedFiles: files.length
    }
  };
}

export function scanButtonBehaviorSource(source, filePath = "source.tsx") {
  const findings = [];
  const buttonPattern = /<button\b([\s\S]*?)>/g;
  let match;

  while ((match = buttonPattern.exec(source))) {
    const attrs = match[1];
    if (hasButtonBehavior(attrs)) continue;

    findings.push({
      attrs: normalizeAttrs(attrs),
      filePath,
      line: source.slice(0, match.index).split("\n").length,
      message: "Button needs onClick, disabled, formAction, or type=\"submit\" behavior."
    });
  }

  return findings;
}

export function formatButtonBehaviorAudit(audit) {
  const lines = [`Toolars button behavior audit: ${audit.findings.length === 0 ? "pass" : "fail"}`];
  lines.push(`Scanned files: ${audit.summary.scannedFiles}`);
  lines.push(`Ambiguous buttons: ${audit.summary.ambiguousButtons}`);

  for (const finding of audit.findings) {
    lines.push(`${finding.filePath}:${finding.line} ${finding.message}`);
  }

  return lines.join("\n");
}

async function listSourceFiles(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;

    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listSourceFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && /\.(tsx|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function hasButtonBehavior(attrs) {
  return (
    /\bonClick\s*=/.test(attrs) ||
    /\bdisabled(?:\s|=|>)/.test(attrs) ||
    /\bformAction\s*=/.test(attrs) ||
    /\btype\s*=\s*["']submit["']/.test(attrs)
  );
}

function normalizeAttrs(attrs) {
  return attrs.replace(/\s+/g, " ").trim().slice(0, 180);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const audit = await createButtonBehaviorAudit();
  console.log(formatButtonBehaviorAudit(audit));
  process.exitCode = audit.findings.length === 0 ? 0 : 1;
}
