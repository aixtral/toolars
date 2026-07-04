import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { ToxicityScannerWorkspace } from "./toxicity-scanner-workspace";

const toxicityScannerSourceFile =
  "src/app/[locale]/tools/toxicity-scanner/toxicity-scanner-workspace.tsx";

function scanToxicityScannerWorkspaceSource() {
  return scanSourceText(readFileSync(toxicityScannerSourceFile, "utf8"), toxicityScannerSourceFile);
}

describe("ToxicityScannerWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanToxicityScannerWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the Toolars toxicity scanner workspace sections", () => {
    renderWithIntl(<ToxicityScannerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "toxicity-scanner");
    expect(screen.getByRole("heading", { name: "Toxicity Scanner" })).toBeInTheDocument();
    expect(screen.getByText("Moderation scan")).toBeInTheDocument();
    expect(screen.getByText("Safety report")).toBeInTheDocument();
    expect(screen.getByText("Reviewer notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Text to scan")).toBeInTheDocument();
  });

  it("flags toxic text locally", () => {
    renderWithIntl(<ToxicityScannerWorkspace />);

    fireEvent.change(screen.getByLabelText("Text to scan"), {
      target: { value: "You are a stupid idiot and I will kill your access." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Scan toxicity" }));

    expect(screen.getByText("Threat")).toBeInTheDocument();
    expect(screen.getByText("Local toxicity scan only; text stays in the browser.")).toBeInTheDocument();
  });
});
