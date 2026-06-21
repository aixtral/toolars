export type ThirtyActivity = "walk" | "jog" | "cycle" | "swim";
export type ThirtySex = "male" | "female";

export interface ThirtyThirtyThirtyInput {
  weightKg: number;
  age: number;
  sex: ThirtySex;
  activity: ThirtyActivity;
}

export interface ThirtyActivityReference {
  label: string;
  met: number;
  tip: string;
}

export interface ThirtyThirtyThirtyResult {
  proteinTargetGrams: number;
  caloriesBurned: number;
  met: number;
  activityLabel: string;
  activityTip: string;
  formattedProteinTarget: string;
  formattedCalories: string;
  summary: string;
  proteinOptions: string[];
}

export const thirtyActivityReferences: Record<ThirtyActivity, ThirtyActivityReference> = {
  walk: {
    label: "Brisk walk",
    met: 3.5,
    tip: "Keep the effort conversational but brisk, around a low-intensity aerobic zone."
  },
  jog: {
    label: "Slow jog",
    met: 6,
    tip: "Use a relaxed slow-jog pace and avoid turning the session into a hard workout."
  },
  cycle: {
    label: "Easy cycling",
    met: 4,
    tip: "Easy cadence on flat terrain or a light indoor-bike setting works best for this model."
  },
  swim: {
    label: "Easy swimming",
    met: 5,
    tip: "Swim at a relaxed pace with steady breathing rather than sprint intervals."
  }
};

export const defaultThirtyThirtyThirtyScenario: ThirtyThirtyThirtyInput = {
  weightKg: 70,
  age: 30,
  sex: "male",
  activity: "walk"
};

export const thirtyProteinOptions = [
  "3 whole eggs plus 150g Greek yogurt (about 30g protein)",
  "150g chicken breast (about 31g protein)",
  "3 scoops whey protein with water (about 30g protein)",
  "200g tofu plus 1 cup milk (about 24g protein)",
  "100g salmon plus 1 egg (about 26g protein)"
];

export function calculateThirtyThirtyThirty(input: ThirtyThirtyThirtyInput): ThirtyThirtyThirtyResult {
  const weightKg = cleanNumber(input.weightKg) || defaultThirtyThirtyThirtyScenario.weightKg;
  const reference = thirtyActivityReferences[input.activity] ?? thirtyActivityReferences.walk;
  const proteinTargetGrams = 30;
  const caloriesBurned = Math.round(reference.met * weightKg * 0.5);

  return {
    proteinTargetGrams,
    caloriesBurned,
    met: reference.met,
    activityLabel: reference.label,
    activityTip: reference.tip,
    formattedProteinTarget: `${proteinTargetGrams} g`,
    formattedCalories: `${caloriesBurned} kcal`,
    summary: `${proteinTargetGrams}g protein plus 30 minutes of ${reference.label.toLowerCase()}`,
    proteinOptions: thirtyProteinOptions
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
