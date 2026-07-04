import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { PiiScannerWorkspace } from "./pii-scanner-workspace";

const piiScannerSourceFile = "src/app/[locale]/tools/pii-scanner/pii-scanner-workspace.tsx";

function scanPiiScannerWorkspaceSource() {
  return scanSourceText(readFileSync(piiScannerSourceFile, "utf8"), piiScannerSourceFile);
}

describe("PiiScannerWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPiiScannerWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the Toolars PII scanner workspace sections", () => {
    renderWithIntl(<PiiScannerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "pii-scanner");
    expect(screen.getByRole("heading", { name: "PII Scanner" })).toBeInTheDocument();
    expect(screen.getByText("Privacy scan")).toBeInTheDocument();
    expect(screen.getByText("Detection report")).toBeInTheDocument();
    expect(screen.getByText("Redacted output")).toBeInTheDocument();
    expect(screen.getByLabelText("Source text")).toBeInTheDocument();
  });

  it("redacts detected PII locally", () => {
    renderWithIntl(<PiiScannerWorkspace />);

    fireEvent.change(screen.getByLabelText("Source text"), {
      target: { value: "Email jane@example.com or call (415) 555-1212." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Scan PII" }));

    expect(screen.getByText("[REDACTED_EMAIL]")).toBeInTheDocument();
    expect(screen.getByText("[REDACTED_PHONE]")).toBeInTheDocument();
    expect(screen.getByText("Local PII scan only; source text stays in the browser.")).toBeInTheDocument();
  });
});
