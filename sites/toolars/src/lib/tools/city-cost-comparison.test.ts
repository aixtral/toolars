import { describe, expect, it } from "vitest";
import {
  calculateCityCostComparison,
  defaultCityCostComparisonScenario
} from "./city-cost-comparison";

describe("calculateCityCostComparison", () => {
  it("calculates the VitalCalc default city surplus comparison", () => {
    const result = calculateCityCostComparison(defaultCityCostComparisonScenario);

    expect(result.formattedCityASurplus).toBe("$2,461");
    expect(result.formattedCityBSurplus).toBe("$4,261");
    expect(result.formattedAnnualDifference).toBe("$21,600");
    expect(result.winner).toBe("city-b");
    expect(result.winnerTitle).toBe("City B saves more");
  });

  it("can identify City A as the lower-cost option", () => {
    const result = calculateCityCostComparison({
      ...defaultCityCostComparisonScenario,
      cityA: { rent: 1000, food: 500, transport: 100, other: 250 },
      cityB: { rent: 2500, food: 900, transport: 350, other: 700 }
    });

    expect(result.winner).toBe("city-a");
    expect(result.cityASurplus).toBeGreaterThan(result.cityBSurplus);
  });
});
