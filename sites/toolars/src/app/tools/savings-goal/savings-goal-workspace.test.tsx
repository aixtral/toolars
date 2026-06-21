import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { SavingsGoalWorkspace } from "./savings-goal-workspace";

describe("SavingsGoalWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc savings goal workspace sections", () => {
    render(<SavingsGoalWorkspace />);

    expect(screen.getByRole("heading", { name: "Savings Goal Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Savings inputs")).toBeInTheDocument();
    expect(screen.getByText("Goal timeline")).toBeInTheDocument();
    expect(screen.getByText("Savings notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/savings-goal/about"
    );
  });

  it("calculates the default goal timeline and saves assumptions locally", () => {
    render(<SavingsGoalWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate goal" }));

    expect(screen.getByText("65 months")).toBeInTheDocument();
    expect(screen.getByText("$42,500")).toBeInTheDocument();
    expect(screen.getByText("$7,841")).toBeInTheDocument();
    expect(screen.getByText("$50,341")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save savings plan" }));

    expect(window.localStorage.getItem("toolars.savings-goal.plan")).toContain("50000");
  });
});
