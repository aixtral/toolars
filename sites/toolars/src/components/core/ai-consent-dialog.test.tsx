import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../scripts/audit-i18n.mjs";

const aiConsentDialogSourceFile = "src/components/core/ai-consent-dialog.tsx";

function scanAiConsentDialogSource() {
  return scanSourceText(readFileSync(aiConsentDialogSourceFile, "utf8"), aiConsentDialogSourceFile);
}

describe("AiConsentDialog", () => {
  it("keeps the AI consent dialog source free of hardcoded UI scanner candidates", () => {
    const scan = scanAiConsentDialogSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });
});
