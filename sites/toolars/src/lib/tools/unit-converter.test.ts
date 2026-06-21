import { describe, expect, it } from "vitest";
import { calculateUnitConversion, defaultUnitConversionScenario } from "./unit-converter";

describe("calculateUnitConversion", () => {
  it("converts the default VitalCalc length scenario", () => {
    const result = calculateUnitConversion(defaultUnitConversionScenario);

    expect(result.category).toBe("length");
    expect(result.formattedResult).toBe("3.106856");
    expect(result.targetUnitLabel).toBe("mi");
    expect(result.formulaNote).toBe("1 mi = 1.60934 km");
    expect(result.summary).toBe("5 km to mi");
  });

  it("uses temperature base conversion rules", () => {
    const result = calculateUnitConversion({
      category: "temperature",
      value: 100,
      fromUnit: "c",
      toUnit: "f"
    });

    expect(result.formattedResult).toBe("212");
    expect(result.targetUnitLabel).toBe("deg F");
    expect(result.formulaNote).toBe("Formula: deg F = deg C x 9/5 + 32");
  });
});
