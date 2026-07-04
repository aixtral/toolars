import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { HttpStatusReferenceWorkspace } from "./http-status-reference-workspace";

const httpStatusReferenceSourceFile =
  "src/app/[locale]/tools/http-status-reference/http-status-reference-workspace.tsx";

function scanHttpStatusReferenceWorkspaceSource() {
  return scanSourceText(readFileSync(httpStatusReferenceSourceFile, "utf8"), httpStatusReferenceSourceFile);
}

describe("HttpStatusReferenceWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanHttpStatusReferenceWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and searches status codes", () => {
    renderWithIntl(<HttpStatusReferenceWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "http-status-reference");
    expect(screen.getByRole("heading", { name: "HTTP Status Reference" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Status search"), { target: { value: "404" } });
    fireEvent.click(screen.getByRole("button", { name: "Search statuses" }));

    expect(screen.getByText(/404 Not Found/)).toBeInTheDocument();
  });
});
