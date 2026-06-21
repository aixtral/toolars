export interface SipInput {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
  initialPrincipal: number;
}

export interface SipScheduleRow {
  year: number;
  annualInvested: number;
  totalInvested: number;
  yearEndValue: number;
  formattedAnnualInvested: string;
  formattedTotalInvested: string;
  formattedYearEndValue: string;
}

export interface SipResult {
  totalValue: number;
  totalInvested: number;
  investmentReturns: number;
  returnRate: number;
  formattedTotalValue: string;
  formattedTotalInvested: string;
  formattedInvestmentReturns: string;
  formattedReturnRate: string;
  summary: string;
  schedule: SipScheduleRow[];
}

export const defaultSipScenario: SipInput = {
  monthlyInvestment: 500,
  annualReturn: 8,
  years: 5,
  initialPrincipal: 0
};

export function calculateSipReturns(input: SipInput): SipResult {
  const monthlyInvestment = Math.max(0, input.monthlyInvestment);
  const years = Math.max(1, Math.round(input.years));
  const initialPrincipal = Math.max(0, input.initialPrincipal);
  const monthlyRate = input.annualReturn / 100 / 12;
  const monthCount = years * 12;
  const totalValue =
    monthlyRate === 0
      ? initialPrincipal + monthlyInvestment * monthCount
      : initialPrincipal * Math.pow(1 + monthlyRate, monthCount) +
        monthlyInvestment * ((Math.pow(1 + monthlyRate, monthCount) - 1) / monthlyRate);
  const totalInvested = initialPrincipal + monthlyInvestment * monthCount;
  const investmentReturns = Math.max(0, totalValue - totalInvested);
  const returnRate = totalInvested > 0 ? (investmentReturns / totalInvested) * 100 : 0;
  const schedule: SipScheduleRow[] = [];

  for (let year = 1; year <= years; year += 1) {
    const months = year * 12;
    const yearEndValue =
      monthlyRate === 0
        ? initialPrincipal + monthlyInvestment * months
        : initialPrincipal * Math.pow(1 + monthlyRate, months) +
          monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const totalInvestedByYear = initialPrincipal + monthlyInvestment * months;
    schedule.push({
      year,
      annualInvested: monthlyInvestment * 12,
      totalInvested: totalInvestedByYear,
      yearEndValue,
      formattedAnnualInvested: formatMoney(monthlyInvestment * 12),
      formattedTotalInvested: formatMoney(totalInvestedByYear),
      formattedYearEndValue: formatMoney(yearEndValue)
    });
  }

  return {
    totalValue,
    totalInvested,
    investmentReturns,
    returnRate,
    formattedTotalValue: formatMoney(totalValue),
    formattedTotalInvested: formatMoney(totalInvested),
    formattedInvestmentReturns: formatMoney(investmentReturns),
    formattedReturnRate: `${returnRate.toFixed(1)}%`,
    summary: `${formatMoney(totalValue)} after ${years} years from ${formatMoney(monthlyInvestment)}/month`,
    schedule
  };
}

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
