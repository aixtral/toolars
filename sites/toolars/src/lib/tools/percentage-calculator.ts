export type PercentageMode = "percentOf" | "ratio" | "change";
export type PercentageDirection = "percent-of" | "ratio" | "increase" | "decrease" | "flat";

export interface PercentageInput {
  mode: PercentageMode;
  percent: number;
  baseValue: number;
  partValue: number;
  wholeValue: number;
  fromValue: number;
  toValue: number;
}

export interface PercentageResult {
  mode: PercentageMode;
  modeLabel: string;
  result: number;
  formattedResult: string;
  summary: string;
  formulaNote: string;
  direction: PercentageDirection;
  directionLabel: string;
  denominatorNote: string;
}

export const defaultPercentageScenarios: Record<PercentageMode, PercentageInput> = {
  percentOf: {
    mode: "percentOf",
    percent: 20,
    baseValue: 150,
    partValue: 45,
    wholeValue: 90,
    fromValue: 100,
    toValue: 130
  },
  ratio: {
    mode: "ratio",
    percent: 20,
    baseValue: 150,
    partValue: 45,
    wholeValue: 90,
    fromValue: 100,
    toValue: 130
  },
  change: {
    mode: "change",
    percent: 20,
    baseValue: 150,
    partValue: 45,
    wholeValue: 90,
    fromValue: 100,
    toValue: 130
  }
};

export const percentageModeLabels: Record<PercentageMode, string> = {
  percentOf: "Percent of",
  ratio: "Ratio percentage",
  change: "Percentage change"
};

export function calculatePercentage(input: PercentageInput): PercentageResult {
  if (input.mode === "ratio") return calculateRatio(input);
  if (input.mode === "change") return calculateChange(input);
  return calculatePercentOf(input);
}

function calculatePercentOf(input: PercentageInput): PercentageResult {
  const percent = cleanNumber(input.percent);
  const baseValue = cleanNumber(input.baseValue);
  const result = percent / 100 * baseValue;

  return {
    mode: "percentOf",
    modeLabel: percentageModeLabels.percentOf,
    result,
    formattedResult: formatFlexibleNumber(result),
    summary: `${formatFlexibleNumber(percent)}% of ${formatFlexibleNumber(baseValue)}`,
    formulaNote: `${formatFlexibleNumber(percent)} / 100 x ${formatFlexibleNumber(baseValue)}`,
    direction: "percent-of",
    directionLabel: "Percent of",
    denominatorNote: "Percent-of calculations use 100 as the denominator."
  };
}

function calculateRatio(input: PercentageInput): PercentageResult {
  const partValue = cleanNumber(input.partValue);
  const wholeValue = cleanNumber(input.wholeValue);
  const result = wholeValue > 0 ? partValue / wholeValue * 100 : 0;

  return {
    mode: "ratio",
    modeLabel: percentageModeLabels.ratio,
    result,
    formattedResult: `${result.toFixed(2)}%`,
    summary: `${formatFlexibleNumber(partValue)} is ${result.toFixed(2)}% of ${formatFlexibleNumber(wholeValue)}`,
    formulaNote: `${formatFlexibleNumber(partValue)} / ${formatFlexibleNumber(wholeValue)} x 100`,
    direction: "ratio",
    directionLabel: "Ratio",
    denominatorNote: wholeValue > 0 ? "The second value is the denominator." : "Denominator cannot be zero."
  };
}

function calculateChange(input: PercentageInput): PercentageResult {
  const fromValue = cleanNumber(input.fromValue);
  const toValue = cleanNumber(input.toValue);
  const result = fromValue > 0 ? (toValue - fromValue) / fromValue * 100 : 0;
  const direction: PercentageDirection = result > 0 ? "increase" : result < 0 ? "decrease" : "flat";
  const label = direction === "increase" ? "Increase" : direction === "decrease" ? "Decrease" : "No change";
  const formattedResult = `${result >= 0 ? "+" : ""}${result.toFixed(2)}%`;

  return {
    mode: "change",
    modeLabel: percentageModeLabels.change,
    result,
    formattedResult,
    summary: `${label} from ${formatFlexibleNumber(fromValue)} to ${formatFlexibleNumber(toValue)}`,
    formulaNote: `(${formatFlexibleNumber(toValue)} - ${formatFlexibleNumber(fromValue)}) / ${formatFlexibleNumber(fromValue)} x 100`,
    direction,
    directionLabel: label,
    denominatorNote: fromValue > 0 ? "The starting value is the denominator." : "Starting value cannot be zero."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return value;
}

function formatFlexibleNumber(value: number): string {
  if (Number.isInteger(value)) return value.toLocaleString("en-US");
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
