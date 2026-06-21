export interface CreditCardAprInput {
  amount: number;
  payments: number;
  monthlyFeeRate: number;
}

export type AprGuidanceTone = "low" | "medium" | "high";

export interface CreditCardAprResult {
  amount: number;
  payments: number;
  monthlyFeeRate: number;
  monthlyFee: number;
  monthlyPrincipal: number;
  monthlyPayment: number;
  totalFees: number;
  totalPayment: number;
  nominalTotalRate: number;
  apr: number;
  guidanceTone: AprGuidanceTone;
  guidance: string;
  formattedApr: string;
  formattedNominalTotalRate: string;
  formattedTotalFees: string;
  formattedTotalPayment: string;
  formattedMonthlyPayment: string;
  summary: string;
}

export const defaultCreditCardAprScenario: CreditCardAprInput = {
  amount: 10000,
  payments: 12,
  monthlyFeeRate: 0.6
};

export function calculateCreditCardApr(input: CreditCardAprInput): CreditCardAprResult {
  const amount = cleanNumber(input.amount);
  const payments = Math.max(1, Math.round(cleanNumber(input.payments)));
  const monthlyFeeRate = cleanNumber(input.monthlyFeeRate);
  const monthlyFee = amount * monthlyFeeRate / 100;
  const totalFees = monthlyFee * payments;
  const monthlyPrincipal = amount / payments;
  const monthlyPayment = monthlyPrincipal + monthlyFee;
  const nominalTotalRate = monthlyFeeRate * payments;
  const monthlyIrr = monthlyFeeRate > 0 ? solveMonthlyIrr(amount, monthlyPayment, payments) : 0;
  const apr = Math.max(0, monthlyIrr * 12 * 100);
  const guidanceTone = getGuidanceTone(apr);
  const formattedApr = formatPercent(apr);

  return {
    amount,
    payments,
    monthlyFeeRate,
    monthlyFee,
    monthlyPrincipal,
    monthlyPayment,
    totalFees,
    totalPayment: amount + totalFees,
    nominalTotalRate,
    apr,
    guidanceTone,
    guidance: getGuidance(guidanceTone),
    formattedApr,
    formattedNominalTotalRate: formatPercent(nominalTotalRate),
    formattedTotalFees: formatCurrency(totalFees),
    formattedTotalPayment: formatCurrency(amount + totalFees),
    formattedMonthlyPayment: formatCurrency(monthlyPayment),
    summary: `${formattedApr} true APR from ${monthlyFeeRate.toFixed(2)}% monthly fee`
  };
}

function solveMonthlyIrr(amount: number, monthlyPayment: number, payments: number): number {
  let rate = 0.01;
  for (let index = 0; index < 50; index += 1) {
    let npv = amount;
    let derivative = 0;
    for (let month = 1; month <= payments; month += 1) {
      const factor = Math.pow(1 + rate, month);
      npv -= monthlyPayment / factor;
      derivative += month * monthlyPayment / Math.pow(1 + rate, month + 1);
    }
    if (Math.abs(derivative) < 1e-9) break;
    const nextRate = rate - npv / derivative;
    if (!Number.isFinite(nextRate) || nextRate <= -0.99) break;
    if (Math.abs(nextRate - rate) < 1e-10) {
      rate = nextRate;
      break;
    }
    rate = nextRate;
  }
  return Number.isFinite(rate) ? rate : 0;
}

function getGuidanceTone(apr: number): AprGuidanceTone {
  if (apr > 15) return "high";
  if (apr > 10) return "medium";
  return "low";
}

function getGuidance(tone: AprGuidanceTone): string {
  if (tone === "high") return "APR exceeds 15%; compare lower-cost financing before using this installment plan.";
  if (tone === "medium") return "APR is 10-15%; evaluate whether the purchase is worth the financing cost.";
  return "APR is below 10%, but the installment should still fit your repayment plan.";
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
