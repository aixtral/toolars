import { fireEvent, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { ModelComparatorWorkspace } from "./model-comparator-workspace";

const modelComparatorSourceFile = "src/app/[locale]/tools/model-comparator/model-comparator-workspace.tsx";

function scanModelComparatorSource() {
  return scanSourceText(readFileSync(modelComparatorSourceFile, "utf8"), modelComparatorSourceFile);
}

describe("ModelComparatorWorkspace", () => {
  it("keeps workspace source free of hardcoded UI scanner candidates", () => {
    const sourceScan = scanModelComparatorSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the Toolars model comparison workspace", () => {
    renderWithIntl(<ModelComparatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "model-comparator");
    expect(screen.getByRole("heading", { name: "Model Comparator" })).toBeInTheDocument();
    expect(screen.getByText("Model fit comparison")).toBeInTheDocument();
    expect(screen.getByLabelText("Workload tokens")).toHaveDisplayValue("14000");
    expect(screen.getByLabelText("Latency target")).toBeInTheDocument();
  });

  it("compares model profiles and shows a recommendation", () => {
    renderWithIntl(<ModelComparatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Compare models" }));

    expect(screen.getByText("Recommended model")).toBeInTheDocument();
    expect(screen.getAllByText("GPT-4o mini").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Local model comparison only/)).toBeInTheDocument();
  });
});
