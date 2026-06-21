export type Glp1NutritionSex = "male" | "female";
export type Glp1Medication = "semaglutide" | "tirzepatide" | "liraglutide" | "dulaglutide" | "other";

export interface Glp1NutritionInput {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Glp1NutritionSex;
  medication: Glp1Medication;
  activityFactor: number;
}

export interface Glp1NutritionResult {
  bmr: number;
  tdee: number;
  calorieFloor: number;
  proteinGrams: number;
  waterMl: number;
  fiberGrams: number;
  medicationLabel: string;
  activityLabel: string;
  formattedBmr: string;
  formattedCalorieFloor: string;
  formattedProtein: string;
  formattedWater: string;
  formattedFiber: string;
  summary: string;
}

export const glp1MedicationLabels: Record<Glp1Medication, string> = {
  semaglutide: "Semaglutide",
  tirzepatide: "Tirzepatide",
  liraglutide: "Liraglutide",
  dulaglutide: "Dulaglutide",
  other: "Other / unsure"
};

export const glp1ActivityLabels: Record<string, string> = {
  "1.2": "Sedentary",
  "1.375": "Lightly active",
  "1.55": "Moderately active",
  "1.725": "Very active"
};

export const defaultGlp1NutritionScenario: Glp1NutritionInput = {
  weightKg: 70,
  heightCm: 170,
  age: 35,
  sex: "male",
  medication: "semaglutide",
  activityFactor: 1.375
};

export function calculateGlp1Nutrition(input: Glp1NutritionInput): Glp1NutritionResult {
  const weightKg = cleanNumber(input.weightKg) || defaultGlp1NutritionScenario.weightKg;
  const heightCm = cleanNumber(input.heightCm) || defaultGlp1NutritionScenario.heightCm;
  const age = cleanNumber(input.age) || defaultGlp1NutritionScenario.age;
  const activityFactor = cleanNumber(input.activityFactor) || defaultGlp1NutritionScenario.activityFactor;
  const bmr = input.sex === "male" ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5 : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const tdee = bmr * activityFactor;
  const calorieFloor = Math.max(Math.round(tdee * 0.75), input.sex === "male" ? 1500 : 1200);
  const proteinGrams = Math.round(weightKg * 1.4);
  const waterMl = Math.round(weightKg * 35 + (activityFactor > 1.375 ? 500 : 0));
  const fiberGrams = Math.max(Math.round((calorieFloor / 1000) * 14), 25);
  const formattedCalorieFloor = `${calorieFloor.toLocaleString()} kcal`;

  return {
    bmr,
    tdee,
    calorieFloor,
    proteinGrams,
    waterMl,
    fiberGrams,
    medicationLabel: glp1MedicationLabels[input.medication] ?? glp1MedicationLabels.other,
    activityLabel: glp1ActivityLabels[String(activityFactor)] ?? `${activityFactor} activity factor`,
    formattedBmr: `${Math.round(bmr).toLocaleString()} kcal`,
    formattedCalorieFloor,
    formattedProtein: `${proteinGrams} g`,
    formattedWater: `${waterMl.toLocaleString()} ml`,
    formattedFiber: `${fiberGrams} g`,
    summary: `${formattedCalorieFloor} calorie floor with ${proteinGrams}g protein target`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
