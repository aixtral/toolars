export type CaffeineDrinkId = "blackCoffee" | "latte" | "blackTea" | "greenTea" | "energyDrink" | "cola";

export interface CaffeineDrink {
  id: CaffeineDrinkId;
  label: string;
  mg: number;
}

export interface CaffeineInput {
  weightKg: number;
  pregnant: boolean;
  selectedDrinkIds: CaffeineDrinkId[];
}

export interface CaffeineResult {
  dailyLimitMg: number;
  consumedMg: number;
  remainingMg: number;
  limitText: string;
  status: string;
  selectedDrinks: CaffeineDrink[];
  formattedDailyLimit: string;
  formattedConsumed: string;
  formattedRemaining: string;
  summary: string;
}

export const caffeineDrinks: CaffeineDrink[] = [
  { id: "blackCoffee", label: "Black coffee", mg: 95 },
  { id: "latte", label: "Latte", mg: 40 },
  { id: "blackTea", label: "Black tea", mg: 30 },
  { id: "greenTea", label: "Green tea", mg: 15 },
  { id: "energyDrink", label: "Energy drink", mg: 80 },
  { id: "cola", label: "Cola", mg: 25 }
];

export const defaultCaffeineScenario: CaffeineInput = {
  weightKg: 70,
  pregnant: false,
  selectedDrinkIds: ["blackCoffee", "energyDrink"]
};

export function calculateCaffeineLimit(input: CaffeineInput): CaffeineResult {
  const weightKg = cleanNumber(input.weightKg);
  let dailyLimitMg = weightKg * 5.7;
  const limitText = input.pregnant ? "Pregnancy safe limit" : "Healthy adult safe limit";

  if (input.pregnant) dailyLimitMg = Math.min(200, dailyLimitMg * 0.5);
  else dailyLimitMg = Math.min(400, dailyLimitMg);

  dailyLimitMg = Math.round(dailyLimitMg);

  const selectedDrinks = caffeineDrinks.filter((drink) => input.selectedDrinkIds.includes(drink.id));
  const consumedMg = selectedDrinks.reduce((total, drink) => total + drink.mg, 0);
  const remainingMg = Math.max(0, dailyLimitMg - consumedMg);
  const status = consumedMg > dailyLimitMg ? "Above safe limit" : "Within safe range";

  return {
    dailyLimitMg,
    consumedMg,
    remainingMg,
    limitText,
    status,
    selectedDrinks,
    formattedDailyLimit: formatMg(dailyLimitMg),
    formattedConsumed: formatMg(consumedMg),
    formattedRemaining: formatMg(remainingMg),
    summary: `${formatMg(consumedMg)} consumed from ${selectedDrinks.length} selected drinks`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatMg(value: number): string {
  return `${Math.round(value).toLocaleString("en-US")} mg`;
}
