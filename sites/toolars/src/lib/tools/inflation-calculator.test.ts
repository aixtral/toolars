import { describe, expect, it } from "vitest";
import { calculateInflation, defaultInflationScenario } from "./inflation-calculator";

describe("calculateInflation", () => {
  it("calculates the VitalCalc default purchasing-power scenario", () => {
    const result = calculateInflation(defaultInflationScenario);

    expect(result.formattedFuturePurchasingPower).toBe("$744");
    expect(result.formattedOriginalAmount).toBe("$1,000");
    expect(result.formattedPurchasingPowerLoss).toBe("$256");
    expect(result.formattedCumulativeInflation).toBe("34.4%");
    expect(result.formattedBreakEvenReturn).toBe("3.0%");
    expect(result.summary).toBe("$1,000 keeps $744 of purchasing power after 10 years");
  });

  it("returns full purchasing power when the rate is zero", () => {
    const result = calculateInflation({
      amount: 500,
      annualInflationRate: 0,
      years: 5
    });

    expect(result.formattedFuturePurchasingPower).toBe("$500");
    expect(result.formattedPurchasingPowerLoss).toBe("$0");
    expect(result.formattedCumulativeInflation).toBe("0.0%");
  });
});
