export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CNY" | "CAD" | "AUD" | "CHF" | "HKD" | "SGD" | "INR" | "KRW";

export interface CurrencyInput {
  amount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  exchangeRate: number;
}

export interface CurrencyResult {
  amount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  exchangeRate: number;
  convertedAmount: number;
  formattedSourceAmount: string;
  formattedConvertedAmount: string;
  rateDisplay: string;
  summary: string;
}

export const currencyOptions: Array<{ code: CurrencyCode; name: string; symbol: string }> = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" }
];

export const defaultCurrencyScenario: CurrencyInput = {
  amount: 1000,
  fromCurrency: "USD",
  toCurrency: "EUR",
  exchangeRate: 0.85
};

export function calculateCurrencyConversion(input: CurrencyInput): CurrencyResult {
  const amount = cleanNumber(input.amount);
  const exchangeRate = cleanNumber(input.exchangeRate);
  const convertedAmount = amount * exchangeRate;
  const formattedSourceAmount = formatCurrencyAmount(amount, input.fromCurrency);
  const formattedConvertedAmount = formatCurrencyAmount(convertedAmount, input.toCurrency);
  const rateDisplay = `1 ${input.fromCurrency} = ${formatRate(exchangeRate)} ${input.toCurrency}`;

  return {
    amount,
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    exchangeRate,
    convertedAmount,
    formattedSourceAmount,
    formattedConvertedAmount,
    rateDisplay,
    summary: `${formattedSourceAmount} to ${formattedConvertedAmount}`
  };
}

export function getCurrencySymbol(code: CurrencyCode): string {
  return currencyOptions.find((option) => option.code === code)?.symbol ?? code;
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function formatCurrencyAmount(value: number, code: CurrencyCode): string {
  return `${getCurrencySymbol(code)}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${code}`;
}

function formatRate(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}
