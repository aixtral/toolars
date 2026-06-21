export type MacroGoal = "balanced" | "low-carb" | "high-carb" | "keto" | "high-protein";

export interface MacroInput {
  calories: number;
  weightKg: number;
  goal: MacroGoal;
}

export interface MacroPreset {
  goal: MacroGoal;
  label: string;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export interface MacroResult {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
  formattedProtein: string;
  formattedCarbs: string;
  formattedFat: string;
  percentSummary: string;
  goalLabel: string;
  summary: string;
  recommendation: string;
}

export const macroPresets: MacroPreset[] = [
  { goal: "balanced", label: "Balanced", proteinPercent: 30, carbsPercent: 40, fatPercent: 30 },
  { goal: "low-carb", label: "Low Carb", proteinPercent: 35, carbsPercent: 20, fatPercent: 45 },
  { goal: "high-carb", label: "High Carb", proteinPercent: 20, carbsPercent: 55, fatPercent: 25 },
  { goal: "keto", label: "Keto", proteinPercent: 25, carbsPercent: 5, fatPercent: 70 },
  { goal: "high-protein", label: "High Protein", proteinPercent: 40, carbsPercent: 30, fatPercent: 30 }
];

export const defaultMacroScenario: MacroInput = {
  calories: 2200,
  weightKg: 70,
  goal: "balanced"
};

export function calculateMacros(input: MacroInput): MacroResult {
  const calories = cleanNumber(input.calories);
  const weightKg = cleanNumber(input.weightKg);
  const preset = macroPresets.find((item) => item.goal === input.goal) ?? macroPresets[0];
  let proteinGrams = Math.round((calories * preset.proteinPercent) / 100 / 4);
  const proteinMinimum = weightKg ? Math.round(weightKg * 1.6) : 0;
  if (preset.goal === "high-protein" && proteinMinimum > proteinGrams) {
    proteinGrams = proteinMinimum;
  }

  const carbsGrams = Math.round((calories * preset.carbsPercent) / 100 / 4);
  const fatGrams = Math.round((calories * preset.fatPercent) / 100 / 9);

  return {
    proteinGrams,
    carbsGrams,
    fatGrams,
    proteinPercent: preset.proteinPercent,
    carbsPercent: preset.carbsPercent,
    fatPercent: preset.fatPercent,
    formattedProtein: `${formatNumber(proteinGrams)} g`,
    formattedCarbs: `${formatNumber(carbsGrams)} g`,
    formattedFat: `${formatNumber(fatGrams)} g`,
    percentSummary: `${preset.proteinPercent}% protein / ${preset.carbsPercent}% carbs / ${preset.fatPercent}% fat`,
    goalLabel: preset.label,
    summary: `${formatNumber(Math.round(calories))} kcal, ${preset.label} split`,
    recommendation: "Use macro grams as a planning target, then adjust by training, satiety, and trend data."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
