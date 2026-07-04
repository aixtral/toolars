import { describe, expect, it } from "vitest";
import { getToolBySlug, publicTools } from "./registry";
import { getToolDetailBySlug } from "./tool-details";

describe("native NanoID Generator registration", () => {
  it("promotes nanoid-generator as a public native Toolars workspace", () => {
    expect(getToolBySlug("nanoid-generator")).toMatchObject({
      slug: "nanoid-generator",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/nanoid-generator"
    });
    expect(publicTools.map((tool) => tool.slug)).toContain("nanoid-generator");
  });

  it("uses native detail copy for compact ID generation", () => {
    const detail = getToolDetailBySlug("nanoid-generator");

    expect(detail?.workspaceHref).toBe("/tools/nanoid-generator");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.trustSection.title).toBe("Local NanoID generation model");
    expect(detail?.handoff.map((item) => item.title)).toContain("Toolars workspace");
  });
});
