import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultWorkspaceRoot = path.resolve(scriptDir, "../src/app/[locale]/tools");

export async function auditWorkspaceInteractions({ workspaceRoot = defaultWorkspaceRoot } = {}) {
  const files = await findWorkspaceFiles(workspaceRoot);
  const findings = [];

  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    visitNode(parsed, (node) => {
      if (!ts.isJsxOpeningElement(node) || node.tagName.getText(parsed) !== "button") return;

      const attributes = new Map(
        node.attributes.properties
          .filter(ts.isJsxAttribute)
          .map((attribute) => [attribute.name.text, attribute])
      );
      const disabled = attributes.get("disabled");
      const onClick = attributes.get("onClick");
      const type = attributeText(attributes.get("type"), parsed);
      const location = parsed.getLineAndCharacterOfPosition(node.getStart(parsed));
      const label = buttonLabel(node.parent, parsed);

      if (disabled && !disabled.initializer) {
        findings.push({
          category: "permanently-disabled",
          file: path.relative(path.resolve(scriptDir, ".."), file),
          label,
          line: location.line + 1
        });
      }

      if (!onClick && type !== "submit") {
        findings.push({
          category: "missing-handler",
          file: path.relative(path.resolve(scriptDir, ".."), file),
          label,
          line: location.line + 1
        });
      }
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    root: workspaceRoot,
    summary: {
      workspaces: files.length,
      permanentDisabled: findings.filter((finding) => finding.category === "permanently-disabled").length,
      missingHandler: findings.filter((finding) => finding.category === "missing-handler").length
    },
    findings
  };
}

function visitNode(node, visitor) {
  visitor(node);
  node.forEachChild((child) => visitNode(child, visitor));
}

function attributeText(attribute, source) {
  if (!attribute?.initializer || !ts.isStringLiteral(attribute.initializer)) return undefined;
  return attribute.initializer.text;
}

function buttonLabel(element, source) {
  if (!ts.isJsxElement(element)) return "unlabeled";
  const text = element.children
    .filter(ts.isJsxText)
    .map((child) => child.getText(source).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
  return text || "localized-or-icon-only";
}

async function findWorkspaceFiles(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findWorkspaceFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith("-workspace.tsx")) {
      files.push(entryPath);
    }
  }
  return files;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = await auditWorkspaceInteractions();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.summary.permanentDisabled > 0 || report.summary.missingHandler > 0) process.exitCode = 1;
}
