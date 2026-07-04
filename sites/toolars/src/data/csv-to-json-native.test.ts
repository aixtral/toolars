import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "./tool-details";
import { getToolBySlug, publicTools } from "./registry";

describe("native CSV to JSON registration", () => {
  it("promotes csv-to-json as a public native Toolars workspace", () => {
    const tool = getToolBySlug("csv-to-json");

    expect(tool).toMatchObject({
      slug: "csv-to-json",
      group: "AI Developer Lab",
      processing: ["local"],
      source: "aixtral-lab",
      status: "ready",
      visibility: "public",
      href: "/tools/csv-to-json"
    });
    expect(publicTools.map((item) => item.slug)).toContain("csv-to-json");
  });

  it("uses native detail copy for CSV parsing workflows", () => {
    const detail = getToolDetailBySlug("csv-to-json");

    expect(detail?.workspaceHref).toBe("/tools/csv-to-json");
    expect(detail?.listingBadge.badge).toBe("Native workspace");
    expect(detail?.metrics.map((metric) => metric.value)).toEqual(expect.arrayContaining(["Local", "Public", "CSV"]));
    expect(detail?.trustSection.title).toBe("Local CSV parsing model");
    expect(detail?.overview).toContain("quoted fields");
  });
});
