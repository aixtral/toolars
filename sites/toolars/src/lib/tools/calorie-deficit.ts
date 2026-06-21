export interface CalorieDeficitInput {
  currentWeightKg: number;
  targetWeightKg: number;
  tdeeCalories: number;
  weeklyLossKg: number;
}

export interface CalorieDeficitResult {
  dailyIntakeCalories: number;
  dailyDeficitCalories: number;
  estimatedWeeks: number;
  fatToLoseKg: number;
  formattedDailyIntake: string;
  formattedDailyDeficit: string;
  formattedEstimatedTime: string;
  formattedFatToLose: string;
  safetyTone: "safe" | "warn";
  safetyMessage: string;
  summary: string;
}

export const defaultCalorieDeficitScenario: CalorieDeficitInput = {
  currentWeightKg: 70,
  targetWeightKg: 65,
  tdeeCalories: 2200,
  weeklyLossKg: 0.5
};

export const weeklyLossOptions = [
  { value: 0.25, label: "0.25 kg (Conservative)" },
  { value: 0.5, label: "0.5 kg (Recommended)" },
  { value: 0.75, label: "0.75 kg (Aggressive)" },
  { value: 1, label: "1.0 kg (Fast)" }
] as const;

export function calculateCalorieDeficit(input: CalorieDeficitInput): CalorieDeficitResult {
  const currentWeightKg = cleanNumber(input.currentWeightKg);
  const targetWeightKg = cleanNumber(input.targetWeightKg);
  const tdeeCalories = cleanNumber(input.tdeeCalories);
  const weeklyLossKg = cleanNumber(input.weeklyLossKg);
  const fatToLoseKg = Math.max(currentWeightKg - targetWeightKg, 0);
  const dailyDeficitCalories = Math.round((weeklyLossKg * 7700) / 7);
  const dailyIntakeCalories = Math.round(tdeeCalories - dailyDeficitCalories);
  const estimatedWeeks = weeklyLossKg > 0 ? Math.ceil(fatToLoseKg / weeklyLossKg) : 0;
  const safetyTone = dailyIntakeCalories < 1200 ? "warn" : "safe";

  return {
    dailyIntakeCalories,
    dailyDeficitCalories,
    estimatedWeeks,
    fatToLoseKg,
    formattedDailyIntake: formatCalories(dailyIntakeCalories),
    formattedDailyDeficit: formatCalories(dailyDeficitCalories),
    formattedEstimatedTime: `${formatNumber(estimatedWeeks)} weeks`,
    formattedFatToLose: `${fatToLoseKg.toFixed(1)} kg`,
    safetyTone,
    safetyMessage:
      safetyTone === "warn"
        ? "Recommended intake is below the 1200 kcal safety reference; choose a slower pace or get qualified nutrition guidance."
        : "Deficit is within the common planning range. Pair it with adequate protein and strength training.",
    summary: `${formatNumber(Math.round(currentWeightKg))} kg to ${formatNumber(Math.round(targetWeightKg))} kg at ${formatMultiplier(weeklyLossKg)} kg/week`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCalories(value: number): string {
  return `${Math.round(value).toLocaleString("en-US")} kcal`;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function formatMultiplier(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : String(value);
}
