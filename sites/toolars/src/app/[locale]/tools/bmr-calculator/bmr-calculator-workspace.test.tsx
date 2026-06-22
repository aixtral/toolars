import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BmrCalculatorWorkspace } from "./bmr-calculator-workspace";

describe("BmrCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc BMR workspace sections", () => {
    render(<BmrCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "BMR Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Metabolism inputs")).toBeInTheDocument();
    expect(screen.getByText("BMR result")).toBeInTheDocument();
    expect(screen.getByText("Formula notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("175")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/bmr-calculator/about"
    );
  });

  it("calculates the default BMR targets and saves assumptions locally", () => {
    render(<BmrCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate BMR" }));

    expect(screen.getByText("1,649 kcal")).toBeInTheDocument();
    expect(screen.getByText("1,149 kcal")).toBeInTheDocument();
    expect(screen.getByText("1,899 kcal")).toBeInTheDocument();
    expect(screen.getByText("Male, 30 years, 175 cm, 70 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save assumptions" }));

    expect(window.localStorage.getItem("toolars.bmr-calculator.assumptions")).toContain("175");
  });
});
