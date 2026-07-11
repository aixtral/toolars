import { describe, expect, it } from "vitest";
import type { ToolDefinition } from "@/data/registry";
import { buildToolMetadata, buildToolAboutMetadata } from "./build-tool-metadata";

const bmiTool: ToolDefinition = {
  slug: "bmi-calculator",
  name: "BMI Calculator",
  description: "Calculate body mass index and health ranges locally.",
  category: "Health",
  group: "VitalCalc",
  type: "traditional",
  processing: ["local"],
  pricing: "free",
  tags: ["Health", "BMI", "Body"],
  source: "vitalcalc",
  accent: "teal",
  status: "ready",
  visibility: "public",
  launchCertified: true,
  href: "/tools/bmi-calculator",
  aboutHref: "/tools/bmi-calculator/about"
} as const;

const uncertifiedTool: ToolDefinition = {
  ...bmiTool,
  slug: "token-counter",
  name: "Token Counter",
  description: "Count tokens for model planning.",
  launchCertified: false,
  href: "/tools/token-counter",
  aboutHref: "/tools/token-counter/about"
} as const;

describe("buildToolMetadata", () => {
  it("builds a title that names the tool and the brand", () => {
    const metadata = buildToolMetadata(bmiTool);
    expect(metadata.title).toBe("BMI Calculator");
  });

  it("uses the tool description as the meta description", () => {
    const metadata = buildToolMetadata(bmiTool);
    expect(metadata.description).toBe("Calculate body mass index and health ranges locally.");
  });

  it("exposes tool tags plus the category as keywords", () => {
    const metadata = buildToolMetadata(bmiTool);
    expect(metadata.keywords).toContain("BMI");
    expect(metadata.keywords).toContain("Health");
  });

  it("sets the canonical url to the tool workspace path", () => {
    const metadata = buildToolMetadata(bmiTool);
    expect(metadata.alternates?.canonical).toBe("/tools/bmi-calculator");
  });

  it("marks local tools as no-api-required via the open graph description suffix", () => {
    const metadata = buildToolMetadata(bmiTool);
    const ogDescription = typeof metadata.openGraph?.description === "string" ? metadata.openGraph.description : "";
    expect(ogDescription.toLowerCase()).toContain("local");
  });

  it("does not add robots restrictions to launch-certified tools", () => {
    const metadata = buildToolMetadata(bmiTool);
    expect(metadata.robots).toBeUndefined();
  });

  it("marks uncertified tool workspace pages as noindex previews", () => {
    const metadata = buildToolMetadata(uncertifiedTool);
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false
    });
  });
});

describe("buildToolAboutMetadata", () => {
  it("builds a title that signals the overview context", () => {
    const metadata = buildToolAboutMetadata(bmiTool);
    expect(metadata.title).toBe("BMI Calculator overview");
  });

  it("sets the canonical url to the tool about path", () => {
    const metadata = buildToolAboutMetadata(bmiTool);
    expect(metadata.alternates?.canonical).toBe("/tools/bmi-calculator/about");
  });

  it("marks uncertified tool about pages as noindex previews", () => {
    const metadata = buildToolAboutMetadata(uncertifiedTool);
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false
    });
  });
});
