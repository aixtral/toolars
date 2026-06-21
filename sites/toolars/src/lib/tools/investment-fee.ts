export interface InvestmentFeeInput {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  annualFee: number;
}

export interface InvestmentFeeResult {
  noFeeValue: number;
  withFeeValue: number;
  feeDrag: number;
  totalInvested: number;
  feeAsInvested: number;
  feeAsEndValue: number;
  realAnnualReturn: number;
  formattedNoFeeValue: string;
  formattedWithFeeValue: string;
  formattedFeeDrag: string;
  formattedTotalInvested: string;
  formattedFeeAsInvested: string;
  formattedFeeAsEndValue: string;
  formattedRealAnnualReturn: string;
  feeTone: "low" | "medium" | "high";
  summary: string;
}

export const defaultInvestmentFeeScenario: InvestmentFeeInput = {
  initialInvestment: 10000,
  monthlyContribution: 500,
  annualReturn: 7,
  years: 30,
  annualFee: 1
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

function futureValue(principal: number, monthlyContribution: number, monthlyRate: number, months: number) {
  if (months <= 0) return principal;
  if (monthlyRate === 0) return principal + monthlyContribution * months;

  const growth = Math.pow(1 + monthlyRate, months);
  return principal * growth + monthlyContribution * ((growth - 1) / monthlyRate);
}

export function calculateInvestmentFee(input: InvestmentFeeInput): InvestmentFeeResult {
  const months = Math.max(0, input.years * 12);
  const principal = Math.max(0, input.initialInvestment);
  const monthly = Math.max(0, input.monthlyContribution);
  const annualReturn = input.annualReturn / 100;
  const annualFee = Math.max(0, input.annualFee) / 100;
  const noFeeRate = annualReturn / 12;
  const withFeeRate = (annualReturn - annualFee) / 12;
  const noFeeValue = futureValue(principal, monthly, noFeeRate, months);
  const withFeeValue = futureValue(principal, monthly, withFeeRate, months);
  const feeDrag = Math.max(0, noFeeValue - withFeeValue);
  const totalInvested = principal + monthly * months;
  const feeAsInvested = totalInvested > 0 ? (feeDrag / totalInvested) * 100 : 0;
  const feeAsEndValue = noFeeValue > 0 ? (feeDrag / noFeeValue) * 100 : 0;
  const realAnnualReturn = input.annualReturn - input.annualFee;
  const feeTone = feeAsEndValue >= 20 ? "high" : feeAsEndValue >= 8 ? "medium" : "low";
  const formattedFeeDrag = formatMoney(feeDrag);

  return {
    noFeeValue,
    withFeeValue,
    feeDrag,
    totalInvested,
    feeAsInvested,
    feeAsEndValue,
    realAnnualReturn,
    formattedNoFeeValue: formatMoney(noFeeValue),
    formattedWithFeeValue: formatMoney(withFeeValue),
    formattedFeeDrag,
    formattedTotalInvested: formatMoney(totalInvested),
    formattedFeeAsInvested: `${feeAsInvested.toFixed(1)}%`,
    formattedFeeAsEndValue: `${feeAsEndValue.toFixed(1)}%`,
    formattedRealAnnualReturn: `${realAnnualReturn.toFixed(2)}%`,
    feeTone,
    summary: `${input.annualFee.toFixed(2)}% annual fee may reduce ending value by ${formattedFeeDrag}`
  };
}
