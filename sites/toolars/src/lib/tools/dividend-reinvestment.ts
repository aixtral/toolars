export interface DividendReinvestmentInput {
  initialInvestment: number;
  dividendYield: number;
  stockGrowthRate: number;
  holdingYears: number;
  reinvestmentFrequency: number;
  taxRate: number;
}

export interface DividendReinvestmentResult {
  finalValue: number;
  totalDividends: number;
  noReinvestValue: number;
  reinvestmentAdvantage: number;
  periods: number;
  formattedFinalValue: string;
  formattedTotalDividends: string;
  formattedNoReinvestValue: string;
  formattedReinvestmentAdvantage: string;
  summary: string;
}

export const defaultDividendReinvestmentScenario: DividendReinvestmentInput = {
  initialInvestment: 100000,
  dividendYield: 4,
  stockGrowthRate: 5,
  holdingYears: 20,
  reinvestmentFrequency: 4,
  taxRate: 15
};

export function calculateDividendReinvestment(input: DividendReinvestmentInput): DividendReinvestmentResult {
  const initialInvestment = Math.max(0, input.initialInvestment);
  const dividendYield = Math.max(0, input.dividendYield) / 100;
  const stockGrowthRate = input.stockGrowthRate / 100;
  const holdingYears = Math.max(1, input.holdingYears);
  const reinvestmentFrequency = Math.max(1, Math.round(input.reinvestmentFrequency));
  const taxRate = Math.min(Math.max(input.taxRate, 0), 100) / 100;
  const periods = holdingYears * reinvestmentFrequency;
  const periodGrowth = Math.pow(1 + stockGrowthRate, 1 / reinvestmentFrequency) - 1;
  const periodDividendRate = dividendYield / reinvestmentFrequency;
  let reinvestedValue = initialInvestment;
  let totalDividends = 0;
  let noReinvestShares = initialInvestment;
  let noReinvestCash = 0;

  for (let period = 0; period < periods; period += 1) {
    reinvestedValue *= 1 + periodGrowth;
    const dividend = reinvestedValue * periodDividendRate;
    totalDividends += dividend;
    reinvestedValue += dividend * (1 - taxRate);

    noReinvestShares *= 1 + periodGrowth;
    noReinvestCash += noReinvestShares * periodDividendRate * (1 - taxRate);
  }

  const noReinvestValue = noReinvestShares + noReinvestCash;
  const reinvestmentAdvantage = reinvestedValue - noReinvestValue;

  return {
    finalValue: reinvestedValue,
    totalDividends,
    noReinvestValue,
    reinvestmentAdvantage,
    periods,
    formattedFinalValue: formatMoney(reinvestedValue),
    formattedTotalDividends: formatMoney(totalDividends),
    formattedNoReinvestValue: formatMoney(noReinvestValue),
    formattedReinvestmentAdvantage: `${reinvestmentAdvantage >= 0 ? "+" : "-"}${formatMoney(Math.abs(reinvestmentAdvantage))}`,
    summary: `${formatMoney(reinvestedValue)} after ${holdingYears} years with dividends reinvested`
  };
}

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
