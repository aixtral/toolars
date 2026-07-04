import { describe, expect, it } from "vitest";
import { publicTools, tools } from "./registry";
import { aixtralBatch4DetailSlugs, getToolDetailBySlug } from "./tool-details";

describe("native color-contrast-checker migration", () => {
  it("promotes Color Contrast Checker to a public native Toolars workspace", () => {
    const tool = tools.find((item) => item.slug === "color-contrast-checker");
    const detail = getToolDetailBySlug("color-contrast-checker");

    expect(tool).toMatchObject({ source: "aixtral-lab", status: "ready", visibility: "public" });
    expect(publicTools.map((item) => item.slug)).toContain("color-contrast-checker");
    expect(detail?.workspaceHref).toBe("/tools/color-contrast-checker");
    expect(detail?.listingBadge?.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local WCAG contrast model");
    expect(aixtralBatch4DetailSlugs).toContain("color-contrast-checker");
  });
});
