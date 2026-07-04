import { convertColor, type RgbColor } from "./color-converter";

export interface WcagResult {
  aa: { normal: boolean; large: boolean };
  aaa: { normal: boolean; large: boolean };
}

export interface ContrastCheckResult {
  success: boolean;
  foreground: string;
  background: string;
  ratio: number;
  formattedRatio: string;
  wcag: WcagResult;
  summary: string;
  privacyNote: string;
  error?: {
    type: "invalid-color";
    message: string;
  };
}

const privacyNote = "Local WCAG contrast checks only; color values stay in the browser.";

export function checkColorContrast({ foreground, background }: { foreground: string; background: string }): ContrastCheckResult {
  const foregroundColor = convertColor(foreground);
  const backgroundColor = convertColor(background);

  if (!foregroundColor.success || !backgroundColor.success) {
    return {
      success: false,
      foreground,
      background,
      ratio: 0,
      formattedRatio: "0.00:1",
      wcag: getWcagLevel(0),
      summary: "Contrast check failed.",
      privacyNote,
      error: {
        type: "invalid-color",
        message: "Enter valid foreground and background colors."
      }
    };
  }

  const ratio = roundRatio(contrastRatioFromRgb(foregroundColor.rgb, backgroundColor.rgb));
  const wcag = getWcagLevel(ratio);
  const formattedRatio = `${ratio.toFixed(2)}:1`;
  const level = wcag.aaa.normal ? "WCAG AAA for normal text" : wcag.aa.normal ? "WCAG AA for normal text" : wcag.aa.large ? "WCAG AA for large text only" : "WCAG AA";
  const verb = wcag.aa.large ? "passes" : "fails";

  return {
    success: true,
    foreground: foregroundColor.hex,
    background: backgroundColor.hex,
    ratio,
    formattedRatio,
    wcag,
    summary: `${formattedRatio} contrast ratio ${verb} ${level}.`,
    privacyNote
  };
}

export function hexToRgb(hex: string): [number, number, number] {
  const result = convertColor(hex);
  if (!result.success) return [0, 0, 0];
  return [result.rgb.r, result.rgb.g, result.rgb.b];
}

export function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return roundRatio(contrastRatioFromRgb({ r: r1, g: g1, b: b1 }, { r: r2, g: g2, b: b2 }));
}

export function contrastRatioFromRgb(foreground: RgbColor, background: RgbColor): number {
  const foregroundLuminance = relativeLuminance(foreground.r, foreground.g, foreground.b);
  const backgroundLuminance = relativeLuminance(background.r, background.g, background.b);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getWcagLevel(ratio: number): WcagResult {
  return {
    aa: { normal: ratio >= 4.5, large: ratio >= 3 },
    aaa: { normal: ratio >= 7, large: ratio >= 4.5 }
  };
}

function roundRatio(value: number): number {
  return Math.round(value * 100) / 100;
}
