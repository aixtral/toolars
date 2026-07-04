import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native Hash Generator registration", () => {
  it("promotes hash-generator as a public native Toolars workspace", () => {
    expect(getToolBySlug("hash-generator")).toMatchObject({
      slug: "hash-generator",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/hash-generator"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("hash-generator");
  });

  it("uses native detail copy for checksum workflows", () => {
    const detail = getToolDetailBySlug("hash-generator");

    expect(detail?.workspaceHref).toBe("/tools/hash-generator");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "4"]));
    expect(detail?.trustSection.title).toBe("Local digest generation model");
  });
});
