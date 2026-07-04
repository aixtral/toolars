import { describe, expect, it } from "vitest";
import { publicTools, tools } from "./registry";
import { aixtralBatch4DetailSlugs, getToolDetailBySlug } from "./tool-details";

describe("native css-border-radius-generator migration", () => {
  it("promotes CSS Border Radius Generator to a public native Toolars workspace", () => {
    const tool = tools.find((item) => item.slug === "css-border-radius-generator");
    const detail = getToolDetailBySlug("css-border-radius-generator");

    expect(tool).toMatchObject({ source: "aixtral-lab", status: "ready", visibility: "public" });
    expect(publicTools.map((item) => item.slug)).toContain("css-border-radius-generator");
    expect(detail?.workspaceHref).toBe("/tools/css-border-radius-generator");
    expect(detail?.listingBadge?.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local border-radius model");
    expect(aixtralBatch4DetailSlugs).toContain("css-border-radius-generator");
  });
});
