import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { LlmCostCalculatorWorkspace } from "./llm-cost-calculator-workspace";

describe("LlmCostCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the Toolars LLM cost planning workspace sections", () => {
    renderWithIntl(<LlmCostCalculatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "llm-cost-calculator");
    expect(screen.getByText("Run mode")).toBeInTheDocument();
    expect(screen.getByText("Provider route")).toBeInTheDocument();
    expect(screen.getByText("Artifact state")).toBeInTheDocument();
    expect(screen.getByText("Static estimator")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LLM Cost Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Usage inputs")).toBeInTheDocument();
    expect(screen.getByText("Monthly estimate")).toBeInTheDocument();
    expect(screen.getByText("Before production")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2400")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Balanced model")).toBeInTheDocument();
  });

  it("calculates the default balanced-model estimate", () => {
    renderWithIntl(<LlmCostCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate cost" }));

    expect(screen.getByText("$562")).toBeInTheDocument();
    expect(screen.getByText("558M")).toBeInTheDocument();
    expect(screen.getByText("Balanced model - input $259 - output $302")).toBeInTheDocument();
    expect(screen.getByText("Review spend before production")).toBeInTheDocument();
  });

  it("updates estimates when the model profile changes", () => {
    renderWithIntl(<LlmCostCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Model profile"), {
      target: { value: "small" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Calculate cost" }));

    expect(screen.getByText("$140")).toBeInTheDocument();
    expect(screen.getByText("Small utility model - input $65 - output $76")).toBeInTheDocument();
  });

  it("saves the usage scenario locally without changing inputs", () => {
    renderWithIntl(<LlmCostCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Requests / month"), {
      target: { value: "250000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save scenario" }));

    expect(screen.getByLabelText("Requests / month")).toHaveValue(250000);
    expect(window.localStorage.getItem("toolars.llm-cost-calculator.scenario")).toContain("250000");
  });
});
