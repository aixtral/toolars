import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MortgageRefinanceCalculatorWorkspace } from "./mortgage-refinance-calculator-workspace";

describe("MortgageRefinanceCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc mortgage refinance workspace sections", () => {
    render(<MortgageRefinanceCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Mortgage Refinance Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Refinance inputs")).toBeInTheDocument();
    expect(screen.getByText("Refinance summary")).toBeInTheDocument();
    expect(screen.getByText("Refinance notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Current loan balance")).toHaveValue(800000);
    expect(screen.getByLabelText("New interest rate")).toHaveValue(3.5);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/mortgage-refinance-calculator/about"
    );
  });

  it("calculates default refinance savings and saves assumptions locally", () => {
    render(<MortgageRefinanceCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate refinance savings" }));

    expect(screen.getByText("$461")).toBeInTheDocument();
    expect(screen.getByText("44 months")).toBeInTheDocument();
    expect(screen.getByText("$146,005")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save refinance case" }));

    expect(window.localStorage.getItem("toolars.mortgage-refinance-calculator.plan")).toContain("800000");
  });
});
