import { describe, expect, it } from "vitest";
import type { ToolDefinition } from "@/data/registry";
import type { ToolDetailDefinition } from "@/data/tool-details";
import type { BlogArticle } from "@/data/blog";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildHowToSchema,
  buildItemListSchema,
  buildOrganizationSchema,
  buildWebApplicationSchema,
  buildWebSiteSchema,
  type JsonLdGraph
} from "./json-ld";

const bmiTool: ToolDefinition = {
  slug: "bmi-calculator",
  name: "BMI Calculator",
  description: "Calculate body mass index and health ranges locally.",
  category: "Health",
  group: "VitalCalc",
  type: "traditional",
  processing: ["local"],
  pricing: "free",
  tags: ["Health", "BMI"],
  source: "vitalcalc",
  accent: "teal",
  status: "ready",
  visibility: "public",
  href: "/tools/bmi-calculator",
  aboutHref: "/tools/bmi-calculator/about"
} as const;

const bmiDetail = {
  tool: bmiTool,
  workspaceHref: "/tools/bmi-calculator",
  summary: "BMI summary",
  overview: "BMI overview text",
  howItWorks: [
    { title: "Enter height and weight", description: "Provide your measurements.", badge: "Input", tone: "neutral" },
    { title: "Read your BMI category", description: "See where you fall on the scale.", badge: "Result", tone: "green" }
  ],
  outcome: "Know your BMI range"
} as unknown as ToolDetailDefinition;

describe("json-ld schema builders", () => {
  it("builds a WebApplication schema with free offer and absolute url", () => {
    const schema = buildWebApplicationSchema(bmiTool, "https://toolars.app");
    expect(schema["@type"]).toBe("WebApplication");
    expect(schema.name).toBe("BMI Calculator");
    expect(schema.url).toBe("https://toolars.app/tools/bmi-calculator");
    expect(schema.offers?.[0]?.price).toBe("0");
    expect(schema.offers?.[0]?.priceCurrency).toBe("USD");
    expect(schema.applicationCategory).toBeDefined();
  });

  it("marks local tools with a browser requirements clue", () => {
    const schema = buildWebApplicationSchema(bmiTool, "https://toolars.app");
    expect(JSON.stringify(schema).toLowerCase()).toContain("local");
  });

  it("builds a HowTo schema from the tool detail steps", () => {
    const schema = buildHowToSchema(bmiDetail, "https://toolars.app");
    expect(schema["@type"]).toBe("HowTo");
    expect(schema.name).toBe("BMI Calculator");
    expect(schema.step).toHaveLength(2);
    expect(schema.step?.[0]?.name).toBe("Enter height and weight");
    expect(schema.totalTime).toBeDefined();
  });

  it("builds a BreadcrumbList with absolute urls and positions", () => {
    const schema = buildBreadcrumbSchema(
      [
        { name: "Tools", path: "/tools" },
        { name: "BMI Calculator", path: "/tools/bmi-calculator" }
      ],
      "https://toolars.app"
    );
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement?.[0]?.position).toBe(1);
    expect(schema.itemListElement?.[1]?.item).toBe("https://toolars.app/tools/bmi-calculator");
  });

  it("builds an ItemList schema for a directory of tools", () => {
    const schema = buildItemListSchema(
      { name: "PDF Tools", path: "/explore/pdf" },
      [bmiTool],
      "https://toolars.app"
    );
    expect(schema["@type"]).toBe("ItemList");
    expect(schema.name).toBe("PDF Tools");
    expect(schema.itemListElement).toHaveLength(1);
    expect(schema.itemListElement?.[0]?.url).toBe("https://toolars.app/tools/bmi-calculator");
  });

  it("builds an Organization schema", () => {
    const schema = buildOrganizationSchema("https://toolars.app");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("Toolars");
    expect(schema.url).toBe("https://toolars.app");
  });

  it("builds a WebSite schema with a search action for sitelinks searchbox", () => {
    const schema = buildWebSiteSchema("https://toolars.app");
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.url).toBe("https://toolars.app");
    expect(schema.potentialAction?.[0]?.["@type"]).toBe("SearchAction");
  });

  it("a graph bundles multiple schemas under one @graph", () => {
    const graph: JsonLdGraph = {
      "@context": "https://schema.org",
      "@graph": [
        buildOrganizationSchema("https://toolars.app"),
        buildWebSiteSchema("https://toolars.app")
      ]
    };
    expect(graph["@graph"]).toHaveLength(2);
  });

  it("builds an Article schema with headline, date, and faq for GEO", () => {
    const article = {
      slug: "json-repair-guide",
      title: "How to Repair Broken JSON in Seconds",
      description: "Fix malformed JSON.",
      category: "Guides",
      publishedAt: "2026-06-10",
      readTimeMinutes: 5,
      author: "Toolars Team",
      featuredToolSlugs: ["json-repair"],
      sections: [{ heading: "Why", paragraphs: ["text"] }],
      faq: [{ question: "Is it safe?", answer: "Yes." }]
    } as unknown as BlogArticle;

    const schema = buildArticleSchema(article, "https://toolars.app");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("How to Repair Broken JSON in Seconds");
    expect(schema.url).toBe("https://toolars.app/blog/json-repair-guide");
    expect(schema.datePublished).toBe("2026-06-10");
    expect(schema.mainEntityOfPage).toBe("https://toolars.app/blog/json-repair-guide");
  });
});
