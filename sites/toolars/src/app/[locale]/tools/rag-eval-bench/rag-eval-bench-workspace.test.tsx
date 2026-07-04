import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { RagEvalBenchWorkspace } from "./rag-eval-bench-workspace";

describe("RagEvalBenchWorkspace", () => {
  it("renders the Toolars RAG eval workspace", () => {
    renderWithIntl(<RagEvalBenchWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "rag-eval-bench");
    expect(screen.getByRole("heading", { name: "RAG Eval Bench" })).toBeInTheDocument();
    expect(screen.getByText("RAG evaluation")).toBeInTheDocument();
    expect(screen.getByLabelText("Eval cases")).toBeInTheDocument();
  });

  it("scores eval cases with groundedness status", () => {
    renderWithIntl(<RagEvalBenchWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Run eval bench" }));

    expect(screen.getByText("Average groundedness")).toBeInTheDocument();
    expect(screen.getAllByText("Pass").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Local eval heuristics only/)).toBeInTheDocument();
  });
});
