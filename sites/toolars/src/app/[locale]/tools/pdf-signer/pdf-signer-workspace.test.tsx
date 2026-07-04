import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { PdfSignerWorkspace } from "./pdf-signer-workspace";

const pdfSignerSourceFile = "src/app/[locale]/tools/pdf-signer/pdf-signer-workspace.tsx";

function scanPdfSignerWorkspaceSource() {
  return scanSourceText(readFileSync(pdfSignerSourceFile, "utf8"), pdfSignerSourceFile);
}

describe("PdfSignerWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPdfSignerWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native PDF signature placement controls", () => {
    renderWithIntl(<PdfSignerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "pdf-signer");
    expect(screen.getByRole("heading", { name: "PDF Signer" })).toBeInTheDocument();
    expect(screen.getByLabelText("PDF metadata")).toBeInTheDocument();
    expect(screen.getByLabelText("Signer name")).toBeInTheDocument();
    expect(screen.getByLabelText("Signature type")).toHaveDisplayValue("Typed");
  });

  it("plans signature placement without claiming the PDF has been signed", () => {
    renderWithIntl(<PdfSignerWorkspace />);

    fireEvent.change(screen.getByLabelText("PDF metadata"), {
      target: { value: "Offer Letter.pdf, 5, 1900000" }
    });
    fireEvent.change(screen.getByLabelText("Signer name"), {
      target: { value: "Avery Stone" }
    });
    fireEvent.change(screen.getByLabelText("Signature page"), {
      target: { value: "5" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Plan signature" }));

    expect(screen.getByLabelText("Signature plan output")).toHaveTextContent("Offer_Letter_signed.pdf");
    expect(screen.getAllByText("Signing engine required").length).toBeGreaterThan(0);
    expect(screen.getByText(/not embedded/i)).toBeInTheDocument();
  });
});
