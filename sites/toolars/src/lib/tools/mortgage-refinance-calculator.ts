export interface MortgageRefinanceInput {
  currentBalance: number;
  currentAnnualInterestRate: number;
  currentRemainingYears: number;
  newAnnualInterestRate: number;
  newLoanTermYears: number;
  refinancingCost: number;
}

export interface MortgageRefinanceResult {
  oldMonthly: number;
  newMonthly: number;
  monthlySavings: number;
  oldInterest: number;
  newInterest: number;
  totalInterestSaved: number;
  oldTotalRepayment: number;
  newTotalRepayment: number;
  breakEvenMonths: number | null;
  breakEvenLabel: string;
  statusTone: "worthwhile" | "long-payback" | "not-worthwhile";
  statusTitle: string;
  guidance: string;
  formattedOldMonthly: string;
  formattedNewMonthly: string;
  formattedMonthlySavings: string;
  formattedTotalInterestSaved: string;
  formattedOldInterest: string;
  formattedNewInterest: string;
  formattedOldTotalRepayment: string;
  formattedNewTotalRepayment: string;
  summary: string;
}

export const defaultMortgageRefinanceScenario: MortgageRefinanceInput = {
  currentBalance: 800000,
  currentAnnualInterestRate: 4.5,
  currentRemainingYears: 30,
  newAnnualInterestRate: 3.5,
  newLoanTermYears: 30,
  refinancingCost: 20000
};

export function calculateMortgageRefinance(input: MortgageRefinanceInput): MortgageRefinanceResult {
  const currentBalance = cleanNumber(input.currentBalance);
  const currentAnnualInterestRate = cleanNumber(input.currentAnnualInterestRate);
  const currentRemainingYears = Math.max(1, cleanNumber(input.currentRemainingYears));
  const newAnnualInterestRate = cleanNumber(input.newAnnualInterestRate);
  const newLoanTermYears = Math.max(1, cleanNumber(input.newLoanTermYears));
  const refinancingCost = cleanNumber(input.refinancingCost);
  const oldMonthly = calculatePayment(currentBalance, currentAnnualInterestRate / 100 / 12, currentRemainingYears * 12);
  const newMonthly = calculatePayment(currentBalance, newAnnualInterestRate / 100 / 12, newLoanTermYears * 12);
  const monthlySavings = oldMonthly - newMonthly;
  const oldInterest = Math.max(0, oldMonthly * currentRemainingYears * 12 - currentBalance);
  const newInterest = Math.max(0, newMonthly * newLoanTermYears * 12 - currentBalance);
  const totalInterestSaved = oldInterest - newInterest - refinancingCost;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(refinancingCost / monthlySavings) : null;
  const statusTone = monthlySavings <= 0 ? "not-worthwhile" : breakEvenMonths && breakEvenMonths > 60 ? "long-payback" : "worthwhile";

  return {
    oldMonthly,
    newMonthly,
    monthlySavings,
    oldInterest,
    newInterest,
    totalInterestSaved,
    oldTotalRepayment: currentBalance + oldInterest,
    newTotalRepayment: currentBalance + newInterest,
    breakEvenMonths,
    breakEvenLabel: breakEvenMonths ? `${breakEvenMonths} months` : "No break-even",
    statusTone,
    statusTitle: statusTone === "worthwhile" ? "Worthwhile" : statusTone === "long-payback" ? "Long payback" : "Not worthwhile",
    guidance: getGuidance(statusTone),
    formattedOldMonthly: formatMoney(oldMonthly),
    formattedNewMonthly: formatMoney(newMonthly),
    formattedMonthlySavings: formatMoney(monthlySavings),
    formattedTotalInterestSaved: formatMoney(totalInterestSaved),
    formattedOldInterest: formatMoney(oldInterest),
    formattedNewInterest: formatMoney(newInterest),
    formattedOldTotalRepayment: formatMoney(currentBalance + oldInterest),
    formattedNewTotalRepayment: formatMoney(currentBalance + newInterest),
    summary:
      monthlySavings > 0
        ? `${formatMoney(monthlySavings)} monthly savings with ${breakEvenMonths} month break-even`
        : "The proposed loan does not lower the monthly payment"
  };
}

function getGuidance(statusTone: MortgageRefinanceResult["statusTone"]) {
  if (statusTone === "worthwhile") return "Short break-even period; compare lender offers and prepayment terms before refinancing.";
  if (statusTone === "long-payback") return "Savings take more than five years to recover costs, so holding period matters.";
  return "The new payment is higher than the current payment under these assumptions.";
}

function calculatePayment(principal: number, monthlyRate: number, paymentCount: number) {
  if (principal <= 0 || paymentCount <= 0) return 0;
  if (monthlyRate === 0) return principal / paymentCount;
  const growthFactor = Math.pow(1 + monthlyRate, paymentCount);
  return (principal * monthlyRate * growthFactor) / (growthFactor - 1);
}

function cleanNumber(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function formatMoney(value: number) {
  const rounded = Math.round(value);
  const prefix = rounded < 0 ? "-$" : "$";
  return `${prefix}${Math.abs(rounded).toLocaleString("en-US")}`;
}
