import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { DrinkCaloriesWorkspace } from "./drink-calories-workspace";

describe("DrinkCaloriesWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc drink calories workspace sections", () => {
    render(<DrinkCaloriesWorkspace />);

    expect(screen.getByRole("heading", { name: "Drink Calories Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Drink inputs")).toBeInTheDocument();
    expect(screen.getByText("Liquid calorie summary")).toBeInTheDocument();
    expect(screen.getByText("Drink calorie notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Cups drank today")).toHaveValue(1);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/drink-calories/about");
  });

  it("calculates the default drink calories and saves the drink plan locally", () => {
    render(<DrinkCaloriesWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate calories" }));

    expect(screen.getByText("325 kcal")).toBeInTheDocument();
    expect(screen.getByText("50 g")).toBeInTheDocument();
    expect(screen.getByText("6,500")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save drink plan" }));

    expect(window.localStorage.getItem("toolars.drink-calories.plan:v1")).toContain("milktea");
  });
});
