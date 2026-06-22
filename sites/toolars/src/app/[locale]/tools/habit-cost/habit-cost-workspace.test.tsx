import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { HabitCostWorkspace } from "./habit-cost-workspace";

describe("HabitCostWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc habit cost workspace sections", () => {
    render(<HabitCostWorkspace />);

    expect(screen.getByRole("heading", { name: "Habit Cost Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Habit inputs")).toBeInTheDocument();
    expect(screen.getByText("Opportunity cost summary")).toBeInTheDocument();
    expect(screen.getByText("Reflection notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Cost per occurrence")).toHaveValue(6);
    expect(screen.getByLabelText("Frequency per week")).toHaveValue(7);
    expect(screen.getByLabelText("Years")).toHaveValue(10);
    expect(screen.getByLabelText("Annual return rate")).toHaveValue(7);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/habit-cost/about"
    );
  });

  it("calculates the default habit cost and saves assumptions locally", () => {
    render(<HabitCostWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate habit cost" }));

    expect(screen.getByText("$31,131")).toBeInTheDocument();
    expect(screen.getByText("$21,840")).toBeInTheDocument();
    expect(screen.getByText("$9,291")).toBeInTheDocument();
    expect(screen.getAllByText("$42 weekly habit over 10 years").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save habit plan" }));

    expect(window.localStorage.getItem("toolars.habit-cost.plan")).toContain("6");
  });
});
