export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
  monthlyRetirementExpenses: number;
}

export interface RetirementProjectionYear {
  year: number;
  balance: number;
  contributions: number;
  formattedBalance: string;
  formattedContributions: string;
}

export interface RetirementResult {
  yearsToRetirement: number;
  nestEggNeeded: number;
  projectedSavings: number;
  gapOrSurplus: number;
  isValidTimeline: boolean;
  warning?: string;
  formattedNestEggNeeded: string;
  formattedProjectedSavings: string;
  formattedGapOrSurplus: string;
  firstYear: RetirementProjectionYear;
  yearlyRows: RetirementProjectionYear[];
  summary: string;
}

export const defaultRetirementScenario: RetirementInput = {
  currentAge: 35,
  retirementAge: 65,
  currentSavings: 50000,
  monthlyContribution: 1000,
  annualReturnRate: 7,
  monthlyRetirementExpenses: 4000
};

export function calculateRetirementPlan(input: RetirementInput): RetirementResult {
  const currentAge = cleanNumber(input.currentAge);
  const retirementAge = cleanNumber(input.retirementAge);
  const currentSavings = cleanNumber(input.currentSavings);
  const monthlyContribution = cleanNumber(input.monthlyContribution);
  const annualReturnRate = cleanNumber(input.annualReturnRate);
  const monthlyRetirementExpenses = cleanNumber(input.monthlyRetirementExpenses);
  const yearsToRetirement = retirementAge - currentAge;
  const nestEggNeeded = monthlyRetirementExpenses * 12 * 25;
  const invalidFirstYear = formatYear({ year: 1, balance: currentSavings, contributions: currentSavings });

  if (yearsToRetirement <= 0) {
    return {
      yearsToRetirement,
      nestEggNeeded,
      projectedSavings: currentSavings,
      gapOrSurplus: currentSavings - nestEggNeeded,
      isValidTimeline: false,
      warning: "Retirement age must be greater than current age.",
      formattedNestEggNeeded: formatCurrency(nestEggNeeded),
      formattedProjectedSavings: formatCurrency(currentSavings),
      formattedGapOrSurplus: formatSignedCurrency(currentSavings - nestEggNeeded),
      firstYear: invalidFirstYear,
      yearlyRows: [],
      summary: "Invalid retirement timeline"
    };
  }

  const monthlyRate = annualReturnRate / 100 / 12;
  const monthCount = yearsToRetirement * 12;
  const projectedSavings = projectFutureValue(currentSavings, monthlyContribution, monthlyRate, monthCount);
  const gapOrSurplus = projectedSavings - nestEggNeeded;
  const yearlyRows = buildYearlyRows(currentSavings, monthlyContribution, monthlyRate, yearsToRetirement);

  return {
    yearsToRetirement,
    nestEggNeeded,
    projectedSavings,
    gapOrSurplus,
    isValidTimeline: true,
    formattedNestEggNeeded: formatCurrency(nestEggNeeded),
    formattedProjectedSavings: formatCurrency(projectedSavings),
    formattedGapOrSurplus: formatSignedCurrency(gapOrSurplus),
    firstYear: yearlyRows[0] ?? invalidFirstYear,
    yearlyRows,
    summary: `${yearsToRetirement} years to retirement using the 4% rule`
  };
}

function projectFutureValue(principal: number, monthlyContribution: number, monthlyRate: number, monthCount: number): number {
  if (monthCount <= 0) return principal;
  if (monthlyRate === 0) return principal + monthlyContribution * monthCount;

  const growthFactor = Math.pow(1 + monthlyRate, monthCount);
  return principal * growthFactor + (monthlyContribution * (growthFactor - 1)) / monthlyRate;
}

function buildYearlyRows(principal: number, monthlyContribution: number, monthlyRate: number, years: number): RetirementProjectionYear[] {
  const rows: RetirementProjectionYear[] = [];
  const rowCount = Math.min(Math.round(years), 35);
  let balance = principal;
  let contributions = principal;

  for (let year = 1; year <= rowCount; year += 1) {
    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributions += monthlyContribution;
    }
    rows.push(formatYear({ year, balance, contributions }));
  }

  return rows;
}

function formatYear(row: Pick<RetirementProjectionYear, "year" | "balance" | "contributions">): RetirementProjectionYear {
  return {
    ...row,
    formattedBalance: formatCurrency(row.balance),
    formattedContributions: formatCurrency(row.contributions)
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatSignedCurrency(value: number): string {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}${formatCurrency(Math.abs(value))}`;
}
