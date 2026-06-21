export type BodyRecompositionSex = "male" | "female";
export type BodyRecompositionGoal = "recomp" | "slow-cut" | "maintain";

export interface BodyRecompositionInput {
  sex: BodyRecompositionSex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityMultiplier: number;
  goal: BodyRecompositionGoal;
}

export interface BodyRecompositionResult {
  bmrCalories: number;
  tdeeCalories: number;
  targetCalories: number;
  deficitCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
  formattedBmr: string;
  formattedTdee: string;
  formattedTargetCalories: string;
  formattedDeficit: string;
  formattedProtein: string;
  formattedCarbs: string;
  formattedFat: string;
  macroPercentSummary: string;
  summary: string;
  recommendation: string;
}

export const bodyRecompositionActivityLevels = [
  { value: 1.2, label: "Sedentary" },
  { value: 1.375, label: "Lightly active" },
  { value: 1.55, label: "Moderately active" },
  { value: 1.725, label: "Very active" },
  { value: 1.9, label: "Extremely active" }
] as const;

export const bodyRecompositionGoals = [
  { value: "recomp", label: "Body Recomposition", deficit: 250 },
  { value: "slow-cut", label: "Slow Cut", deficit: 400 },
  { value: "maintain", label: "Maintenance", deficit: 0 }
] as const;

export const defaultBodyRecompositionScenario: BodyRecompositionInput = {
  sex: "male",
  age: 30,
  heightCm: 175,
  weightKg: 75,
  activityMultiplier: 1.55,
  goal: "recomp"
};

export function calculateBodyRecomposition(input: BodyRecompositionInput): BodyRecompositionResult {
  const sex = input.sex === "female" ? "female" : "male";
  const age = cleanNumber(input.age);
  const heightCm = cleanNumber(input.heightCm);
  const weightKg = cleanNumber(input.weightKg);
  const activityMultiplier = cleanNumber(input.activityMultiplier);
  const bmrCalories = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  const tdeeCalories = Math.round(bmrCalories * activityMultiplier);
  const goal = bodyRecompositionGoals.find((item) => item.value === input.goal) ?? bodyRecompositionGoals[0];
  const deficitCalories = goal.deficit;
  const targetCalories = Math.max(tdeeCalories - deficitCalories, 0);
  const proteinGrams = Math.round(weightKg * 2);
  const fatGrams = Math.round(weightKg * 0.9);
  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;
  const carbsCalories = Math.max(targetCalories - proteinCalories - fatCalories, 0);
  const carbsGrams = Math.round(carbsCalories / 4);
  const proteinPercent = percentOf(proteinCalories, targetCalories);
  const carbsPercent = percentOf(carbsCalories, targetCalories);
  const fatPercent = percentOf(fatCalories, targetCalories);

  return {
    bmrCalories,
    tdeeCalories,
    targetCalories,
    deficitCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    proteinCalories,
    carbsCalories,
    fatCalories,
    proteinPercent,
    carbsPercent,
    fatPercent,
    formattedBmr: formatCalories(bmrCalories),
    formattedTdee: formatCalories(tdeeCalories),
    formattedTargetCalories: formatCalories(targetCalories),
    formattedDeficit: formatCalories(deficitCalories),
    formattedProtein: `${formatNumber(proteinGrams)} g`,
    formattedCarbs: `${formatNumber(carbsGrams)} g`,
    formattedFat: `${formatNumber(fatGrams)} g`,
    macroPercentSummary: `${proteinPercent}% protein / ${carbsPercent}% carbs / ${fatPercent}% fat`,
    summary: `${goal.label}, TDEE ${formatNumber(tdeeCalories)} kcal, deficit ${formatNumber(deficitCalories)} kcal`,
    recommendation: "Pair a small deficit with progressive resistance training and high protein."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function percentOf(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function formatCalories(value: number): string {
  return `${Math.round(value).toLocaleString("en-US")} kcal`;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
