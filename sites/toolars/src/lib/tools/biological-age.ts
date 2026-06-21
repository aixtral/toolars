export type SmokingStatus = "no" | "former" | "yes";
export type AlcoholFrequency = "never" | "rare" | "weekly" | "daily";
export type StressLevel = "low" | "moderate" | "high";

export interface BiologicalAgeInput {
  chronologicalAge: number;
  bmi: number;
  systolicBp: number;
  exerciseDays: number;
  sleepHours: number;
  smoking: SmokingStatus;
  alcohol: AlcoholFrequency;
  stress: StressLevel;
}

export interface BiologicalAgeResult {
  biologicalAge: number;
  ageDifference: number;
  delta: number;
  differenceLabel: string;
  status: "younger" | "same" | "older";
  formattedBiologicalAge: string;
  tips: string[];
  summary: string;
  recommendation: string;
}

export const defaultBiologicalAgeScenario: BiologicalAgeInput = {
  chronologicalAge: 35,
  bmi: 24,
  systolicBp: 120,
  exerciseDays: 3,
  sleepHours: 7,
  smoking: "no",
  alcohol: "never",
  stress: "low"
};

export function calculateBiologicalAge(input: BiologicalAgeInput): BiologicalAgeResult {
  const chronologicalAge = cleanPositive(input.chronologicalAge) || 35;
  const bmi = cleanPositive(input.bmi);
  const systolicBp = cleanPositive(input.systolicBp);
  const exerciseDays = cleanPositive(input.exerciseDays);
  const sleepHours = cleanPositive(input.sleepHours);
  let delta = 0;

  if (bmi < 18.5) delta += 1;
  else if (bmi >= 25 && bmi < 30) delta += 1.5;
  else if (bmi >= 30) delta += 3;

  if (systolicBp >= 140) delta += 2;
  else if (systolicBp >= 130) delta += 1;

  delta -= exerciseDays * 0.5;

  if (sleepHours < 6) delta += 2;
  else if (sleepHours > 9) delta += 0.5;
  else if (sleepHours >= 7 && sleepHours <= 8) delta -= 1;

  if (input.smoking === "yes") delta += 3;
  else if (input.smoking === "former") delta += 0.5;

  if (input.alcohol === "daily") delta += 2;
  else if (input.alcohol === "weekly") delta += 1;
  else if (input.alcohol === "never") delta -= 0.5;

  if (input.stress === "high") delta += 2;
  else if (input.stress === "moderate") delta += 0.5;
  else if (input.stress === "low") delta -= 1;

  const biologicalAge = Math.max(18, Math.round(chronologicalAge + delta));
  const ageDifference = biologicalAge - chronologicalAge;
  const status = ageDifference < -1 ? "younger" : ageDifference <= 1 ? "same" : "older";

  return {
    biologicalAge,
    ageDifference,
    delta,
    status,
    differenceLabel: getDifferenceLabel(ageDifference),
    formattedBiologicalAge: `${biologicalAge.toFixed(0)} years`,
    tips: getTips(input),
    summary: `${chronologicalAge.toFixed(0)} chronological years, ${delta.toFixed(1)} year lifestyle delta`,
    recommendation: getRecommendation(status)
  };
}

function getDifferenceLabel(ageDifference: number): string {
  if (ageDifference < -1) return `${Math.abs(ageDifference)} years younger`;
  if (ageDifference <= 1) return "About the same";
  return `${ageDifference} years older`;
}

function getTips(input: BiologicalAgeInput): string[] {
  const tips: string[] = [];
  if (input.bmi >= 25) tips.push("Lose weight to a healthy BMI range (18.5-24.9)");
  if (input.exerciseDays < 3) tips.push("Increase exercise to 3-5 days/week, include cardio + strength");
  if (input.sleepHours < 7) tips.push("Aim for 7-9 hours of quality sleep per night");
  if (input.smoking === "yes") tips.push("Quitting smoking is the single most effective intervention");
  if (input.alcohol === "daily" || input.alcohol === "weekly") tips.push("Reduce alcohol frequency, ideally no more than 2x/week");
  if (input.stress === "high") tips.push("Try mindfulness, deep breathing, or counseling for stress");
  if (input.systolicBp >= 130) tips.push("Control blood pressure: reduce sodium, exercise, maintain weight");
  return tips.length ? tips : ["Keep up your healthy lifestyle!"];
}

function getRecommendation(status: BiologicalAgeResult["status"]): string {
  if (status === "younger") return "Your current inputs produce a younger estimate in the VitalCalc lifestyle model.";
  if (status === "same") return "Your estimate is close to chronological age; small habits can still compound.";
  return "The source model flags lifestyle inputs that may be accelerating the estimate; focus on reversible habits.";
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
