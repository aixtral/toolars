import { describe, expect, it } from "vitest";
import { calculateDividendReinvestment, defaultDividendReinvestmentScenario } from "./dividend-reinvestment";

describe("calculateDividendReinvestment", () => {
  it("calculates the VitalCalc default DRIP projection", () => {
    const result = calculateDividendReinvestment(defaultDividendReinvestmentScenario);

    expect(result.formattedFinalValue).toBe("$522,226");
    expect(result.formattedTotalDividends).toBe("$204,731");
    expect(result.formattedNoReinvestValue).toBe("$381,246");
    expect(result.formattedReinvestmentAdvantage).toBe("+$140,980");
  });

  it("keeps the reinvestment advantage positive when dividends are reinvested", () => {
    const result = calculateDividendReinvestment(defaultDividendReinvestmentScenario);

    expect(result.reinvestmentAdvantage).toBeGreaterThan(0);
    expect(result.finalValue).toBeGreaterThan(result.noReinvestValue);
  });
});
