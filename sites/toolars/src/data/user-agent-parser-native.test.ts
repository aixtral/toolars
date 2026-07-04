import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native User Agent Parser registration", () => {
  it("promotes user-agent-parser as a public native Toolars workspace", () => {
    const tool = getToolBySlug("user-agent-parser");

    expect(tool).toMatchObject({
      slug: "user-agent-parser",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/user-agent-parser"
    });
    expect(publicTools.map((item) => item.slug)).toContain("user-agent-parser");
  });

  it("uses native detail copy instead of detail-only migration content", () => {
    const detail = getToolDetailBySlug("user-agent-parser");

    expect(detail?.workspaceHref).toBe("/tools/user-agent-parser");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "UA"]));
    expect(detail?.trustSection.title).toBe("Local User-Agent parsing model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
