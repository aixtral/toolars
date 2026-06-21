import { describe, expect, it } from "vitest";
import { calculateDti, defaultDtiScenario } from "./dti-calculator";

describe("calculateDti", () => {
  it("calculates the default VitalCalc DTI ratios", () => {
    const result = calculateDti(defaultDtiScenario);

    expect(result.frontEndDtiPercent).toBe(37.5);
    expect(result.backEndDtiPercent).toBe(47.5);
    expect(result.formattedTotalMonthlyPayments).toBe("$3,800");
    expect(result.formattedDisposableIncome).toBe("$4,200");
    expect(result.qualifyMessage).toBe("DTI too high — reduce debt before applying");
    expect(result.summary).toBe("37.5% front-end / 47.5% back-end DTI");
  });

  it("returns zero ratios when monthly income is missing", () => {
    const result = calculateDti({
      grossMonthlyIncome: 0,
      mortgagePayment: 2500,
      otherMonthlyDebt: 800,
      housingAddOns: 500
    });

    expect(result.frontEndDtiPercent).toBe(0);
    expect(result.backEndDtiPercent).toBe(0);
    expect(result.healthTone).toBe("missing");
  });
});
