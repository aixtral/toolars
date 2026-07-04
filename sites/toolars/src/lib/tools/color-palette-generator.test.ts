import { describe, expect, it } from "vitest";
import { exportAsCssVariables, generatePalette } from "./color-palette-generator";

describe("generatePalette", () => {
  it("generates source-compatible triadic palettes with tints and shades", () => {
    const palette = generatePalette("#FF0000", "triadic", 2, 2);

    expect(palette.colors.map((color) => color.hex)).toEqual(["#FF0000", "#00FF00", "#0000FF"]);
    expect(palette.colors[0].tints).toHaveLength(2);
    expect(palette.colors[0].shades).toHaveLength(2);
  });

  it("exports generated palettes as copy-ready CSS variables", () => {
    const palette = generatePalette("#3366FF", "complementary", 1, 1);
    const css = exportAsCssVariables(palette);

    expect(css).toContain("--color-1: #3366FF;");
    expect(css).toContain("--color-2:");
    expect(css).toContain("--color-1-tint-1:");
    expect(css).toContain("--color-1-shade-1:");
  });
});
