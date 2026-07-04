import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, type HslColor, type RgbColor } from "./color-converter";

export type HarmonyType = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "monochromatic";

export interface PaletteColor {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  tints: string[];
  shades: string[];
}

export interface Palette {
  harmonyType: HarmonyType;
  colors: PaletteColor[];
}

export function hexToHsl(hex: string): HslColor {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function generateHarmony(base: HslColor, type: HarmonyType): HslColor[] {
  switch (type) {
    case "monochromatic":
      return [{ ...base }];
    case "complementary":
      return [{ ...base }, { ...base, h: wrapHue(base.h + 180) }];
    case "analogous":
      return [{ ...base }, { ...base, h: wrapHue(base.h + 30) }, { ...base, h: wrapHue(base.h - 30) }];
    case "triadic":
      return [{ ...base }, { ...base, h: wrapHue(base.h + 120) }, { ...base, h: wrapHue(base.h + 240) }];
    case "split-complementary":
      return [{ ...base }, { ...base, h: wrapHue(base.h + 150) }, { ...base, h: wrapHue(base.h + 210) }];
    case "tetradic":
      return [{ ...base }, { ...base, h: wrapHue(base.h + 90) }, { ...base, h: wrapHue(base.h + 180) }, { ...base, h: wrapHue(base.h + 270) }];
  }
}

export function generateTints(base: HslColor, count: number): string[] {
  const safeCount = Math.max(0, Math.round(count));
  if (safeCount === 0) return [];
  const step = (100 - base.l) / safeCount;

  return Array.from({ length: safeCount }, (_, index) => hslToHex(base.h, base.s, Math.min(100, base.l + step * (index + 1))));
}

export function generateShades(base: HslColor, count: number): string[] {
  const safeCount = Math.max(0, Math.round(count));
  if (safeCount === 0) return [];
  const step = base.l / safeCount;

  return Array.from({ length: safeCount }, (_, index) => hslToHex(base.h, base.s, Math.max(0, base.l - step * (index + 1))));
}

export function generatePalette(hex: string, harmonyType: HarmonyType, tintCount = 5, shadeCount = 5): Palette {
  const baseHsl = hexToHsl(hex);
  const colors = generateHarmony(baseHsl, harmonyType).map((hsl) => {
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

    return {
      hex: hslToHex(hsl.h, hsl.s, hsl.l),
      rgb,
      hsl,
      tints: generateTints(hsl, tintCount),
      shades: generateShades(hsl, shadeCount)
    };
  });

  return { harmonyType, colors };
}

export function exportAsCssVariables(palette: Palette): string {
  const lines = [":root {"];

  palette.colors.forEach((color, index) => {
    const colorIndex = index + 1;
    lines.push(`  --color-${colorIndex}: ${color.hex};`);
    color.tints.forEach((tint, tintIndex) => lines.push(`  --color-${colorIndex}-tint-${tintIndex + 1}: ${tint};`));
    color.shades.forEach((shade, shadeIndex) => lines.push(`  --color-${colorIndex}-shade-${shadeIndex + 1}: ${shade};`));
  });
  lines.push("}");

  return lines.join("\n");
}

export function exportAsJsonArray(palette: Palette): string {
  return JSON.stringify(palette.colors, null, 2);
}

function wrapHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}
