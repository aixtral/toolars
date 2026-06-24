import { describe, expect, it } from "vitest";
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

  it("emits an entry for every tool workspace and about page", () => {
    const entries = buildSitemapEntries("https://toolars.app");
    const hasBmiWorkspace = entries.some((entry) => entry.url === "https://toolars.app/tools/bmi-calculator");
    const hasBmiAbout = entries.some((entry) => entry.url === "https://toolars.app/tools/bmi-calculator/about");

    expect(hasBmiWorkspace).toBe(true);
    expect(hasBmiAbout).toBe(true);
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
});
