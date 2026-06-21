export interface ProteinInput {
  weightKg: number;
  factor: number;
}

export interface ProteinResult {
  proteinGrams: number;
  perMealGrams: number;
  eggsEquivalent: number;
  chickenBreastGrams: number;
  formattedProtein: string;
  formattedPerMeal: string;
  formattedEggs: string;
  formattedChicken: string;
  factorLabel: string;
  summary: string;
  recommendation: string;
}

export const proteinFactors = [
  { value: 0.8, label: "Sedentary" },
  { value: 1.2, label: "Lightly Active" },
  { value: 1.6, label: "Moderate Exercise" },
  { value: 2, label: "Strength Training" },
  { value: 2.2, label: "Muscle Building" }
] as const;

export const defaultProteinScenario: ProteinInput = {
  weightKg: 70,
  factor: 1.6
};

export function calculateProteinNeeds(input: ProteinInput): ProteinResult {
  const weightKg = cleanNumber(input.weightKg);
  const factor = cleanNumber(input.factor);
  const proteinGrams = Math.round(weightKg * factor);
  const perMealGrams = Math.round(proteinGrams / 3);
  const eggsEquivalent = Math.ceil(proteinGrams / 6);
  const chickenBreastGrams = Math.ceil(proteinGrams / 0.31);

  return {
    proteinGrams,
    perMealGrams,
    eggsEquivalent,
    chickenBreastGrams,
    formattedProtein: `${formatNumber(proteinGrams)} g`,
    formattedPerMeal: `${formatNumber(perMealGrams)} g`,
    formattedEggs: `${formatNumber(eggsEquivalent)} eggs`,
    formattedChicken: `${formatNumber(chickenBreastGrams)} g`,
    factorLabel: getFactorLabel(factor),
    summary: `${formatNumber(Math.round(weightKg))} kg × ${formatMultiplier(factor)} g/kg`,
    recommendation: "Spread protein across meals and adjust for training, appetite, and clinical context."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function getFactorLabel(value: number): string {
  return proteinFactors.find((factor) => Math.abs(factor.value - value) < 0.001)?.label ?? `${formatMultiplier(value)} g/kg`;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function formatMultiplier(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : String(value);
}
