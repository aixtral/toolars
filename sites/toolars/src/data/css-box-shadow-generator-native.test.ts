import { describe, expect, it } from "vitest";
import { publicTools, tools } from "./registry";
import { aixtralBatch9DetailSlugs, getToolDetailBySlug } from "./tool-details";

describe("native css-box-shadow-generator migration", () => {
  it("promotes CSS Box Shadow Generator to a public native Toolars workspace", () => {
    const tool = tools.find((item) => item.slug === "css-box-shadow-generator");
    const detail = getToolDetailBySlug("css-box-shadow-generator");

    expect(tool).toMatchObject({ source: "aixtral-lab", status: "ready", visibility: "public" });
    expect(publicTools.map((item) => item.slug)).toContain("css-box-shadow-generator");
    expect(detail?.workspaceHref).toBe("/tools/css-box-shadow-generator");
    expect(detail?.listingBadge?.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local CSS shadow model");
    expect(aixtralBatch9DetailSlugs).toContain("css-box-shadow-generator");
  });
});
