import { describe, expect, it } from "vitest";
import {
  calculatePercentage,
  defaultPercentageScenarios,
  type PercentageInput
} from "./percentage-calculator";

describe("calculatePercentage", () => {
  it("calculates the VitalCalc percent-of scenario", () => {
    const result = calculatePercentage(defaultPercentageScenarios.percentOf);

    expect(result.formattedResult).toBe("30");
    expect(result.modeLabel).toBe("Percent of");
    expect(result.directionLabel).toBe("Percent of");
    expect(result.summary).toBe("20% of 150");
    expect(result.formulaNote).toBe("20 / 100 x 150");
  });

  it("calculates the VitalCalc ratio percentage scenario", () => {
    const result = calculatePercentage(defaultPercentageScenarios.ratio);

    expect(result.formattedResult).toBe("50.00%");
    expect(result.modeLabel).toBe("Ratio percentage");
    expect(result.directionLabel).toBe("Ratio");
    expect(result.summary).toBe("45 is 50.00% of 90");
    expect(result.direction).toBe("ratio");
  });

  it("calculates the VitalCalc percentage change scenario", () => {
    const input: PercentageInput = defaultPercentageScenarios.change;
    const result = calculatePercentage(input);

    expect(result.formattedResult).toBe("+30.00%");
    expect(result.modeLabel).toBe("Percentage change");
    expect(result.directionLabel).toBe("Increase");
    expect(result.summary).toBe("Increase from 100 to 130");
    expect(result.direction).toBe("increase");
  });
});
