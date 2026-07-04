import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { JsonTreeViewerWorkspace } from "./json-tree-viewer-workspace";

const jsonTreeViewerSourceFile =
  "src/app/[locale]/tools/json-tree-viewer/json-tree-viewer-workspace.tsx";

function scanJsonTreeViewerWorkspaceSource() {
  return scanSourceText(readFileSync(jsonTreeViewerSourceFile, "utf8"), jsonTreeViewerSourceFile);
}

describe("JsonTreeViewerWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanJsonTreeViewerWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and inspects JSON paths", () => {
    renderWithIntl(<JsonTreeViewerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "json-tree-viewer");
    expect(screen.getByRole("heading", { name: "JSON Tree Viewer" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("JSON input"), { target: { value: '{"user":{"name":"Ada"}}' } });
    fireEvent.click(screen.getByRole("button", { name: "Inspect JSON" }));

    expect(screen.getByText("$.user.name")).toBeInTheDocument();
  });
});
