import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native IPv4 Subnet Calculator registration", () => {
  it("promotes ipv4-subnet-calculator as a public native Toolars workspace", () => {
    const tool = getToolBySlug("ipv4-subnet-calculator");

    expect(tool).toMatchObject({
      slug: "ipv4-subnet-calculator",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/ipv4-subnet-calculator"
    });
    expect(publicTools.map((item) => item.slug)).toContain("ipv4-subnet-calculator");
  });

  it("uses native detail copy instead of detail-only migration content", () => {
    const detail = getToolDetailBySlug("ipv4-subnet-calculator");

    expect(detail?.workspaceHref).toBe("/tools/ipv4-subnet-calculator");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "CIDR"]));
    expect(detail?.trustSection.title).toBe("Local subnet calculation model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
