export interface BloodPressureInput {
  systolic: number;
  diastolic: number;
}

export type BloodPressureCategory = "normal" | "elevated" | "stage1" | "stage2" | "crisis";

export interface BloodPressureResult {
  systolic: number;
  diastolic: number;
  category: BloodPressureCategory;
  formattedReading: string;
}

export const defaultBloodPressureReading: BloodPressureInput = {
  systolic: 120,
  diastolic: 80
};

export function calculateBloodPressure(input: BloodPressureInput): BloodPressureResult {
  const systolic = Math.round(cleanNumber(input.systolic));
  const diastolic = Math.round(cleanNumber(input.diastolic));
  const formattedReading = `${systolic}/${diastolic}`;
  const category = getCategory(systolic, diastolic);

  return { systolic, diastolic, category, formattedReading };
}

function getCategory(systolic: number, diastolic: number): BloodPressureCategory {
  if (systolic >= 180 || diastolic >= 120) return "crisis";
  if (systolic >= 140 || diastolic >= 90) return "stage2";
  if (systolic >= 130 || diastolic >= 80) return "stage1";
  if (systolic >= 120) return "elevated";
  return "normal";
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
