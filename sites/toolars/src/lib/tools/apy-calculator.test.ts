import { describe, expect, it } from "vitest";
import { calculateApy, defaultApyScenario } from "./apy-calculator";

describe("calculateApy", () => {
  it("calculates the default VitalCalc monthly-compounded APY", () => {
    const result = calculateApy(defaultApyScenario);

    expect(result.formattedApr).toBe("5.00%");
    expect(result.formattedApy).toBe("5.12%");
    expect(result.formattedYearEndBalance).toBe("$10,512");
    expect(result.formattedInterestEarned).toBe("$512");
    expect(result.comparisonRows.find((row) => row.frequency === "Daily")?.formattedApy).toBe("5.13%");
    expect(result.summary).toBe("5.00% APR compounded monthly");
  });

  it("matches APR when compounding annually", () => {
    const result = calculateApy({
      aprPercent: 4,
      compoundingPeriods: 1,
      principal: 1000
    });

    expect(result.formattedApy).toBe("4.00%");
    expect(result.formattedInterestEarned).toBe("$40");
  });
});
