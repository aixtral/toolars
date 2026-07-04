import { describe, expect, it } from "vitest";
import { RADIUS_PRESETS, generateBorderRadiusCSS } from "./css-border-radius-generator";

describe("generateBorderRadiusCSS", () => {
  it("simplifies equal corner values into one border-radius value", () => {
    const result = generateBorderRadiusCSS({
      topLeft: 16,
      topRight: 16,
      bottomRight: 16,
      bottomLeft: 16,
      unit: "px"
    });

    expect(result.css).toBe("border-radius: 16px;");
    expect(result.simplified).toBe(true);
  });

  it("keeps asymmetric source presets as four-corner CSS", () => {
    const result = generateBorderRadiusCSS(RADIUS_PRESETS.leaf);

    expect(result.css).toBe("border-radius: 0% 100% 0% 100%;");
    expect(result.simplified).toBe(false);
  });
});
