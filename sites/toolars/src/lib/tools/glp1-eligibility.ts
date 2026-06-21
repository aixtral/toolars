export type Glp1Comorbidity = "diabetes" | "hypertension" | "cholesterol" | "sleepApnea" | "pcos" | "heart";

export interface Glp1EligibilityInput {
  heightCm: number;
  weightKg: number;
  comorbidities: Glp1Comorbidity[];
}

export interface Glp1EligibilityResult {
  bmi: number;
  formattedBmi: string;
  bmiCategory: string;
  hasComorbidity: boolean;
  comorbidityLabel: string;
  isCriteriaMatch: boolean;
  criteriaStatus: string;
  medicationNote: string;
  summary: string;
}

export const glp1ComorbidityLabels: Record<Glp1Comorbidity, string> = {
  diabetes: "Type 2 diabetes",
  hypertension: "Hypertension",
  cholesterol: "High cholesterol",
  sleepApnea: "Sleep apnea",
  pcos: "PCOS",
  heart: "Cardiovascular disease"
};

export const defaultGlp1EligibilityScenario: Glp1EligibilityInput = {
  heightCm: 170,
  weightKg: 85,
  comorbidities: []
};

export function calculateGlp1Eligibility(input: Glp1EligibilityInput): Glp1EligibilityResult {
  const heightCm = cleanNumber(input.heightCm) || defaultGlp1EligibilityScenario.heightCm;
  const weightKg = cleanNumber(input.weightKg) || defaultGlp1EligibilityScenario.weightKg;
  const bmi = weightKg / (heightCm / 100) ** 2;
  const bmiCategory = getBmiCategory(bmi);
  const hasComorbidity = input.comorbidities.length > 0;
  const isCriteriaMatch = bmi >= 30 || (bmi >= 27 && hasComorbidity);
  const criteriaStatus = getCriteriaStatus(bmi, hasComorbidity);
  const medicationNote = getMedicationNote(bmi, hasComorbidity);

  return {
    bmi,
    formattedBmi: bmi.toFixed(1),
    bmiCategory,
    hasComorbidity,
    comorbidityLabel: input.comorbidities.length === 0 ? "None selected" : `${input.comorbidities.length} selected`,
    isCriteriaMatch,
    criteriaStatus,
    medicationNote,
    summary: `${bmi.toFixed(1)} BMI - ${criteriaStatus}`
  };
}

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

function getCriteriaStatus(bmi: number, hasComorbidity: boolean): string {
  if (bmi >= 30) return "Common criteria match";
  if (bmi >= 27 && hasComorbidity) return "Common criteria match";
  if (bmi >= 27) return "Needs comorbidity context";
  return "Criteria not met";
}

function getMedicationNote(bmi: number, hasComorbidity: boolean): string {
  if (bmi >= 30 || (bmi >= 27 && hasComorbidity)) return "Prepare this snapshot for a clinician conversation; it is not a prescription decision.";
  if (bmi >= 27) return "Discuss lifestyle care and comorbidity review with a clinician.";
  return "Source criteria are not met; focus on lifestyle care and clinician guidance when needed.";
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
