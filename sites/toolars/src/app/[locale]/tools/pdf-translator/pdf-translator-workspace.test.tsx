import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { PdfTranslatorWorkspace } from "./pdf-translator-workspace";

const pdfTranslatorSourceFile =
  "src/app/[locale]/tools/pdf-translator/pdf-translator-workspace.tsx";

function scanPdfTranslatorWorkspaceSource() {
  return scanSourceText(readFileSync(pdfTranslatorSourceFile, "utf8"), pdfTranslatorSourceFile);
}

describe("PdfTranslatorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPdfTranslatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native PDF translation planning controls", () => {
    renderWithIntl(<PdfTranslatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "pdf-translator");
    expect(screen.getByRole("heading", { name: "PDF Translator" })).toBeInTheDocument();
    expect(screen.getByLabelText("PDF extraction metadata")).toBeInTheDocument();
    expect(screen.getByLabelText("Target language")).toHaveDisplayValue("Spanish");
  });

  it("shows AI consent and PDF engine boundaries for translated output", () => {
    renderWithIntl(<PdfTranslatorWorkspace />);

    fireEvent.change(screen.getByLabelText("PDF extraction metadata"), {
      target: { value: "Product Manual.pdf, 32, 7200000, 24000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Plan translation" }));

    expect(screen.getByLabelText("Translation handoff output")).toHaveTextContent("Product_Manual_es_translation.pdf");
    expect(screen.getAllByText("AI consent required").length).toBeGreaterThan(0);
    expect(screen.getByText(/PDF engine/i)).toBeInTheDocument();
  });
});
