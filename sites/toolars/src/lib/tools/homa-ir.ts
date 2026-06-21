export type FastingGlucoseUnit = "mmoll" | "mgdl";
export type FastingInsulinUnit = "uUml" | "pmoll";

export interface HomaIrInput {
  fastingGlucose: number;
  fastingGlucoseUnit: FastingGlucoseUnit;
  fastingInsulin: number;
  fastingInsulinUnit: FastingInsulinUnit;
}

export interface HomaIrResult {
  fastingGlucoseMmoll: number;
  fastingInsulinUuml: number;
  homaIr: number;
  level: string;
  interpretation: string;
  formattedGlucose: string;
  formattedInsulin: string;
  formattedHomaIr: string;
  summary: string;
}

export const defaultHomaIrScenario: HomaIrInput = {
  fastingGlucose: 5.5,
  fastingGlucoseUnit: "mmoll",
  fastingInsulin: 12,
  fastingInsulinUnit: "uUml"
};

export function calculateHomaIr(input: HomaIrInput): HomaIrResult {
  const fastingGlucoseMmoll = input.fastingGlucoseUnit === "mgdl" ? cleanNumber(input.fastingGlucose) * 0.0555 : cleanNumber(input.fastingGlucose);
  const fastingInsulinUuml = input.fastingInsulinUnit === "pmoll" ? cleanNumber(input.fastingInsulin) / 6.945 : cleanNumber(input.fastingInsulin);
  const homaIr = (fastingGlucoseMmoll * fastingInsulinUuml) / 22.5;
  const { level, interpretation } = getHomaLevel(homaIr);
  const formattedHomaIr = homaIr.toFixed(2);

  return {
    fastingGlucoseMmoll,
    fastingInsulinUuml,
    homaIr,
    level,
    interpretation,
    formattedGlucose: `${fastingGlucoseMmoll.toFixed(1)} mmol/L`,
    formattedInsulin: `${fastingInsulinUuml.toFixed(1)} uU/mL`,
    formattedHomaIr,
    summary: `${formattedHomaIr} HOMA-IR - ${level}`
  };
}

function getHomaLevel(homaIr: number) {
  if (homaIr < 2) {
    return {
      level: "Normal Range",
      interpretation: "HOMA-IR is within normal range (< 2.0), indicating good insulin sensitivity."
    };
  }

  if (homaIr <= 2.5) {
    return {
      level: "Borderline Range",
      interpretation: "HOMA-IR is in the borderline range (2.0-2.5). Pay attention to diet and exercise to prevent progression."
    };
  }

  return {
    level: "Insulin Resistance",
    interpretation: "HOMA-IR is above 2.5, suggesting possible insulin resistance. Consult an endocrinologist and intervene actively."
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
