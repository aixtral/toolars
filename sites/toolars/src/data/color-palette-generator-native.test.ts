import { describe, expect, it } from "vitest";
import { publicTools, tools } from "./registry";
import { aixtralBatch4DetailSlugs, getToolDetailBySlug } from "./tool-details";

describe("native color-palette-generator migration", () => {
  it("promotes Color Palette Generator to a public native Toolars workspace", () => {
    const tool = tools.find((item) => item.slug === "color-palette-generator");
    const detail = getToolDetailBySlug("color-palette-generator");

    expect(tool).toMatchObject({ source: "aixtral-lab", status: "ready", visibility: "public" });
    expect(publicTools.map((item) => item.slug)).toContain("color-palette-generator");
    expect(detail?.workspaceHref).toBe("/tools/color-palette-generator");
    expect(detail?.listingBadge?.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local palette generation model");
    expect(aixtralBatch4DetailSlugs).toContain("color-palette-generator");
  });
});
