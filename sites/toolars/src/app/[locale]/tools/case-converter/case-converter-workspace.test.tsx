import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CaseConverterWorkspace } from "./case-converter-workspace";

const caseConverterSourceFile = "src/app/[locale]/tools/case-converter/case-converter-workspace.tsx";

function scanCaseConverterWorkspaceSource() {
  return scanSourceText(readFileSync(caseConverterSourceFile, "utf8"), caseConverterSourceFile);
}

describe("CaseConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCaseConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the Toolars case conversion workspace sections", () => {
    renderWithIntl(<CaseConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "case-converter");
    expect(screen.getByRole("heading", { name: "Case Converter" })).toBeInTheDocument();
    expect(screen.getByText("Naming conversion")).toBeInTheDocument();
    expect(screen.getByText("Case input")).toBeInTheDocument();
    expect(screen.getByText("Generated variants")).toBeInTheDocument();
    expect(screen.getByText("Detected words")).toBeInTheDocument();
    expect(screen.getByLabelText("Source text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Convert case" })).toBeDisabled();
  });

  it("converts mixed naming text into copy-ready variants locally", () => {
    renderWithIntl(<CaseConverterWorkspace />);

    fireEvent.change(screen.getByLabelText("Source text"), {
      target: { value: "XMLHttp_request parser demo" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Convert case" }));

    expect(screen.getByText("xmlHttpRequestParserDemo")).toBeInTheDocument();
    expect(screen.getByText("XML_HTTP_REQUEST_PARSER_DEMO")).toBeInTheDocument();
    expect(screen.getByText("5 detected words")).toBeInTheDocument();
    expect(screen.getByText("Local conversion only; input text stays in the browser.")).toBeInTheDocument();
  });
});
