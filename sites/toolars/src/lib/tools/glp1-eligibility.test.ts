import { describe, expect, it } from "vitest";
import { calculateGlp1Eligibility, defaultGlp1EligibilityScenario } from "./glp1-eligibility";

describe("calculateGlp1Eligibility", () => {
  it("flags BMI >= 27 without comorbidity as a clinician discussion that needs comorbidity context", () => {
    const result = calculateGlp1Eligibility(defaultGlp1EligibilityScenario);

    expect(result.formattedBmi).toBe("29.4");
    expect(result.bmiCategory).toBe("Overweight");
    expect(result.criteriaStatus).toBe("Needs comorbidity context");
    expect(result.isCriteriaMatch).toBe(false);
    expect(result.medicationNote).toBe("Discuss lifestyle care and comorbidity review with a clinician.");
  });

  it("matches the source BMI >= 27 plus comorbidity rule", () => {
    const result = calculateGlp1Eligibility({ heightCm: 170, weightKg: 85, comorbidities: ["hypertension"] });

    expect(result.formattedBmi).toBe("29.4");
    expect(result.criteriaStatus).toBe("Common criteria match");
    expect(result.isCriteriaMatch).toBe(true);
    expect(result.comorbidityLabel).toBe("1 selected");
  });
});
