import { describe, expect, it } from "vitest";
import { generateGridCss } from "./css-grid-generator";

describe("CSS grid generator", () => {
  it("generates repeat templates, gap values, and preview cells", () => {
    const result = generateGridCss({
      columns: 3,
      rows: 2,
      columnGap: 24,
      rowGap: 16,
      minColumnWidth: 180
    });

    expect(result.css).toContain("grid-template-columns: repeat(3, minmax(180px, 1fr));");
    expect(result.css).toContain("grid-template-rows: repeat(2, minmax(80px, auto));");
    expect(result.css).toContain("column-gap: 24px;");
    expect(result.previewCells).toHaveLength(6);
  });
});
