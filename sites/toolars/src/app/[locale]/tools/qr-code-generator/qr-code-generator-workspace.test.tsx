import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { QrCodeGeneratorWorkspace } from "./qr-code-generator-workspace";

const qrCodeGeneratorSourceFile = "src/app/[locale]/tools/qr-code-generator/qr-code-generator-workspace.tsx";

function scanQrCodeGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(qrCodeGeneratorSourceFile, "utf8"), qrCodeGeneratorSourceFile);
}

describe("QrCodeGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanQrCodeGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native QR preview controls", () => {
    renderWithIntl(<QrCodeGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "qr-code-generator");
    expect(screen.getByRole("heading", { name: "QR Code Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("QR content")).toBeInTheDocument();
    expect(screen.getByLabelText("Error correction")).toHaveDisplayValue("Medium");
  });

  it("generates local SVG preview output", () => {
    renderWithIntl(<QrCodeGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("QR content"), {
      target: { value: "https://toolars.app/tools" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate QR preview" }));

    expect(screen.getByLabelText("QR SVG output")).toHaveTextContent("<svg");
    expect(screen.getAllByText("Preview ready").length).toBeGreaterThan(0);
  });
});
