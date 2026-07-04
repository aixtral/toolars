import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { HtmlPreviewWorkspace } from "./html-preview-workspace";

const htmlPreviewSourceFile = "src/app/[locale]/tools/html-preview/html-preview-workspace.tsx";

function scanHtmlPreviewWorkspaceSource() {
  return scanSourceText(readFileSync(htmlPreviewSourceFile, "utf8"), htmlPreviewSourceFile);
}

describe("HtmlPreviewWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanHtmlPreviewWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and builds an iframe preview", () => {
    renderWithIntl(<HtmlPreviewWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "html-preview");
    expect(screen.getByRole("heading", { name: "HTML Preview" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("HTML input"), { target: { value: "<h1>Toolars</h1>" } });
    fireEvent.click(screen.getByRole("button", { name: "Preview HTML" }));

    expect(screen.getByTitle("HTML preview")).toHaveAttribute("sandbox");
    expect(screen.getAllByText(/Preview ready/).length).toBeGreaterThan(0);
  });
});
