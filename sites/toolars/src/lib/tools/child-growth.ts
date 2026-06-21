export type ChildGrowthSex = "boy" | "girl";

export interface ChildGrowthInput {
  sex: ChildGrowthSex;
  ageYears: number;
  ageMonths: number;
  heightCm: number;
  weightKg: number;
}

export interface ChildGrowthResult {
  bmi: number;
  percentile: number;
  category: string;
  formattedBmi: string;
  formattedPercentile: string;
  rankLabel: string;
  idealWeightRange: string;
  ageLabel: string;
  summary: string;
}

export const defaultChildGrowthProfile: ChildGrowthInput = {
  sex: "boy",
  ageYears: 8,
  ageMonths: 0,
  heightCm: 125,
  weightKg: 26
};

export function calculateChildGrowth(input: ChildGrowthInput): ChildGrowthResult {
  const sex = input.sex === "girl" ? "girl" : "boy";
  const ageYears = Math.max(0, Math.round(cleanNumber(input.ageYears)));
  const ageMonths = Math.max(0, Math.round(cleanNumber(input.ageMonths)));
  const heightCm = cleanNumber(input.heightCm);
  const weightKg = cleanNumber(input.weightKg);
  const totalAgeMonths = ageYears * 12 + ageMonths;
  const bmi = heightCm > 0 ? weightKg / (heightCm / 100) ** 2 : 0;
  const percentile = getPercentile(bmi, totalAgeMonths, sex === "boy");
  const category = getChildGrowthCategory(percentile);
  const idealLow = 18.5 * (heightCm / 100) ** 2;
  const idealHigh = 24 * (heightCm / 100) ** 2;

  return {
    bmi,
    percentile,
    category,
    formattedBmi: bmi.toFixed(1),
    formattedPercentile: `${percentile.toFixed(1)}th`,
    rankLabel: `Top ${percentile.toFixed(1)}%`,
    idealWeightRange: `${idealLow.toFixed(1)}-${idealHigh.toFixed(1)} kg`,
    ageLabel: `${ageYears}y ${ageMonths}m`,
    summary: `${capitalize(sex)}, ${ageYears}y ${ageMonths}m, ${Math.round(heightCm)} cm and ${formatOneDecimal(weightKg)} kg`
  };
}

function getPercentile(bmi: number, ageMonths: number, isBoy: boolean) {
  const base = isBoy ? 15.5 : 15.2;
  const growth = isBoy ? 0.55 : 0.5;
  const mean = base + growth * (ageMonths / 12 - 2);
  const sd = 1.8;
  const z = (bmi - mean) / sd;
  const p = 0.5 * (1 + Math.tanh(z * 0.79788456));
  return Math.max(0.1, Math.min(99.9, p * 100));
}

function getChildGrowthCategory(percentile: number) {
  if (percentile < 5) return "Underweight";
  if (percentile < 85) return "Healthy";
  if (percentile < 95) return "Overweight";
  return "Obese";
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatOneDecimal(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
