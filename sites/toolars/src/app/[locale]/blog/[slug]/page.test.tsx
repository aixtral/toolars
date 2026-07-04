import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";

const blogArticleSourceFile = "src/app/[locale]/blog/[slug]/page.tsx";

function scanBlogArticleSource() {
  return scanSourceText(readFileSync(blogArticleSourceFile, "utf8"), blogArticleSourceFile);
}

describe("BlogArticlePage i18n audit", () => {
  it("does not contribute blog article hardcoded UI candidates to the i18n audit", () => {
    const sourceScan = scanBlogArticleSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });
});
