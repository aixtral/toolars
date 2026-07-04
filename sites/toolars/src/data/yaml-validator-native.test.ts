import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native YAML Validator registration", () => {
  it("promotes yaml-validator as a public native Toolars workspace", () => {
    const tool = getToolBySlug("yaml-validator");

    expect(tool).toMatchObject({
      slug: "yaml-validator",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/yaml-validator"
    });
    expect(publicTools.map((item) => item.slug)).toContain("yaml-validator");
  });

  it("uses native detail copy for configuration review workflows", () => {
    const detail = getToolDetailBySlug("yaml-validator");

    expect(detail?.workspaceHref).toBe("/tools/yaml-validator");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "YAML"]));
    expect(detail?.trustSection.title).toBe("Local YAML validation model");
    expect(detail?.overview).toContain("configuration");
  });
});
