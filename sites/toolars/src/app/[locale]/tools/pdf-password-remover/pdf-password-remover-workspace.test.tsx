import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { PdfPasswordRemoverWorkspace } from "./pdf-password-remover-workspace";

describe("PdfPasswordRemoverWorkspace", () => {
  it("renders local ownership validation controls for password removal", () => {
    renderWithIntl(<PdfPasswordRemoverWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "pdf-password-remover");
    expect(screen.getByRole("heading", { name: "PDF Password Remover" })).toBeInTheDocument();
    expect(screen.getByLabelText("Locked PDF metadata")).toBeInTheDocument();
    expect(screen.getByLabelText("I own this PDF or have permission to unlock it")).toBeInTheDocument();
  });

  it("shows the PDF engine handoff only after ownership and password evidence", () => {
    renderWithIntl(<PdfPasswordRemoverWorkspace />);

    fireEvent.change(screen.getByLabelText("Locked PDF metadata"), {
      target: { value: "Client Contract.pdf, 12, 2800000" }
    });
    fireEvent.click(screen.getByLabelText("I own this PDF or have permission to unlock it"));
    fireEvent.click(screen.getByLabelText("I can provide the existing password"));
    fireEvent.click(screen.getByRole("button", { name: "Validate unlock" }));

    expect(screen.getByLabelText("Unlock validation output")).toHaveTextContent("Client_Contract_unlocked.pdf");
    expect(screen.getAllByText("PDF engine required").length).toBeGreaterThan(0);
    expect(screen.getByText(/does not crack passwords/i)).toBeInTheDocument();
  });
});
