export type DrinkCaloriesId =
  | "milktea"
  | "milktea-half"
  | "americano"
  | "latte"
  | "cappuccino"
  | "frappuccino"
  | "cola"
  | "juice"
  | "beer"
  | "wine"
  | "vodka"
  | "soda"
  | "green-tea"
  | "coconut"
  | "custom";

export interface DrinkCaloriesReference {
  id: DrinkCaloriesId;
  label: string;
  caloriesPer100Ml: number;
  sugarPer100Ml: number;
}

export interface DrinkCaloriesInput {
  drinkId: DrinkCaloriesId;
  servingSizeMl: number;
  cups: number;
  customCaloriesPer100Ml: number;
  customSugarPer100Ml?: number;
}

export interface DrinkCaloriesResult {
  totalCalories: number;
  totalSugarGrams: number;
  stepsToBurn: number;
  dailyPercent: number;
  perCupDescription: string;
  tip: string;
  formattedTotalCalories: string;
  formattedSugar: string;
  formattedSteps: string;
  formattedDailyPercent: string;
  summary: string;
}

export const drinkCaloriesReferences: DrinkCaloriesReference[] = [
  { id: "milktea", label: "Boba Tea (full sugar)", caloriesPer100Ml: 65, sugarPer100Ml: 10 },
  { id: "milktea-half", label: "Boba Tea (half sugar)", caloriesPer100Ml: 45, sugarPer100Ml: 5 },
  { id: "americano", label: "Americano", caloriesPer100Ml: 2, sugarPer100Ml: 0 },
  { id: "latte", label: "Latte", caloriesPer100Ml: 35, sugarPer100Ml: 3 },
  { id: "cappuccino", label: "Cappuccino", caloriesPer100Ml: 30, sugarPer100Ml: 2.5 },
  { id: "frappuccino", label: "Frappuccino", caloriesPer100Ml: 85, sugarPer100Ml: 12 },
  { id: "cola", label: "Cola", caloriesPer100Ml: 42, sugarPer100Ml: 10.6 },
  { id: "juice", label: "Orange Juice", caloriesPer100Ml: 45, sugarPer100Ml: 10 },
  { id: "beer", label: "Beer", caloriesPer100Ml: 43, sugarPer100Ml: 0 },
  { id: "wine", label: "Red Wine", caloriesPer100Ml: 85, sugarPer100Ml: 1 },
  { id: "vodka", label: "Vodka (neat)", caloriesPer100Ml: 231, sugarPer100Ml: 0 },
  { id: "soda", label: "Soda Water", caloriesPer100Ml: 0, sugarPer100Ml: 0 },
  { id: "green-tea", label: "Green Tea (unsweetened)", caloriesPer100Ml: 1, sugarPer100Ml: 0 },
  { id: "coconut", label: "Coconut Water", caloriesPer100Ml: 19, sugarPer100Ml: 2.6 },
  { id: "custom", label: "Custom", caloriesPer100Ml: 0, sugarPer100Ml: 0 }
];

export const defaultDrinkCaloriesScenario: DrinkCaloriesInput = {
  drinkId: "milktea",
  servingSizeMl: 500,
  cups: 1,
  customCaloriesPer100Ml: 40,
  customSugarPer100Ml: 0
};

export function calculateDrinkCalories(input: DrinkCaloriesInput): DrinkCaloriesResult {
  const reference = getDrinkCaloriesReference(input.drinkId);
  const servingSizeMl = cleanNumber(input.servingSizeMl) || 500;
  const cups = cleanNumber(input.cups) || 1;
  const caloriesPer100Ml = input.drinkId === "custom" ? cleanNumber(input.customCaloriesPer100Ml) : reference.caloriesPer100Ml;
  const sugarPer100Ml = input.drinkId === "custom" ? cleanNumber(input.customSugarPer100Ml ?? 0) : reference.sugarPer100Ml;
  const totalCalories = Math.round((caloriesPer100Ml * servingSizeMl * cups) / 100);
  const totalSugarGrams = Math.round((sugarPer100Ml * servingSizeMl * cups) / 10) / 10;
  const stepsToBurn = totalCalories > 0 ? Math.round(totalCalories / 0.05) : 0;
  const dailyPercent = Math.min(100, (totalCalories / 2000) * 100);
  const formattedTotalCalories = `${totalCalories.toLocaleString("en-US")} kcal`;
  const formattedSugar = `${formatOneDecimal(totalSugarGrams)} g`;

  return {
    totalCalories,
    totalSugarGrams,
    stepsToBurn,
    dailyPercent,
    perCupDescription: `${reference.label} - ${servingSizeMl}ml x ${formatNumber(cups)}`,
    tip: getDrinkTip(totalCalories, totalSugarGrams),
    formattedTotalCalories,
    formattedSugar,
    formattedSteps: totalCalories > 0 ? stepsToBurn.toLocaleString("en-US") : "--",
    formattedDailyPercent: `${dailyPercent.toFixed(1)}%`,
    summary: `${formattedTotalCalories} from ${formatNumber(cups)} cup${cups === 1 ? "" : "s"}`
  };
}

export function getDrinkCaloriesReference(drinkId: DrinkCaloriesId): DrinkCaloriesReference {
  return drinkCaloriesReferences.find((drink) => drink.id === drinkId) ?? drinkCaloriesReferences[0];
}

function getDrinkTip(totalCalories: number, totalSugarGrams: number) {
  if (totalSugarGrams > 25) return "Sugar exceeds WHO daily recommendation (25g). Consider reducing intake.";
  if (totalCalories > 500) return `Today's drink calories are high, about ${(totalCalories / 2000 * 100).toFixed(0)}% of daily recommendation.`;
  return "Calories are within a healthy range. Keep it up!";
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatOneDecimal(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
