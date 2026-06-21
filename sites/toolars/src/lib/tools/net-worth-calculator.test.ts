import { describe, expect, it } from "vitest";
import { calculateNetWorth, defaultNetWorthScenario } from "./net-worth-calculator";

describe("calculateNetWorth", () => {
  it("calculates the default Toolars net worth scenario using the VitalCalc formula", () => {
    const result = calculateNetWorth(defaultNetWorthScenario);

    expect(result.formattedTotalAssets).toBe("$535,000");
    expect(result.formattedTotalLiabilities).toBe("$320,000");
    expect(result.formattedNetWorth).toBe("$215,000");
    expect(result.debtToAssetRatioPercent).toBe(59.8);
    expect(result.healthTone).toBe("positive");
    expect(result.summary).toBe("$535,000 assets minus $320,000 liabilities");
  });

  it("marks negative net worth when liabilities exceed assets", () => {
    const result = calculateNetWorth({
      homeValue: 0,
      investments: 1000,
      cashSavings: 500,
      vehicleValue: 0,
      otherAssets: 0,
      mortgageBalance: 0,
      carLoanBalance: 0,
      creditCardDebt: 5000,
      studentLoanBalance: 0,
      otherDebts: 0
    });

    expect(result.formattedNetWorth).toBe("-$3,500");
    expect(result.healthTone).toBe("negative");
    expect(result.debtToAssetRatioPercent).toBe(333.3);
  });
});
