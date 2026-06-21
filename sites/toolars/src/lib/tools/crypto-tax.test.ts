import { describe, expect, it } from "vitest";
import { calculateCryptoTax, defaultCryptoTaxScenario } from "./crypto-tax";

describe("calculateCryptoTax", () => {
  it("calculates the VitalCalc average cost basis PnL model", () => {
    const result = calculateCryptoTax(defaultCryptoTaxScenario);

    expect(result.formattedAverageCostBasis).toBe("$33,333.33");
    expect(result.formattedRealizedPnl).toBe("$8,000.00");
    expect(result.formattedUnrealizedPnl).toBe("$7,500.00");
    expect(result.formattedRemainingQuantity).toBe("0.4500");
    expect(result.summary).toContain("0.3000 sold");
  });

  it("returns zero PnL when there are no buy transactions", () => {
    const result = calculateCryptoTax({
      buyTransactions: [],
      sellTransactions: [{ price: 50000, quantity: 0.2 }],
      currentPrice: 52000
    });

    expect(result.averageCostBasis).toBe(0);
    expect(result.realizedPnl).toBe(0);
    expect(result.unrealizedPnl).toBe(0);
  });
});
