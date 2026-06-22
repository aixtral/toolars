import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { NetWorthCalculatorWorkspace } from "./net-worth-calculator-workspace";

describe("NetWorthCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc net worth workspace sections", () => {
    render(<NetWorthCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Net Worth Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Asset inputs")).toBeInTheDocument();
    expect(screen.getByText("Net worth summary")).toBeInTheDocument();
    expect(screen.getByText("Net worth notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("400000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("280000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/net-worth-calculator/about"
    );
  });

  it("calculates the default net worth and saves assumptions locally", () => {
    render(<NetWorthCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate net worth" }));

    expect(screen.getByText("$215,000")).toBeInTheDocument();
    expect(screen.getByText("$535,000")).toBeInTheDocument();
    expect(screen.getByText("$320,000")).toBeInTheDocument();
    expect(screen.getByText("Debt-to-asset ratio 59.8%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save snapshot" }));

    expect(window.localStorage.getItem("toolars.net-worth-calculator.snapshot")).toContain("400000");
  });
});
