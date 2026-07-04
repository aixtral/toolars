import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SyntheticDatasetGenWorkspace } from "./synthetic-dataset-gen-workspace";

const syntheticDatasetGenSourceFile = "src/app/[locale]/tools/synthetic-dataset-gen/synthetic-dataset-gen-workspace.tsx";

function scanSyntheticDatasetGenSource() {
  return scanSourceText(readFileSync(syntheticDatasetGenSourceFile, "utf8"), syntheticDatasetGenSourceFile);
}

describe("SyntheticDatasetGenWorkspace", () => {
  it("keeps workspace source free of hardcoded UI scanner candidates", () => {
    const sourceScan = scanSyntheticDatasetGenSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and builds a synthetic dataset", () => {
    renderWithIntl(<SyntheticDatasetGenWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "synthetic-dataset-gen");
    expect(screen.getByRole("heading", { name: "Synthetic Dataset Generator" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Dataset schema"), {
      target: { value: "account_id:string\nsegment:enum(smb|enterprise)" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Build dataset" }));

    expect(screen.getByText(/account_id_1/)).toBeInTheDocument();
    expect(screen.getAllByText(/synthetic rows/).length).toBeGreaterThan(0);
  });
});
