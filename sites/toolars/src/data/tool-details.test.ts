import { describe, expect, it } from "vitest";
import { getAllToolDetails, getToolDetailBySlug, labDetailSlugs, vitalCalcDetailSlugs } from "./tool-details";

describe("AI Developer Lab tool details", () => {
  it("defines public detail data for the designed Toolars and lab tools", () => {
    expect(labDetailSlugs).toEqual([
      "pdf-toolkit",
      "json-repair",
      "prompt-injection-scanner",
      "llm-cost-calculator",
      "mcp-server-builder"
    ]);

    const collectionBySlug = new Map([
      ["pdf-toolkit", "pdf-ops-kit"],
      ["json-repair", "ai-developer-lab"],
      ["prompt-injection-scanner", "ai-developer-lab"],
      ["llm-cost-calculator", "ai-developer-lab"],
      ["mcp-server-builder", "ai-developer-lab"]
    ]);

    for (const slug of labDetailSlugs) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.workspaceHref).toBe(`/tools/${slug}`);
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.includedCollections.map((item) => item.slug)).toContain(collectionBySlug.get(slug));
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(3);
      expect(detail?.recommendedWorkflow).toBeDefined();
    }
  });

  it("keeps detail-specific trust sections and workflow handoffs", () => {
    const pdfDetail = getToolDetailBySlug("pdf-toolkit");
    const jsonDetail = getToolDetailBySlug("json-repair");
    const promptDetail = getToolDetailBySlug("prompt-injection-scanner");
    const costDetail = getToolDetailBySlug("llm-cost-calculator");
    const mcpDetail = getToolDetailBySlug("mcp-server-builder");

    expect(pdfDetail?.trustSection.title).toBe("PDF processing model");
    expect(pdfDetail?.recommendedWorkflow?.href).toBe("/workflows/pdf-summary");
    expect(jsonDetail?.trustSection.title).toBe("Local repair model");
    expect(jsonDetail?.recommendedWorkflow?.href).toBe("/workflows/ai-prompt-hardening");
    expect(promptDetail?.trustSection.title).toBe("Privacy and review model");
    expect(promptDetail?.recommendedWorkflow?.href).toBe("/workflows/ai-prompt-hardening");
    expect(costDetail?.trustSection.title).toBe("Pricing and limits");
    expect(costDetail?.recommendedWorkflow?.href).toBe("/workflows/llm-cost-review");
    expect(mcpDetail?.trustSection.title).toBe("Security and launch review");
    expect(mcpDetail?.recommendedWorkflow?.href).toBe("/workflows/mcp-tool-launch");
  });

  it("defines public detail data for featured VitalCalc tools", () => {
    const detailSlugs = getAllToolDetails().map((detail) => detail.tool.slug);

    expect(detailSlugs).toEqual(
      expect.arrayContaining(["mortgage-calculator", "bmi-calculator", "loan-calculator"])
    );

    for (const slug of ["mortgage-calculator", "bmi-calculator", "loan-calculator"]) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.tool.pricing).toBe("free");
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the second VitalCalc batch", () => {
    const secondBatch = [
      "retirement-calculator",
      "debt-payoff",
      "roi-calculator",
      "tdee-calculator",
      "body-fat-calculator",
      "protein-calculator"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(secondBatch));

    for (const slug of secondBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines public detail data for VitalCalc tools referenced by existing related cards", () => {
    const relatedCoverage = ["compound-interest", "bmr-calculator", "water-intake"];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(relatedCoverage));

    for (const slug of relatedCoverage) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the third VitalCalc batch", () => {
    const thirdBatch = [
      "income-tax",
      "fire-calculator",
      "discount-calculator",
      "heart-rate-zone",
      "sleep-calculator",
      "ideal-weight-calculator"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(thirdBatch));

    for (const slug of thirdBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the fourth VitalCalc batch", () => {
    const fourthBatch = [
      "car-loan",
      "rent-vs-buy",
      "home-affordability-calculator",
      "waist-hip-ratio",
      "blood-pressure",
      "child-growth"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(fourthBatch));

    for (const slug of fourthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the fifth VitalCalc batch", () => {
    const fifthBatch = [
      "student-loan-calculator",
      "apy-calculator",
      "rule-of-72",
      "calorie-deficit",
      "macro-calculator",
      "lean-body-mass"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(fifthBatch));

    for (const slug of fifthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the sixth VitalCalc batch", () => {
    const sixthBatch = [
      "emergency-fund",
      "savings-goal",
      "dti-calculator",
      "net-worth-calculator",
      "budget-rule",
      "side-income-tax"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(sixthBatch));

    for (const slug of sixthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the seventh VitalCalc batch", () => {
    const seventhBatch = [
      "intermittent-fasting",
      "creatine-calculator",
      "vo2-max",
      "biological-age",
      "glycemic-load",
      "30-30-30-method"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(seventhBatch));

    for (const slug of seventhBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the eighth VitalCalc batch", () => {
    const eighthBatch = [
      "tip-calculator",
      "bill-split-calculator",
      "unit-converter",
      "hourly-to-salary",
      "inflation-calculator",
      "habit-cost"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(eighthBatch));

    for (const slug of eighthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the ninth VitalCalc batch", () => {
    const ninthBatch = [
      "caffeine-calculator",
      "alcohol-metabolism",
      "blood-sugar-calculator",
      "drink-calories",
      "fiber-intake",
      "steps-to-calories"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(ninthBatch));

    for (const slug of ninthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the tenth VitalCalc batch", () => {
    const tenthBatch = [
      "currency-converter",
      "percentage-calculator",
      "stock-average",
      "credit-card-apr",
      "investment-fee",
      "investment-goal"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(tenthBatch));

    for (const slug of tenthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the eleventh VitalCalc batch", () => {
    const eleventhBatch = [
      "credit-score-simulator",
      "crypto-tax",
      "freelance-rate",
      "subscription-audit",
      "savings-challenge",
      "city-cost-comparison"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(eleventhBatch));

    for (const slug of eleventhBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the twelfth VitalCalc batch", () => {
    const twelfthBatch = [
      "social-insurance-calculator",
      "dividend-reinvestment",
      "mortgage-refinance-calculator",
      "coast-fire",
      "sip-calculator",
      "smoke-free"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(twelfthBatch));

    for (const slug of twelfthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the thirteenth VitalCalc screening batch", () => {
    const thirteenthBatch = [
      "adhd-screener",
      "burnout-assessment",
      "gad7-anxiety",
      "phq9-depression",
      "pss10-stress",
      "glp1-eligibility"
    ];

    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(thirteenthBatch));

    for (const slug of thirteenthBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("defines shared public detail data for the final VitalCalc source batch", () => {
    const finalBatch = [
      "body-recomposition",
      "glp1-nutrition",
      "homa-ir",
      "one-rep-max",
      "ovulation-calculator",
      "pregnancy-due-date",
      "running-pace",
      "testosterone-calculator"
    ];

    expect(vitalCalcDetailSlugs).toHaveLength(86);
    expect(vitalCalcDetailSlugs).toEqual(expect.arrayContaining(finalBatch));

    for (const slug of finalBatch) {
      const detail = getToolDetailBySlug(slug);

      expect(detail?.tool.slug).toBe(slug);
      expect(detail?.tool.source).toBe("vitalcalc");
      expect(detail?.tool.processing).toContain("local");
      expect(detail?.metrics).toHaveLength(4);
      expect(detail?.howItWorks).toHaveLength(4);
      expect(detail?.trustSection.title).toBe("Local calculation model");
      expect(detail?.handoff.map((item) => item.title)).toContain("VitalCalc source");
      expect(detail?.relatedTools.length).toBeGreaterThanOrEqual(2);
      expect(detail?.relatedTools.every((tool) => Boolean(getToolDetailBySlug(tool.slug)))).toBe(true);
      expect(detail?.recommendedWorkflow).toBeUndefined();
    }
  });

  it("keeps VitalCalc related tool cards within implemented public detail pages", () => {
    const detailSlugs = getAllToolDetails()
      .filter((detail) => detail.tool.source === "vitalcalc")
      .map((detail) => detail.tool.slug);

    for (const slug of detailSlugs) {
      const detail = getToolDetailBySlug(slug);
      const missingRelatedDetails = detail?.relatedTools
        .filter((tool) => tool.source === "vitalcalc")
        .filter((tool) => !getToolDetailBySlug(tool.slug))
        .map((tool) => tool.slug);

      expect(missingRelatedDetails).toEqual([]);
    }
  });

  it("returns undefined for tools without a designed public detail page", () => {
    expect(getToolDetailBySlug("token-counter")).toBeUndefined();
  });
});
