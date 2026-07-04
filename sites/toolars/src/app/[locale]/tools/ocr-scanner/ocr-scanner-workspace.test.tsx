import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { OcrScannerWorkspace } from "./ocr-scanner-workspace";

const ocrScannerSourceFile = "src/app/[locale]/tools/ocr-scanner/ocr-scanner-workspace.tsx";

function scanOcrScannerSource() {
  return scanSourceText(readFileSync(ocrScannerSourceFile, "utf8"), ocrScannerSourceFile);
}

describe("OcrScannerWorkspace", () => {
  it("has no hardcoded workspace text or absolute href i18n audit candidates", () => {
    const sourceScan = scanOcrScannerSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native OCR planning controls", () => {
    renderWithIntl(<OcrScannerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "ocr-scanner");
    expect(screen.getByRole("heading", { name: "OCR Scanner" })).toBeInTheDocument();
    expect(screen.getByLabelText("Image or PDF metadata")).toBeInTheDocument();
    expect(screen.getByLabelText("Language")).toHaveDisplayValue("English");
  });

  it("plans OCR handoff for image metadata", () => {
    renderWithIntl(<OcrScannerWorkspace />);

    fireEvent.change(screen.getByLabelText("Image or PDF metadata"), {
      target: { value: "receipt.png, image/png, 520000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Plan OCR" }));

    expect(screen.getByLabelText("OCR handoff output")).toHaveTextContent("receipt_ocr.txt");
    expect(screen.getAllByText("OCR engine required").length).toBeGreaterThan(0);
  });
});
