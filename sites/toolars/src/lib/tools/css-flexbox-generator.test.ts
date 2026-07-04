import { describe, expect, it } from "vitest";
import { generateFlexboxCss } from "./css-flexbox-generator";

describe("CSS flexbox generator", () => {
  it("generates container and item CSS from layout controls", () => {
    const result = generateFlexboxCss({
      direction: "row",
      wrap: "wrap",
      justify: "center",
      align: "stretch",
      gap: 16,
      itemGrow: 1,
      itemBasis: "160px"
    });

    expect(result.containerCss).toContain("display: flex;");
    expect(result.containerCss).toContain("flex-wrap: wrap;");
    expect(result.containerCss).toContain("justify-content: center;");
    expect(result.containerCss).toContain("gap: 16px;");
    expect(result.itemCss).toContain("flex: 1 1 160px;");
    expect(result.warningCount).toBe(0);
  });
});
