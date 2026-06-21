export interface CompoundInterestInput {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturnRate: number;
  years: number;
}

export interface CompoundInterestYear {
  year: number;
  balance: number;
  interestEarned: number;
  formattedBalance: string;
  formattedInterestEarned: string;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  interestEarned: number;
  formattedFutureValue: string;
  formattedTotalContributions: string;
  formattedInterestEarned: string;
  firstYear: CompoundInterestYear;
  yearlyRows: CompoundInterestYear[];
  summary: string;
}

export const defaultCompoundInterestScenario: CompoundInterestInput = {
  initialInvestment: 10000,
  monthlyContribution: 500,
  annualReturnRate: 7,
  years: 20
};

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const initialInvestment = cleanNumber(input.initialInvestment);
  const monthlyContribution = cleanNumber(input.monthlyContribution);
  const annualReturnRate = cleanNumber(input.annualReturnRate);
  const years = cleanNumber(input.years);
  const monthCount = Math.round(years * 12);
  const monthlyRate = annualReturnRate / 100 / 12;
  const futureValue = calculateFutureValue(initialInvestment, monthlyContribution, monthlyRate, monthCount);
  const totalContributions = monthlyContribution * monthCount;
  const interestEarned = Math.max(futureValue - initialInvestment - totalContributions, 0);
  const yearlyRows = buildYearlyRows(initialInvestment, monthlyContribution, monthlyRate, years);

  return {
    futureValue,
    totalContributions,
    interestEarned,
    formattedFutureValue: formatCurrency(futureValue),
    formattedTotalContributions: formatCurrency(totalContributions),
    formattedInterestEarned: formatCurrency(interestEarned),
    firstYear: yearlyRows[0] ?? formatYear({ year: 1, balance: initialInvestment, interestEarned: 0 }),
    yearlyRows,
    summary: `${formatCurrency(initialInvestment)} initial + ${formatCurrency(monthlyContribution)}/month for ${years} years`
  };
}

function calculateFutureValue(principal: number, monthlyContribution: number, monthlyRate: number, monthCount: number): number {
  if (monthCount <= 0) return principal;
  if (monthlyRate === 0) return principal + monthlyContribution * monthCount;

  const growthFactor = Math.pow(1 + monthlyRate, monthCount);
  return principal * growthFactor + (monthlyContribution * (growthFactor - 1)) / monthlyRate;
}

function buildYearlyRows(principal: number, monthlyContribution: number, monthlyRate: number, years: number): CompoundInterestYear[] {
  const rowCount = Math.min(Math.round(years), 30);
  const rows: CompoundInterestYear[] = [];
  let previousBalance = principal;

  for (let year = 1; year <= rowCount; year += 1) {
    const monthCount = year * 12;
    const balance = calculateFutureValue(principal, monthlyContribution, monthlyRate, monthCount);
    const interestEarned = Math.max(balance - previousBalance - monthlyContribution * 12, 0);
    rows.push(formatYear({ year, balance, interestEarned }));
    previousBalance = balance;
  }

  return rows;
}

function formatYear(row: Pick<CompoundInterestYear, "year" | "balance" | "interestEarned">): CompoundInterestYear {
  return {
    ...row,
    formattedBalance: formatCurrency(row.balance),
    formattedInterestEarned: formatCurrency(row.interestEarned)
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
