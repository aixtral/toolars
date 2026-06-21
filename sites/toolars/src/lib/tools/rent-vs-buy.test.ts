import { describe, expect, it } from "vitest";
import { calculateRentVsBuy, defaultRentVsBuyScenario } from "./rent-vs-buy";

describe("calculateRentVsBuy", () => {
  it("calculates the VitalCalc default rent versus buy comparison", () => {
    const result = calculateRentVsBuy(defaultRentVsBuyScenario);

    expect(result.recommendation).toBe("rent");
    expect(result.formattedBuyingCost).toBe("$408,479");
    expect(result.formattedRentingCost).toBe("$222,000");
    expect(result.formattedMonthlyMortgage).toBe("$2,487/mo");
    expect(result.formattedOpportunityCost).toBe("$42,000");
  });

  it("can recommend buying when rent is much higher", () => {
    const result = calculateRentVsBuy({
      ...defaultRentVsBuyScenario,
      monthlyRent: 4000
    });

    expect(result.recommendation).toBe("buy");
    expect(result.buyingCost).toBeLessThan(result.rentingCost);
  });
});
