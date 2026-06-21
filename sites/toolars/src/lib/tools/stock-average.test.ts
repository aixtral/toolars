import { describe, expect, it } from "vitest";
import { calculateStockAverage, defaultStockAverageScenario } from "./stock-average";

describe("calculateStockAverage", () => {
  it("calculates the VitalCalc default stock average cost basis", () => {
    const result = calculateStockAverage(defaultStockAverageScenario);

    expect(result.formattedAveragePrice).toBe("$140.00");
    expect(result.formattedTotalShares).toBe("150");
    expect(result.formattedTotalCost).toBe("$21,000.00");
    expect(result.formattedBreakevenPrice).toBe("$140.00");
    expect(result.summary).toBe("150 shares at $140.00 average");
  });

  it("ignores empty purchase lots", () => {
    const result = calculateStockAverage({
      purchases: [
        { shares: 0, pricePerShare: 100 },
        { shares: 10, pricePerShare: 50 }
      ]
    });

    expect(result.formattedTotalShares).toBe("10");
    expect(result.formattedAveragePrice).toBe("$50.00");
  });
});
