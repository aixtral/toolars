import { describe, expect, it } from "vitest";
import { calculateWaistHipRatio, defaultWaistHipScenario } from "./waist-hip-ratio";

describe("calculateWaistHipRatio", () => {
  it("calculates the VitalCalc default waist-to-hip ratio", () => {
    const result = calculateWaistHipRatio(defaultWaistHipScenario);

    expect(result.formattedRatio).toBe("0.84");
    expect(result.category).toBe("Low Risk");
    expect(result.formattedWaist).toBe("80 cm");
    expect(result.formattedHip).toBe("95 cm");
  });

  it("uses female thresholds for a moderate-risk result", () => {
    const result = calculateWaistHipRatio({
      sex: "female",
      waistCm: 78,
      hipCm: 90
    });

    expect(result.formattedRatio).toBe("0.87");
    expect(result.category).toBe("Moderate Risk");
  });
});
