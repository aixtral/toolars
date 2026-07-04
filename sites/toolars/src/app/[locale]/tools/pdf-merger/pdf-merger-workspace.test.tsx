import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { PdfMergerWorkspace } from "./pdf-merger-workspace";

describe("PdfMergerWorkspace", () => {
  it("renders native PDF merge planning controls", () => {
    renderWithIntl(<PdfMergerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "pdf-merger");
    expect(screen.getByRole("heading", { name: "PDF Merger" })).toBeInTheDocument();
    expect(screen.getByLabelText("PDF files")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Plan merge" })).toBeInTheDocument();
  });

  it("plans a local merge queue from pasted PDF metadata", () => {
    renderWithIntl(<PdfMergerWorkspace />);

    fireEvent.change(screen.getByLabelText("PDF files"), {
      target: { value: "Client Brief.pdf, 8, 1600000\nAppendix.pdf, 4, 800000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Plan merge" }));

    expect(screen.getByLabelText("Merge plan output")).toHaveTextContent("Client_Brief_merged.pdf");
    expect(screen.getAllByText("Merge plan ready").length).toBeGreaterThan(0);
  });
});
