import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { EmbeddingPlaygroundWorkspace } from "./embedding-playground-workspace";

describe("EmbeddingPlaygroundWorkspace", () => {
  it("renders the Toolars embedding comparison workspace", () => {
    renderWithIntl(<EmbeddingPlaygroundWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "embedding-playground");
    expect(screen.getByRole("heading", { name: "Embedding Playground" })).toBeInTheDocument();
    expect(screen.getByText("Retrieval similarity")).toBeInTheDocument();
    expect(screen.getByLabelText("Query text")).toBeInTheDocument();
    expect(screen.getByLabelText("Candidate chunks")).toBeInTheDocument();
  });

  it("compares chunks and shows the top local match", () => {
    renderWithIntl(<EmbeddingPlaygroundWorkspace />);

    fireEvent.change(screen.getByLabelText("Query text"), { target: { value: "refund annual subscription" } });
    fireEvent.change(screen.getByLabelText("Candidate chunks"), {
      target: { value: "Security settings and SSO\nAnnual subscription refunds are available within 14 days" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Compare chunks" }));

    expect(screen.getByText("Top match")).toBeInTheDocument();
    expect(screen.getAllByText(/Annual subscription refunds/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Local lexical similarity only/)).toBeInTheDocument();
  });
});
