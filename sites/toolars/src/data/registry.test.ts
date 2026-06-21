import { describe, expect, it } from "vitest";
import {
  collections,
  sourceInventory,
  tools,
  workflows,
  getToolsByGroup
} from "./registry";

describe("Toolars registry", () => {
  it("contains the first representative tools from the design contract", () => {
    const slugs = tools.map((tool) => tool.slug);

    expect(slugs).toContain("pdf-toolkit");
    expect(slugs).toContain("json-repair");
    expect(slugs).toContain("prompt-injection-scanner");
    expect(slugs).toContain("llm-cost-calculator");
    expect(slugs).toContain("mcp-server-builder");
  });

  it("carries trust metadata for every registered tool", () => {
    expect(tools.length).toBeGreaterThanOrEqual(30);

    for (const tool of tools) {
      expect(tool.type).toMatch(/traditional|ai|workflow/);
      expect(tool.processing.length).toBeGreaterThan(0);
      expect(tool.pricing).toMatch(/free|freemium|paid/);
      expect(tool.tags.length).toBeGreaterThan(0);
      expect(tool.source).toMatch(/vitalcalc|aixtral-lab|toolars/);
    }
  });

  it("keeps the AI Developer Lab as a first-class merged inventory", () => {
    const labTools = getToolsByGroup("AI Developer Lab");

    expect(labTools).toHaveLength(22);
    expect(labTools.map((tool) => tool.slug)).toContain("json-repair");
    expect(labTools.map((tool) => tool.slug)).toContain("mcp-server-builder");
  });

  it("keeps representative VitalCalc finance and health tools in the merged inventory", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);

    expect(vitalCalcTools.length).toBeGreaterThanOrEqual(12);
    expect(slugs).toEqual(expect.arrayContaining(["mortgage-calculator", "bmi-calculator", "loan-calculator"]));
    expect(vitalCalcTools.some((tool) => tool.category === "Finance")).toBe(true);
    expect(vitalCalcTools.some((tool) => tool.category === "Health")).toBe(true);
    expect(vitalCalcTools.every((tool) => tool.processing.includes("local"))).toBe(true);
  });

  it("includes the second VitalCalc detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const secondBatch = [
      "retirement-calculator",
      "debt-payoff",
      "roi-calculator",
      "tdee-calculator",
      "body-fat-calculator",
      "protein-calculator"
    ];

    expect(slugs).toEqual(expect.arrayContaining(secondBatch));
    for (const slug of secondBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
    }
  });

  it("includes the third VitalCalc finance and health detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const thirdBatch = [
      "income-tax",
      "fire-calculator",
      "discount-calculator",
      "heart-rate-zone",
      "sleep-calculator",
      "ideal-weight-calculator"
    ];

    expect(slugs).toEqual(expect.arrayContaining(thirdBatch));
    for (const slug of thirdBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the fourth VitalCalc finance and health detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const fourthBatch = [
      "car-loan",
      "rent-vs-buy",
      "home-affordability-calculator",
      "waist-hip-ratio",
      "blood-pressure",
      "child-growth"
    ];

    expect(slugs).toEqual(expect.arrayContaining(fourthBatch));
    for (const slug of fourthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the fifth VitalCalc finance and health detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const fifthBatch = [
      "student-loan-calculator",
      "apy-calculator",
      "rule-of-72",
      "calorie-deficit",
      "macro-calculator",
      "lean-body-mass"
    ];

    expect(slugs).toEqual(expect.arrayContaining(fifthBatch));
    for (const slug of fifthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the sixth VitalCalc finance planning detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const sixthBatch = [
      "emergency-fund",
      "savings-goal",
      "dti-calculator",
      "net-worth-calculator",
      "budget-rule",
      "side-income-tax"
    ];

    expect(slugs).toEqual(expect.arrayContaining(sixthBatch));
    for (const slug of sixthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the seventh VitalCalc health and wellness detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const seventhBatch = [
      "intermittent-fasting",
      "creatine-calculator",
      "vo2-max",
      "biological-age",
      "glycemic-load",
      "30-30-30-method"
    ];

    expect(slugs).toEqual(expect.arrayContaining(seventhBatch));
    for (const slug of seventhBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the eighth VitalCalc utility and everyday finance detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const eighthBatch = [
      "tip-calculator",
      "bill-split-calculator",
      "unit-converter",
      "hourly-to-salary",
      "inflation-calculator",
      "habit-cost"
    ];

    expect(slugs).toEqual(expect.arrayContaining(eighthBatch));
    for (const slug of eighthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the ninth VitalCalc health and lifestyle detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const ninthBatch = [
      "caffeine-calculator",
      "alcohol-metabolism",
      "blood-sugar-calculator",
      "drink-calories",
      "fiber-intake",
      "steps-to-calories"
    ];

    expect(slugs).toEqual(expect.arrayContaining(ninthBatch));
    for (const slug of ninthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the tenth VitalCalc finance utility and investment detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const tenthBatch = [
      "currency-converter",
      "percentage-calculator",
      "stock-average",
      "credit-card-apr",
      "investment-fee",
      "investment-goal"
    ];

    expect(slugs).toEqual(expect.arrayContaining(tenthBatch));
    for (const slug of tenthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the eleventh VitalCalc life-money detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const eleventhBatch = [
      "credit-score-simulator",
      "crypto-tax",
      "freelance-rate",
      "subscription-audit",
      "savings-challenge",
      "city-cost-comparison"
    ];

    expect(slugs).toEqual(expect.arrayContaining(eleventhBatch));
    for (const slug of eleventhBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the twelfth VitalCalc payroll investment and lifestyle detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const twelfthBatch = [
      "social-insurance-calculator",
      "dividend-reinvestment",
      "mortgage-refinance-calculator",
      "coast-fire",
      "sip-calculator",
      "smoke-free"
    ];

    expect(slugs).toEqual(expect.arrayContaining(twelfthBatch));
    for (const slug of twelfthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the thirteenth VitalCalc screening detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
    const thirteenthBatch = [
      "adhd-screener",
      "burnout-assessment",
      "gad7-anxiety",
      "phq9-depression",
      "pss10-stress",
      "glp1-eligibility"
    ];

    expect(slugs).toEqual(expect.arrayContaining(thirteenthBatch));
    for (const slug of thirteenthBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("includes the final VitalCalc metabolic reproductive and performance detail batch as free local tools", () => {
    const vitalCalcTools = getToolsByGroup("VitalCalc");
    const slugs = vitalCalcTools.map((tool) => tool.slug);
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

    expect(vitalCalcTools).toHaveLength(sourceInventory.vitalcalc.rootToolPages);
    expect(slugs).toEqual(expect.arrayContaining(finalBatch));
    for (const slug of finalBatch) {
      const tool = vitalCalcTools.find((item) => item.slug === slug);

      expect(tool?.source).toBe("vitalcalc");
      expect(tool?.pricing).toBe("free");
      expect(tool?.processing).toContain("local");
      expect(tool?.aboutHref).toBe(`/tools/${slug}/about`);
    }
  });

  it("records current source inventory counts", () => {
    expect(sourceInventory.vitalcalc.rootToolPages).toBe(86);
    expect(sourceInventory.aixtralLab.totalTools).toBe(92);
    expect(sourceInventory.aixtralLab.categories.developerTools).toBe(37);
  });

  it("defines workflows and collections for cross-tool continuity", () => {
    expect(workflows.map((workflow) => workflow.slug)).toContain("mcp-tool-launch");
    expect(collections.map((collection) => collection.slug)).toContain("ai-developer-lab");
  });
});
