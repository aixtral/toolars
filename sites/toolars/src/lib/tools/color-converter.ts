export type ColorInputFormat = "hex" | "rgb" | "hsl" | "hsv" | "cmyk" | "name";
export type ColorConverterErrorType = "empty-input" | "invalid-color" | "out-of-range";

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface ColorConverterError {
  type: ColorConverterErrorType;
  message: string;
}

export interface ColorConversionResult {
  success: boolean;
  inputFormat?: ColorInputFormat;
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  hsv: HsvColor;
  cmyk: CmykColor;
  css: {
    hex: string;
    rgb: string;
    hsl: string;
    hsv: string;
    cmyk: string;
  };
  summary: string;
  privacyNote: string;
  error?: ColorConverterError;
}

const emptyRgb = { r: 0, g: 0, b: 0 };
const emptyHsl = { h: 0, s: 0, l: 0 };
const emptyHsv = { h: 0, s: 0, v: 0 };
const emptyCmyk = { c: 0, m: 0, y: 0, k: 0 };
const privacyNote = "Local color conversion only; color values stay in the browser.";

const namedColors: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  green: "#008000",
  blue: "#0000FF",
  transparent: "#000000",
  rebeccapurple: "#663399",
  orange: "#FFA500",
  yellow: "#FFFF00",
  purple: "#800080",
  pink: "#FFC0CB",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  gray: "#808080",
  grey: "#808080",
  slategray: "#708090"
};

export function convertColor(input: string): ColorConversionResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return colorError("empty-input", "Enter a HEX, RGB, HSL, HSV, CMYK, or named color.");
  }

  const parsed = parseColor(trimmed);
  if (!parsed.success) {
    return colorError(parsed.error.type, parsed.error.message);
  }

  const rgb = parsed.rgb;
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  return {
    success: true,
    inputFormat: parsed.format,
    hex,
    rgb,
    hsl,
    hsv,
    cmyk,
    css: {
      hex,
      rgb: formatRgb(rgb),
      hsl: formatHsl(hsl),
      hsv: formatHsv(hsv),
      cmyk: formatCmyk(cmyk)
    },
    summary: `Converted ${parsed.format.toUpperCase()} color to 5 output formats.`,
    privacyNote
  };
}

function colorError(type: ColorConverterErrorType, message: string): ColorConversionResult {
  return {
    success: false,
    hex: "",
    rgb: emptyRgb,
    hsl: emptyHsl,
    hsv: emptyHsv,
    cmyk: emptyCmyk,
    css: {
      hex: "",
      rgb: "",
      hsl: "",
      hsv: "",
      cmyk: ""
    },
    summary: "Color conversion failed.",
    privacyNote,
    error: { type, message }
  };
}

