export interface TdeeInput {
  bmr: number;
  activityMultiplier: number;
}

export interface TdeeResult {
  tdee: number;
  activityBurn: number;
  fatLossTarget: number;
  muscleGainTarget: number;
  formattedTdee: string;
  formattedActivityBurn: string;
  formattedFatLossTarget: string;
  formattedMuscleGainTarget: string;
  summary: string;
  recommendation: string;
}

export const defaultTdeeScenario: TdeeInput = {
  bmr: 1500,
  activityMultiplier: 1.55
};

export const activityLevels = [
  { value: 1.2, label: "Sedentary" },
  { value: 1.375, label: "Lightly active" },
  { value: 1.55, label: "Moderately active" },
  { value: 1.725, label: "Very active" },
  { value: 1.9, label: "Extremely active" }
] as const;

export function calculateTdee(input: TdeeInput): TdeeResult {
  const bmr = cleanNumber(input.bmr);
  const activityMultiplier = cleanNumber(input.activityMultiplier);
  const tdee = Math.round(bmr * activityMultiplier);
  const activityBurn = Math.max(tdee - bmr, 0);
  const fatLossTarget = Math.max(tdee - 500, 0);
  const muscleGainTarget = tdee + 250;

  return {
    tdee,
    activityBurn,
    fatLossTarget,
    muscleGainTarget,
    formattedTdee: formatNumber(tdee),
    formattedActivityBurn: `${formatNumber(activityBurn)} kcal`,
    formattedFatLossTarget: formatNumber(fatLossTarget),
    formattedMuscleGainTarget: formatNumber(muscleGainTarget),
    summary: `BMR ${formatNumber(Math.round(bmr))} × activity ${formatMultiplier(activityMultiplier)}`,
    recommendation: "Use TDEE as a planning baseline, then adjust from measured trend data."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function formatMultiplier(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : String(value);
}
