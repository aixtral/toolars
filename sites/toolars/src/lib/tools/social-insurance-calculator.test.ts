import { describe, expect, it } from "vitest";
import {
  calculateSocialInsurance,
  defaultSocialInsuranceScenario
} from "./social-insurance-calculator";

describe("calculateSocialInsurance", () => {
  it("calculates the VitalCalc default five-insurance and housing-fund estimate", () => {
    const result = calculateSocialInsurance(defaultSocialInsuranceScenario);

    expect(result.formattedNetSalary).toBe("¥1.12万");
    expect(result.formattedEmployeeContribution).toBe("¥3,375");
    expect(result.formattedEmployerContribution).toBe("¥5,670");
    expect(result.formattedTax).toBe("¥453");
    expect(result.formattedHousingFundDeposit).toBe("¥3,600");
  });

  it("clamps the contribution base to configured min and max limits", () => {
    const result = calculateSocialInsurance({
      ...defaultSocialInsuranceScenario,
      salary: 50000,
      baseMin: 8000,
      baseMax: 30000
    });

    expect(result.contributionBase).toBe(30000);
    expect(result.formattedContributionBase).toBe("¥3.00万");
  });
});
