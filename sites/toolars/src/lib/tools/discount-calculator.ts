export interface DiscountInput {
  originalPrice: number;
  discountPercent: number;
  taxPercent: number;
}

export interface DiscountResult {
  originalPrice: number;
  discountPercent: number;
  taxPercent: number;
  discountAmount: number;
  priceAfterDiscount: number;
  taxAmount: number;
  finalPrice: number;
  formattedOriginalPrice: string;
  formattedDiscountAmount: string;
  formattedPriceAfterDiscount: string;
  formattedTaxAmount: string;
  formattedFinalPrice: string;
  summary: string;
}

export const defaultDiscountScenario: DiscountInput = {
  originalPrice: 100,
  discountPercent: 20,
  taxPercent: 8
};

export function calculateDiscount(input: DiscountInput): DiscountResult {
  const originalPrice = cleanNumber(input.originalPrice);
  const discountPercent = cleanNumber(input.discountPercent);
  const taxPercent = cleanNumber(input.taxPercent);
  const discountAmount = originalPrice * discountPercent / 100;
  const priceAfterDiscount = Math.max(0, originalPrice - discountAmount);
  const taxAmount = priceAfterDiscount * taxPercent / 100;
  const finalPrice = priceAfterDiscount + taxAmount;
  const formattedOriginalPrice = formatCurrency(originalPrice);

  return {
    originalPrice,
    discountPercent,
    taxPercent,
    discountAmount,
    priceAfterDiscount,
    taxAmount,
    finalPrice,
    formattedOriginalPrice,
    formattedDiscountAmount: formatCurrency(discountAmount),
    formattedPriceAfterDiscount: formatCurrency(priceAfterDiscount),
    formattedTaxAmount: formatCurrency(taxAmount),
    formattedFinalPrice: formatCurrency(finalPrice),
    summary: `${formatPercent(discountPercent)} off ${formattedOriginalPrice}`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value: number): string {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(2)}%`;
}
