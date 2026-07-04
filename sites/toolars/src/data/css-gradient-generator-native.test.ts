import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { aixtralBatch4DetailSlugs, getToolDetailBySlug } from "./tool-details";

describe("native css-gradient-generator migration", () => {
  it("promotes CSS Gradient Generator from preview to a public native Toolars workspace", () => {
    const tool = getToolBySlug("css-gradient-generator");
    const detail = getToolDetailBySlug("css-gradient-generator");

    expect(tool).toMatchObject({ source: "aixtral-lab", status: "ready", visibility: "public" });
    expect(publicTools.map((item) => item.slug)).toContain("css-gradient-generator");
    expect(detail?.workspaceHref).toBe("/tools/css-gradient-generator");
    expect(detail?.listingBadge?.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local CSS gradient model");
    expect(aixtralBatch4DetailSlugs).toContain("css-gradient-generator");
  });
});
