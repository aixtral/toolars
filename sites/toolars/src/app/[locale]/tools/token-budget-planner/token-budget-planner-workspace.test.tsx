import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { TokenBudgetPlannerWorkspace } from "./token-budget-planner-workspace";

describe("TokenBudgetPlannerWorkspace", () => {
  it("renders the Toolars token budget workspace", () => {
    renderWithIntl(<TokenBudgetPlannerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "token-budget-planner");
    expect(screen.getByRole("heading", { name: "Token Budget Planner" })).toBeInTheDocument();
    expect(screen.getByText("Token allocation plan")).toBeInTheDocument();
    expect(screen.getByLabelText("Total context budget")).toHaveDisplayValue("32000");
    expect(screen.getByLabelText("Budget allocations")).toBeInTheDocument();
  });

  it("plans budget headroom and allocation rows", () => {
    renderWithIntl(<TokenBudgetPlannerWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Plan budget" }));

    expect(screen.getByText("Remaining budget")).toBeInTheDocument();
    expect(screen.getByText("Retrieval")).toBeInTheDocument();
    expect(screen.getByText(/Local token budgeting only/)).toBeInTheDocument();
  });
});
