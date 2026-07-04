import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../scripts/audit-i18n.mjs";

const siteFooterSourceFile = "src/components/shell/site-footer.tsx";

function scanSiteFooterSource() {
  return scanSourceText(readFileSync(siteFooterSourceFile, "utf8"), siteFooterSourceFile);
}

describe("SiteFooter", () => {
  it("does not leave hardcoded UI audit candidates in the footer source", () => {
    const scan = scanSiteFooterSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });
});
