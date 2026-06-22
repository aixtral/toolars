import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BudgetRuleWorkspace } from "./budget-rule-workspace";

describe("BudgetRuleWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc budget rule workspace sections", () => {
    render(<BudgetRuleWorkspace />);

    expect(screen.getByRole("heading", { name: "50/30/20 Budget Rule" })).toBeInTheDocument();
    expect(screen.getByText("Budget inputs")).toBeInTheDocument();
    expect(screen.getByText("Budget allocation")).toBeInTheDocument();
    expect(screen.getByText("Budget notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/budget-rule/about"
    );
  });

  it("calculates the default budget split and saves assumptions locally", () => {
    render(<BudgetRuleWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Generate budget" }));

    expect(screen.getByText("$2,500")).toBeInTheDocument();
    expect(screen.getByText("$1,500")).toBeInTheDocument();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getByText("Healthy savings rate! Keep it up.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save budget" }));

    expect(window.localStorage.getItem("toolars.budget-rule.plan")).toContain("5000");
  });
});
