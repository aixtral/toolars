import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LoanCalculatorWorkspace } from "./loan-calculator-workspace";

describe("LoanCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc loan workspace sections", () => {
    render(<LoanCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Loan Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Loan terms")).toBeInTheDocument();
    expect(screen.getByText("Payment summary")).toBeInTheDocument();
    expect(screen.getByText("Amortization notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7.5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/loan-calculator/about"
    );
  });

  it("calculates the default loan payment and saves assumptions locally", () => {
    render(<LoanCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate loan" }));

    expect(screen.getByText("$501")).toBeInTheDocument();
    expect(screen.getByText("$5,057")).toBeInTheDocument();
    expect(screen.getByText("$30,057")).toBeInTheDocument();
    expect(screen.getByText("Year 1 principal $4,282 + interest $1,730")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Loan amount"), {
      target: { value: "30000" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save assumptions" }));

    expect(window.localStorage.getItem("toolars.loan-calculator.scenario")).toContain("30000");
  });
});
