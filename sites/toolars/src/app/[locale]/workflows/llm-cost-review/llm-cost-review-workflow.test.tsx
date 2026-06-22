import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LlmCostReviewWorkflow } from "./llm-cost-review-workflow";

describe("LlmCostReviewWorkflow", () => {
  it("renders the LLM cost review workflow sections from the design", () => {
    render(<LlmCostReviewWorkflow />);

    expect(document.querySelector(".workflow-builder-layout")).toHaveAttribute("data-ai-lab-workflow", "mobile-edge-v3");
    expect(screen.getByRole("heading", { name: "LLM Cost Review Workflow Builder" })).toBeInTheDocument();
    expect(screen.getByText("Cost review canvas")).toBeInTheDocument();
    expect(screen.getByText("Run preview")).toBeInTheDocument();
    expect(screen.getByText("Tool chain")).toBeInTheDocument();
    expect(screen.getByText("Budget policy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "MVP launch" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /LLM Cost Calculator/ })).toHaveAttribute("href", "/tools/llm-cost-calculator");
  });

  it("simulates the launch review when the user runs the workflow", () => {
    render(<LlmCostReviewWorkflow />);

    fireEvent.click(screen.getByRole("button", { name: "Run review" }));

    expect(screen.getByText("Cost review ready")).toBeInTheDocument();
    expect(screen.getByText(/Estimated \$562\/month/)).toBeInTheDocument();
    expect(screen.getByText(/smaller model/)).toBeInTheDocument();
    expect(screen.getByLabelText("Cost review progress")).toHaveAttribute("aria-valuenow", "76");
  });
});
