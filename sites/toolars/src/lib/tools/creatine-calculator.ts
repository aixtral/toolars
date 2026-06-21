export type CreatineWeightUnit = "kg" | "lb";
export type CreatineTrainingIntensity = "standard" | "moderate" | "intense";

export interface CreatineInput {
  weight: number;
  unit: CreatineWeightUnit;
  trainingIntensity: CreatineTrainingIntensity;
  vegetarian: boolean;
  loading: boolean;
}

export interface CreatineResult {
  weightKg: number;
  maintenanceGrams: number;
  extraWaterMl: number;
  loadingEnabled: boolean;
  formattedMaintenance: string;
  formattedExtraWater: string;
  formattedLoadingDose: string;
  loadingProtocol: string;
  rangeLabel: string;
  summary: string;
  recommendation: string;
}

export const creatineTrainingOptions = [
  { value: "standard", label: "Light" },
  { value: "moderate", label: "Strength" },
  { value: "intense", label: "Competitive" }
] as const;

export const defaultCreatineScenario: CreatineInput = {
  weight: 70,
  unit: "kg",
  trainingIntensity: "moderate",
  vegetarian: false,
  loading: false
};

export function calculateCreatineDose(input: CreatineInput): CreatineResult {
  const weightKg = input.unit === "lb" ? cleanPositive(input.weight) * 0.453592 : cleanPositive(input.weight);
  let maintenanceGrams = Math.round(weightKg * 0.03 * 2) / 2;
  maintenanceGrams = Math.max(3, Math.min(5, maintenanceGrams));
  if (input.trainingIntensity === "intense" || input.vegetarian) maintenanceGrams = Math.max(maintenanceGrams, 5);
  const extraWaterMl = Math.round(weightKg * 10);

  return {
    weightKg,
    maintenanceGrams,
    extraWaterMl,
    loadingEnabled: input.loading,
    formattedMaintenance: `${formatDose(maintenanceGrams)} g`,
    formattedExtraWater: `${extraWaterMl.toLocaleString("en-US")} ml`,
    formattedLoadingDose: input.loading ? "20 g/day" : "Not enabled",
    loadingProtocol: input.loading ? "4 doses for 5-7 days" : "Maintenance only",
    rangeLabel: "3-5 g/day",
    summary: `${Math.round(weightKg)} kg source weight`,
    recommendation:
      input.loading
        ? "Use loading for faster saturation, then return to the maintenance dose."
        : "Maintenance dosing reaches similar saturation over about 28-30 days."
  };
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatDose(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
