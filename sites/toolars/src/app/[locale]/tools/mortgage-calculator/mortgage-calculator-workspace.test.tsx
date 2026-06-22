import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MortgageCalculatorWorkspace } from "./mortgage-calculator-workspace";

describe("MortgageCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc mortgage workspace sections", () => {
    render(<MortgageCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Mortgage Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Loan inputs")).toBeInTheDocument();
    expect(screen.getByText("Monthly payment")).toBeInTheDocument();
    expect(screen.getByText("Affordability notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("450000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("90000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/mortgage-calculator/about"
    );
  });

  it("calculates the default monthly payment and interest summary", () => {
    render(<MortgageCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate payment" }));

    expect(screen.getByText("$2,875")).toBeInTheDocument();
    expect(screen.getByText("$459,160")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByText("Principal and interest $2,275 + escrow $600")).toBeInTheDocument();
    expect(screen.getByText("Strong down payment cushion")).toBeInTheDocument();
  });

  it("updates the scenario and saves it locally", () => {
    render(<MortgageCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Down payment"), {
      target: { value: "100000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save scenario" }));

    expect(screen.getByLabelText("Down payment")).toHaveValue(100000);
    expect(window.localStorage.getItem("toolars.mortgage-calculator.scenario")).toContain("100000");
  });
});
