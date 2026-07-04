import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../scripts/audit-i18n.mjs";

const aiLabWorkbenchShellSourceFile = "src/components/lab/ai-lab-workbench-shell.tsx";

function scanAiLabWorkbenchShellSource() {
  return scanSourceText(readFileSync(aiLabWorkbenchShellSourceFile, "utf8"), aiLabWorkbenchShellSourceFile);
}

describe("AiLabWorkbenchShell", () => {
  it("keeps the AI lab workbench shell source free of hardcoded UI scanner candidates", () => {
    const scan = scanAiLabWorkbenchShellSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });
});
