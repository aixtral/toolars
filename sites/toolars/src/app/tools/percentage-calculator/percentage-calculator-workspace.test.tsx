import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PercentageCalculatorWorkspace } from "./percentage-calculator-workspace";

describe("PercentageCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc percentage workspace sections", () => {
    render(<PercentageCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Percentage Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Percentage inputs")).toBeInTheDocument();
    expect(screen.getByText("Percentage summary")).toBeInTheDocument();
    expect(screen.getByText("Denominator notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Calculation mode")).toHaveValue("percentOf");
    expect(screen.getByLabelText("Percent")).toHaveValue(20);
    expect(screen.getByLabelText("Base value")).toHaveValue(150);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/percentage-calculator/about"
    );
  });

  it("calculates the default percent-of value and saves assumptions locally", () => {
    render(<PercentageCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate percentage" }));

    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getAllByText("20% of 150").length).toBeGreaterThan(0);
    expect(screen.getByText("20 / 100 x 150")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save percentage" }));

    expect(window.localStorage.getItem("toolars.percentage-calculator.plan")).toContain("percentOf");
  });
});
