import { describe, expect, it } from "vitest";
import { calculateRoi, defaultRoiScenario } from "./roi-calculator";

describe("calculateRoi", () => {
  it("calculates the VitalCalc default ROI and profit", () => {
    const result = calculateRoi(defaultRoiScenario);

    expect(result.formattedRoi).toBe("50.00%");
    expect(result.formattedProfit).toBe("+$5,000");
    expect(result.formattedCost).toBe("$10,000");
    expect(result.formattedFinalValue).toBe("$15,000");
    expect(result.resultTone).toBe("gain");
  });

  it("labels a negative ROI as a loss", () => {
    const result = calculateRoi({ investmentCost: 10000, finalValue: 8000 });

    expect(result.formattedRoi).toBe("-20.00%");
    expect(result.formattedProfit).toBe("-$2,000");
    expect(result.resultTone).toBe("loss");
  });
});
