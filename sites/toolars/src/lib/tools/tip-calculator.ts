export interface TipInput {
  billAmount: number;
  tipPercent: number;
  people: number;
}

export interface TipResult {
  billAmount: number;
  tipPercent: number;
  people: number;
  tipAmount: number;
  totalBill: number;
  perPersonShare: number;
  formattedBillAmount: string;
  formattedTipAmount: string;
  formattedTotalBill: string;
  formattedPerPersonShare: string;
  summary: string;
}

export const defaultTipScenario: TipInput = {
  billAmount: 85.5,
  tipPercent: 18,
  people: 2
};

export function calculateTip(input: TipInput): TipResult {
  const billAmount = cleanAmount(input.billAmount);
  const tipPercent = cleanAmount(input.tipPercent);
  const people = cleanPeople(input.people);
  const tipAmount = billAmount * (tipPercent / 100);
  const totalBill = billAmount + tipAmount;
  const perPersonShare = totalBill / people;

  return {
    billAmount,
    tipPercent,
    people,
    tipAmount,
    totalBill,
    perPersonShare,
    formattedBillAmount: formatCurrency(billAmount),
    formattedTipAmount: formatCurrency(tipAmount),
    formattedTotalBill: formatCurrency(totalBill),
    formattedPerPersonShare: formatCurrency(perPersonShare),
    summary: `${formatPercent(tipPercent)} tip across ${people} ${people === 1 ? "person" : "people"}`
  };
}

function cleanAmount(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function cleanPeople(value: number): number {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.max(1, Math.floor(value));
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(2)}%`;
}
