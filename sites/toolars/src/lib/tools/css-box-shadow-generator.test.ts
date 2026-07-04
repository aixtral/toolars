import { describe, expect, it } from "vitest";
import { BOX_SHADOW_PRESETS, generateBoxShadowCss, hexToRgba } from "./css-box-shadow-generator";

describe("CSS box shadow generation", () => {
  it("converts hex and opacity into rgba shadow colors", () => {
    expect(hexToRgba("#000000", 15)).toBe("rgba(0, 0, 0, 0.15)");
    expect(hexToRgba("#ffffff", 80)).toBe("rgba(255, 255, 255, 0.80)");
  });

  it("generates multi-layer box-shadow CSS from source presets", () => {
    const result = generateBoxShadowCss(BOX_SHADOW_PRESETS.elevated.layers);

    expect(result.css).toBe(
      "box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.10),\n  0px 2px 4px -2px rgba(0, 0, 0, 0.10);"
    );
    expect(result.layerCount).toBe(2);
  });
});
