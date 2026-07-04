import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { HtmlMarkdownConverterWorkspace } from "./html-markdown-converter-workspace";

const htmlMarkdownConverterSourceFile =
  "src/app/[locale]/tools/html-markdown-converter/html-markdown-converter-workspace.tsx";

function scanHtmlMarkdownConverterWorkspaceSource() {
  return scanSourceText(readFileSync(htmlMarkdownConverterSourceFile, "utf8"), htmlMarkdownConverterSourceFile);
}

describe("HtmlMarkdownConverterWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanHtmlMarkdownConverterWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders and converts HTML to Markdown", () => {
    renderWithIntl(<HtmlMarkdownConverterWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "html-markdown-converter");
    expect(screen.getByRole("heading", { name: "HTML to Markdown Converter" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Markup input"), { target: { value: "<h1>Guide</h1>" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert markup" }));

    expect(screen.getByText(/# Guide/)).toBeInTheDocument();
  });
});
