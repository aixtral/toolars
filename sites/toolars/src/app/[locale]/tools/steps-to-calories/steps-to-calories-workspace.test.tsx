import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { StepsToCaloriesWorkspace } from "./steps-to-calories-workspace";

describe("StepsToCaloriesWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc steps to calories workspace sections", () => {
    render(<StepsToCaloriesWorkspace />);

    expect(screen.getByRole("heading", { name: "Steps to Calories Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Activity inputs")).toBeInTheDocument();
    expect(screen.getByText("Burn result")).toBeInTheDocument();
    expect(screen.getByText("Activity notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Steps today")).toHaveValue(8000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/steps-to-calories/about");
  });

  it("calculates calorie burn and saves the activity sample locally", () => {
    render(<StepsToCaloriesWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate burn" }));

    expect(screen.getByText("276 kcal")).toBeInTheDocument();
    expect(screen.getByText("5.63 km")).toBeInTheDocument();
    expect(screen.getByText("1.2 bowls rice")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save activity sample" }));

    expect(window.localStorage.getItem("toolars.steps-to-calories.activity:v1")).toContain("\"steps\":8000");
  });
});
