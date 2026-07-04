import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SyntheticDatasetGeneratorWorkspace } from "./synthetic-dataset-generator-workspace";

const syntheticDatasetGeneratorSourceFile =
  "src/app/[locale]/tools/synthetic-dataset-generator/synthetic-dataset-generator-workspace.tsx";

function scanSyntheticDatasetGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(syntheticDatasetGeneratorSourceFile, "utf8"), syntheticDatasetGeneratorSourceFile);
}

describe("SyntheticDatasetGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanSyntheticDatasetGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and generates local AI workflow fixture rows", () => {
    renderWithIntl(<SyntheticDatasetGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "synthetic-dataset-generator");
    expect(screen.getByRole("heading", { name: "AI Fixture Dataset Generator" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Fixture fields"), {
      target: { value: "ticket:string\nlabel:enum(billing|bug)" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate fixtures" }));

    expect(screen.getByText(/ticket_1/)).toBeInTheDocument();
    expect(screen.getAllByText(/JSONL ready/).length).toBeGreaterThan(0);
  });
});
