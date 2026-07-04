import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Chmod Calculator registration", () => {
  it("promotes chmod-calculator as a public native Toolars workspace", () => {
    const tool = getToolBySlug("chmod-calculator");

    expect(tool).toMatchObject({
      slug: "chmod-calculator",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/chmod-calculator"
    });
    expect(publicTools.map((item) => item.slug)).toContain("chmod-calculator");
  });

  it("uses native detail copy instead of detail-only migration content", () => {
    const detail = getToolDetailBySlug("chmod-calculator");

    expect(detail?.workspaceHref).toBe("/tools/chmod-calculator");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "rwx"]));
    expect(detail?.trustSection.title).toBe("Local permission calculation model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
