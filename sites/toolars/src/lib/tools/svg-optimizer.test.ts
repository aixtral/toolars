import { describe, expect, it } from "vitest";
import { optimizeSvg } from "./svg-optimizer";

describe("SVG optimizer", () => {
  it("removes comments and metadata while preserving renderable markup", () => {
    const result = optimizeSvg(
      `<svg width="24" height="24" viewBox="0 0 24 24">
        <!-- exported from design tool -->
        <metadata>draft</metadata>
        <rect width="24" height="24" fill="#111827" />
      </svg>`,
      { removeComments: true, removeMetadata: true, collapseWhitespace: true }
    );

    expect(result.optimized).not.toContain("metadata");
    expect(result.optimized).not.toContain("exported from design tool");
    expect(result.optimized).toContain("<rect");
    expect(result.savingsBytes).toBeGreaterThan(0);
  });
});
