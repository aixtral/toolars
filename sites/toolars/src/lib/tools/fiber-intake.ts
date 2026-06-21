export type FiberSex = "male" | "female";

export interface FiberIntakeInput {
  weightKg: number;
  age: number;
  sex: FiberSex;
  currentFiberGrams: number;
}

export interface FiberFoodReference {
  label: string;
  fiberPer100g: number;
}

export interface FiberIntakeResult {
  recommendedFiberGrams: number;
  recommendedMin: number;
  recommendedMax: number;
  currentFiberGrams: number;
  progressPercent: number;
  gapGrams: number;
  recommendedRange: string;
  formattedRecommendedFiber: string;
  formattedGap: string;
  summary: string;
}

export const fiberFoodReferences: FiberFoodReference[] = [
  { label: "Oats", fiberPer100g: 10.6 },
  { label: "Black beans", fiberPer100g: 15.5 },
  { label: "Broccoli", fiberPer100g: 2.6 },
  { label: "Chia seeds", fiberPer100g: 34.4 },
  { label: "Apple (with skin)", fiberPer100g: 2.4 },
  { label: "Brown rice", fiberPer100g: 1.8 }
];

export const defaultFiberIntakeScenario: FiberIntakeInput = {
  weightKg: 70,
  age: 30,
  sex: "male",
  currentFiberGrams: 15
};

export function calculateFiberIntake(input: FiberIntakeInput): FiberIntakeResult {
  const weightKg = cleanNumber(input.weightKg);
  const age = cleanNumber(input.age) || 30;
  const currentFiberGrams = cleanNumber(input.currentFiberGrams);
  let fiber = weightKg * 0.35;
  if (input.sex === "female") fiber *= 0.9;
  if (age > 50) fiber *= 0.95;

  const recommendedFiberGrams = Math.round(fiber);
  const rangeFloor = recommendedFiberGrams >= 25 ? Math.max(25, Math.round(recommendedFiberGrams * 0.9)) : recommendedFiberGrams;
  const rangeCeiling = Math.round(recommendedFiberGrams * 1.1);
  const recommendedMin = Math.min(rangeFloor, rangeCeiling);
  const recommendedMax = Math.max(rangeFloor, rangeCeiling);
  const progressPercent = recommendedFiberGrams > 0 ? Math.min(100, Math.round((currentFiberGrams / recommendedFiberGrams) * 100)) : 0;
  const gapGrams = Math.max(0, recommendedFiberGrams - currentFiberGrams);

  return {
    recommendedFiberGrams,
    recommendedMin,
    recommendedMax,
    currentFiberGrams,
    progressPercent,
    gapGrams,
    recommendedRange: `${recommendedMin}-${recommendedMax} g/day`,
    formattedRecommendedFiber: `${recommendedFiberGrams} g`,
    formattedGap: `${gapGrams} g`,
    summary: `${formatNumber(currentFiberGrams)}g / ${recommendedFiberGrams}g (${progressPercent}%)`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
