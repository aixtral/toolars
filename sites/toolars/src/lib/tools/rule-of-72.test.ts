import { describe, expect, it } from "vitest";
import { calculateRuleOf72, defaultRuleOf72Scenario } from "./rule-of-72";

describe("calculateRuleOf72", () => {
  it("calculates the VitalCalc default shortcut and exact doubling time", () => {
    const result = calculateRuleOf72(defaultRuleOf72Scenario);

    expect(result.formattedRuleYears).toBe("10.3 years");
    expect(result.formattedExactYears).toBe("10.24 years");
    expect(result.formattedDoubledValue).toBe("$20,000");
    expect(result.formattedReverseTenYearRate).toBe("7.2%");
    expect(result.schedule[0]).toMatchObject({
      year: 1,
      formattedValue: "$10,700",
      formattedGrowth: "+$700"
    });
  });

  it("flags the shortcut as rough for extreme rates", () => {
    const result = calculateRuleOf72({ annualReturn: 2, principal: 10000 });

    expect(result.accuracyTone).toBe("rough");
    expect(result.formattedRuleYears).toBe("36.0 years");
  });
});
