import { describe, expect, it } from "vitest";
import { calculateCurrencyConversion, defaultCurrencyScenario } from "./currency-converter";

describe("calculateCurrencyConversion", () => {
  it("calculates the VitalCalc default manual exchange-rate conversion", () => {
    const result = calculateCurrencyConversion(defaultCurrencyScenario);

    expect(result.formattedSourceAmount).toBe("$1,000.00 USD");
    expect(result.formattedConvertedAmount).toBe("€850.00 EUR");
    expect(result.rateDisplay).toBe("1 USD = 0.85 EUR");
    expect(result.summary).toBe("$1,000.00 USD to €850.00 EUR");
  });

  it("normalizes invalid exchange rates to zero converted amount", () => {
    const result = calculateCurrencyConversion({
      amount: 100,
      fromCurrency: "USD",
      toCurrency: "JPY",
      exchangeRate: -1
    });

    expect(result.convertedAmount).toBe(0);
    expect(result.formattedConvertedAmount).toBe("¥0.00 JPY");
  });
});
