import { describe, expect, it } from "vitest";
import { calculateBloodSugar, defaultBloodSugarScenario } from "./blood-sugar-calculator";

describe("calculateBloodSugar", () => {
  it("converts the VitalCalc default fasting glucose value", () => {
    const result = calculateBloodSugar(defaultBloodSugarScenario);

    expect(result.formattedFastingGlucose).toBe("5.5 mmol/L");
    expect(result.formattedA1c).toBe("5.1%");
    expect(result.formattedAverageGlucose).toBe("99 mg/dL");
    expect(result.riskBand).toBe("Normal range");
  });

  it("uses A1C input to assess prediabetes reference range", () => {
    const result = calculateBloodSugar({
      ...defaultBloodSugarScenario,
      inputMode: "a1c",
      a1c: 6
    });

    expect(result.formattedA1c).toBe("6.0%");
    expect(result.formattedAverageGlucose).toBe("125 mg/dL");
    expect(result.riskBand).toBe("Prediabetes range");
  });
});
