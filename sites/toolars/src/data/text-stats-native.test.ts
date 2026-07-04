import { describe, expect, it } from "vitest";
import { publicTools, tools } from "./registry";
import { aixtralBatch1DetailSlugs, getToolDetailBySlug } from "./tool-details";

describe("native text-stats migration", () => {
  it("promotes Text Stats from detail-only inventory to a public native Toolars workspace", () => {
    const tool = tools.find((item) => item.slug === "text-stats");
    const detail = getToolDetailBySlug("text-stats");

    expect(tool).toMatchObject({
      group: "AI Developer Lab",
      source: "aixtral-lab",
      status: "ready",
      visibility: "public"
    });
    expect(publicTools.map((item) => item.slug)).toContain("text-stats");
    expect(detail?.tool.status).toBe("ready");
    expect(detail?.tool.visibility).toBe("public");
    expect(detail?.workspaceHref).toBe("/tools/text-stats");
    expect(detail?.listingBadge?.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).not.toBe("Detail-only migration model");
    expect(aixtralBatch1DetailSlugs).toContain("text-stats");
  });
});
