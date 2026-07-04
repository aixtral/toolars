import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { PdfCompressorWorkspace } from "./pdf-compressor-workspace";

const pdfCompressorSourceFile = "src/app/[locale]/tools/pdf-compressor/pdf-compressor-workspace.tsx";

function scanPdfCompressorWorkspaceSource() {
  return scanSourceText(readFileSync(pdfCompressorSourceFile, "utf8"), pdfCompressorSourceFile);
}

describe("PdfCompressorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPdfCompressorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native PDF compression estimation controls", () => {
    renderWithIntl(<PdfCompressorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "pdf-compressor");
    expect(screen.getByRole("heading", { name: "PDF Compressor" })).toBeInTheDocument();
    expect(screen.getByLabelText("PDF metadata")).toBeInTheDocument();
    expect(screen.getByLabelText("Compression profile")).toHaveDisplayValue("Balanced");
  });

  it("estimates compressed output size locally", () => {
    renderWithIntl(<PdfCompressorWorkspace />);

    fireEvent.change(screen.getByLabelText("PDF metadata"), {
      target: { value: "Large Deck.pdf, 24, 12582912" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Estimate compression" }));

    expect(screen.getByLabelText("Compression estimate output")).toHaveTextContent("Large_Deck_compressed.pdf");
    expect(screen.getByText("41% estimated savings")).toBeInTheDocument();
  });
});
