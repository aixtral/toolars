export type BodyFatSex = "male" | "female";

export interface BodyFatInput {
  sex: BodyFatSex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm: number;
  weightKg: number;
}

export interface BodyFatResult {
  bodyFatPercentage: number;
  fatMassKg: number;
  leanMassKg: number;
  formattedBodyFat: string;
  formattedFatMass: string;
  formattedLeanMass: string;
  category: string;
  tip: string;
  formulaLabel: string;
  summary: string;
}

export const defaultBodyFatScenario: BodyFatInput = {
  sex: "male",
  heightCm: 175,
  neckCm: 38,
  waistCm: 85,
  hipCm: 95,
  weightKg: 70
};

export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  const sex = input.sex === "female" ? "female" : "male";
  const heightCm = cleanNumber(input.heightCm);
  const neckCm = cleanNumber(input.neckCm);
  const waistCm = cleanNumber(input.waistCm);
  const hipCm = cleanNumber(input.hipCm);
  const weightKg = cleanNumber(input.weightKg);
  const bodyFatPercentage = clampBodyFat(calculateNavyBodyFat(sex, heightCm, neckCm, waistCm, hipCm));
  const fatMassKg = weightKg * (bodyFatPercentage / 100);
  const leanMassKg = Math.max(weightKg - fatMassKg, 0);
  const category = getBodyFatCategory(sex, bodyFatPercentage);

  return {
    bodyFatPercentage,
    fatMassKg,
    leanMassKg,
    formattedBodyFat: `${bodyFatPercentage.toFixed(1)}%`,
    formattedFatMass: `${formatOneDecimal(fatMassKg)} kg`,
    formattedLeanMass: `${formatOneDecimal(leanMassKg)} kg`,
    category,
    tip: getBodyFatTip(category),
    formulaLabel: "US Navy method",
    summary: `${capitalize(sex)}, ${Math.round(heightCm)} cm, waist ${Math.round(waistCm)} cm, neck ${Math.round(neckCm)} cm`
  };
}

function calculateNavyBodyFat(sex: BodyFatSex, heightCm: number, neckCm: number, waistCm: number, hipCm: number): number {
  if (heightCm <= 0 || neckCm <= 0 || waistCm <= 0) return 0;

  if (sex === "female") {
    const measurement = waistCm + hipCm - neckCm;
    if (measurement <= 0) return 0;
    return 495 / (1.29579 - 0.35004 * Math.log10(measurement) + 0.221 * Math.log10(heightCm)) - 450;
  }

  const measurement = waistCm - neckCm;
  if (measurement <= 0) return 0;
  return 495 / (1.0324 - 0.19077 * Math.log10(measurement) + 0.15456 * Math.log10(heightCm)) - 450;
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function clampBodyFat(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(2, Math.min(60, value));
}

function getBodyFatCategory(sex: BodyFatSex, value: number): string {
  if (sex === "female") {
    if (value < 14) return "Essential Fat";
    if (value < 21) return "Athletic";
    if (value < 25) return "Fitness";
    if (value < 32) return "Average";
    return "Above Average";
  }

  if (value < 6) return "Essential Fat";
  if (value < 14) return "Athletic";
  if (value < 18) return "Fitness";
  if (value < 25) return "Average";
  return "Above Average";
}

function getBodyFatTip(category: string): string {
  if (category === "Essential Fat") return "Below typical reference range; consider qualified guidance.";
  if (category === "Athletic") return "Athletic reference range; measurement consistency matters.";
  if (category === "Fitness") return "Fitness reference range; combine with trend and performance data.";
  if (category === "Average") return "Average reference range; use strength, nutrition, and trend data for planning.";
  return "Above typical reference range; consider a balanced nutrition and activity plan.";
}

function formatOneDecimal(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  });
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
