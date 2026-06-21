export interface InflationInput {
  amount: number;
  annualInflationRate: number;
  years: number;
}

export interface InflationResult {
  amount: number;
  annualInflationRate: number;
  years: number;
  futurePurchasingPower: number;
  purchasingPowerLoss: number;
  cumulativeInflation: number;
  breakEvenReturn: number;
  formattedOriginalAmount: string;
  formattedFuturePurchasingPower: string;
  formattedPurchasingPowerLoss: string;
  formattedCumulativeInflation: string;
  formattedBreakEvenReturn: string;
  summary: string;
}

export const defaultInflationScenario: InflationInput = {
  amount: 1000,
  annualInflationRate: 3,
  years: 10
};

export function calculateInflation(input: InflationInput): InflationResult {
  const amount = cleanNumber(input.amount);
  const annualInflationRate = cleanNumber(input.annualInflationRate);
  const years = cleanNumber(input.years);
  const rate = annualInflationRate / 100;
  const inflationFactor = Math.pow(1 + rate, years);
  const futurePurchasingPower = inflationFactor > 0 ? amount / inflationFactor : amount;
  const purchasingPowerLoss = Math.max(0, amount - futurePurchasingPower);
  const cumulativeInflation = (inflationFactor - 1) * 100;
  const formattedOriginalAmount = formatCurrency(amount);
  const formattedFuturePurchasingPower = formatCurrency(futurePurchasingPower);

  return {
    amount,
    annualInflationRate,
    years,
    futurePurchasingPower,
    purchasingPowerLoss,
    cumulativeInflation,
    breakEvenReturn: annualInflationRate,
    formattedOriginalAmount,
    formattedFuturePurchasingPower,
    formattedPurchasingPowerLoss: formatCurrency(purchasingPowerLoss),
    formattedCumulativeInflation: formatPercent(cumulativeInflation),
    formattedBreakEvenReturn: formatPercent(annualInflationRate),
    summary: `${formattedOriginalAmount} keeps ${formattedFuturePurchasingPower} of purchasing power after ${formatNumber(years)} years`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}
