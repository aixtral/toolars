export type BmrSex = "male" | "female";

export interface BmrInput {
  sex: BmrSex;
  age: number;
  heightCm: number;
  weightKg: number;
}

export interface BmrResult {
  bmr: number;
  lossTarget: number;
  maintainTarget: number;
  gainTarget: number;
  formattedBmr: string;
  formattedLossTarget: string;
  formattedMaintainTarget: string;
  formattedGainTarget: string;
  formulaLabel: string;
  summary: string;
  recommendation: string;
}

export const defaultBmrScenario: BmrInput = {
  sex: "male",
  age: 30,
  heightCm: 175,
  weightKg: 70
};

export function calculateBmr(input: BmrInput): BmrResult {
  const sex = input.sex === "female" ? "female" : "male";
  const age = cleanNumber(input.age);
  const heightCm = cleanNumber(input.heightCm);
  const weightKg = cleanNumber(input.weightKg);
  const sexAdjustment = sex === "male" ? 5 : -161;
  const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + sexAdjustment);
  const maintainTarget = Math.max(bmr, 0);
  const lossTarget = Math.max(maintainTarget - 500, 0);
  const gainTarget = maintainTarget + 250;

  return {
    bmr: maintainTarget,
    lossTarget,
    maintainTarget,
    gainTarget,
    formattedBmr: formatCalories(maintainTarget),
    formattedLossTarget: formatCalories(lossTarget),
    formattedMaintainTarget: formatCalories(maintainTarget),
    formattedGainTarget: formatCalories(gainTarget),
    formulaLabel: "Mifflin-St Jeor",
    summary: `${capitalize(sex)}, ${Math.round(age)} years, ${Math.round(heightCm)} cm, ${Math.round(weightKg)} kg`,
    recommendation: "Use BMR as resting energy, then use TDEE for activity-adjusted planning."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCalories(value: number): string {
  return `${Math.round(value).toLocaleString("en-US")} kcal`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
