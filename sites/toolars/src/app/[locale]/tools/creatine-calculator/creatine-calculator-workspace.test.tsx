import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CreatineCalculatorWorkspace } from "./creatine-calculator-workspace";

describe("CreatineCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc creatine workspace sections", () => {
    render(<CreatineCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Creatine Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Supplement inputs")).toBeInTheDocument();
    expect(screen.getByText("Creatine result")).toBeInTheDocument();
    expect(screen.getByText("Supplement notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/creatine-calculator/about");
  });

  it("calculates the default maintenance dose and saves the plan locally", () => {
    render(<CreatineCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate creatine dose" }));

    expect(screen.getByText("3 g")).toBeInTheDocument();
    expect(screen.getByText("700 ml")).toBeInTheDocument();
    expect(screen.getByText("3-5 g/day")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save supplement plan" }));

    expect(window.localStorage.getItem("toolars.creatine-calculator.plan:v1")).toContain("moderate");
  });
});
