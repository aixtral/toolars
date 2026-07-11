import { describe, expect, it } from "vitest";
import { launchCertifiedTools } from "@/data/registry";
import { buildSitemapEntries, type SitemapEntry } from "./build-sitemap-entries";

describe("buildSitemapEntries", () => {
  it("includes the homepage and primary directory routes", () => {
    const entries = buildSitemapEntries("https://toolars.app");
    const paths = entries.map((entry) => entry.url);

    expect(paths).toContain("https://toolars.app");
    expect(paths).toContain("https://toolars.app/explore/pdf");
    expect(paths).toContain("https://toolars.app/explore/ai-developer");
    expect(paths).toContain("https://toolars.app/workflows");
    expect(paths).toContain("https://toolars.app/collections");
    expect(paths).toContain("https://toolars.app/pricing");
    expect(paths).not.toContain("https://toolars.app/submit");
  });

  it("emits entries only for launch-certified tool workspace and about pages", () => {
    const entries = buildSitemapEntries("https://toolars.app");
    const paths = entries.map((entry) => entry.url);
    const toolEntries = paths.filter((path) => new URL(path).pathname.startsWith("/tools/"));

    expect(toolEntries).toHaveLength(launchCertifiedTools.length * 2);
    expect(paths).toContain("https://toolars.app/tools/bmi-calculator");
    expect(paths).toContain("https://toolars.app/tools/bmi-calculator/about");
    expect(paths).toContain("https://toolars.app/tools/json-repair");
    expect(paths).not.toContain("https://toolars.app/tools/color-contrast-checker");
    expect(paths).not.toContain("https://toolars.app/tools/color-contrast-checker/about");
  });

  it("emits an entry for every workflow and collection", () => {
    const entries = buildSitemapEntries("https://toolars.app");
    const paths = entries.map((entry) => entry.url);

    expect(paths).toContain("https://toolars.app/workflows/pdf-summary");
    expect(paths.some((path) => path.startsWith("https://toolars.app/collections/"))).toBe(true);
  });

  it("strips trailing slashes from the base url", () => {
    const entries = buildSitemapEntries("https://toolars.app/");
    expect(entries[0].url).not.toContain("toolars.app//");
  });

  it("marks tool pages with a weekly change frequency", () => {
    const entries: SitemapEntry[] = buildSitemapEntries("https://toolars.app");
    const bmiWorkspace = entries.find((entry) => entry.url === "https://toolars.app/tools/bmi-calculator");

    expect(bmiWorkspace?.changeFrequency).toBe("weekly");
    expect(bmiWorkspace?.priority).toBeGreaterThan(0.5);
  });

  it("marks blog article entries with every launch locale because fallback content is routable", () => {
    const entries = buildSitemapEntries("https://toolars.app");
    const launchArticle = entries.find((entry) => entry.url === "https://toolars.app/blog/json-repair-guide");
    const vitalCalcArticle = entries.find((entry) => entry.url === "https://toolars.app/blog/what-is-bmi");

    expect(launchArticle?.locales).toEqual(["en", "es", "zh-hans", "zh-hant"]);
    expect(vitalCalcArticle?.locales).toEqual(["en", "es", "zh-hans", "zh-hant"]);
  });
});
