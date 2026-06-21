import { describe, expect, it } from "vitest";
import { selectAiProviderRoute } from "./provider-routing";

describe("selectAiProviderRoute", () => {
  it("routes PDF summary to a consent-gated default provider route", () => {
    const route = selectAiProviderRoute({ workflowSlug: "pdf-summary", stepId: "summarize-with-ai" });

    expect(route.workflowSlug).toBe("pdf-summary");
    expect(route.stepId).toBe("summarize-with-ai");
    expect(route.requiresConsent).toBe(true);
    expect(route.providerLabel).toBe("Toolars AI Gateway");
    expect(route.modelFamily).toBe("Fast summary model");
    expect(route.retentionDays).toBe(30);
    expect(route.contentScope).toContain("extracted text");
    expect(route.contentScope).not.toContain("full PDF");
  });
});
