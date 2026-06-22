import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AI_CONSENT_AUDIT_STORAGE_KEY } from "@/lib/ai/consent-audit-storage";
import { WORKSPACE_IDENTITY_STORAGE_KEY } from "@/lib/workspace/workspace-identity";
import { PdfSummaryWorkflow } from "./pdf-summary-workflow";

describe("PdfSummaryWorkflow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the PDF summary workflow builder sections from the design", () => {
    renderWithIntl(<PdfSummaryWorkflow />);

    expect(screen.getByRole("heading", { name: "PDF Summary Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Recommended variations")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Board pack" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Step canvas")).toBeInTheDocument();
    expect(screen.getByText("Run preview")).toBeInTheDocument();
    expect(screen.getByText("Step settings")).toBeInTheDocument();
    expect(screen.getByText("AI consent is step-scoped")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /PDF Toolkit/ })).toHaveAttribute("href", "/tools/pdf-toolkit");
    expect(screen.getByText("AI")).toBeInTheDocument();
  });

  it("simulates the PDF summary run when the user runs the workflow", () => {
    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Run workflow" }));

    expect(screen.getByText("Workflow simulated")).toBeInTheDocument();
    expect(screen.getByText(/Local extraction complete/)).toBeInTheDocument();
    expect(screen.getByText(/AI summary is waiting for consent approval/)).toBeInTheDocument();
    expect(screen.getByLabelText("PDF summary progress")).toHaveAttribute("aria-valuenow", "72");
  });

  it("opens the step-scoped AI consent dialog from Review consent", () => {
    renderWithIntl(<PdfSummaryWorkflow />);

    const trigger = screen.getByRole("button", { name: "Review consent" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Review AI consent" });
    expect(dialog).toHaveFocus();
    expect(screen.getByText("Only extracted text from the selected workflow step is sent.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));

    expect(screen.queryByRole("dialog", { name: "Review AI consent" })).not.toBeInTheDocument();
    expect(screen.getByText("Consent reviewed for this workflow step.")).toBeInTheDocument();
  });

  it("persists the approved AI provider route in the consent audit log", () => {
    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Review consent" }));

    expect(screen.getByText("Toolars AI Gateway · Fast summary model · 30 day audit retention")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));

    const rawLog = window.localStorage.getItem(AI_CONSENT_AUDIT_STORAGE_KEY);

    expect(rawLog).toContain("pdf-summary");
    expect(rawLog).toContain("summarize-with-ai");
    expect(rawLog).toContain("pdf-summary.fast-summary:v1");
  });

  it("posts approved consent with run metadata to the server audit ledger", () => {
    window.localStorage.setItem(
      WORKSPACE_IDENTITY_STORAGE_KEY,
      JSON.stringify({
        createdAt: "2026-06-19T10:07:00Z",
        source: "anonymous-local",
        version: 1,
        workspaceId: "toolars_ws_pdf_summary_test"
      })
    );
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ ledger: { events: [], runs: [], version: 1 } }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<PdfSummaryWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Review consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ai/consent-audit",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
          "x-toolars-workspace-id": "toolars_ws_pdf_summary_test"
        },
        method: "POST"
      })
    );

    const [, init] = fetchMock.mock.calls.find(([url, callInit]) => url === "/api/ai/consent-audit" && callInit?.method === "POST")!;
    const body = JSON.parse(String(init.body));

    expect(body.event).toMatchObject({
      providerRouteId: "pdf-summary.fast-summary:v1",
      stepId: "summarize-with-ai",
      workflowSlug: "pdf-summary"
    });
    expect(body.runMetadata).toMatchObject({
      modelFamily: "Fast summary model",
      providerRouteId: "pdf-summary.fast-summary:v1",
      retentionDays: 30,
      status: "consent-approved"
    });
    expect(body.runMetadata.contentBytes).toBeGreaterThan(0);
    expect(body.runMetadata.runId).toMatch(/^run_pdf-summary_summarize-with-ai_/);
  });

  it("loads PDF Toolkit server upload handoffs for the workflow input source", async () => {
    window.localStorage.setItem(
      WORKSPACE_IDENTITY_STORAGE_KEY,
      JSON.stringify({
        createdAt: "2026-06-19T10:30:00Z",
        source: "anonymous-local",
        version: 1,
        workspaceId: "toolars_ws_pdf_handoff_test"
      })
    );
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        uploads: [
          {
            deleteStatus: "active",
            expiresAt: "2026-06-19T12:30:00Z",
            fileName: "Board Pack.pdf",
            handoffTarget: "pdf-summary",
            handoffToken: "handoff_pdf-summary_board_pack",
            objectKey: "temp/toolars_ws_pdf_handoff_test/pdf_upload_board_pack.pdf",
            retentionLabel: "Temporary server object",
            scanLabel: "Server scan passed",
            scanStatus: "ready",
            uploadId: "pdf_upload_board_pack",
            workspaceId: "toolars_ws_pdf_handoff_test"
          }
        ]
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<PdfSummaryWorkflow />);

    expect(await screen.findByText("Board Pack.pdf")).toBeInTheDocument();
    expect(screen.getByText("Server handoff ready")).toBeInTheDocument();
    expect(screen.getByText("handoff_pdf-summary_board_pack")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/pdf/uploads?handoff=pdf-summary", {
      headers: {
        "x-toolars-workspace-id": "toolars_ws_pdf_handoff_test"
      }
    });
  });
});