function parseColor(input: string): { success: true; format: ColorInputFormat; rgb: RgbColor } | { success: false; error: ColorConverterError } {
  const lower = input.toLowerCase();

  if (namedColors[lower]) {
    return { success: true, format: "name", rgb: hexToRgb(namedColors[lower]) };
  }

  if (input.startsWith("#")) {
    try {
      return { success: true, format: "hex", rgb: hexToRgb(input) };
    } catch {
      return { success: false, error: { type: "invalid-color", message: "Invalid HEX color." } };
    }
  }

  const rgbMatch = input.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i);
  if (rgbMatch) {
    const rgb = { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) };
    if (!isRgbInRange(rgb)) {
      return { success: false, error: { type: "out-of-range", message: "RGB values must be between 0 and 255." } };
    }
    return { success: true, format: "rgb", rgb };
  }

  const hslMatch = input.match(/^hsla?\(\s*(-?\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i);
  if (hslMatch) {
    const hsl = { h: normalizeHue(Number(hslMatch[1])), s: Number(hslMatch[2]), l: Number(hslMatch[3]) };
    if (!isPercent(hsl.s) || !isPercent(hsl.l)) {
      return { success: false, error: { type: "out-of-range", message: "HSL saturation and lightness must be between 0 and 100." } };
    }
    return { success: true, format: "hsl", rgb: hslToRgb(hsl.h, hsl.s, hsl.l) };
  }

  const hsvMatch = input.match(/^hsv\(\s*(-?\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/i);
  if (hsvMatch) {
    const hsv = { h: normalizeHue(Number(hsvMatch[1])), s: Number(hsvMatch[2]), v: Number(hsvMatch[3]) };
    if (!isPercent(hsv.s) || !isPercent(hsv.v)) {
      return { success: false, error: { type: "out-of-range", message: "HSV saturation and value must be between 0 and 100." } };
    }
    return { success: true, format: "hsv", rgb: hsvToRgb(hsv.h, hsv.s, hsv.v) };
  }

  const cmykMatch = input.match(/^cmyk\(\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/i);
  if (cmykMatch) {
    const cmyk = { c: Number(cmykMatch[1]), m: Number(cmykMatch[2]), y: Number(cmykMatch[3]), k: Number(cmykMatch[4]) };
    if (!isPercent(cmyk.c) || !isPercent(cmyk.m) || !isPercent(cmyk.y) || !isPercent(cmyk.k)) {
      return { success: false, error: { type: "out-of-range", message: "CMYK channels must be between 0 and 100." } };
    }
    return { success: true, format: "cmyk", rgb: cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k) };
  }

  return {
    success: false,
    error: {
      type: "invalid-color",
      message: "Unrecognized color format. Use HEX, RGB, HSL, HSV, CMYK, or a CSS named color."
    }
  };
}

export function hexToRgb(hex: string): RgbColor {
  let clean = hex.trim().replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((char) => char + char).join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    throw new Error("Invalid HEX color");
  }
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => clamp(value, 0, 255).toString(16).padStart(2, "0").toUpperCase()).join("")}`;
}

export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === rn) h = (gn - bn) / delta + (gn < bn ? 6 : 0);
    if (max === gn) h = (bn - rn) / delta + 2;
    if (max === bn) h = (rn - gn) / delta + 4;
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h: number, s: number, l: number): RgbColor {
  const hue = normalizeHue(h) / 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;

  if (saturation === 0) {
    const channel = Math.round(lightness * 255);
    return { r: channel, g: channel, b: channel };
  }

  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const hueToRgb = (offset: number) => {
    let t = hue + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  return {
    r: Math.round(hueToRgb(1 / 3) * 255),
    g: Math.round(hueToRgb(0) * 255),
    b: Math.round(hueToRgb(-1 / 3) * 255)
  };
}

export function rgbToHsv(r: number, g: number, b: number): HsvColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === rn) h = 60 * (((gn - bn) / delta) % 6);
    if (max === gn) h = 60 * ((bn - rn) / delta + 2);
    if (max === bn) h = 60 * ((rn - gn) / delta + 4);
  }

  return {
    h: normalizeHue(Math.round(h)),
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    v: Math.round(max * 100)
  };
}

export function hsvToRgb(h: number, s: number, v: number): RgbColor {
  const hue = normalizeHue(h);
  const saturation = clamp(s, 0, 100) / 100;
  const value = clamp(v, 0, 100) / 100;
  const c = value * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = value - c;
  const [rn, gn, bn] =
    hue < 60 ? [c, x, 0] :
    hue < 120 ? [x, c, 0] :
    hue < 180 ? [0, c, x] :
    hue < 240 ? [0, x, c] :
    hue < 300 ? [x, 0, c] :
    [c, 0, x];

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255)
  };
}

export function rgbToCmyk(r: number, g: number, b: number): CmykColor {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);

  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  };
}

export function cmykToRgb(c: number, m: number, y: number, k: number): RgbColor {
  const cn = clamp(c, 0, 100) / 100;
  const mn = clamp(m, 0, 100) / 100;
  const yn = clamp(y, 0, 100) / 100;
  const kn = clamp(k, 0, 100) / 100;

  return {
    r: Math.round(255 * (1 - cn) * (1 - kn)),
    g: Math.round(255 * (1 - mn) * (1 - kn)),
    b: Math.round(255 * (1 - yn) * (1 - kn))
  };
}

export function formatRgb(rgb: RgbColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHsl(hsl: HslColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function formatHsv(hsv: HsvColor): string {
  return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
}

export function formatCmyk(cmyk: CmykColor): string {
  return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}

function isRgbInRange(rgb: RgbColor): boolean {
  return [rgb.r, rgb.g, rgb.b].every((value) => Number.isInteger(value) && value >= 0 && value <= 255);
}

function isPercent(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

function normalizeHue(value: number): number {
  return ((value % 360) + 360) % 360;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}
