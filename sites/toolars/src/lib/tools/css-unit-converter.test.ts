import { describe, expect, it } from "vitest";
import { convertCssUnit } from "./css-unit-converter";

describe("CSS unit converter", () => {
  it("converts px to rem using root font-size context", () => {
    const result = convertCssUnit({
      value: 32,
      fromUnit: "px",
      toUnit: "rem",
      context: { rootFontSize: 16, currentFontSize: 16, parentSize: 640, viewportWidth: 1440, viewportHeight: 900 }
    });

    expect(result.value).toBe(2);
    expect(result.cssValue).toBe("2rem");
    expect(result.formula).toContain("32px / 16");
  });

  it("converts percentages through parent-size context", () => {
    const result = convertCssUnit({
      value: 50,
      fromUnit: "%",
      toUnit: "px",
      context: { rootFontSize: 16, currentFontSize: 16, parentSize: 640, viewportWidth: 1440, viewportHeight: 900 }
    });

    expect(result.value).toBe(320);
    expect(result.cssValue).toBe("320px");
  });
});
