export type CssUnit = "px" | "rem" | "em" | "%" | "vw" | "vh" | "cm" | "mm" | "in" | "pt" | "pc";

export interface CssUnitContext {
  rootFontSize: number;
  currentFontSize: number;
  parentSize: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface CssUnitConversionInput {
  value: number;
  fromUnit: CssUnit;
  toUnit: CssUnit;
  context: CssUnitContext;
  precision?: number;
}

export interface CssUnitConversionResult {
  value: number;
  cssValue: string;
  formula: string;
  pxValue: number;
}

export const DEFAULT_CSS_UNIT_CONTEXT: CssUnitContext = {
  rootFontSize: 16,
  currentFontSize: 16,
  parentSize: 640,
  viewportWidth: 1440,
  viewportHeight: 900
};

export function convertCssUnit(input: CssUnitConversionInput): CssUnitConversionResult {
  const context = normalizeContext(input.context);
  const precision = input.precision ?? 4;
  const pxValue = toPx(input.value, input.fromUnit, context);
  const rawValue = fromPx(pxValue, input.toUnit, context);
  const value = round(rawValue, precision);

  return {
    value,
    cssValue: `${formatNumber(value)}${input.toUnit}`,
    formula: buildFormula(input.value, input.fromUnit, input.toUnit, context),
    pxValue: round(pxValue, precision)
  };
}

function toPx(value: number, unit: CssUnit, context: CssUnitContext): number {
  switch (unit) {
    case "px": return value;
    case "rem": return value * context.rootFontSize;
    case "em": return value * context.currentFontSize;
    case "%": return (value / 100) * context.parentSize;
    case "vw": return (value / 100) * context.viewportWidth;
    case "vh": return (value / 100) * context.viewportHeight;
    case "in": return value * 96;
    case "cm": return value * (96 / 2.54);
    case "mm": return value * (96 / 25.4);
    case "pt": return value * (96 / 72);
    case "pc": return value * 16;
  }
}

function fromPx(value: number, unit: CssUnit, context: CssUnitContext): number {
  switch (unit) {
    case "px": return value;
    case "rem": return value / context.rootFontSize;
    case "em": return value / context.currentFontSize;
    case "%": return (value / context.parentSize) * 100;
    case "vw": return (value / context.viewportWidth) * 100;
    case "vh": return (value / context.viewportHeight) * 100;
    case "in": return value / 96;
    case "cm": return value / (96 / 2.54);
    case "mm": return value / (96 / 25.4);
    case "pt": return value / (96 / 72);
    case "pc": return value / 16;
  }
}

function buildFormula(value: number, fromUnit: CssUnit, toUnit: CssUnit, context: CssUnitContext): string {
  if (fromUnit === "px" && toUnit === "rem") return `${formatNumber(value)}px / ${formatNumber(context.rootFontSize)} root px`;
  if (fromUnit === "%" && toUnit === "px") return `${formatNumber(value)}% * ${formatNumber(context.parentSize)} parent px`;
  return `${formatNumber(value)}${fromUnit} -> px -> ${toUnit}`;
}

function normalizeContext(context: CssUnitContext): CssUnitContext {
  return {
    rootFontSize: positive(context.rootFontSize, DEFAULT_CSS_UNIT_CONTEXT.rootFontSize),
    currentFontSize: positive(context.currentFontSize, DEFAULT_CSS_UNIT_CONTEXT.currentFontSize),
    parentSize: positive(context.parentSize, DEFAULT_CSS_UNIT_CONTEXT.parentSize),
    viewportWidth: positive(context.viewportWidth, DEFAULT_CSS_UNIT_CONTEXT.viewportWidth),
    viewportHeight: positive(context.viewportHeight, DEFAULT_CSS_UNIT_CONTEXT.viewportHeight)
  };
}

function positive(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function round(value: number, precision: number): number {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

function formatNumber(value: number): string {
  return String(Number.isInteger(value) ? value : Number(value.toFixed(4)));
}
