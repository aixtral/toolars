import { describe, expect, it } from "vitest";
import { calculateIdealWeight, defaultIdealWeightScenario } from "./ideal-weight-calculator";

describe("calculateIdealWeight", () => {
  it("calculates male ideal weight and +/-10% range with the Devine formula", () => {
    const result = calculateIdealWeight(defaultIdealWeightScenario);

    expect(result.formattedIdealWeight).toBe("70.6 kg");
    expect(result.formattedMinimumWeight).toBe("63.5 kg");
    expect(result.formattedMaximumWeight).toBe("77.7 kg");
    expect(result.formulaLabel).toBe("Devine formula");
  });

  it("uses the female Devine base weight", () => {
    const result = calculateIdealWeight({ sex: "female", heightCm: 165 });

    expect(result.formattedIdealWeight).toBe("57.0 kg");
    expect(result.formattedMinimumWeight).toBe("51.3 kg");
    expect(result.formattedMaximumWeight).toBe("62.7 kg");
  });
});
