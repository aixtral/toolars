export type WaistHipSex = "male" | "female";

export interface WaistHipInput {
  sex: WaistHipSex;
  waistCm: number;
  hipCm: number;
}

export interface WaistHipResult {
  ratio: number;
  category: string;
  thresholdLabel: string;
  formattedRatio: string;
  formattedWaist: string;
  formattedHip: string;
  tip: string;
  summary: string;
}

export const defaultWaistHipScenario: WaistHipInput = {
  sex: "male",
  waistCm: 80,
  hipCm: 95
};

export function calculateWaistHipRatio(input: WaistHipInput): WaistHipResult {
  const sex = input.sex === "female" ? "female" : "male";
  const waistCm = cleanNumber(input.waistCm);
  const hipCm = cleanNumber(input.hipCm);
  const ratio = hipCm > 0 ? waistCm / hipCm : 0;
  const category = getWhrCategory(sex, ratio);

  return {
    ratio,
    category,
    thresholdLabel: sex === "male" ? "Male thresholds" : "Female thresholds",
    formattedRatio: ratio.toFixed(2),
    formattedWaist: `${formatMeasurement(waistCm)} cm`,
    formattedHip: `${formatMeasurement(hipCm)} cm`,
    tip: getWhrTip(category),
    summary: `${capitalize(sex)} WHR reference from ${formatMeasurement(waistCm)} cm waist and ${formatMeasurement(hipCm)} cm hips`
  };
}

function getWhrCategory(sex: WaistHipSex, ratio: number) {
  if (sex === "male") {
    if (ratio < 0.9) return "Low Risk";
    if (ratio <= 0.95) return "Moderate Risk";
    return "High Risk";
  }

  if (ratio < 0.85) return "Low Risk";
  if (ratio <= 0.9) return "Moderate Risk";
  return "High Risk";
}

function getWhrTip(category: string) {
  if (category === "Low Risk") return "The ratio is inside the lower-risk reference band.";
  if (category === "Moderate Risk") return "The ratio is elevated; review measurement consistency and broader health context.";
  return "The ratio is in a high-risk reference band; consider qualified medical guidance.";
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatMeasurement(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
