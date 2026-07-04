import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WORKSPACE_IDENTITY_STORAGE_KEY } from "@/lib/workspace/workspace-identity";
import es from "../../../../../messages/es.json";
import { PdfToolkitWorkspace } from "./pdf-toolkit-workspace";

function scanPdfToolkitWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/pdf-toolkit/pdf-toolkit-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

function renderPdfToolkitWithSpanishMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      <PdfToolkitWorkspace />
    </NextIntlClientProvider>
  );
}

describe("PdfToolkitWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the design-contract sections for the PDF workspace", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    expect(screen.getByRole("heading", { name: "PDF Toolkit" })).toBeInTheDocument();
    expect(screen.getByText("Add & organize PDF files")).toBeInTheDocument();
    expect(screen.getByText("Choose operation")).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AI Enhance" })).toBeInTheDocument();
    expect(screen.getByText("Local PDF operations")).toBeInTheDocument();
    expect(document.querySelector('[data-pdf-mobile-density="sidebar-first"]')).toBeInTheDocument();
    expect(document.querySelector('[data-pdf-desktop-layout="workspace-v2"]')).toBeInTheDocument();
    expect(screen.getByText("Pro plan usage")).toBeInTheDocument();
    expect(screen.getByText("Key takeaways")).toBeInTheDocument();
    expect(screen.getByText("Citations")).toBeInTheDocument();
    expect(screen.getByText("Turn PDF into slides")).toBeInTheDocument();
    expect(screen.getByText("Create email draft")).toBeInTheDocument();
    expect(document.querySelectorAll(".next-step-strip article")).toHaveLength(5);
  });

  it("keeps the desktop PDF workspace grid fluid within the shell content width", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    const desktopGridRule = css.match(
      /\.pdf-workspace-shell\[data-pdf-desktop-layout="workspace-v2"\] \.pdf-workspace\s*{[^}]*grid-template-columns:\s*([^;]+);/
    );

    expect(desktopGridRule?.[1]).toContain("minmax(0,");
    expect(desktopGridRule?.[1]).not.toMatch(/\\d+px/);
  });

  it("keeps the PDF workspace source clear of i18n audit candidates", () => {
    const scan = scanPdfToolkitWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("requires explicit consent before generating an AI summary", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Summarize" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate summary" }));

    expect(screen.getByText("Consent required before AI processing.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "I consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve AI consent" }));
    fireEvent.click(screen.getByRole("button", { name: "Generate summary" }));

    expect(screen.getByText("AI summary ready")).toBeInTheDocument();
    expect(screen.getByText(/Q2 2024 marketing report/)).toBeInTheDocument();
  });

  it("opens an AI consent dialog and restores focus when dismissed", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    const trigger = screen.getByRole("button", { name: "I consent" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Review AI consent" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();
    expect(screen.getByText("Only selected PDF text is sent after you approve this step.")).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Review AI consent" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(screen.getByRole("button", { name: "I consent" })).toBeInTheDocument();
  });

  it("opens a local PDF upload overlay from Add files and restores focus on close", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    const trigger = screen.getByRole("button", { name: "Add files" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Add PDF files" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();
    expect(screen.getByText("Files stay on this device until you choose a cloud or AI step.")).toBeInTheDocument();
    expect(screen.getByText("PDF limit: 50 MB per file")).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Add PDF files" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps upload guidance separate from AI consent copy", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Add files" }));

    const uploadDialog = screen.getByRole("dialog", { name: "Add PDF files" });

    expect(uploadDialog).toBeInTheDocument();
    expect(screen.getByText("Queued locally")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve AI consent" })).not.toBeInTheDocument();

    fireEvent.keyDown(uploadDialog, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "I consent" }));

    expect(screen.getByRole("dialog", { name: "Review AI consent" })).toBeInTheDocument();
  });

  it("queues selected File API PDFs after scan and applies session retention", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Add files" }));
    const fileInput = screen.getByLabelText("Choose PDF files");
    const upload = new File(["pdf"], "Client_Brief.pdf", { type: "application/pdf" });

    fireEvent.change(fileInput, { target: { files: [upload] } });

    expect(screen.getByText("Client_Brief.pdf")).toBeInTheDocument();
    expect(screen.getByText("Scan passed")).toBeInTheDocument();
    expect(screen.getByText("Auto-delete after session")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add 1 file to queue" }));

    expect(screen.queryByRole("dialog", { name: "Add PDF files" })).not.toBeInTheDocument();
    expect(screen.getByText("Client_Brief.pdf")).toBeInTheDocument();
    expect(screen.getByText("Uploaded · Scan passed · Auto-delete after session")).toBeInTheDocument();
  });

  it("registers ready PDF uploads with the server temp store for workflow handoff", async () => {
    window.localStorage.setItem(
      WORKSPACE_IDENTITY_STORAGE_KEY,
      JSON.stringify({
        createdAt: "2026-06-19T10:27:00Z",
        source: "anonymous-local",
        version: 1,
        workspaceId: "toolars_ws_upload_component_test"
      })
    );
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        uploads: [
          {
            deleteStatus: "active",
            expiresAt: "2026-06-19T12:27:00Z",
            fileName: "Client_Brief.pdf",
            handoffTarget: "pdf-summary",
            handoffToken: "handoff_pdf-summary_component_test",
            objectKey: "temp/toolars_ws_upload_component_test/pdf_upload_component_test.pdf",
            retentionLabel: "Temporary server object",
            scanLabel: "Server scan passed",
            scanStatus: "ready",
            uploadId: "pdf_upload_component_test",
            workspaceId: "toolars_ws_upload_component_test"
          }
        ]
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<PdfToolkitWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Add files" }));
    fireEvent.change(screen.getByLabelText("Choose PDF files"), {
      target: { files: [new File(["pdf"], "Client_Brief.pdf", { type: "application/pdf" })] }
    });

    expect(await screen.findByText("Server scan passed")).toBeInTheDocument();
    expect(screen.getByText("Temporary server object")).toBeInTheDocument();
    expect(screen.getByText("handoff_pdf-summary_component_test")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/pdf/uploads",
      expect.objectContaining({
        headers: {
          "x-toolars-workspace-id": "toolars_ws_upload_component_test"
        },
        method: "POST"
      })
    );

    fireEvent.click(screen.getByRole("button", { name: "Add 1 file to queue" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Add PDF files" })).not.toBeInTheDocument();
    });
    expect(screen.getByText("Uploaded · Server scan passed · Temporary server object")).toBeInTheDocument();
  });

  it("shows server storage failure and lets users retry the upload handoff", async () => {
    window.localStorage.setItem(
      WORKSPACE_IDENTITY_STORAGE_KEY,
      JSON.stringify({
        createdAt: "2026-06-19T10:35:00Z",
        source: "anonymous-local",
        version: 1,
        workspaceId: "toolars_ws_upload_retry_test"
      })
    );
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ error: "Storage unavailable" }),
        ok: false
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          uploads: [
            {
              deleteStatus: "active",
              expiresAt: "2026-06-19T12:35:00Z",
              fileName: "Retry_Me.pdf",
              handoffTarget: "pdf-summary",
              handoffToken: "handoff_pdf-summary_retry_component_test",
              objectKey: "temp/toolars_ws_upload_retry_test/pdf_upload_retry_component_test.pdf",
              retentionLabel: "Temporary server object",
              scanLabel: "Server scan passed",
              scanStatus: "ready",
              signedHandoffUrl: "/api/pdf/uploads?handoffToken=handoff_pdf-summary_retry_component_test&signature=abc",
              signedObjectUrl: "/api/pdf/uploads/object?objectKey=temp%2Ftoolars_ws_upload_retry_test%2Fpdf_upload_retry_component_test.pdf&signature=def",
              uploadId: "pdf_upload_retry_component_test",
              workspaceId: "toolars_ws_upload_retry_test"
            }
          ]
        }),
        ok: true
      });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<PdfToolkitWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Add files" }));
    fireEvent.change(screen.getByLabelText("Choose PDF files"), {
      target: { files: [new File(["pdf"], "Retry_Me.pdf", { type: "application/pdf" })] }
    });

    expect(await screen.findByText("Storage handoff failed")).toBeInTheDocument();
    expect(screen.getByText("Retry upload handoff")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry upload handoff Retry_Me.pdf" }));

    expect(await screen.findByText("Server scan passed")).toBeInTheDocument();
    expect(screen.getByText("handoff_pdf-summary_retry_component_test")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("shows scan rejection and lets users delete uploaded files from the local queue", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Add files" }));
    const fileInput = screen.getByLabelText("Choose PDF files");
    const upload = new File(["pdf"], "Contract.pdf", { type: "application/pdf" });
    const textFile = new File(["notes"], "notes.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [upload, textFile] } });

    expect(screen.getByText("Contract.pdf")).toBeInTheDocument();
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
    expect(screen.getByText("Only PDF files can be queued")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add 1 file to queue" }));

    expect(screen.getByText("Contract.pdf")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete uploaded file Contract.pdf" }));

    expect(screen.queryByText("Contract.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("Deleted Contract.pdf from the local queue.")).toBeInTheDocument();
  });

  it("renders critical PDF workspace controls and statuses from the active locale bundle", () => {
    const { container } = renderPdfToolkitWithSpanishMessages();

    expect(screen.getByRole("button", { name: "Añadir archivos" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add files" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Resultado" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mejora con IA" })).toBeInTheDocument();
    expect(screen.getByText("hace 2 h")).toBeInTheDocument();
    expect(screen.queryByText("2h")).not.toBeInTheDocument();
    expect(container.querySelector(".pdf-mobile-rail-back")).toHaveAttribute("href", "/es/explore/pdf");
    expect(container.querySelector('.workspace-tab[href="/es/workflows/pdf-summary"]')).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Resumir" }));
    fireEvent.click(screen.getByRole("button", { name: "Generar resumen" }));

    expect(screen.getByText("Se requiere consentimiento antes del procesamiento con IA.")).toBeInTheDocument();
    expect(screen.queryByText("Consent required before AI processing.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Añadir archivos" }));
    fireEvent.change(screen.getByLabelText("Elegir archivos PDF"), {
      target: { files: [new File(["pdf"], "Client_Brief.pdf", { type: "application/pdf" })] }
    });

    expect(screen.getByText("Escaneo aprobado")).toBeInTheDocument();
    expect(screen.queryByText("Scan passed")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Añadir 1 archivo a la cola" })).toBeInTheDocument();
  });
});
