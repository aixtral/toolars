import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { PDFDocument } from "pdf-lib";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

async function createPdfFile(name: string, pageCount = 1) {
  const document = await PDFDocument.create();
  for (let page = 0; page < pageCount; page += 1) document.addPage();
  const bytes = await document.save();
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const file = new File([arrayBuffer], name, {
    type: "application/pdf"
  });
  Object.defineProperty(file, "arrayBuffer", {
    configurable: true,
    value: async () => arrayBuffer
  });
  return file;
}

async function addQueuedPdf(file: File) {
  fireEvent.click(screen.getByRole("button", { name: "Add files" }));
  fireEvent.change(screen.getByLabelText("Choose PDF files"), { target: { files: [file] } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Add 1 file to queue" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Add 1 file to queue" }));
}

describe("PdfToolkitWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts without example documents, a result, or an enabled processing action", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    expect(screen.getByRole("heading", { name: "PDF Toolkit" })).toBeInTheDocument();
    expect(screen.getByText("Add & organize PDF files")).toBeInTheDocument();
    expect(screen.getByText("Choose operation")).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getByText("Ready for local PDF processing.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Merge PDFs" })).toBeDisabled();
    expect(screen.queryByText("Q2_Marketing_Report_2024.pdf")).not.toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Download" })).not.toBeInTheDocument();
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

  it("opens a local PDF upload overlay from Add files and restores focus on close", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    const trigger = screen.getByRole("button", { name: "Add files" });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Add PDF files" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();
    expect(screen.getByText("Files stay on this device.")).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Add PDF files" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("rejects non-PDF uploads and lets users delete queued PDFs", async () => {
    renderWithIntl(<PdfToolkitWorkspace />);
    const upload = await createPdfFile("Contract.pdf");
    const textFile = new File(["notes"], "notes.txt", { type: "text/plain" });

    fireEvent.click(screen.getByRole("button", { name: "Add files" }));
    fireEvent.change(screen.getByLabelText("Choose PDF files"), { target: { files: [upload, textFile] } });

    await waitFor(() => expect(screen.getByText("Only PDF files can be queued")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Add 1 file to queue" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete uploaded file Contract.pdf" }));

    expect(screen.queryByText("Contract.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("Deleted Contract.pdf from the local queue.")).toBeInTheDocument();
  });

  it("merges uploaded PDFs and only enables download after real bytes are produced", async () => {
    const createObjectURL = vi.fn(() => "blob:toolars-output");
    const revokeObjectURL = vi.fn();
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });

    renderWithIntl(<PdfToolkitWorkspace />);
    await addQueuedPdf(await createPdfFile("Client_Brief.pdf", 2));

    fireEvent.click(screen.getByRole("button", { name: "Merge PDFs" }));

    await waitFor(() => expect(screen.getByText("Completed")).toBeInTheDocument());
    expect(screen.getByText("Client_Brief_merged.pdf")).toBeInTheDocument();
    expect(screen.getAllByText(/2 pages/).length).toBeGreaterThanOrEqual(2);

    fireEvent.click(screen.getByRole("button", { name: "Download" }));
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:toolars-output");
  });

  it("produces a ZIP result when splitting uploaded PDFs", async () => {
    renderWithIntl(<PdfToolkitWorkspace />);
    await addQueuedPdf(await createPdfFile("Client_Brief.pdf", 2));

    fireEvent.click(screen.getByRole("button", { name: "Split" }));
    fireEvent.click(screen.getByRole("button", { name: "Split PDF" }));

    await waitFor(() => expect(screen.getByText("Client_Brief_pages.zip")).toBeInTheDocument());
    expect(screen.getAllByText(/2 pages/).length).toBeGreaterThanOrEqual(2);
  });

  it("does not advertise unsupported drive, AI, conversion, sharing, or preview controls", () => {
    renderWithIntl(<PdfToolkitWorkspace />);

    expect(screen.queryByRole("button", { name: "Import from Drive" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Convert" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Summarize" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy link" })).not.toBeInTheDocument();
    expect(screen.queryByText("AI Enhance")).not.toBeInTheDocument();
    expect(screen.queryByText("Preview")).not.toBeInTheDocument();
  });

  it("renders critical controls from the active locale bundle", () => {
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <PdfToolkitWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("button", { name: "Añadir archivos" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add files" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Resultado" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fusionar PDF" })).toBeDisabled();
  });
});
