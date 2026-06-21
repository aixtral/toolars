export type IdealWeightSex = "male" | "female";

export interface IdealWeightInput {
  sex: IdealWeightSex;
  heightCm: number;
}

export interface IdealWeightResult {
  idealWeightKg: number;
  minimumWeightKg: number;
  maximumWeightKg: number;
  formattedIdealWeight: string;
  formattedMinimumWeight: string;
  formattedMaximumWeight: string;
  formulaLabel: string;
  summary: string;
  recommendation: string;
}

export const defaultIdealWeightScenario: IdealWeightInput = {
  sex: "male",
  heightCm: 175
};

export function calculateIdealWeight(input: IdealWeightInput): IdealWeightResult {
  const heightCm = cleanPositive(input.heightCm);
  const base = input.sex === "male" ? 50 : 45.5;
  const idealWeightKg = roundOne(base + 0.91 * (heightCm - 152.4));
  const minimumWeightKg = roundOne(idealWeightKg * 0.9);
  const maximumWeightKg = roundOne(idealWeightKg * 1.1);

  return {
    idealWeightKg,
    minimumWeightKg,
    maximumWeightKg,
    formattedIdealWeight: formatKg(idealWeightKg),
    formattedMinimumWeight: formatKg(minimumWeightKg),
    formattedMaximumWeight: formatKg(maximumWeightKg),
    formulaLabel: "Devine formula",
    summary: `${heightCm.toFixed(0)} cm, ${input.sex}`,
    recommendation: "Use the range as a reference and interpret it with muscle mass, frame size, and clinical context."
  };
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function formatKg(value: number): string {
  return `${value.toFixed(1)} kg`;
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
