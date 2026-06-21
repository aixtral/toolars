export interface CryptoTaxTransaction {
  price: number;
  quantity: number;
}

export interface CryptoTaxInput {
  buyTransactions: CryptoTaxTransaction[];
  sellTransactions: CryptoTaxTransaction[];
  currentPrice: number;
}

export interface CryptoTaxResult {
  totalBuyAmount: number;
  totalBuyQuantity: number;
  totalSellAmount: number;
  totalSellQuantity: number;
  averageCostBasis: number;
  averageSellPrice: number;
  realizedPnl: number;
  remainingQuantity: number;
  unrealizedPnl: number;
  formattedAverageCostBasis: string;
  formattedAverageSellPrice: string;
  formattedRealizedPnl: string;
  formattedRemainingQuantity: string;
  formattedUnrealizedPnl: string;
  summary: string;
}

export const defaultCryptoTaxScenario: CryptoTaxInput = {
  buyTransactions: [
    { price: 30000, quantity: 0.5 },
    { price: 40000, quantity: 0.25 }
  ],
  sellTransactions: [{ price: 60000, quantity: 0.3 }],
  currentPrice: 50000
};

export function calculateCryptoTax(input: CryptoTaxInput): CryptoTaxResult {
  const buyTransactions = input.buyTransactions.map(cleanTransaction).filter((item) => item.price > 0 && item.quantity > 0);
  const sellTransactions = input.sellTransactions.map(cleanTransaction).filter((item) => item.price > 0 && item.quantity > 0);
  const currentPrice = cleanNumber(input.currentPrice);
  const totalBuyAmount = sumAmount(buyTransactions);
  const totalBuyQuantity = sumQuantity(buyTransactions);
  const totalSellAmount = sumAmount(sellTransactions);
  const totalSellQuantity = sumQuantity(sellTransactions);
  const averageCostBasis = totalBuyQuantity > 0 ? totalBuyAmount / totalBuyQuantity : 0;
  const averageSellPrice = totalSellQuantity > 0 ? totalSellAmount / totalSellQuantity : 0;
  const realizedPnl = totalBuyQuantity > 0 ? totalSellQuantity * (averageSellPrice - averageCostBasis) : 0;
  const remainingQuantity = Math.max(0, totalBuyQuantity - totalSellQuantity);
  const unrealizedPnl = totalBuyQuantity > 0 ? remainingQuantity * (currentPrice - averageCostBasis) : 0;

  return {
    totalBuyAmount,
    totalBuyQuantity,
    totalSellAmount,
    totalSellQuantity,
    averageCostBasis,
    averageSellPrice,
    realizedPnl,
    remainingQuantity,
    unrealizedPnl,
    formattedAverageCostBasis: formatCurrency(averageCostBasis),
    formattedAverageSellPrice: formatCurrency(averageSellPrice),
    formattedRealizedPnl: formatCurrency(realizedPnl),
    formattedRemainingQuantity: formatQuantity(remainingQuantity),
    formattedUnrealizedPnl: formatCurrency(unrealizedPnl),
    summary: `${formatQuantity(totalSellQuantity)} sold against ${formatQuantity(totalBuyQuantity)} bought`
  };
}

function cleanTransaction(transaction: CryptoTaxTransaction): CryptoTaxTransaction {
  return {
    price: cleanNumber(transaction.price),
    quantity: cleanNumber(transaction.quantity)
  };
}

function sumAmount(transactions: CryptoTaxTransaction[]) {
  return transactions.reduce((total, item) => total + item.price * item.quantity, 0);
}

function sumQuantity(transactions: CryptoTaxTransaction[]) {
  return transactions.reduce((total, item) => total + item.quantity, 0);
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency"
  });
}

function formatQuantity(value: number): string {
  return value.toFixed(4);
}
