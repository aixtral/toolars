import { readFileSync } from "node:fs";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { AiPdfSummarizerWorkspace } from "./ai-pdf-summarizer-workspace";

const aiPdfSummarizerSourceFile =
  "src/app/[locale]/tools/ai-pdf-summarizer/ai-pdf-summarizer-workspace.tsx";

function scanAiPdfSummarizerWorkspaceSource() {
  return scanSourceText(readFileSync(aiPdfSummarizerSourceFile, "utf8"), aiPdfSummarizerSourceFile);
}

describe("AiPdfSummarizerWorkspace", () => {
  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanAiPdfSummarizerWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders native AI PDF summary planning controls", () => {
    renderWithIntl(<AiPdfSummarizerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "ai-pdf-summarizer");
    expect(screen.getByRole("heading", { name: "AI PDF Summarizer" })).toBeInTheDocument();
    expect(screen.getByLabelText("PDF extraction metadata")).toBeInTheDocument();
    expect(screen.getByLabelText("Summary style")).toHaveDisplayValue("Executive");
  });

  it("shows an AI-consent handoff without claiming server-side summarization is complete", () => {
    renderWithIntl(<AiPdfSummarizerWorkspace />);

    fireEvent.change(screen.getByLabelText("PDF extraction metadata"), {
      target: { value: "Board Pack.pdf, 18, 8400000, 42000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Plan summary" }));

    expect(screen.getByLabelText("Summary handoff output")).toHaveTextContent("Board_Pack_summary.md");
    expect(screen.getAllByText("AI consent required").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/model route/i).length).toBeGreaterThan(0);
  });
});
