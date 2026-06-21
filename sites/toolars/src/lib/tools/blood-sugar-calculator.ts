export type BloodSugarInputMode = "fpg" | "a1c" | "eag";
export type GlucoseUnit = "mmoll" | "mgdl";

export interface BloodSugarInput {
  inputMode: BloodSugarInputMode;
  fastingGlucose: number;
  fastingGlucoseUnit: GlucoseUnit;
  a1c: number;
  averageGlucose: number;
  averageGlucoseUnit: GlucoseUnit;
}

export interface BloodSugarResult {
  fastingGlucoseMmoll: number;
  fastingGlucoseMgdl: number;
  a1c: number;
  averageGlucoseMgdl: number;
  riskBand: string;
  formattedFastingGlucose: string;
  formattedA1c: string;
  formattedAverageGlucose: string;
  summary: string;
  advice: string;
}

export const defaultBloodSugarScenario: BloodSugarInput = {
  inputMode: "fpg",
  fastingGlucose: 5.5,
  fastingGlucoseUnit: "mmoll",
  a1c: 5.7,
  averageGlucose: 100,
  averageGlucoseUnit: "mgdl"
};

export function calculateBloodSugar(input: BloodSugarInput): BloodSugarResult {
  const values = deriveBloodSugarValues(input);
  const riskBand = getRiskBand(values.fastingGlucoseMmoll, values.a1c);

  return {
    ...values,
    riskBand,
    formattedFastingGlucose: `${values.fastingGlucoseMmoll.toFixed(1)} mmol/L`,
    formattedA1c: `${values.a1c.toFixed(1)}%`,
    formattedAverageGlucose: `${Math.round(values.averageGlucoseMgdl).toLocaleString("en-US")} mg/dL`,
    summary: `${riskBand} from ${formatInputMode(input.inputMode)} input`,
    advice: getAdvice(riskBand)
  };
}

function deriveBloodSugarValues(input: BloodSugarInput) {
  if (input.inputMode === "a1c") {
    const a1c = cleanNumber(input.a1c);
    const averageGlucoseMgdl = a1c * 28.7 - 46.7;
    return fromAverageGlucose(averageGlucoseMgdl, a1c);
  }

  if (input.inputMode === "eag") {
    const averageGlucoseMgdl = input.averageGlucoseUnit === "mmoll" ? mmollToMgdl(input.averageGlucose) : cleanNumber(input.averageGlucose);
    const a1c = (averageGlucoseMgdl + 46.7) / 28.7;
    return fromAverageGlucose(averageGlucoseMgdl, a1c);
  }

  const fastingGlucoseMgdl = input.fastingGlucoseUnit === "mmoll" ? mmollToMgdl(input.fastingGlucose) : cleanNumber(input.fastingGlucose);
  const a1c = (fastingGlucoseMgdl + 46.7) / 28.7;
  return fromAverageGlucose(fastingGlucoseMgdl, a1c);
}

function fromAverageGlucose(averageGlucoseMgdl: number, a1c: number) {
  const cleanAverage = Math.max(0, Number.isFinite(averageGlucoseMgdl) ? averageGlucoseMgdl : 0);
  return {
    fastingGlucoseMmoll: mgdlToMmoll(cleanAverage),
    fastingGlucoseMgdl: cleanAverage,
    a1c,
    averageGlucoseMgdl: cleanAverage
  };
}

function getRiskBand(fastingGlucoseMmoll: number, a1c: number) {
  if (a1c >= 6.5 || fastingGlucoseMmoll >= 7) return "Diabetes risk range";
  if (a1c >= 5.7 || fastingGlucoseMmoll >= 6.1) return "Prediabetes range";
  return "Normal range";
}

function getAdvice(riskBand: string) {
  if (riskBand === "Normal range") return "Values are inside the normal reference band; keep routine screening as appropriate.";
  if (riskBand === "Prediabetes range") return "This is an early warning reference band; consider clinician review and lifestyle intervention.";
  return "These values meet diabetes-risk reference criteria; seek professional confirmation and care.";
}

function formatInputMode(mode: BloodSugarInputMode) {
  if (mode === "a1c") return "A1C";
  if (mode === "eag") return "estimated average glucose";
  return "fasting glucose";
}

function mmollToMgdl(value: number) {
  return cleanNumber(value) * 18;
}

function mgdlToMmoll(value: number) {
  return cleanNumber(value) / 18;
}

function cleanNumber(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
