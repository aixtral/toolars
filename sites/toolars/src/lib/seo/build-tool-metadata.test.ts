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

  it.each([
    ["en", "BMI Calculator overview", "What BMI Calculator does, how it works, and when to use it. Calculate body mass index and health ranges locally.", "/tools/bmi-calculator/about"],
    ["es", "Resumen de Calculadora de IMC", "Descubre que hace Calculadora de IMC, como funciona y cuando usarla. Calcula el índice de masa corporal y consulta tu categoría de salud localmente.", "/es/tools/bmi-calculator/about"],
    ["zh-hans", "BMI 计算器概览", "了解 BMI 计算器 的用途、工作方式以及适合使用的场景。在本地计算身体质量指数并查看健康分类。", "/zh-hans/tools/bmi-calculator/about"],
    ["zh-hant", "BMI 計算器概覽", "了解 BMI 計算器 的用途、運作方式以及適合使用的情境。在本機計算身體質量指數並查看健康分類。", "/zh-hant/tools/bmi-calculator/about"]
  ])("localizes title, description, canonical, and Open Graph URL for %s", (locale, title, description, canonical) => {
    const metadata = buildToolAboutMetadata(bmiTool, locale);

    expect(metadata.title).toBe(title);
    expect(metadata.description).toBe(description);
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.openGraph).toMatchObject({ title: `${title} — Toolars`, description, url: canonical });
  });

  it("falls back to English metadata when the route locale is unsupported", () => {
    const metadata = buildToolAboutMetadata(bmiTool, "fr");

    expect(metadata.title).toBe("BMI Calculator overview");
    expect(metadata.alternates?.canonical).toBe("/tools/bmi-calculator/about");
    expect(metadata.openGraph).toMatchObject({ url: "/tools/bmi-calculator/about" });
  });

  it("marks uncertified tool about pages as noindex previews", () => {
    const metadata = buildToolAboutMetadata(uncertifiedTool);
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false
    });
  });
});
