import { describe, expect, it } from "vitest";
import { calculateHomeAffordability, defaultHomeAffordabilityScenario } from "./home-affordability-calculator";

describe("calculateHomeAffordability", () => {
  it("calculates the VitalCalc default affordable home price", () => {
    const result = calculateHomeAffordability(defaultHomeAffordabilityScenario);

    expect(result.formattedMaxPrice).toBe("¥214.6万");
    expect(result.formattedMonthlyPayment).toBe("¥7,000");
    expect(result.formattedLoanAmount).toBe("¥150.2万");
    expect(result.formattedDownPayment).toBe("¥64.4万");
    expect(result.formattedDtiRatio).toBe("35.0%");
    expect(result.statusTone).toBe("healthy");
  });

  it("blocks affordability when existing debt exceeds the DTI limit", () => {
    const result = calculateHomeAffordability({
      ...defaultHomeAffordabilityScenario,
      existingMonthlyDebt: 8000
    });

    expect(result.maxPrice).toBe(0);
    expect(result.formattedMaxPrice).toBe("¥0");
    expect(result.statusTone).toBe("blocked");
  });
});
