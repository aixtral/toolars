export type WalkingSpeed = "slow" | "normal" | "fast" | "very-fast";

export interface StepsToCaloriesInput {
  steps: number;
  weightKg: number;
  heightCm: number;
  speed: WalkingSpeed;
}

export interface StepsToCaloriesResult {
  strideMeters: number;
  distanceKm: number;
  durationHours: number;
  met: number;
  calories: number;
  formattedCalories: string;
  formattedDistance: string;
  formattedRiceEquivalent: string;
  formattedSodaEquivalent: string;
  formattedBurgerEquivalent: string;
  formattedStepsPerRice: string;
  formattedTenThousandStepBurn: string;
  summary: string;
  recommendation: string;
}

export const walkingSpeedOptions = [
  { value: "slow", label: "Slow (3 km/h)" },
  { value: "normal", label: "Normal (5 km/h)" },
  { value: "fast", label: "Fast (6.5 km/h)" },
  { value: "very-fast", label: "Jogging / Running (8 km/h)" }
] as const;

export const defaultStepsToCaloriesScenario: StepsToCaloriesInput = {
  steps: 8000,
  weightKg: 70,
  heightCm: 170,
  speed: "normal"
};

const speedKmhBySpeed: Record<WalkingSpeed, number> = {
  slow: 3,
  normal: 5,
  fast: 6.5,
  "very-fast": 8
};

const metBySpeed: Record<WalkingSpeed, number> = {
  slow: 2.5,
  normal: 3.5,
  fast: 5,
  "very-fast": 8
};

export function calculateStepsToCalories(input: StepsToCaloriesInput): StepsToCaloriesResult {
  const steps = cleanPositive(input.steps);
  const weightKg = cleanPositive(input.weightKg);
  const heightCm = cleanPositive(input.heightCm);
  const speed = input.speed in speedKmhBySpeed ? input.speed : "normal";
  const strideMeters = heightCm ? (heightCm * 0.414) / 100 : 0.7;
  const distanceKm = (steps * strideMeters) / 1000;
  const durationHours = distanceKm / speedKmhBySpeed[speed];
  const met = metBySpeed[speed];
  const calories = met * weightKg * durationHours;
  const caloriesPerStep = steps > 0 ? calories / steps : 0;
  const riceEquivalent = calories / 230;
  const sodaEquivalent = calories / 140;
  const burgerEquivalent = calories / 500;
  const stepsPerRice = caloriesPerStep > 0 ? Math.round(230 / caloriesPerStep) : 0;
  const tenThousandStepBurn = Math.round(caloriesPerStep * 10000);

  return {
    strideMeters,
    distanceKm,
    durationHours,
    met,
    calories,
    formattedCalories: `${Math.round(calories).toLocaleString("en-US")} kcal`,
    formattedDistance: `${distanceKm.toFixed(2)} km`,
    formattedRiceEquivalent: `${riceEquivalent.toFixed(1)} bowls rice`,
    formattedSodaEquivalent: `${sodaEquivalent.toFixed(1)} cans soda`,
    formattedBurgerEquivalent: `${burgerEquivalent.toFixed(1)} burgers`,
    formattedStepsPerRice: `${stepsPerRice.toLocaleString("en-US")} steps`,
    formattedTenThousandStepBurn: `${tenThousandStepBurn.toLocaleString("en-US")} kcal`,
    summary: `${steps.toLocaleString("en-US")} steps at ${speedKmhBySpeed[speed]} km/h`,
    recommendation: "Calories are estimates; terrain, grade, fitness, and device step detection can move the result."
  };
}

function cleanPositive(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
