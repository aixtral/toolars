import { beforeEach, describe, expect, it } from "vitest";
import {
  AI_CONSENT_AUDIT_STORAGE_KEY,
  appendAiConsentAuditEvent,
  clearAiConsentAuditLog,
  loadAiConsentAuditLog
} from "./consent-audit-storage";

describe("AI consent audit storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("appends approved AI consent events into a versioned localStorage audit log", () => {
    appendAiConsentAuditEvent({
      approvedAt: "2026-06-19T08:30:00Z",
      contentSummary: "Only extracted text from the selected workflow step is sent.",
      providerLabel: "Toolars AI Gateway",
      providerRouteId: "pdf-summary.fast-summary:v1",
      stepId: "summarize-with-ai",
      workflowSlug: "pdf-summary",
      workflowTitle: "PDF Summary Workflow"
    });

    appendAiConsentAuditEvent({
      approvedAt: "2026-06-19T08:31:00Z",
      contentSummary: "Only selected table text is sent.",
      providerLabel: "Toolars AI Gateway",
      providerRouteId: "pdf-summary.fast-summary:v1",
      stepId: "extract-table-summary",
      workflowSlug: "pdf-summary",
      workflowTitle: "PDF Summary Workflow"
    });

    const rawLog = window.localStorage.getItem(AI_CONSENT_AUDIT_STORAGE_KEY);
    const log = loadAiConsentAuditLog();

    expect(AI_CONSENT_AUDIT_STORAGE_KEY).toBe("toolars.ai-consent-audit:v1");
    expect(rawLog).toContain("\"version\":1");
    expect(log.version).toBe(1);
    expect(log.events).toHaveLength(2);
    expect(log.events[0]).toMatchObject({
      workflowSlug: "pdf-summary",
      stepId: "summarize-with-ai",
      providerRouteId: "pdf-summary.fast-summary:v1"
    });
    expect(log.events[1]?.contentSummary).toBe("Only selected table text is sent.");
  });

  it("clears the local AI consent audit log for deletion requests", () => {
    appendAiConsentAuditEvent({
      approvedAt: "2026-06-19T08:30:00Z",
      contentSummary: "Only extracted text from the selected workflow step is sent.",
      providerLabel: "Toolars AI Gateway",
      providerRouteId: "pdf-summary.fast-summary:v1",
      stepId: "summarize-with-ai",
      workflowSlug: "pdf-summary",
      workflowTitle: "PDF Summary Workflow"
    });

    const cleared = clearAiConsentAuditLog();

    expect(cleared).toEqual({ events: [], version: 1 });
    expect(window.localStorage.getItem(AI_CONSENT_AUDIT_STORAGE_KEY)).toBeNull();
    expect(loadAiConsentAuditLog().events).toHaveLength(0);
  });
});
