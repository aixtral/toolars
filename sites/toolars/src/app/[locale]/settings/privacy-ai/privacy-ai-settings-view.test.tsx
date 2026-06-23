import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AI_CONSENT_AUDIT_STORAGE_KEY } from "@/lib/ai/consent-audit-storage";
import { WORKSPACE_IDENTITY_STORAGE_KEY, bindWorkspaceIdentityToAccount } from "@/lib/workspace/workspace-identity";
import { PrivacyAiSettingsView } from "./privacy-ai-settings-view";

describe("PrivacyAiSettingsView", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders privacy and AI settings modules from the design", () => {
    const { container } = renderWithIntl(<PrivacyAiSettingsView />);

    expect(container.querySelector('[data-privacy-ai-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Privacy & AI" })).toBeInTheDocument();
    expect(screen.getByText("Consent defaults")).toBeInTheDocument();
    expect(screen.getByText("AI processing policy")).toBeInTheDocument();
    expect(screen.getByText("Local-first routing")).toBeInTheDocument();
    expect(screen.getByText("Provider routing matrix")).toBeInTheDocument();
    expect(screen.getByText("AI audit trail")).toBeInTheDocument();
    expect(screen.getByText("Training controls")).toBeInTheDocument();
    expect(screen.getByText("Data retention")).toBeInTheDocument();
    expect(screen.getByText("Consent preview")).toBeInTheDocument();
    expect(screen.getByText("Privacy log")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download privacy log" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete AI history" })).toBeInTheDocument();
    expect(screen.getByText("pdf-summary.fast-summary:v1")).toBeInTheDocument();
    expect(screen.getByText("local-extract-only:v1")).toBeInTheDocument();
    expect(screen.getByText("Retention 30 days")).toBeInTheDocument();
  });

  it("updates visible consent state when a trust default is toggled", () => {
    renderWithIntl(<PrivacyAiSettingsView />);

    const askConsent = screen.getByRole("button", { name: "Ask before AI processing" });
    expect(askConsent).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(askConsent);

    expect(askConsent).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Consent prompt paused for this workspace.")).toBeInTheDocument();
  });

  it("renders persisted AI consent audit events in the privacy log", () => {
    window.localStorage.setItem(
      AI_CONSENT_AUDIT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        events: [
          {
            approvedAt: "2026-06-19T08:30:00Z",
            contentSummary: "Only extracted text from the selected workflow step is sent.",
            providerLabel: "Toolars AI Gateway",
            providerRouteId: "pdf-summary.fast-summary:v1",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary",
            workflowTitle: "PDF Summary Workflow"
          }
        ]
      })
    );

    renderWithIntl(<PrivacyAiSettingsView />);

    expect(screen.getByText("1 AI consent event retained locally")).toBeInTheDocument();
    expect(screen.getByText("PDF Summary Workflow")).toBeInTheDocument();
    expect(screen.getAllByText("Toolars AI Gateway").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("pdf-summary.fast-summary:v1").length).toBeGreaterThanOrEqual(1);
  });

  it("renders server audit ledger run metadata without replacing the local log", async () => {
    window.localStorage.setItem(
      AI_CONSENT_AUDIT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        events: [
          {
            approvedAt: "2026-06-19T08:30:00Z",
            contentSummary: "Only extracted text from the selected workflow step is sent.",
            providerLabel: "Toolars AI Gateway",
            providerRouteId: "pdf-summary.fast-summary:v1",
            stepId: "summarize-with-ai",
            workflowSlug: "pdf-summary",
            workflowTitle: "PDF Summary Workflow"
          }
        ]
      })
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          auth: {
            accountEmail: "owner@example.com",
            accountId: "acct-preview-123",
            isAuthenticated: true,
            source: "preview-header",
            workspaceId: "toolars_ws_privacy_test"
          },
          ledger: {
            events: [
              {
                approvedAt: "2026-06-19T08:30:00Z",
                contentSummary: "Only extracted text from the selected workflow step is sent.",
                providerLabel: "Toolars AI Gateway",
                providerRouteId: "pdf-summary.fast-summary:v1",
                stepId: "summarize-with-ai",
                workflowSlug: "pdf-summary",
                workflowTitle: "PDF Summary Workflow"
              }
            ],
            runs: [
              {
                contentBytes: 61,
                createdAt: "2026-06-19T08:30:00Z",
                modelFamily: "Fast summary model",
                providerRouteId: "pdf-summary.fast-summary:v1",
                retentionDays: 30,
                runId: "run_pdf-summary_summarize-with-ai_20260619083000Z",
                status: "consent-approved",
                stepId: "summarize-with-ai",
                workflowSlug: "pdf-summary"
              }
            ],
            version: 1
          }
        }),
        ok: true
      })
    );

    renderWithIntl(<PrivacyAiSettingsView />);

    expect(await screen.findByText("Server ledger synced")).toBeInTheDocument();
    expect(screen.getByText("1 AI consent event retained locally")).toBeInTheDocument();
    expect(screen.getByText("1 server audit run with metadata")).toBeInTheDocument();
    expect(screen.getByText("Account ledger connected")).toBeInTheDocument();
    expect(screen.getByText("acct-preview-123")).toBeInTheDocument();
    expect(screen.getByText("owner@example.com")).toBeInTheDocument();
    expect(screen.getByText("preview-header")).toBeInTheDocument();
    expect(screen.getByText("run_pdf-summary_summarize-with-ai_20260619083000Z")).toBeInTheDocument();
    expect(screen.getByText("consent-approved")).toBeInTheDocument();
  });

  it("refreshes server auth context when the workspace identity changes after sign-in", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          auth: {
            accountEmail: null,
            accountId: null,
            isAuthenticated: false,
            source: "anonymous",
            workspaceId: "toolars_ws_privacy_refresh"
          },
          ledger: {
            deletions: [],
            events: [],
            runs: [],
            version: 1,
            workspaceId: "toolars_ws_privacy_refresh"
          }
        }),
        ok: true
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          auth: {
            accountEmail: "owner@example.com",
            accountId: "acct-owner",
            isAuthenticated: true,
            source: "preview-header",
            workspaceId: "toolars_ws_privacy_refresh"
          },
          ledger: {
            accountBindings: [
              {
                accountEmail: "owner@example.com",
                accountId: "acct-owner",
                boundAt: "2026-06-21T09:10:00Z",
                source: "future-login",
                workspaceId: "toolars_ws_privacy_refresh"
              }
            ],
            deletions: [],
            events: [],
            runs: [],
            version: 1,
            workspaceId: "account:acct-owner"
          }
        }),
        ok: true
      });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<PrivacyAiSettingsView />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    bindWorkspaceIdentityToAccount({
      accountEmail: "owner@example.com",
      accountId: "acct-owner",
      now: () => "2026-06-21T09:10:00Z"
    });

    expect(await screen.findByText("Account ledger connected")).toBeInTheDocument();
    expect(screen.getByText("acct-owner")).toBeInTheDocument();
    expect(screen.getByText("owner@example.com")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith("/api/ai/consent-audit", {
      headers: {
        "x-toolars-account-email": "owner@example.com",
        "x-toolars-account-id": "acct-owner",
        "x-toolars-workspace-id": expect.stringMatching(/^toolars_ws_/)
      }
    });
  });

  it("exports and deletes AI history while retaining server deletion audit status", async () => {
    const auditEvent = {
      approvedAt: "2026-06-19T08:30:00Z",
      contentSummary: "Only extracted text from the selected workflow step is sent.",
      providerLabel: "Toolars AI Gateway",
      providerRouteId: "pdf-summary.fast-summary:v1",
      stepId: "summarize-with-ai",
      workflowSlug: "pdf-summary",
      workflowTitle: "PDF Summary Workflow"
    };
    const runMetadata = {
      contentBytes: 61,
      createdAt: "2026-06-19T08:30:00Z",
      modelFamily: "Fast summary model",
      providerRouteId: "pdf-summary.fast-summary:v1",
      retentionDays: 30,
      runId: "run_pdf-summary_summarize-with-ai_20260619083000Z",
      status: "consent-approved",
      stepId: "summarize-with-ai",
      workflowSlug: "pdf-summary"
    };
    window.localStorage.setItem(
      AI_CONSENT_AUDIT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        events: [auditEvent]
      })
    );
    window.localStorage.setItem(
      WORKSPACE_IDENTITY_STORAGE_KEY,
      JSON.stringify({
        createdAt: "2026-06-19T10:08:00Z",
        source: "anonymous-local",
        version: 1,
        workspaceId: "toolars_ws_privacy_test"
      })
    );

    const fetchMock = vi.fn((_url: string, init?: RequestInit) => {
      const ledger =
        init?.method === "DELETE"
          ? {
              deletions: [
                {
                  deletedEvents: 1,
                  deletedRuns: 1,
                  requestedAt: "2026-06-19T10:00:00Z",
                  scope: "ai-history",
                  status: "completed"
                }
              ],
              events: [],
              runs: [],
              version: 1
            }
          : {
              deletions: [],
              events: [auditEvent],
              runs: [runMetadata],
              version: 1
            };

      return Promise.resolve({
        json: vi.fn().mockResolvedValue({ ledger }),
        ok: true
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    renderWithIntl(<PrivacyAiSettingsView />);

    expect(await screen.findByText("Server ledger synced")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Download privacy log" }));
    expect(screen.getByText("Privacy log export prepared with 1 local event and 1 server run.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete AI history" }));

    expect(await screen.findByText("AI history deleted locally; server deletion audit retained.")).toBeInTheDocument();
    expect(screen.getByText("0 AI consent events retained locally")).toBeInTheDocument();
    expect(screen.getByText("0 server audit runs with metadata")).toBeInTheDocument();
    expect(screen.getByText("1 deletion request retained in server ledger")).toBeInTheDocument();
    expect(window.localStorage.getItem(AI_CONSENT_AUDIT_STORAGE_KEY)).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith("/api/ai/consent-audit", {
      headers: {
        "x-toolars-workspace-id": "toolars_ws_privacy_test"
      }
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/ai/consent-audit", {
      headers: {
        "x-toolars-workspace-id": "toolars_ws_privacy_test"
      },
      method: "DELETE"
    });
  });
});
