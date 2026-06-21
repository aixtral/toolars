export type BillSplitMode = "equal" | "itemized";

export interface BillSplitInput {
  subtotal: number;
  people: number;
  tipPercent: number;
  taxPercent: number;
  splitMode: BillSplitMode;
}

export interface BillSplitResult {
  subtotal: number;
  people: number;
  tipPercent: number;
  taxPercent: number;
  splitMode: BillSplitMode;
  tipAmount: number;
  taxAmount: number;
  fees: number;
  grandTotal: number;
  equalShare: number;
  formattedSubtotal: string;
  formattedTipAmount: string;
  formattedTaxAmount: string;
  formattedFees: string;
  formattedGrandTotal: string;
  formattedEqualShare: string;
  summary: string;
  guidance: string;
}

export const defaultBillSplitScenario: BillSplitInput = {
  subtotal: 120,
  people: 4,
  tipPercent: 18,
  taxPercent: 8.25,
  splitMode: "equal"
};

export function calculateBillSplit(input: BillSplitInput): BillSplitResult {
  const subtotal = cleanAmount(input.subtotal);
  const people = cleanPeople(input.people);
  const tipPercent = cleanAmount(input.tipPercent);
  const taxPercent = cleanAmount(input.taxPercent);
  const splitMode = input.splitMode === "itemized" ? "itemized" : "equal";
  const tipAmount = subtotal * (tipPercent / 100);
  const taxAmount = subtotal * (taxPercent / 100);
  const fees = tipAmount + taxAmount;
  const grandTotal = subtotal + fees;
  const equalShare = grandTotal / people;

  return {
    subtotal,
    people,
    tipPercent,
    taxPercent,
    splitMode,
    tipAmount,
    taxAmount,
    fees,
    grandTotal,
    equalShare,
    formattedSubtotal: formatCurrency(subtotal),
    formattedTipAmount: formatCurrency(tipAmount),
    formattedTaxAmount: formatCurrency(taxAmount),
    formattedFees: formatCurrency(fees),
    formattedGrandTotal: formatCurrency(grandTotal),
    formattedEqualShare: formatCurrency(equalShare),
    summary: `${people} ${people === 1 ? "person" : "people"}, ${formatPercent(tipPercent)} tip, ${formatPercent(taxPercent)} tax`,
    guidance:
      splitMode === "itemized"
        ? "Use itemized mode when people ordered different items, then agree how to allocate tip and tax."
        : "Equal split works best when everyone agrees to divide the full bill evenly."
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
  return Number.isInteger(value) ? `${value}%` : `${value.toString()}%`;
}
