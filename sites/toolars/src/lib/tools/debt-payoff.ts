export type DebtPayoffStrategy = "avalanche" | "snowball";

export interface DebtPayoffInput {
  debtBalance: number;
  annualInterestRate: number;
  monthlyPayment: number;
  strategy: DebtPayoffStrategy;
}

export interface DebtPayoffMonth {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  endingBalance: number;
  formattedPayment: string;
  formattedInterest: string;
  formattedPrincipal: string;
  formattedEndingBalance: string;
}

export interface DebtPayoffResult {
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  isPaymentTooLow: boolean;
  warning?: string;
  formattedTotalInterest: string;
  formattedTotalPaid: string;
  firstMonth: DebtPayoffMonth;
  schedule: DebtPayoffMonth[];
  strategyMessage: string;
  summary: string;
}

export const defaultDebtPayoffScenario: DebtPayoffInput = {
  debtBalance: 10000,
  annualInterestRate: 18,
  monthlyPayment: 300,
  strategy: "avalanche"
};

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const debtBalance = cleanNumber(input.debtBalance);
  const annualInterestRate = cleanNumber(input.annualInterestRate);
  const monthlyPayment = cleanNumber(input.monthlyPayment);
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyInterest = debtBalance * monthlyRate;
  const firstMonth = formatMonth({
    month: 0,
    payment: 0,
    interest: 0,
    principal: 0,
    endingBalance: debtBalance
  });

  if (monthlyPayment <= 0 || (monthlyRate > 0 && monthlyPayment <= monthlyInterest)) {
    return {
      monthsToPayoff: 0,
      totalInterest: 0,
      totalPaid: debtBalance,
      isPaymentTooLow: true,
      warning: "Monthly payment must be greater than monthly interest.",
      formattedTotalInterest: formatCurrency(0),
      formattedTotalPaid: formatCurrency(debtBalance),
      firstMonth,
      schedule: [],
      strategyMessage: strategyMessage(input.strategy),
      summary: "Payment too low to reduce principal"
    };
  }

  let balance = debtBalance;
  let totalInterest = 0;
  let monthsToPayoff = 0;
  const schedule: DebtPayoffMonth[] = [];

  while (balance > 0 && monthsToPayoff < 600) {
    monthsToPayoff += 1;
    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    if (schedule.length < 12) {
      schedule.push(formatMonth({ month: monthsToPayoff, payment: monthlyPayment, interest, principal, endingBalance: balance }));
    }
  }

  return {
    monthsToPayoff,
    totalInterest,
    totalPaid: debtBalance + totalInterest,
    isPaymentTooLow: false,
    formattedTotalInterest: formatCurrency(totalInterest),
    formattedTotalPaid: formatCurrency(debtBalance + totalInterest),
    firstMonth: schedule[0] ?? firstMonth,
    schedule,
    strategyMessage: strategyMessage(input.strategy),
    summary: `${monthsToPayoff} months with ${input.strategy} strategy`
  };
}

function strategyMessage(strategy: DebtPayoffStrategy): string {
  if (strategy === "snowball") return "Snowball method: target smaller balances first for momentum.";
  return "Avalanche method: target highest-interest debt first to reduce total interest.";
}

function formatMonth(row: Pick<DebtPayoffMonth, "month" | "payment" | "interest" | "principal" | "endingBalance">): DebtPayoffMonth {
  return {
    ...row,
    formattedPayment: formatCurrency(row.payment),
    formattedInterest: formatCurrency(row.interest),
    formattedPrincipal: formatCurrency(row.principal),
    formattedEndingBalance: formatCurrency(row.endingBalance)
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}
