export type Vo2Method = "cooper" | "restingHeartRate";
export type Vo2Sex = "male" | "female";

export interface Vo2MaxInput {
  method: Vo2Method;
  distanceMeters: number;
  sex: Vo2Sex;
  age: number;
  restingHeartRate: number;
}

export interface Vo2ReferenceRow {
  label: string;
  range: string;
}

export interface Vo2MaxResult {
  vo2Max: number;
  formattedVo2Max: string;
  methodLabel: string;
  fitnessLevel: string;
  referenceRows: Vo2ReferenceRow[];
  summary: string;
  recommendation: string;
}

export const defaultVo2MaxScenario: Vo2MaxInput = {
  method: "cooper",
  distanceMeters: 2400,
  sex: "male",
  age: 30,
  restingHeartRate: 60
};

export const vo2MethodOptions = [
  { value: "cooper", label: "Cooper 12-minute run" },
  { value: "restingHeartRate", label: "Resting heart rate" }
] as const;

export const vo2ReferenceRows: Vo2ReferenceRow[] = [
  { label: "Elite", range: ">= 60 ml/kg/min" },
  { label: "Excellent", range: "50-59 ml/kg/min" },
  { label: "Good", range: "42-49 ml/kg/min" },
  { label: "Average", range: "35-41 ml/kg/min" },
  { label: "Below Average", range: "28-34 ml/kg/min" },
  { label: "Low", range: "< 28 ml/kg/min" }
];

export function calculateVo2Max(input: Vo2MaxInput): Vo2MaxResult {
  const method = input.method;
  let vo2Max: number;
  let summary: string;
  let methodLabel: string;

  if (method === "restingHeartRate") {
    const age = cleanPositive(input.age);
    const restingHeartRate = cleanPositive(input.restingHeartRate) || 1;
    vo2Max = (15.3 * (208 - 0.7 * age)) / restingHeartRate;
    summary = `${formatCompact(age)} years, ${formatCompact(restingHeartRate)} bpm resting HR`;
    methodLabel = "Resting heart rate";
  } else {
    const distanceMeters = cleanPositive(input.distanceMeters);
    vo2Max = (distanceMeters - 504.9) / 44.73;
    if (input.sex === "female") vo2Max *= 0.85;
    summary = `${formatCompact(distanceMeters)} meters, ${input.sex}`;
    methodLabel = "Cooper 12-minute run";
  }

  const fitnessLevel = getFitnessLevel(vo2Max);

  return {
    vo2Max,
    formattedVo2Max: vo2Max.toFixed(1),
    methodLabel,
    fitnessLevel,
    referenceRows: vo2ReferenceRows,
    summary,
    recommendation:
      fitnessLevel === "Elite" || fitnessLevel === "Excellent"
        ? "Maintain aerobic capacity with structured recovery and periodic retesting."
        : "Use the estimate as a training baseline and retest under similar conditions."
  };
}

function getFitnessLevel(vo2Max: number): string {
  if (vo2Max >= 60) return "Elite";
  if (vo2Max >= 50) return "Excellent";
  if (vo2Max >= 42) return "Good";
  if (vo2Max >= 35) return "Average";
  if (vo2Max >= 28) return "Below Average";
  return "Low";
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCompact(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
