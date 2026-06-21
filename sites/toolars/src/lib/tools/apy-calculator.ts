export interface ApyInput {
  aprPercent: number;
  compoundingPeriods: number;
  principal: number;
}

export interface ApyComparisonRow {
  frequency: string;
  periods: number;
  apyPercent: number;
  formattedApy: string;
}

export interface ApyResult {
  aprPercent: number;
  apyPercent: number;
  yearEndBalance: number;
  interestEarned: number;
  formattedApr: string;
  formattedApy: string;
  formattedYearEndBalance: string;
  formattedInterestEarned: string;
  comparisonRows: ApyComparisonRow[];
  summary: string;
}

export const defaultApyScenario: ApyInput = {
  aprPercent: 5,
  compoundingPeriods: 12,
  principal: 10000
};

export const apyCompoundingOptions = [
  { frequency: "Annually", periods: 1 },
  { frequency: "Semi-annually", periods: 2 },
  { frequency: "Quarterly", periods: 4 },
  { frequency: "Monthly", periods: 12 },
  { frequency: "Weekly", periods: 52 },
  { frequency: "Daily", periods: 365 }
] as const;

export function calculateApy(input: ApyInput): ApyResult {
  const aprPercent = cleanNumber(input.aprPercent);
  const compoundingPeriods = Math.max(1, Math.round(cleanNumber(input.compoundingPeriods)));
  const principal = cleanNumber(input.principal);
  const apyPercent = calculateApyPercent(aprPercent, compoundingPeriods);
  const yearEndBalance = principal * (1 + apyPercent / 100);
  const interestEarned = Math.max(0, yearEndBalance - principal);
  const selectedFrequency = apyCompoundingOptions.find((option) => option.periods === compoundingPeriods)?.frequency.toLowerCase() ?? `${compoundingPeriods}x/year`;

  return {
    aprPercent,
    apyPercent,
    yearEndBalance,
    interestEarned,
    formattedApr: formatPercent(aprPercent),
    formattedApy: formatPercent(apyPercent),
    formattedYearEndBalance: formatCurrency(yearEndBalance),
    formattedInterestEarned: formatCurrency(interestEarned),
    comparisonRows: apyCompoundingOptions.map((option) => ({
      frequency: option.frequency,
      periods: option.periods,
      apyPercent: calculateApyPercent(aprPercent, option.periods),
      formattedApy: formatPercent(calculateApyPercent(aprPercent, option.periods))
    })),
    summary: `${formatPercent(aprPercent)} APR compounded ${selectedFrequency}`
  };
}

function calculateApyPercent(aprPercent: number, periods: number): number {
  const rate = aprPercent / 100;
  return (Math.pow(1 + rate / periods, periods) - 1) * 100;
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
