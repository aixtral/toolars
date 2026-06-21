export interface BloodPressureInput {
  systolic: number;
  diastolic: number;
}

export interface BloodPressureResult {
  systolic: number;
  diastolic: number;
  category: string;
  reason: string;
  advice: string;
  formattedReading: string;
  summary: string;
}

export const defaultBloodPressureReading: BloodPressureInput = {
  systolic: 120,
  diastolic: 80
};

export function calculateBloodPressure(input: BloodPressureInput): BloodPressureResult {
  const systolic = Math.round(cleanNumber(input.systolic));
  const diastolic = Math.round(cleanNumber(input.diastolic));
  const formattedReading = `${systolic}/${diastolic}`;

  if (systolic >= 180 || diastolic >= 120) {
    return buildResult(systolic, diastolic, "Crisis", "Systolic >=180 or diastolic >=120. Medical emergency.", "Seek emergency medical care immediately. Do not wait.");
  }

  if (systolic >= 140 || diastolic >= 90) {
    return buildResult(systolic, diastolic, "Stage 2", "Systolic >=140 or diastolic >=90.", "Consult a doctor soon. Medication may be needed. Improve lifestyle.");
  }

  if (systolic >= 130 || diastolic >= 80) {
    return buildResult(systolic, diastolic, "Stage 1", "Systolic 130-139 or diastolic 80-89.", "Improve lifestyle: reduce salt, maintain healthy weight, exercise, and monitor regularly.");
  }

  if (systolic >= 120) {
    return buildResult(systolic, diastolic, "Elevated", "Systolic 120-129 and diastolic below 80.", "Preventive diet and exercise improvements are recommended.");
  }

  return {
    systolic,
    diastolic,
    category: "Normal",
    reason: "Systolic below 120 and diastolic below 80.",
    advice: "Blood pressure is normal. Keep up the healthy lifestyle.",
    formattedReading,
    summary: `${formattedReading} mmHg is in the normal reference band`
  };
}

function buildResult(systolic: number, diastolic: number, category: string, reason: string, advice: string): BloodPressureResult {
  const formattedReading = `${systolic}/${diastolic}`;
  return {
    systolic,
    diastolic,
    category,
    reason,
    advice,
    formattedReading,
    summary: `${formattedReading} mmHg maps to ${category}`
  };
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
