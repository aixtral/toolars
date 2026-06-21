import { describe, expect, it } from "vitest";
import { calculateHomaIr, defaultHomaIrScenario } from "./homa-ir";

describe("calculateHomaIr", () => {
  it("calculates the VitalCalc default HOMA-IR value and interpretation", () => {
    const result = calculateHomaIr(defaultHomaIrScenario);

    expect(result.homaIr).toBeCloseTo(2.933333, 5);
    expect(result.formattedHomaIr).toBe("2.93");
    expect(result.level).toBe("Insulin Resistance");
    expect(result.interpretation).toContain("above 2.5");
  });

  it("converts mg/dL glucose and pmol/L insulin before calculating", () => {
    const result = calculateHomaIr({
      fastingGlucose: 99,
      fastingGlucoseUnit: "mgdl",
      fastingInsulin: 83.34,
      fastingInsulinUnit: "pmoll"
    });

    expect(result.fastingGlucoseMmoll).toBeCloseTo(5.4945, 5);
    expect(result.fastingInsulinUuml).toBeCloseTo(12, 2);
    expect(result.level).toBe("Insulin Resistance");
  });
});
