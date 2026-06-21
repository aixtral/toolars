export interface LeanBodyMassInput {
  weightKg: number;
  bodyFatPercent: number;
}

export interface LeanBodyMassResult {
  leanBodyMassKg: number;
  fatMassKg: number;
  leanMassRatio: number;
  formattedLeanBodyMass: string;
  formattedFatMass: string;
  formattedLeanMassRatio: string;
  summary: string;
  recommendation: string;
}

export const defaultLeanBodyMassScenario: LeanBodyMassInput = {
  weightKg: 70,
  bodyFatPercent: 20
};

export function calculateLeanBodyMass(input: LeanBodyMassInput): LeanBodyMassResult {
  const weightKg = cleanNumber(input.weightKg);
  const bodyFatPercent = clampPercent(input.bodyFatPercent);
  const fatMassKg = weightKg * (bodyFatPercent / 100);
  const leanBodyMassKg = Math.max(weightKg - fatMassKg, 0);
  const leanMassRatio = Math.max(100 - bodyFatPercent, 0);

  return {
    leanBodyMassKg,
    fatMassKg,
    leanMassRatio,
    formattedLeanBodyMass: `${formatOneDecimal(leanBodyMassKg)} kg`,
    formattedFatMass: `${formatOneDecimal(fatMassKg)} kg`,
    formattedLeanMassRatio: `${formatOneDecimal(leanMassRatio)}%`,
    summary: `${formatNumber(Math.round(weightKg))} kg at ${formatOneDecimal(bodyFatPercent)}% body fat`,
    recommendation: "Track lean mass with the same body-fat method over time instead of mixing measurement systems."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function formatOneDecimal(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  });
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
