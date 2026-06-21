export interface BmiInput {
  heightCm: number;
  weightKg: number;
}

export interface BmiResult {
  bmi: number;
  formattedBmi: string;
  category: string;
  recommendation: string;
  healthyWeightRange: string;
  inputSummary: string;
  summary: string;
}

export const defaultBmiProfile: BmiInput = {
  heightCm: 175,
  weightKg: 70
};

export function calculateBmi(input: BmiInput): BmiResult {
  const heightCm = cleanNumber(input.heightCm);
  const weightKg = cleanNumber(input.weightKg);
  const heightMeters = heightCm / 100;
  const bmi = heightMeters > 0 && weightKg > 0 ? weightKg / (heightMeters * heightMeters) : 0;
  const roundedBmi = roundOne(bmi);
  const category = getCategory(roundedBmi);
  const recommendation = getRecommendation(category);
  const healthyMin = heightMeters > 0 ? 18.5 * heightMeters * heightMeters : 0;
  const healthyMax = heightMeters > 0 ? 24.9 * heightMeters * heightMeters : 0;

  return {
    bmi: roundedBmi,
    formattedBmi: roundedBmi.toFixed(1),
    category,
    recommendation,
    healthyWeightRange: `${roundOne(healthyMin).toFixed(1)}-${roundOne(healthyMax).toFixed(1)} kg`,
    inputSummary: `${heightCm} cm / ${weightKg} kg`,
    summary: category === "Unavailable" ? "Enter height and weight" : `BMI ${roundedBmi.toFixed(1)} - ${category} range`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value;
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function getCategory(bmi: number): string {
  if (bmi <= 0) return "Unavailable";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

function getRecommendation(category: string): string {
  if (category === "Normal") return "Healthy range";
  if (category === "Unavailable") return "Enter height and weight";
  return "Review with context";
}
