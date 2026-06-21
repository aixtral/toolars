export interface WaterIntakeInput {
  weightKg: number;
  activityMultiplier: number;
  climateAdjustment: number;
}

export interface WaterIntakeResult {
  totalMl: number;
  cups: number;
  baseNeedMl: number;
  activityExtraMl: number;
  climateExtraMl: number;
  formattedTotal: string;
  formattedCups: string;
  formattedBaseNeed: string;
  formattedActivityExtra: string;
  formattedClimateExtra: string;
  summary: string;
  recommendation: string;
}

export const waterActivityLevels = [
  { value: 1, label: "Sedentary" },
  { value: 1.2, label: "Moderate activity" },
  { value: 1.5, label: "Active" },
  { value: 1.8, label: "Very active" }
] as const;

export const climateOptions = [
  { value: 0, label: "Temperate" },
  { value: 0.5, label: "Hot" },
  { value: -0.3, label: "Cold" }
] as const;

export const defaultWaterIntakeScenario: WaterIntakeInput = {
  weightKg: 70,
  activityMultiplier: 1.2,
  climateAdjustment: 0.5
};

export function calculateWaterIntake(input: WaterIntakeInput): WaterIntakeResult {
  const weightKg = cleanNumber(input.weightKg);
  const activityMultiplier = cleanNumber(input.activityMultiplier);
  const climateAdjustment = Number.isFinite(input.climateAdjustment) ? input.climateAdjustment : 0;
  const baseNeedMl = weightKg * 35;
  const activityExtraMl = Math.round(baseNeedMl * (activityMultiplier - 1));
  const climateExtraMl = Math.round(baseNeedMl * climateAdjustment);
  const totalMl = Math.max(Math.round(baseNeedMl + activityExtraMl + climateExtraMl), 0);
  const cups = Math.round(totalMl / 250);

  return {
    totalMl,
    cups,
    baseNeedMl,
    activityExtraMl,
    climateExtraMl,
    formattedTotal: formatMl(totalMl),
    formattedCups: `${formatNumber(cups)} cups`,
    formattedBaseNeed: formatMl(baseNeedMl),
    formattedActivityExtra: formatSignedMl(activityExtraMl),
    formattedClimateExtra: formatSignedMl(climateExtraMl),
    summary: `${formatNumber(Math.round(weightKg))} kg, ${getActivityLabel(activityMultiplier)}, ${getClimateLabel(climateAdjustment)} climate`,
    recommendation: "Drink small amounts frequently and adjust for sweat, medication, and clinician guidance."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function getActivityLabel(value: number): string {
  return waterActivityLevels.find((level) => Math.abs(level.value - value) < 0.001)?.label ?? `Activity ${value}`;
}

function getClimateLabel(value: number): string {
  return climateOptions.find((option) => Math.abs(option.value - value) < 0.001)?.label ?? "Custom";
}

function formatMl(value: number): string {
  return `${formatNumber(Math.round(value))} ml`;
}

function formatSignedMl(value: number): string {
  const rounded = Math.round(value);
  const prefix = rounded >= 0 ? "+" : "";
  return `${prefix}${formatNumber(rounded)} ml`;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
