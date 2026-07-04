import { describe, expect, it } from "vitest";
import { publicTools, tools } from "./registry";
import { aixtralBatch4DetailSlugs, getToolDetailBySlug } from "./tool-details";

describe("native color-converter migration", () => {
  it("promotes Color Converter to a public native Toolars workspace", () => {
    const tool = tools.find((item) => item.slug === "color-converter");
    const detail = getToolDetailBySlug("color-converter");

    expect(tool).toMatchObject({ source: "aixtral-lab", status: "ready", visibility: "public" });
    expect(publicTools.map((item) => item.slug)).toContain("color-converter");
    expect(detail?.workspaceHref).toBe("/tools/color-converter");
    expect(detail?.listingBadge?.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local color conversion model");
    expect(aixtralBatch4DetailSlugs).toContain("color-converter");
  });
});
