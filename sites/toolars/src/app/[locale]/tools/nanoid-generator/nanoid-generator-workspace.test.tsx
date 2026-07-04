import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { NanoidGeneratorWorkspace } from "./nanoid-generator-workspace";

const nanoidGeneratorSourceFile = "src/app/[locale]/tools/nanoid-generator/nanoid-generator-workspace.tsx";

function scanNanoidGeneratorWorkspaceSource() {
  return scanSourceText(readFileSync(nanoidGeneratorSourceFile, "utf8"), nanoidGeneratorSourceFile);
}

describe("NanoidGeneratorWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanNanoidGeneratorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native NanoID Generator controls", () => {
    renderWithIntl(<NanoidGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "nanoid-generator");
    expect(screen.getByRole("heading", { name: "NanoID Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("ID length")).toHaveValue(21);
    expect(screen.getByRole("button", { name: "Generate IDs" })).toBeEnabled();
  });

  it("generates compact IDs locally", () => {
    renderWithIntl(<NanoidGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("ID length"), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate IDs" }));

    expect(screen.getAllByTestId("nanoid-output")).toHaveLength(3);
    expect(screen.getByText("3 IDs generated")).toBeInTheDocument();
  });
});
