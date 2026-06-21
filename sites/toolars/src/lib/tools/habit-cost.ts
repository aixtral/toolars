export interface HabitCostInput {
  costPerOccurrence: number;
  frequencyPerWeek: number;
  years: number;
  annualReturnRate: number;
}

export interface HabitCostResult {
  costPerOccurrence: number;
  frequencyPerWeek: number;
  years: number;
  annualReturnRate: number;
  weeklyCost: number;
  annualCost: number;
  totalSpent: number;
  futureValue: number;
  investmentGain: number;
  opportunityCost: number;
  formattedWeeklyCost: string;
  formattedAnnualCost: string;
  formattedTotalSpent: string;
  formattedFutureValue: string;
  formattedInvestmentGain: string;
  formattedOpportunityCost: string;
  summary: string;
}

export const defaultHabitCostScenario: HabitCostInput = {
  costPerOccurrence: 6,
  frequencyPerWeek: 7,
  years: 10,
  annualReturnRate: 7
};

export function calculateHabitCost(input: HabitCostInput): HabitCostResult {
  const costPerOccurrence = cleanNumber(input.costPerOccurrence);
  const frequencyPerWeek = cleanNumber(input.frequencyPerWeek);
  const years = cleanNumber(input.years);
  const annualReturnRate = cleanNumber(input.annualReturnRate);
  const weeklyCost = costPerOccurrence * frequencyPerWeek;
  const annualCost = weeklyCost * 52;
  const totalSpent = annualCost * years;
  const months = years * 12;
  const monthlyCost = annualCost / 12;
  const monthlyRate = Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;
  const futureValue = monthlyRate > 0 ? monthlyCost * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate : monthlyCost * months;
  const investmentGain = Math.max(0, futureValue - totalSpent);
  const formattedWeeklyCost = formatCurrency(weeklyCost);

  return {
    costPerOccurrence,
    frequencyPerWeek,
    years,
    annualReturnRate,
    weeklyCost,
    annualCost,
    totalSpent,
    futureValue,
    investmentGain,
    opportunityCost: investmentGain,
    formattedWeeklyCost,
    formattedAnnualCost: formatCurrency(annualCost),
    formattedTotalSpent: formatCurrency(totalSpent),
    formattedFutureValue: formatCurrency(futureValue),
    formattedInvestmentGain: formatCurrency(investmentGain),
    formattedOpportunityCost: formatCurrency(investmentGain),
    summary: `${formattedWeeklyCost} weekly habit over ${formatNumber(years)} years`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
