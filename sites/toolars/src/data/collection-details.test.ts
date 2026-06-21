import { describe, expect, it } from "vitest";
import { collectionDetailSlugs, getCollectionDetailBySlug } from "./collection-details";

describe("collection details", () => {
  it("defines collection detail data for the PDF and AI Developer Lab templates", () => {
    expect(collectionDetailSlugs).toEqual(["pdf-ops-kit", "ai-developer-lab"]);

    for (const slug of collectionDetailSlugs) {
      const detail = getCollectionDetailBySlug(slug);

      expect(detail?.collection.slug).toBe(slug);
      expect(detail?.recommendedPath).toHaveLength(3);
      expect(detail?.tools.length).toBeGreaterThanOrEqual(4);
      expect(detail?.workflows.length).toBeGreaterThanOrEqual(1);
      expect(detail?.notes).toBeTruthy();
      expect(detail?.primaryAction.href.startsWith("/")).toBe(true);
    }
  });

  it("keeps PDF Ops Kit handoffs tied to the PDF summary workflow", () => {
    const detail = getCollectionDetailBySlug("pdf-ops-kit");

    expect(detail?.secondaryAction.href).toBe("/workflows/pdf-summary");
    expect(detail?.primaryAction.href).toBe("/tools/pdf-toolkit");
    expect(detail?.recommendedPath.map((step) => step.title)).toEqual([
      "Merge and reorder PDFs",
      "Summarize selected pages",
      "Validate structured output"
    ]);
    expect(detail?.workflows.map((workflow) => workflow.slug)).toContain("pdf-summary");
  });

  it("keeps AI Developer Lab handoffs tied to lab workflows and playbooks", () => {
    const detail = getCollectionDetailBySlug("ai-developer-lab");

    expect(detail?.secondaryAction.href).toBe("/explore/ai-developer");
    expect(detail?.workflows.map((workflow) => workflow.slug)).toEqual([
      "ai-prompt-hardening",
      "llm-cost-review",
      "mcp-tool-launch"
    ]);
    expect(detail?.playbooks).toHaveLength(3);
  });
});
