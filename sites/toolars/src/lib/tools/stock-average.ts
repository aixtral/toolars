export interface StockPurchaseLot {
  shares: number;
  pricePerShare: number;
}

export interface StockAverageInput {
  purchases: StockPurchaseLot[];
}

export interface StockAverageResult {
  purchases: StockPurchaseLot[];
  totalShares: number;
  totalCost: number;
  averagePrice: number;
  breakevenPrice: number;
  formattedTotalShares: string;
  formattedTotalCost: string;
  formattedAveragePrice: string;
  formattedBreakevenPrice: string;
  summary: string;
}

export const defaultStockAverageScenario: StockAverageInput = {
  purchases: [
    { shares: 100, pricePerShare: 150 },
    { shares: 50, pricePerShare: 120 }
  ]
};

export function calculateStockAverage(input: StockAverageInput): StockAverageResult {
  const purchases = input.purchases.map((lot) => ({
    shares: cleanNumber(lot.shares),
    pricePerShare: cleanNumber(lot.pricePerShare)
  }));
  const totalShares = purchases.reduce((sum, lot) => sum + lot.shares, 0);
  const totalCost = purchases.reduce((sum, lot) => sum + lot.shares * lot.pricePerShare, 0);
  const averagePrice = totalShares > 0 ? totalCost / totalShares : 0;
  const formattedAveragePrice = formatCurrency(averagePrice);
  const formattedTotalShares = formatNumber(totalShares);

  return {
    purchases,
    totalShares,
    totalCost,
    averagePrice,
    breakevenPrice: averagePrice,
    formattedTotalShares,
    formattedTotalCost: formatCurrency(totalCost),
    formattedAveragePrice,
    formattedBreakevenPrice: formattedAveragePrice,
    summary: `${formattedTotalShares} shares at ${formattedAveragePrice} average`
  };
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toLocaleString("en-US") : value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
