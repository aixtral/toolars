export interface CarLoanInput {
  vehiclePrice: number;
  downPaymentPercent: number;
  annualInterestRate: number;
  termMonths: number;
}

export interface CarLoanResult {
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  trueCost: number;
  interestTone: "low" | "medium" | "high";
  formattedDownPayment: string;
  formattedLoanAmount: string;
  formattedMonthlyPayment: string;
  formattedTotalPayment: string;
  formattedTotalInterest: string;
  formattedTrueCost: string;
  summary: string;
}

export const defaultCarLoanScenario: CarLoanInput = {
  vehiclePrice: 25000,
  downPaymentPercent: 20,
  annualInterestRate: 5,
  termMonths: 60
};

const dollars = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD"
});

function formatMoney(value: number) {
  return dollars.format(Math.round(value));
}

export function calculateCarLoan(input: CarLoanInput): CarLoanResult {
  const vehiclePrice = Math.max(0, input.vehiclePrice);
  const downPaymentPercent = Math.max(0, input.downPaymentPercent) / 100;
  const annualInterestRate = Math.max(0, input.annualInterestRate);
  const termMonths = Math.max(1, input.termMonths);
  const downPayment = vehiclePrice * downPaymentPercent;
  const loanAmount = Math.max(0, vehiclePrice - downPayment);
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / termMonths
      : loanAmount * ((monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1));
  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const trueCost = downPayment + totalPayment;
  const interestShare = loanAmount > 0 ? (totalInterest / loanAmount) * 100 : 0;
  const interestTone = interestShare >= 25 ? "high" : interestShare >= 10 ? "medium" : "low";

  return {
    downPayment,
    loanAmount,
    monthlyPayment,
    totalPayment,
    totalInterest,
    trueCost,
    interestTone,
    formattedDownPayment: formatMoney(downPayment),
    formattedLoanAmount: formatMoney(loanAmount),
    formattedMonthlyPayment: formatMoney(monthlyPayment),
    formattedTotalPayment: formatMoney(totalPayment),
    formattedTotalInterest: formatMoney(totalInterest),
    formattedTrueCost: formatMoney(trueCost),
    summary: `${formatMoney(monthlyPayment)} monthly payment over ${termMonths} months`
  };
}
