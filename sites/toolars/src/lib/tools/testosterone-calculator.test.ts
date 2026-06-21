import { describe, expect, it } from "vitest";
import { calculateTestosterone, defaultTestosteroneScenario } from "./testosterone-calculator";

describe("calculateTestosterone", () => {
  it("preserves the VitalCalc source estimate and clamps negative free testosterone to zero", () => {
    const result = calculateTestosterone(defaultTestosteroneScenario);

    expect(result.totalTestosteroneNgDl).toBe(500);
    expect(result.freeTestosteroneNgDl).toBe(0);
    expect(result.formattedFreeTestosterone).toBe("0.0 ng/dL");
    expect(result.formattedBioavailableTestosterone).toBe("150.0 ng/dL");
    expect(result.formattedFreePercent).toBe("0.00%");
    expect(result.status).toBe("Low");
  });

  it("converts nmol/L total testosterone to ng/dL before calculation", () => {
    const result = calculateTestosterone({
      ...defaultTestosteroneScenario,
      totalTestosterone: 17.34,
      totalUnit: "nmoll"
    });

    expect(result.totalTestosteroneNgDl).toBeCloseTo(500, 0);
    expect(result.summary).toContain("500.1 ng/dL");
  });
});
