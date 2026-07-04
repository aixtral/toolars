import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { PdfToWordWorkspace } from "./pdf-to-word-workspace";

describe("PdfToWordWorkspace", () => {
  it("renders native PDF to Word handoff controls", () => {
    renderWithIntl(<PdfToWordWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "pdf-to-word");
    expect(screen.getByRole("heading", { name: "PDF to Word" })).toBeInTheDocument();
    expect(screen.getByLabelText("PDF metadata")).toBeInTheDocument();
    expect(screen.getByLabelText("Preserve layout")).toBeChecked();
  });

  it("builds a DOCX conversion handoff without claiming browser conversion", () => {
    renderWithIntl(<PdfToWordWorkspace />);

    fireEvent.change(screen.getByLabelText("PDF metadata"), {
      target: { value: "Proposal.pdf, 8, 1200000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Plan DOCX handoff" }));

    expect(screen.getByLabelText("DOCX handoff output")).toHaveTextContent("Proposal.docx");
    expect(screen.getAllByText("Conversion handoff ready").length).toBeGreaterThan(0);
    expect(screen.getByText("Actual DOCX generation requires a conversion service after this local validation step.")).toBeInTheDocument();
  });
});
